"""Document Chunk entity module.

Represents a granular segment of text extracted from a parent document with vector embeddings.
"""

from typing import Dict, Any, List, Optional
from app.domain.exceptions.domain_exceptions import DomainValidationError


class DocumentChunk:
    """Domain entity representing an embedded textual chunk for semantic retrieval.

    Attributes:
        id (str): Unique chunk identifier.
        document_id (str): Identifier of the parent RAG document.
        chunk_index (int): Sequential index within the parent document.
        content (str): Plaintext chunk content.
        embedding (Optional[List[float]]): Dense vector representation.
        metadata (Dict[str, Any]): Contextual metadata for vector store filtering.
    """

    def __init__(
        self,
        id: str,
        document_id: str,
        chunk_index: int,
        content: str,
        embedding: Optional[List[float]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Initializes and validates a DocumentChunk entity.

        Args:
            id (str): Unique chunk identifier.
            document_id (str): Parent document identifier.
            chunk_index (int): Zero-based sequential position.
            content (str): Text excerpt.
            embedding (Optional[List[float]]): Vector embedding dimensions.
            metadata (Optional[Dict[str, Any]]): Chunk metadata.

        Raises:
            DomainValidationError: If content is empty or blank.
        """
        if not content or not content.strip():
            raise DomainValidationError("Chunk content cannot be empty")

        self.id = id
        self.document_id = document_id
        self.chunk_index = max(0, chunk_index)
        self.content = content.strip()
        self.embedding = embedding
        self.metadata = metadata or {}
