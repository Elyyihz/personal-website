"""Shared test fixtures and database configuration for integration tests.

Configures an isolated in-memory SQLite database using StaticPool to ensure multi-threaded
and async safety across test executions.
"""

import asyncio
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.infrastructure.database.config import Base, get_db
from app.presentation.main import app
from app.infrastructure.security.password_hasher import BcryptPasswordHasher
from app.domain.entities.admin import AdminUser
from app.infrastructure.repositories.sqlalchemy_repositories import SqlAlchemyAdminUserRepository

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    """Provides test database session."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_test_database():
    """Recreates database tables and seeds test administrator."""
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()
    hasher = BcryptPasswordHasher()
    admin_repo = SqlAlchemyAdminUserRepository(db)

    user = AdminUser(
        id="admin-test-id",
        username="elyyihz",
        password_hash=hasher.hash_password("admin_test_pass"),
    )
    asyncio.run(admin_repo.save(user))
    db.close()
    yield
