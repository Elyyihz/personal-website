"""Data Transfer Objects for WishlistItem entity operations.

Enforces schema contracts with explicit is_fulfilled boolean tracking.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class WishlistCreateDTO(BaseModel):
    """Payload schema for creating a wishlist item."""
    title: str = Field(..., min_length=1, max_length=250)
    category: str = Field(default="Livros")
    subtitle: Optional[str] = None
    url: Optional[str] = None
    tag: Optional[str] = None
    is_fulfilled: bool = False


class WishlistUpdateDTO(BaseModel):
    """Payload schema for updating a wishlist item."""
    title: str = Field(..., min_length=1, max_length=250)
    category: str = Field(default="Livros")
    subtitle: Optional[str] = None
    url: Optional[str] = None
    tag: Optional[str] = None
    is_fulfilled: Optional[bool] = None


class WishlistResponseDTO(BaseModel):
    """Payload schema for serialized wishlist output."""
    id: str
    title: str
    category: str
    subtitle: Optional[str] = None
    url: Optional[str] = None
    tag: Optional[str] = None
    is_fulfilled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
