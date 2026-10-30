"""Data Transfer Objects for Project entity operations.

Provides strict payload schemas for request parsing and API responses.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProjectCreateDTO(BaseModel):
    """Payload schema for creating a project."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    tags: List[str] = Field(default_factory=lambda: ["General"])
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool = False
    icon_slug: str = "code"


class ProjectUpdateDTO(BaseModel):
    """Payload schema for updating a project."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    tags: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: Optional[bool] = None
    icon_slug: Optional[str] = None


class ProjectResponseDTO(BaseModel):
    """Payload schema for serialized project output."""
    id: str
    title: str
    description: str
    tags: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool
    icon_slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
