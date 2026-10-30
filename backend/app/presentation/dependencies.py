"""FastAPI dependency injection providers adhering to Clean Architecture principles."""

from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.infrastructure.database.config import get_db, settings
from app.infrastructure.security.password_hasher import BcryptPasswordHasher
from app.infrastructure.security.token_provider import JwtTokenProvider
from app.infrastructure.repositories.sqlalchemy_repositories import (
    SqlAlchemyProjectRepository,
    SqlAlchemyWishlistRepository,
    SqlAlchemyMediaRepository,
    SqlAlchemyHobbyRepository,
    SqlAlchemyAdminUserRepository,
)
from app.application.use_cases.project_use_cases import ProjectUseCases
from app.application.use_cases.wishlist_use_cases import WishlistUseCases
from app.application.use_cases.media_use_cases import MediaUseCases
from app.application.use_cases.hobby_use_cases import HobbyUseCases
from app.application.use_cases.auth_use_cases import AuthUseCases
from app.application.dtos.auth_dto import AdminProfileResponseDTO
from app.domain.exceptions.domain_exceptions import AuthenticationFailedException

security_scheme = HTTPBearer(auto_error=False)

password_hasher = BcryptPasswordHasher()
token_provider = JwtTokenProvider(
    secret_key=settings.jwt_secret_key,
    algorithm=settings.jwt_algorithm,
    expiration_seconds=settings.jwt_expiration_seconds,
)


def get_auth_use_cases(db: Session = Depends(get_db)) -> AuthUseCases:
    """Provides instantiated AuthUseCases."""
    repo = SqlAlchemyAdminUserRepository(db)
    return AuthUseCases(
        admin_repo=repo,
        hasher=password_hasher,
        token_provider=token_provider,
        token_expiry_seconds=settings.jwt_expiration_seconds,
    )


def get_project_use_cases(db: Session = Depends(get_db)) -> ProjectUseCases:
    """Provides instantiated ProjectUseCases."""
    return ProjectUseCases(repository=SqlAlchemyProjectRepository(db))


def get_wishlist_use_cases(db: Session = Depends(get_db)) -> WishlistUseCases:
    """Provides instantiated WishlistUseCases."""
    return WishlistUseCases(repository=SqlAlchemyWishlistRepository(db))


def get_media_use_cases(db: Session = Depends(get_db)) -> MediaUseCases:
    """Provides instantiated MediaUseCases."""
    return MediaUseCases(repository=SqlAlchemyMediaRepository(db))


def get_hobby_use_cases(db: Session = Depends(get_db)) -> HobbyUseCases:
    """Provides instantiated HobbyUseCases."""
    return HobbyUseCases(repository=SqlAlchemyHobbyRepository(db))


async def get_current_admin(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security_scheme)] = None,
    auth_cases: AuthUseCases = Depends(get_auth_use_cases),
) -> AdminProfileResponseDTO:
    """Extracts and verifies JWT bearer token guarding administrative endpoints."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials are required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return await auth_cases.verify_token(credentials.credentials)
    except AuthenticationFailedException as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(err),
            headers={"WWW-Authenticate": "Bearer"},
        ) from err
