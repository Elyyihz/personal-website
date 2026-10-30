"""Data Transfer Objects for Administrative Authentication."""

from pydantic import BaseModel, Field


class LoginRequestDTO(BaseModel):
    """Payload schema for administrator login."""
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponseDTO(BaseModel):
    """Payload schema for JWT bearer token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class AdminProfileResponseDTO(BaseModel):
    """Payload schema for authenticated admin profile."""
    username: str
    role: str = "administrator"
