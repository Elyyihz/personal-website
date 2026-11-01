"""Data Transfer Objects for Conversational Assistant and Streaming RAG Chat.

Defines client query schemas and structured inference response envelopes.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessageDTO(BaseModel):
    """Schema for individual conversational history turns."""

    role: str = Field(..., description="Role of the speaker: user or assistant")
    content: str = Field(..., min_length=1, description="Text body of the conversational message")
    timestamp: Optional[datetime] = Field(default=None, description="Timestamp of the message turn")


class ChatQueryRequestDTO(BaseModel):
    """Payload schema for submitting a query to the AI Assistant."""

    session_id: str = Field(..., min_length=1, max_length=128, description="Persistent visitor session identifier")
    message: str = Field(..., min_length=1, max_length=2000, description="Natural language question or prompt")
    history: List[ChatMessageDTO] = Field(default_factory=list, description="Prior conversation turns for context")


class ChatResponseDTO(BaseModel):
    """Schema for synchronous (non-streaming) AI assistant responses."""

    session_id: str
    answer: str
    sources: List[str] = Field(default_factory=list, description="Referenced document titles or citations")
