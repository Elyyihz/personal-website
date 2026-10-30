"""Application Use Cases for Administrative Authentication and Session Management.

Verifies bcrypt hashed credentials and generates secure JWT tokens.
"""

from typing import Protocol

from app.domain.repositories.interfaces import AdminUserRepository
from app.domain.exceptions.domain_exceptions import AuthenticationFailedException
from app.application.dtos.auth_dto import LoginRequestDTO, TokenResponseDTO, AdminProfileResponseDTO


class PasswordHasher(Protocol):
    """Protocol establishing password hashing contract."""
    def hash_password(self, password: str) -> str: ...
    def verify_password(self, password: str, hashed: str) -> bool: ...


class TokenProvider(Protocol):
    """Protocol establishing JWT generation contract."""
    def create_access_token(self, subject: str) -> str: ...
    def decode_access_token(self, token: str) -> str: ...


class AuthUseCases:
    """Orchestrates administrative authentication workflows."""

    def __init__(
        self,
        admin_repo: AdminUserRepository,
        hasher: PasswordHasher,
        token_provider: TokenProvider,
        token_expiry_seconds: int = 86400,
    ) -> None:
        """Initializes auth use cases with injected dependencies."""
        self._admin_repo = admin_repo
        self._hasher = hasher
        self._token_provider = token_provider
        self._token_expiry_seconds = token_expiry_seconds

    async def login(self, dto: LoginRequestDTO) -> TokenResponseDTO:
        """Authenticates admin credentials and returns JWT bearer token.

        Args:
            dto (LoginRequestDTO): Username and raw password.

        Returns:
            TokenResponseDTO: Signed JWT and expiration metadata.

        Raises:
            AuthenticationFailedException: If username does not exist or password is wrong.
        """
        user = await self._admin_repo.get_by_username(dto.username)
        if not user:
            raise AuthenticationFailedException("Invalid username or password.")

        is_valid = self._hasher.verify_password(dto.password, user.password_hash)
        if not is_valid:
            raise AuthenticationFailedException("Invalid username or password.")

        token = self._token_provider.create_access_token(subject=user.username)

        return TokenResponseDTO(
            access_token=token,
            token_type="bearer",
            expires_in=self._token_expiry_seconds,
        )

    async def verify_token(self, token: str) -> AdminProfileResponseDTO:
        """Validates JWT access token and returns admin profile."""
        username = self._token_provider.decode_access_token(token)
        user = await self._admin_repo.get_by_username(username)
        if not user:
            raise AuthenticationFailedException("User referenced in token no longer exists.")

        return AdminProfileResponseDTO(username=user.username)
