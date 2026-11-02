"""Integration tests for FastAPI REST endpoints following TDD discipline.

Tests authentication, CRUD routes for Projects, Wishlist (including is_fulfilled toggle),
Media, and Hobbies against in-memory SQLite database.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.presentation.main import app


@pytest.mark.asyncio
async def test_auth_login_and_protected_access():
    """Tests admin login flow and JWT authentication header."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Invalid login
        resp = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "wrong_password"},
        )
        assert resp.status_code == 401

        # Valid login
        resp = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "admin_test_pass"},
        )
        assert resp.status_code == 200
        token_data = resp.json()
        assert "access_token" in token_data
        token = token_data["access_token"]

        # Access protected /auth/me
        me_resp = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_resp.status_code == 200
        assert me_resp.json()["username"] == "elyyihz"


@pytest.mark.asyncio
async def test_projects_crud_workflow():
    """Tests Projects CRUD endpoints."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login to obtain token
        login_resp = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "admin_test_pass"},
        )
        token = login_resp.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 1. Create project
        create_resp = await client.post(
            "/api/v1/projects",
            headers=auth_headers,
            json={
                "title": "Clean Arch Multi-Agent Validator",
                "description": "Multi-agent graph for architecture enforcement",
                "tags": ["Python", "LangGraph"],
                "github_url": "https://github.com/Elyyihz/clean-arch-validator",
                "featured": True,
                "icon_slug": "code",
            },
        )
        assert create_resp.status_code == 201
        project_data = create_resp.json()
        project_id = project_data["id"]
        assert project_data["title"] == "Clean Arch Multi-Agent Validator"
        assert project_data["featured"] is True

        # 2. Public list
        list_resp = await client.get("/api/v1/projects")
        assert list_resp.status_code == 200
        assert len(list_resp.json()) == 1

        # 3. Update project
        update_resp = await client.put(
            f"/api/v1/projects/{project_id}",
            headers=auth_headers,
            json={
                "title": "Clean Arch Multi-Agent Validator (v2)",
                "description": "Updated AST parsing engine",
                "tags": ["Python", "AST"],
                "featured": False,
                "icon_slug": "hexagon",
            },
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["title"] == "Clean Arch Multi-Agent Validator (v2)"
        assert update_resp.json()["featured"] is False

        # 4. Delete project
        del_resp = await client.delete(
            f"/api/v1/projects/{project_id}",
            headers=auth_headers,
        )
        assert del_resp.status_code == 200

        # Verify list is empty
        list_after = await client.get("/api/v1/projects")
        assert len(list_after.json()) == 0


@pytest.mark.asyncio
async def test_wishlist_crud_and_is_fulfilled_toggle():
    """Tests Wishlist endpoints and explicit is_fulfilled toggle."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_resp = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "admin_test_pass"},
        )
        token = login_resp.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 1. Create item
        create_resp = await client.post(
            "/api/v1/wishlist",
            headers=auth_headers,
            json={
                "title": "The Man in the High Castle",
                "subtitle": "Philip K. Dick",
                "category": "Livros",
                "url": "https://amazon.com.br",
                "tag": "Ficção Científica",
                "is_fulfilled": False,
            },
        )
        assert create_resp.status_code == 201
        item_id = create_resp.json()["id"]
        assert create_resp.json()["is_fulfilled"] is False

        # 2. Toggle fulfilled
        toggle_resp = await client.patch(
            f"/api/v1/wishlist/{item_id}/toggle-fulfilled",
            headers=auth_headers,
        )
        assert toggle_resp.status_code == 200
        assert toggle_resp.json()["is_fulfilled"] is True

        # 3. Delete item
        del_resp = await client.delete(
            f"/api/v1/wishlist/{item_id}",
            headers=auth_headers,
        )
        assert del_resp.status_code == 200


@pytest.mark.asyncio
async def test_media_and_hobbies_endpoints():
    """Tests Media and Hobbies endpoints."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_resp = await client.post(
            "/api/v1/auth/login",
            json={"username": "elyyihz", "password": "admin_test_pass"},
        )
        token = login_resp.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 1. Media GET
        media_resp = await client.get("/api/v1/media")
        assert media_resp.status_code == 200
        media_data = media_resp.json()
        assert "reading" in media_data
        assert "watching" in media_data

        # 2. Hobbies Create & List
        hobby_create = await client.post(
            "/api/v1/hobbies",
            headers=auth_headers,
            json={
                "name": "Stardew Valley",
                "icon_slug": "plant",
                "category": "Cozy Gaming",
            },
        )
        assert hobby_create.status_code == 201
        hobby_id = hobby_create.json()["id"]

        hobbies_list = await client.get("/api/v1/hobbies")
        assert hobbies_list.status_code == 200
        assert any(h["id"] == hobby_id for h in hobbies_list.json())

        # 3. Hobbies Delete
        del_hobby = await client.delete(
            f"/api/v1/hobbies/{hobby_id}",
            headers=auth_headers,
        )
        assert del_hobby.status_code == 200
