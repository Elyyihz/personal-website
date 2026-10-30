"""Data Transfer Objects for HobbyInterest operations."""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class HobbyCreateDTO(BaseModel):
    """Payload schema for creating a hobby or interest entry."""
    name: str = Field(..., min_length=1, max_length=120)
    category: str = Field(..., min_length=1, max_length=120)
    icon_slug: str = "heart"


class HobbyUpdateDTO(BaseModel):
    """Payload schema for updating a hobby or interest entry."""
    name: str = Field(..., min_length=1, max_length=120)
    category: str = Field(..., min_length=1, max_length=120)
    icon_slug: str = "heart"


class HobbyResponseDTO(BaseModel):
    """Payload schema for serialized hobby output."""
    id: str
    name: str
    category: str
    icon_slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
