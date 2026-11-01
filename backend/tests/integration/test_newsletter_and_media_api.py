"""Integration tests for Newsletter RSS sync/webhook and ConsumedMedia progress/gaming endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.presentation.main import app

SAMPLE_FEED_XML = """<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Elyy.init</title>
  <link>https://elyy.init</link>
  <description>Technical articles on Clean Architecture.</description>
  <item>
    <title>Modelos de Code Review em Quatro Níveis</title>
    <link>https://elyy.init/four-level-code-review</link>
    <description>Mapeamento estrito entre bloqueante, pontos cruciais, não bloqueia e nits.</description>
    <pubDate>Sun, 01 Nov 2026 14:00:00 GMT</pubDate>
    <author>Elynne Lima</author>
    <category>Code Review</category>
    <category>Clean Code</category>
  </item>
</channel>
</rss>
"""


@pytest.mark.asyncio
async def test_media_reading_progress_and_gaming_webhooks():
    """Validates reading page checkpoint and gaming status webhook endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Update reading progress checkpoint
        progress_payload = {
            "current_page": 195,
            "total_pages": 260,
            "book_title": "The Man in the High Castle",
        }
        res_progress = await client.post("/api/v1/media/reading/progress", json=progress_payload)
        assert res_progress.status_code == 200
        data_prog = res_progress.json()
        assert data_prog["reading"]["current_page"] == 195
        assert data_prog["reading"]["total_pages"] == 260
        assert data_prog["reading"]["progress_percentage"] == 75

        # 2. Update gaming status checkpoint
        gaming_payload = {
            "title": "Stardew Valley",
            "platform": "PC / Steam Deck",
            "status": "Ano 3 (Comunidade Concluída)",
            "hours_played": 148.5,
        }
        res_gaming = await client.post("/api/v1/media/gaming/status", json=gaming_payload)
        assert res_gaming.status_code == 200
        data_game = res_gaming.json()
        assert data_game["gaming"]["title"] == "Stardew Valley"
        assert data_game["gaming"]["platform"] == "PC / Steam Deck"
        assert data_game["gaming"]["hours_played"] == 148.5

        # 3. Verify via public GET /api/v1/media
        get_res = await client.get("/api/v1/media")
        assert get_res.status_code == 200
        get_data = get_res.json()
        assert get_data["reading"]["current_page"] == 195
        assert get_data["gaming"]["title"] == "Stardew Valley"


@pytest.mark.asyncio
async def test_newsletter_sync_and_webhook_workflow():
    """Validates RSS synchronization and webhook payload ingestion."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Post XML payload to /api/v1/newsletter/sync
        sync_payload = {"xml_content": SAMPLE_FEED_XML}
        res_sync = await client.post("/api/v1/newsletter/sync", json=sync_payload)
        assert res_sync.status_code == 200
        sync_data = res_sync.json()
        assert sync_data["synced_count"] >= 1

        # 2. Verify articles listed via public GET /api/v1/newsletter/articles
        res_list = await client.get("/api/v1/newsletter/articles")
        assert res_list.status_code == 200
        articles = res_list.json()
        assert any("Modelos de Code Review" in a["title"] for a in articles)

        # 3. Post to webhook endpoint
        webhook_res = await client.post(
            "/api/v1/newsletter/webhook",
            content=SAMPLE_FEED_XML,
            headers={"Content-Type": "application/xml"},
        )
        assert webhook_res.status_code == 200
        webhook_data = webhook_res.json()
        assert webhook_data["synced_count"] == 0  # Already exists, deduplicated
