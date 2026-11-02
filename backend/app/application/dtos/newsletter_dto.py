"""Data Transfer Objects for Elyy.init newsletter syndication and synchronization."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ArticleResponseDTO(BaseModel):
    """Payload schema for serialized newsletter article."""

    id: str
    title: str
    link: str
    description: str
    pub_date: datetime
    author: str
    tags: List[str]
    content_html: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NewsletterSyncRequestDTO(BaseModel):
    """Payload schema for triggering newsletter feed synchronization."""

    rss_url: Optional[str] = Field(
        default="https://elyy.init/feed.xml",
        description="Optional remote RSS/XML URL to pull feed from",
    )
    xml_content: Optional[str] = Field(
        default=None,
        description="Optional direct XML string payload (e.g. from webhook)",
    )


class NewsletterSyncResponseDTO(BaseModel):
    """Payload schema returned after feed synchronization."""

    synced_count: int = Field(description="Number of newly indexed articles")
    total_articles: int = Field(description="Total article count in the database")
    message: str = Field(description="Human-readable outcome summary")
