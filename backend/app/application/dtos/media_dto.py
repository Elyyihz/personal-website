"""Data Transfer Objects for ConsumedMedia operations.

Serializes literature and multimedia consumption states.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class MediaReadingDTO(BaseModel):
    """Payload schema for reading literature status."""
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    category: str
    cover_url: str
    reference_url: str
    status: str = "Lendo Atualmente"


class MediaWatchingDTO(BaseModel):
    """Payload schema for watching media status."""
    title: str = Field(..., min_length=1)
    subtitle: str
    cover_url: str
    category: str = "Séries & Mídia"


class MediaUpdateDTO(BaseModel):
    """Payload schema for updating the consumed media aggregate."""
    reading: MediaReadingDTO
    watching: MediaWatchingDTO


class MediaResponseDTO(BaseModel):
    """Payload schema for serialized media output."""
    id: str
    reading: MediaReadingDTO
    watching: MediaWatchingDTO
    updated_at: datetime
