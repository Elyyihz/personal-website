"""Unit tests for RAG and Chat Use Cases.

Validates text chunking, document ingestion, vector persistence, and conversational orchestration.
"""

from typing import AsyncGenerator, List, Optional
import pytest

from app.domain.entities.rag_document import RAGDocument
from app.domain.entities.document_chunk import DocumentChunk
from app.domain.entities.chat_session import ChatMessage, ChatRole
from app.domain.repositories.interfaces import (
    RAGDocumentRepository,
    VectorStoreRepository,
    LLMGatewayInterface,
)
from app.application.dtos.rag_dto import RAGIngestTextDTO
from app.application.use_cases.rag_use_cases import (
    IngestRAGDocumentUseCase,
    ListRAGDocumentsUseCase,
    DeleteRAGDocumentUseCase,
    SearchKnowledgeBaseUseCase,
)
from app.application.use_cases.chat_use_cases import LangGraphRAGChatUseCase


class InMemoryRAGDocumentRepository(RAGDocumentRepository):
    """In-memory test double for RAG document metadata persistence."""

    def __init__(self):
        self.documents = {}

    async def get_all(self) -> List[RAGDocument]:
        return list(self.documents.values())

    async def get_by_id(self, document_id: str) -> Optional[RAGDocument]:
        return self.documents.get(document_id)

    async def save(self, document: RAGDocument) -> RAGDocument:
        self.documents[document.id] = document
        return document

    async def delete(self, document_id: str) -> bool:
        return bool(self.documents.pop(document_id, None))


class InMemoryVectorStoreRepository(VectorStoreRepository):
    """In-memory test double for dense vector persistence and retrieval."""

    def __init__(self):
        self.chunks = []

    async def upsert_chunks(self, chunks: List[DocumentChunk]) -> int:
        self.chunks.extend(chunks)
        return len(chunks)

    async def search_similar_chunks(
        self,
        query_vector: List[float],
        limit: int = 4,
        score_threshold: float = 0.2,
    ) -> List[DocumentChunk]:
        # Simple test mock returning top chunks
        return self.chunks[:limit]

    async def delete_by_document_id(self, document_id: str) -> bool:
        before = len(self.chunks)
        self.chunks = [c for c in self.chunks if c.document_id != document_id]
        return len(self.chunks) < before

    async def count_chunks(self) -> int:
        return len(self.chunks)


class MockLLMGateway(LLMGatewayInterface):
    """Mock LLM gateway providing deterministic embeddings and responses."""

    async def embed_text(self, text: str) -> List[float]:
        return [0.1, 0.2, 0.3, 0.4]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [[0.1, 0.2, 0.3, 0.4] for _ in texts]

    async def generate_text(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> str:
        return "Elynne Lima e uma Engenheira de Sistemas de IA especializada em Clean Architecture."

    async def generate_stream(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> AsyncGenerator[str, None]:
        tokens = ["Elynne ", "Lima ", "e ", "uma ", "Engenheira ", "de ", "Sistemas ", "de ", "IA."]
        for token in tokens:
            yield token


@pytest.mark.asyncio
async def test_rag_ingest_and_retrieval_workflow():
    """Validates document ingestion chunking, embedding, and deletion lifecycle."""
    doc_repo = InMemoryRAGDocumentRepository()
    vector_repo = InMemoryVectorStoreRepository()
    llm_gateway = MockLLMGateway()

    ingest_use_case = IngestRAGDocumentUseCase(
        document_repository=doc_repo,
        vector_store_repository=vector_repo,
        llm_gateway=llm_gateway,
    )

    dto = RAGIngestTextDTO(
        title="MAIA Multi-Agent Architecture",
        content=(
            "MAIA e um orquestrador multi-agente inteligente.\n\n"
            "Ele opera com LangGraph, decomposicao deterministica de tarefas e Clean Architecture.\n\n"
            "Cada agente atua de forma autonoma com validacao de schema estrita."
        ),
        category="project",
        tags=["LangGraph", "MultiAgent"],
    )

    doc = await ingest_use_case.execute(dto)
    assert doc.id.startswith("doc-")
    assert doc.title == "MAIA Multi-Agent Architecture"
    assert doc.chunk_count >= 1

    chunks_count = await vector_repo.count_chunks()
    assert chunks_count == doc.chunk_count

    # Test listing
    list_use_case = ListRAGDocumentsUseCase(document_repository=doc_repo)
    docs = await list_use_case.execute()
    assert len(docs) == 1

    # Test search
    search_use_case = SearchKnowledgeBaseUseCase(
        vector_store_repository=vector_repo,
        llm_gateway=llm_gateway,
    )
    results = await search_use_case.execute(query="Como funciona o MAIA?")
    assert len(results) >= 1

    # Test delete
    delete_use_case = DeleteRAGDocumentUseCase(
        document_repository=doc_repo,
        vector_store_repository=vector_repo,
    )
    deleted = await delete_use_case.execute(doc.id)
    assert deleted is True

    assert len(await doc_repo.get_all()) == 0
    assert await vector_repo.count_chunks() == 0


@pytest.mark.asyncio
async def test_langgraph_rag_chat_sync_and_stream():
    """Validates LangGraph-powered conversational assistant retrieval and generation."""
    doc_repo = InMemoryRAGDocumentRepository()
    vector_repo = InMemoryVectorStoreRepository()
    llm_gateway = MockLLMGateway()

    # Pre-populate knowledge chunk
    chunk = DocumentChunk(
        id="chunk-1",
        document_id="doc-1",
        chunk_index=0,
        content="Elynne Lima desenvolveu o SAED para auditoria estatica de seguranca com IA.",
        embedding=[0.1, 0.2, 0.3, 0.4],
        metadata={"title": "SAED Overview"},
    )
    await vector_repo.upsert_chunks([chunk])

    chat_use_case = LangGraphRAGChatUseCase(
        vector_store_repository=vector_repo,
        llm_gateway=llm_gateway,
    )

    # Test synchronous query
    response = await chat_use_case.execute_sync(
        session_id="session-user-1",
        query="O que e o SAED?",
        history=[],
    )
    assert response.session_id == "session-user-1"
    assert "Elynne Lima" in response.answer
    assert "SAED Overview" in response.sources

    # Test streaming generator
    stream_chunks = []
    async for token in chat_use_case.execute_stream(
        session_id="session-user-1",
        query="Fale mais sobre a Elynne",
        history=[],
    ):
        stream_chunks.append(token)

    full_stream_text = "".join(stream_chunks)
    assert "Elynne Lima" in full_stream_text
