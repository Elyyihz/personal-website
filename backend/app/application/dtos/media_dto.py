"""Data Transfer Objects for ConsumedMedia operations.

Serializes literature reading progress, visual media, and active gaming states.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MediaReadingDTO(BaseModel):
    """Payload schema for reading literature status and page progress."""

    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    category: str
    cover_url: str
    reference_url: str
    status: str = "Lendo Atualmente"
    current_page: int = Field(default=184, ge=0)
    total_pages: int = Field(default=260, ge=1)
    progress_percentage: int = Field(default=71, ge=0, le=100)


class MediaWatchingDTO(BaseModel):
    """Payload schema for watching media status."""

    title: str = Field(..., min_length=1)
    subtitle: str
    cover_url: str
    category: str = "Séries & Mídia"


class MediaGamingDTO(BaseModel):
    """Payload schema for active video gaming status and logged hours."""

    title: str = Field(..., min_length=1)
    platform: str = "PC / Steam"
    status: str = "Em Progresso (Ano 3)"
    cover_url: str = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80"
    hours_played: float = Field(default=142.5, ge=0.0)


class ReadingProgressWebhookDTO(BaseModel):
    """Payload schema for reading progress webhooks or quick page updates."""

    current_page: int = Field(..., ge=0, description="Current page reached")
    total_pages: Optional[int] = Field(default=None, ge=1, description="Total book pages")
    book_title: Optional[str] = Field(default=None, description="Optional book title check")


class GamingStatusWebhookDTO(BaseModel):
    """Payload schema for video game status webhooks or manual updates."""

    title: str = Field(..., min_length=1, description="Game title")
    platform: Optional[str] = Field(default=None, description="Gaming console or platform")
    status: Optional[str] = Field(default=None, description="In-game progression or lore checkpoint")
    cover_url: Optional[str] = Field(default=None, description="Cover artwork URL")
    hours_played: Optional[float] = Field(default=None, ge=0.0, description="Logged gameplay hours")


class MediaUpdateDTO(BaseModel):
    """Payload schema for updating the full consumed media aggregate."""

    reading: MediaReadingDTO
    watching: MediaWatchingDTO
    gaming: Optional[MediaGamingDTO] = None


class MediaResponseDTO(BaseModel):
    """Payload schema for serialized media output."""

    id: str
    reading: MediaReadingDTO
    watching: MediaWatchingDTO
    gaming: MediaGamingDTO
    updated_at: datetime
