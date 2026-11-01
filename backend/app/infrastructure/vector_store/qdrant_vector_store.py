"""Qdrant vector store adapter implementing VectorStoreRepository port.

Manages high-performance dense vector persistence, indexing, and similarity search
using embedded or persistent Qdrant engine.
"""

import logging
import os
import uuid
from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.domain.entities.document_chunk import DocumentChunk
from app.domain.repositories.interfaces import VectorStoreRepository

logger = logging.getLogger("qdrant_vector_store")


class QdrantVectorStoreAdapter(VectorStoreRepository):
    """Concrete adapter for dense vector persistence using Qdrant.

    Attributes:
        collection_name (str): Target collection namespace.
        vector_size (int): Expected embedding dimension.
        client (QdrantClient): Underlying Qdrant client instance.
    """

    def __init__(
        self,
        storage_path: Optional[str] = None,
        collection_name: str = "elyy_knowledge_base",
        vector_size: int = 768,
        in_memory: bool = False,
    ) -> None:
        """Initializes the Qdrant vector store client and ensures collection exists.

        Args:
            storage_path (Optional[str]): File system directory for persistent storage.
            collection_name (str): Qdrant collection name.
            vector_size (int): Dimension of embedding vectors.
            in_memory (bool): If true, creates transient in-memory store.
        """
        self.collection_name = collection_name
        self.vector_size = vector_size

        if in_memory or not storage_path or storage_path == ":memory:":
            logger.info("Initializing transient in-memory Qdrant instance")
            self.client = QdrantClient(location=":memory:")
        else:
            os.makedirs(storage_path, exist_ok=True)
            logger.info("Initializing persistent local Qdrant instance at '%s'", storage_path)
            self.client = QdrantClient(path=storage_path)

        self._ensure_collection_exists()

    def _ensure_collection_exists(self) -> None:
        """Creates the target collection with cosine distance if not already present."""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                logger.info(
                    "Decision taken: Creating new Qdrant collection '%s' with dimension %d",
                    self.collection_name,
                    self.vector_size,
                )
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
                )
        except Exception as exc:
            logger.error("Failed to verify or create Qdrant collection: %s", exc)

    async def upsert_chunks(self, chunks: List[DocumentChunk]) -> int:
        """Inserts or replaces dense vector embeddings for document chunks.

        Args:
            chunks (List[DocumentChunk]): Document chunk entities with embeddings.

        Returns:
            int: Number of chunks successfully upserted.
        """
        if not chunks:
            return 0

        points: List[PointStruct] = []
        for chunk in chunks:
            if not chunk.embedding:
                logger.warning("Decision taken: Skipping chunk id=%s without embedding", chunk.id)
                continue

            # Deterministic UUID derived from chunk ID
            point_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, chunk.id))
            payload = {
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                **chunk.metadata,
            }

            points.append(
                PointStruct(
                    id=point_uuid,
                    vector=chunk.embedding,
                    payload=payload,
                )
            )

        if points:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points,
            )
            logger.info(
                "Step concluded: Upserted %d vector points into '%s'",
                len(points),
                self.collection_name,
            )

        return len(points)

    async def search_similar_chunks(
        self,
        query_vector: List[float],
        limit: int = 4,
        score_threshold: Optional[float] = None,
    ) -> List[DocumentChunk]:
        """Performs nearest-neighbor vector similarity search against the collection.

        Args:
            query_vector (List[float]): Dense query embedding vector.
            limit (int): Maximum number of top chunks to return.
            score_threshold (Optional[float]): Minimum cosine similarity cutoff.

        Returns:
            List[DocumentChunk]: Ranked sequence of relevant chunks.
        """
        if not query_vector:
            return []

        try:
            results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=limit,
                score_threshold=score_threshold,
            )
        except Exception as err:
            logger.error("Error executing vector query on Qdrant: %s", err)
            return []

        chunks: List[DocumentChunk] = []
        for scored_point in results.points:
            payload = scored_point.payload or {}
            chunk_id = payload.get("chunk_id", str(scored_point.id))
            doc_id = payload.get("document_id", "unknown-doc")
            chunk_index = payload.get("chunk_index", 0)
            content = payload.get("content", "")

            # Filter out internal payload keys for entity metadata
            meta = {k: v for k, v in payload.items() if k not in ("chunk_id", "document_id", "chunk_index", "content")}
            meta["score"] = scored_point.score

            chunks.append(
                DocumentChunk(
                    id=chunk_id,
                    document_id=doc_id,
                    chunk_index=chunk_index,
                    content=content,
                    metadata=meta,
                )
            )

        logger.info(
            "Step concluded: Vector query returned %d matches above threshold=%.2f",
            len(chunks),
            score_threshold,
        )
        return chunks

    async def delete_by_document_id(self, document_id: str) -> bool:
        """Purges all vector embeddings associated with a parent document ID.

        Args:
            document_id (str): Target parent document identifier.

        Returns:
            bool: True if chunks were successfully removed.
        """
        logger.info("Purging vector points for document_id=%s", document_id)
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=Filter(
                    must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
                ),
            )
            return True
        except Exception as exc:
            logger.error("Failed to delete points for document_id=%s: %s", document_id, exc)
            return False

    async def count_chunks(self) -> int:
        """Returns total number of indexed vector chunks in the collection.

        Returns:
            int: Total point count.
        """
        try:
            res = self.client.count(collection_name=self.collection_name)
            return res.count
        except Exception:
            return 0
