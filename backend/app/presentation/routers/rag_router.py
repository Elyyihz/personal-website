"""API router exposing RAG knowledge base ingestion and management endpoints."""

from typing import List
from fastapi import APIRouter, Depends, status, HTTPException, Query

from app.presentation.dependencies import (
    get_current_admin,
    get_ingest_rag_use_case,
    get_list_rag_use_case,
    get_delete_rag_use_case,
    get_search_knowledge_use_case,
)
from app.application.dtos.auth_dto import AdminProfileResponseDTO
from app.application.dtos.rag_dto import (
    RAGIngestTextDTO,
    RAGDocumentResponseDTO,
    RAGSearchResultDTO,
)
from app.application.use_cases.rag_use_cases import (
    IngestRAGDocumentUseCase,
    ListRAGDocumentsUseCase,
    DeleteRAGDocumentUseCase,
    SearchKnowledgeBaseUseCase,
)

router = APIRouter(prefix="/rag", tags=["RAG & Knowledge Base"])


@router.post(
    "/ingest",
    response_model=RAGDocumentResponseDTO,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest raw text or technical article into vector store",
)
async def ingest_document(
    dto: RAGIngestTextDTO,
    _current_admin: AdminProfileResponseDTO = Depends(get_current_admin),
    use_case: IngestRAGDocumentUseCase = Depends(get_ingest_rag_use_case),
):
    """Admin-guarded endpoint for chunking, embedding, and indexing knowledge documents."""
    return await use_case.execute(dto)


@router.get(
    "/documents",
    response_model=List[RAGDocumentResponseDTO],
    summary="List all indexed knowledge documents",
)
async def list_documents(
    _current_admin: AdminProfileResponseDTO = Depends(get_current_admin),
    use_case: ListRAGDocumentsUseCase = Depends(get_list_rag_use_case),
):
    """Admin-guarded endpoint retrieving registered knowledge documents."""
    return await use_case.execute()


@router.delete(
    "/documents/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Purge knowledge document and associated vector chunks",
)
async def delete_document(
    document_id: str,
    _current_admin: AdminProfileResponseDTO = Depends(get_current_admin),
    use_case: DeleteRAGDocumentUseCase = Depends(get_delete_rag_use_case),
):
    """Admin-guarded endpoint deleting document metadata and dense vectors."""
    deleted = await use_case.execute(document_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )
    return None


@router.get(
    "/search",
    response_model=List[RAGSearchResultDTO],
    summary="Semantic similarity search in vector knowledge base",
)
async def search_knowledge(
    q: str = Query(..., min_length=2, description="Search query string"),
    limit: int = Query(default=4, ge=1, le=10, description="Top-K cutoff"),
    use_case: SearchKnowledgeBaseUseCase = Depends(get_search_knowledge_use_case),
):
    """Performs semantic similarity query against indexed knowledge chunks."""
    chunks = await use_case.execute(query=q, limit=limit)
    return [
        RAGSearchResultDTO(
            chunk_id=c.id,
            document_id=c.document_id,
            content=c.content,
            metadata=c.metadata,
        )
        for c in chunks
    ]
