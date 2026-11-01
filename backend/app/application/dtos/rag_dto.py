"""Data Transfer Objects for RAG knowledge ingestion and search operations.

Provides schemas for administrative data ingestion and retrieval inspection.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class RAGIngestTextDTO(BaseModel):
    """Payload schema for ingesting raw knowledge documents or articles."""

    title: str = Field(..., min_length=2, max_length=250, description="Knowledge title or article headline")
    content: str = Field(..., min_length=10, description="Knowledge text or markdown content")
    category: str = Field(default="general", description="Classification category (project, article, bio, general)")
    tags: List[str] = Field(default_factory=list, description="Categorical tags for filtering")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Optional arbitrary contextual metadata")


class RAGDocumentResponseDTO(BaseModel):
    """Payload schema for returning registered RAG documents."""

    id: str
    title: str
    content: str
    category: str
    chunk_count: int
    created_at: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)


class RAGSearchResultDTO(BaseModel):
    """Payload schema for testing or inspecting semantic search results."""

    chunk_id: str
    document_id: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
