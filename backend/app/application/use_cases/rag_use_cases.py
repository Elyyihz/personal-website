"""RAG use cases module.

Orchestrates document chunking, semantic embedding generation, vector store persistence,
and document lifecycle management for retrieval-augmented generation.
"""

import logging
import uuid
from typing import List, Optional

from app.domain.entities.rag_document import RAGDocument
from app.domain.entities.document_chunk import DocumentChunk
from app.domain.repositories.interfaces import (
    RAGDocumentRepository,
    VectorStoreRepository,
    LLMGatewayInterface,
)
from app.application.dtos.rag_dto import RAGIngestTextDTO

logger = logging.getLogger("rag_use_cases")


class TextChunker:
    """Helper utility for splitting continuous textual content into overlapping semantic chunks.

    Decomposes documents into coherent sections respecting sentence and paragraph boundaries
    to preserve contextual integrity during dense vector retrieval.
    """

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 80) -> None:
        """Initializes the TextChunker with window parameters.

        Args:
            chunk_size (int): Target character length for individual chunks.
            chunk_overlap (int): Number of overlapping characters retained between chunks.
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        """Splits an input text block into a sequence of semantic segments.

        Prioritizes structural delimiters (paragraphs, sentences) before slicing arbitrarily.

        Args:
            text (str): Source text payload.

        Returns:
            List[str]: List of non-empty textual segments.
        """
        clean_text = text.strip()
        if len(clean_text) <= self.chunk_size:
            return [clean_text]

        chunks: List[str] = []
        start_idx = 0
        total_len = len(clean_text)

        while start_idx < total_len:
            end_idx = min(start_idx + self.chunk_size, total_len)

            # Look for paragraph or sentence boundaries within the window to prevent fragmenting phrases
            if end_idx < total_len:
                boundary_point = clean_text.rfind("\n\n", start_idx, end_idx)
                if boundary_point == -1 or boundary_point <= start_idx:
                    boundary_point = clean_text.rfind(". ", start_idx, end_idx)

                if boundary_point > start_idx + (self.chunk_size // 2):
                    end_idx = boundary_point + 1

            chunk_text = clean_text[start_idx:end_idx].strip()
            if chunk_text:
                chunks.append(chunk_text)

            # Advance index considering overlap
            if end_idx >= total_len:
                break
            start_idx = max(start_idx + 1, end_idx - self.chunk_overlap)

        return chunks


class IngestRAGDocumentUseCase:
    """Use case coordinating document segmentation, embedding generation, and vector persistence.

    Attributes:
        document_repository (RAGDocumentRepository): Metadata persistence gateway.
        vector_store_repository (VectorStoreRepository): Dense vector index gateway.
        llm_gateway (LLMGatewayInterface): Embedding generation provider.
        chunker (TextChunker): Semantic segmenter.
    """

    def __init__(
        self,
        document_repository: RAGDocumentRepository,
        vector_store_repository: VectorStoreRepository,
        llm_gateway: LLMGatewayInterface,
        chunk_size: int = 500,
        chunk_overlap: int = 80,
    ) -> None:
        """Initializes the ingestion use case with required ports.

        Args:
            document_repository (RAGDocumentRepository): Repository for document entity records.
            vector_store_repository (VectorStoreRepository): Repository for vector embeddings.
            llm_gateway (LLMGatewayInterface): LLM client for computing embeddings.
            chunk_size (int): Segment window size in characters.
            chunk_overlap (int): Overlap window size in characters.
        """
        self.document_repository = document_repository
        self.vector_store_repository = vector_store_repository
        self.llm_gateway = llm_gateway
        self.chunker = TextChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    async def execute(self, dto: RAGIngestTextDTO) -> RAGDocument:
        """Executes full document ingestion lifecycle.

        Segments raw text, produces vector embeddings, and stores records across relational
        and vector databases.

        Args:
            dto (RAGIngestTextDTO): Ingestion input payload.

        Returns:
            RAGDocument: Persisted document entity with chunk count populated.
        """
        document_id = f"doc-{uuid.uuid4().hex[:12]}"
        logger.info(
            "Step started: Ingesting RAG document title='%s' category='%s' id=%s",
            dto.title,
            dto.category,
            document_id,
        )

        # 1. Segment text into chunks
        text_segments = self.chunker.split_text(dto.content)
        logger.info(
            "Decision taken: Segmented document into %d semantic chunk(s) for document_id=%s",
            len(text_segments),
            document_id,
        )

        # 2. Generate vector embeddings in batch
        embeddings = await self.llm_gateway.embed_batch(text_segments)

        # 3. Formulate chunk entities
        chunk_entities: List[DocumentChunk] = []
        base_metadata = {
            "title": dto.title,
            "category": dto.category,
            "tags": dto.tags,
            **(dto.metadata or {}),
        }

        for idx, (segment_text, vector) in enumerate(zip(text_segments, embeddings)):
            chunk_id = f"{document_id}-chk-{idx}"
            chunk_entities.append(
                DocumentChunk(
                    id=chunk_id,
                    document_id=document_id,
                    chunk_index=idx,
                    content=segment_text,
                    embedding=vector,
                    metadata=base_metadata,
                )
            )

        # 4. Upsert into vector repository
        await self.vector_store_repository.upsert_chunks(chunk_entities)
        logger.info(
            "Decision taken: Persisted %d vector chunks into vector store for document_id=%s",
            len(chunk_entities),
            document_id,
        )

        # 5. Persist parent document entity
        document_entity = RAGDocument(
            id=document_id,
            title=dto.title,
            content=dto.content,
            category=dto.category,
            metadata=base_metadata,
            chunk_count=len(chunk_entities),
        )
        saved_doc = await self.document_repository.save(document_entity)

        logger.info(
            "Step concluded: Successfully indexed RAG document title='%s' id=%s total_chunks=%d",
            saved_doc.title,
            saved_doc.id,
            saved_doc.chunk_count,
        )
        return saved_doc


class ListRAGDocumentsUseCase:
    """Use case retrieving all registered knowledge documents."""

    def __init__(self, document_repository: RAGDocumentRepository) -> None:
        """Initializes use case with document repository.

        Args:
            document_repository (RAGDocumentRepository): Document metadata port.
        """
        self.document_repository = document_repository

    async def execute(self) -> List[RAGDocument]:
        """Retrieves all indexed RAG documents.

        Returns:
            List[RAGDocument]: Sequence of registered document entities.
        """
        return await self.document_repository.get_all()


class DeleteRAGDocumentUseCase:
    """Use case purging a document and its related vector chunks."""

    def __init__(
        self,
        document_repository: RAGDocumentRepository,
        vector_store_repository: VectorStoreRepository,
    ) -> None:
        """Initializes deletion use case with persistence ports.

        Args:
            document_repository (RAGDocumentRepository): Metadata repository.
            vector_store_repository (VectorStoreRepository): Vector storage repository.
        """
        self.document_repository = document_repository
        self.vector_store_repository = vector_store_repository

    async def execute(self, document_id: str) -> bool:
        """Deletes document metadata and all corresponding vector embeddings.

        Args:
            document_id (str): Target document identifier.

        Returns:
            bool: True if document was located and purged.
        """
        logger.info("Step started: Purging RAG document id=%s", document_id)

        # Remove vector embeddings first to maintain integrity
        await self.vector_store_repository.delete_by_document_id(document_id)
        logger.info(
            "Decision taken: Cleaned associated vector chunks for document_id=%s",
            document_id,
        )

        # Remove relational metadata record
        deleted = await self.document_repository.delete(document_id)
        logger.info(
            "Step concluded: Document purge outcome=%s for document_id=%s",
            deleted,
            document_id,
        )
        return deleted


class SearchKnowledgeBaseUseCase:
    """Use case querying the vector store for semantic matches against a user query."""

    def __init__(
        self,
        vector_store_repository: VectorStoreRepository,
        llm_gateway: LLMGatewayInterface,
    ) -> None:
        """Initializes search use case with vector store and embedding provider.

        Args:
            vector_store_repository (VectorStoreRepository): Vector search gateway.
            llm_gateway (LLMGatewayInterface): Embedding generation provider.
        """
        self.vector_store_repository = vector_store_repository
        self.llm_gateway = llm_gateway

    async def execute(self, query: str, limit: int = 4) -> List[DocumentChunk]:
        """Searches for relevant chunks using dense vector cosine distance.

        Args:
            query (str): Natural language search query.
            limit (int): Top-K cutoff.

        Returns:
            List[DocumentChunk]: Ranked chunks meeting similarity criteria.
        """
        query_vector = await self.llm_gateway.embed_text(query)
        return await self.vector_store_repository.search_similar_chunks(
            query_vector=query_vector,
            limit=limit,
        )
