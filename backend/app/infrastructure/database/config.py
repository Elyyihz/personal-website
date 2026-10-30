"""Database configuration and session management module.

Supports PostgreSQL in containerized production and SQLite for local development/tests.
"""

import os
from typing import Generator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""

    database_url: str = "sqlite:///./portfolio.db"
    jwt_secret_key: str = "super_secure_jwt_secret_key_minimum_32_bytes_long_portfolio_2026"
    jwt_algorithm: str = "HS256"
    jwt_expiration_seconds: int = 86400

    # Administrative Seed Credentials
    admin_default_username: str = "elyyihz"
    admin_default_password: str = "admin123"

    # Spotify OAuth Configurations
    spotify_client_id: str = ""
    spotify_client_secret: str = ""
    spotify_redirect_uri: str = "http://localhost:3000/callback"
    spotify_refresh_token: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

# Configure SQLAlchemy engine
# SQLite requires check_same_thread=False
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency helper yielding thread-local database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
