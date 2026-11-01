"""RAG Document entity module.

Represents an indexed source document within the retrieval-augmented generation domain.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class RAGDocument:
    """Domain entity representing a documented knowledge source indexed for RAG retrieval.

    Attributes:
        id (str): Unique identifier of the document.
        title (str): Title or headline of the source knowledge.
        content (str): Full text content of the document.
        category (str): Classification category (e.g. 'project', 'article', 'bio').
        metadata (Dict[str, Any]): Additional contextual key-value pairs.
        chunk_count (int): Number of segmented vector chunks produced.
        created_at (datetime): Timestamp when the document was registered.
    """

    def __init__(
        self,
        id: str,
        title: str,
        content: str,
        category: str = "general",
        metadata: Optional[Dict[str, Any]] = None,
        chunk_count: int = 0,
        created_at: Optional[datetime] = None,
    ) -> None:
        """Initializes and validates a RAGDocument entity.

        Args:
            id (str): Unique identifier.
            title (str): Knowledge document title.
            content (str): Text payload to index.
            category (str): Category classification.
            metadata (Optional[Dict[str, Any]]): Arbitrary metadata mapping.
            chunk_count (int): Initial chunk count.
            created_at (Optional[datetime]): Timestamp of creation.

        Raises:
            DomainValidationError: If title or content are empty or blank.
        """
        self._validate_invariants(title, content)

        self.id = id
        self.title = title.strip()
        self.content = content.strip()
        self.category = category.strip() if category else "general"
        self.metadata = metadata or {}
        self.chunk_count = max(0, chunk_count)
        self.created_at = created_at or datetime.now(timezone.utc)

    def _validate_invariants(self, title: str, content: str) -> None:
        """Validates domain business rules for RAG documents.

        Args:
            title (str): Proposed document title.
            content (str): Proposed document body.

        Raises:
            DomainValidationError: If invariants are violated.
        """
        if not title or not title.strip():
            raise DomainValidationError("Title cannot be empty")
        if not content or not content.strip():
            raise DomainValidationError("Content cannot be empty")

    def set_chunk_count(self, count: int) -> None:
        """Updates the total count of vector chunks generated for this document.

        Args:
            count (int): Non-negative integer representing the chunk count.
        """
        self.chunk_count = max(0, count)
