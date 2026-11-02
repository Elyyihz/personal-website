"""SQLAlchemy ORM models mapped to persistence relational schema."""

from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    Integer,
    Float,
)
from app.infrastructure.database.config import Base


def utcnow() -> datetime:
    """Helper returning current UTC datetime."""
    return datetime.now(timezone.utc)


class ProjectModel(Base):
    """Relational table mapping for Project entity."""
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tags_json = Column(Text, nullable=False, default="[]")
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    icon_slug = Column(String(64), default="code", nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    @property
    def tags(self) -> list[str]:
        """Deserializes JSON tags array."""
        try:
            return json.loads(self.tags_json)
        except Exception:
            return ["General"]

    @tags.setter
    def tags(self, value: list[str]) -> None:
        """Serializes tags list into JSON string."""
        self.tags_json = json.dumps(list(value) if value else ["General"])


class WishlistItemModel(Base):
    """Relational table mapping for WishlistItem entity."""
    __tablename__ = "wishlist_items"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(250), nullable=False)
    category = Column(String(64), nullable=False, default="Livros")
    subtitle = Column(String(250), nullable=True)
    url = Column(Text, nullable=True)
    tag = Column(String(64), nullable=True)
    is_fulfilled = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)


class ConsumedMediaModel(Base):
    """Relational table mapping for singleton ConsumedMedia aggregate."""
    __tablename__ = "consumed_media"

    id = Column(String(64), primary_key=True, default="default-consumed-media")
    reading_title = Column(String(250), nullable=False)
    reading_author = Column(String(200), nullable=False)
    reading_category = Column(String(100), nullable=False)
    reading_cover_url = Column(Text, nullable=False)
    reading_reference_url = Column(Text, nullable=False)
    reading_status = Column(String(64), nullable=False, default="Lendo Atualmente")
    reading_current_page = Column(Integer, default=184, nullable=False)
    reading_total_pages = Column(Integer, default=260, nullable=False)

    watching_title = Column(String(250), nullable=False)
    watching_subtitle = Column(String(250), nullable=False)
    watching_cover_url = Column(Text, nullable=False)
    watching_category = Column(String(100), nullable=False)

    gaming_title = Column(String(250), default="Stardew Valley", nullable=False)
    gaming_platform = Column(String(100), default="PC / Steam", nullable=False)
    gaming_status = Column(String(150), default="Em Progresso (Ano 3)", nullable=False)
    gaming_cover_url = Column(Text, default="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80", nullable=False)
    gaming_hours_played = Column(Float, default=142.5, nullable=False)

    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)


class HobbyModel(Base):
    """Relational table mapping for HobbyInterest entity."""
    __tablename__ = "hobbies"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(120), nullable=False)
    icon_slug = Column(String(64), default="heart", nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)


class AdminUserModel(Base):
    """Relational table mapping for AdminUser credentials."""
    __tablename__ = "admin_users"

    id = Column(String(64), primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)


class RAGDocumentModel(Base):
    """Relational table mapping for RAGDocument metadata persistence."""
    __tablename__ = "rag_documents"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(250), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(64), nullable=False, default="general")
    chunk_count = Column(Integer, default=0, nullable=False)
    metadata_json = Column(Text, default="{}", nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    @property
    def metadata_dict(self) -> dict:
        """Deserializes contextual JSON metadata."""
        try:
            return json.loads(self.metadata_json) if self.metadata_json else {}
        except Exception:
            return {}

    @metadata_dict.setter
    def metadata_dict(self, val: dict) -> None:
        """Serializes dictionary to JSON string."""
        self.metadata_json = json.dumps(val or {})


class ArticleModel(Base):
    """Relational table mapping for synchronized Elyy.init newsletter articles."""
    __tablename__ = "newsletter_articles"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(250), nullable=False)
    link = Column(String(500), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    pub_date = Column(DateTime, default=utcnow, index=True, nullable=False)
    author = Column(String(100), default="Elynne Lima", nullable=False)
    tags_json = Column(Text, default="[]", nullable=False)
    content_html = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    @property
    def tags(self) -> list[str]:
        """Deserializes JSON tags list."""
        try:
            return json.loads(self.tags_json) if self.tags_json else []
        except Exception:
            return []

    @tags.setter
    def tags(self, val: list[str]) -> None:
        """Serializes list of tags to JSON string."""
        self.tags_json = json.dumps(list(val) if val else [])
