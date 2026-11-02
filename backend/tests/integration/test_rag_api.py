"""Integration tests for RAG knowledge management and Chat endpoints.

Validates document ingestion, document deletion, semantic search, and streaming chat.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.presentation.main import app


@pytest.mark.asyncio
async def test_rag_ingest_and_management_workflow():
    """Tests administrative RAG ingestion, listing, searching, and deletion."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Login
        login_res = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "admin_test_pass"},
        )
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 2. Ingest document
        ingest_payload = {
            "title": "DocChecker Legal Compliance Engine",
            "content": "DocChecker utilizes PaddleOCR, Qdrant vector store, and async RAG for legal parity.",
            "category": "project",
            "tags": ["LegalTech", "RAG", "Qdrant"],
        }
        ingest_res = await client.post("/api/v1/rag/ingest", json=ingest_payload, headers=auth_headers)
        assert ingest_res.status_code == 201
        doc_data = ingest_res.json()
        assert doc_data["title"] == "DocChecker Legal Compliance Engine"
        assert doc_data["chunk_count"] >= 1
        doc_id = doc_data["id"]

        # 3. List documents
        list_res = await client.get("/api/v1/rag/documents", headers=auth_headers)
        assert list_res.status_code == 200
        docs = list_res.json()
        assert any(d["id"] == doc_id for d in docs)

        # 4. Search knowledge base
        search_res = await client.get("/api/v1/rag/search?q=DocChecker+legal+compliance")
        assert search_res.status_code == 200
        matches = search_res.json()
        assert len(matches) >= 1

        # 5. Delete document
        del_res = await client.delete(f"/api/v1/rag/documents/{doc_id}", headers=auth_headers)
        assert del_res.status_code == 204

        # Verify deletion
        list_after = await client.get("/api/v1/rag/documents", headers=auth_headers)
        assert not any(d["id"] == doc_id for d in list_after.json())


@pytest.mark.asyncio
async def test_chat_message_and_stream_endpoints():
    """Tests public chat query and SSE streaming endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test synchronous chat
        chat_req = {
            "session_id": "test-session-123",
            "message": "Quais projetos a Elynne desenvolveu?",
            "history": [],
        }
        res_sync = await client.post("/api/v1/chat/message", json=chat_req)
        assert res_sync.status_code == 200
        sync_data = res_sync.json()
        assert sync_data["session_id"] == "test-session-123"
        assert len(sync_data["answer"]) > 0

        # Test SSE streaming chat
        res_stream = await client.post("/api/v1/chat/stream", json=chat_req)
        assert res_stream.status_code == 200
        assert "text/event-stream" in res_stream.headers["content-type"]

        content = res_stream.text
        assert "data: " in content
        assert "[DONE]" in content
