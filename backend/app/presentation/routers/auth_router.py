"""FastAPI router handling administrative authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from app.application.dtos.auth_dto import (
    LoginRequestDTO,
    TokenResponseDTO,
    AdminProfileResponseDTO,
)
from app.application.use_cases.auth_use_cases import AuthUseCases
from app.presentation.dependencies import get_auth_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import AuthenticationFailedException

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponseDTO)
@router.post("/token", response_model=TokenResponseDTO)
async def login(
    dto: LoginRequestDTO,
    auth_cases: AuthUseCases = Depends(get_auth_use_cases),
) -> TokenResponseDTO:
    """Authenticates administrative user credentials and issues JWT token."""
    try:
        return await auth_cases.login(dto)
    except AuthenticationFailedException as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(err),
            headers={"WWW-Authenticate": "Bearer"},
        ) from err


@router.get("/me", response_model=AdminProfileResponseDTO)
async def get_current_user_profile(
    current_admin: AdminProfileResponseDTO = Depends(get_current_admin),
) -> AdminProfileResponseDTO:
    """Returns verified profile for current authenticated administrator."""
    return current_admin
