"""Unit tests for RAG domain entities.

Tests creation, validation, and domain logic for RAG documents, chunks, and chat messages.
"""

from datetime import datetime, timezone
import pytest

from app.domain.entities.rag_document import RAGDocument
from app.domain.entities.document_chunk import DocumentChunk
from app.domain.entities.chat_session import ChatMessage, ChatRole
from app.domain.exceptions.domain_exceptions import DomainValidationError


def test_rag_document_creation_and_mutation():
    """Validates successful RAGDocument instantiation and mutation."""
    doc = RAGDocument(
        id="doc-101",
        title="Doc Semantic Engine Overview",
        content="This engine computes dense embeddings for semantic document comparison.",
        category="project",
        metadata={"project_slug": "docchecker", "version": "1.0"},
    )

    assert doc.id == "doc-101"
    assert doc.title == "Doc Semantic Engine Overview"
    assert doc.category == "project"
    assert doc.chunk_count == 0
    assert doc.metadata["project_slug"] == "docchecker"
    assert isinstance(doc.created_at, datetime)

    doc.set_chunk_count(5)
    assert doc.chunk_count == 5


def test_rag_document_validation_errors():
    """Validates rejection of empty titles and contents."""
    with pytest.raises(DomainValidationError, match="Title cannot be empty"):
        RAGDocument(
            id="doc-bad-1",
            title="   ",
            content="Valid content",
            category="project",
        )

    with pytest.raises(DomainValidationError, match="Content cannot be empty"):
        RAGDocument(
            id="doc-bad-2",
            title="Valid Title",
            content="   ",
            category="project",
        )


def test_document_chunk_creation_and_validation():
    """Validates DocumentChunk properties and validation rules."""
    chunk = DocumentChunk(
        id="chunk-1",
        document_id="doc-101",
        chunk_index=0,
        content="Semantic document chunk content",
        embedding=[0.1, 0.2, 0.3],
        metadata={"section": "intro"},
    )

    assert chunk.id == "chunk-1"
    assert chunk.document_id == "doc-101"
    assert chunk.chunk_index == 0
    assert len(chunk.embedding) == 3

    with pytest.raises(DomainValidationError, match="Chunk content cannot be empty"):
        DocumentChunk(
            id="chunk-bad",
            document_id="doc-101",
            chunk_index=1,
            content="",
        )


def test_chat_message_creation_and_role_validation():
    """Validates ChatMessage roles and invariant validations."""
    msg = ChatMessage(
        role=ChatRole.USER,
        content="What architecture was used in DocChecker?",
    )

    assert msg.role == ChatRole.USER
    assert msg.content == "What architecture was used in DocChecker?"
    assert isinstance(msg.timestamp, datetime)

    with pytest.raises(DomainValidationError, match="Message content cannot be empty"):
        ChatMessage(role=ChatRole.ASSISTANT, content="   ")
