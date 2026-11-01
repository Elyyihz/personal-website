"""Integration tests for Steam Web API and Discord RPC endpoint /api/consuming/games.

Strictly verifies HTTP 204 fallback on idle state and network connection failures.
"""

import pytest
from httpx import AsyncClient, ASGITransport

from app.presentation.main import app
from app.presentation.dependencies import get_current_game_use_case
from app.domain.repositories.interfaces import SteamGatewayInterface
from app.application.use_cases.game_use_cases import GetCurrentGameUseCase
from app.infrastructure.repositories.sqlalchemy_repositories import SqlAlchemyMediaRepository


class FailingSteamGateway(SteamGatewayInterface):
    """Test double simulating a network failure when connecting to Steam Web API."""

    async def get_active_game(self, steam_id: str):
        raise ConnectionError("Connection refused by Steam Web API")

    async def get_recently_played_games(self, steam_id: str):
        raise ConnectionError("Connection refused by Steam Web API")


@pytest.mark.asyncio
async def test_get_consuming_games_fallback_204_when_idle():
    """Validates HTTP 204 No Content when no game is active."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/consuming/games")
        assert res.status_code == 204
        assert res.text == ""


@pytest.mark.asyncio
async def test_discord_rpc_webhook_and_active_game_retrieval():
    """Validates Discord RPC webhook push and subsequent live game status retrieval."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Post to Discord RPC webhook
        rpc_payload = {
            "title": "Stardew Valley",
            "state": "Farming right now...",
            "details": "Spring Year 3",
            "platform": "Steam / Linux",
            "hours_played": 142.5,
        }
        res_rpc = await client.post("/api/v1/consuming/games/discord-rpc", json=rpc_payload)
        assert res_rpc.status_code == 200
        rpc_data = res_rpc.json()
        assert rpc_data["title"] == "Stardew Valley"
        assert rpc_data["is_playing"] is True

        # 2. Query /api/consuming/games -> returns HTTP 200 with active game
        res_get = await client.get("/api/consuming/games")
        assert res_get.status_code == 200
        get_data = res_get.json()
        assert get_data["title"] == "Stardew Valley"
        assert get_data["is_playing"] is True
        assert "Farming right now..." in get_data["status_message"]


@pytest.mark.asyncio
async def test_steam_api_connection_failure_falls_back_to_204(setup_test_database):
    """Guarantees FastAPI returns HTTP 204 when Steam API network connection fails."""
    from tests.integration.conftest import TestingSessionLocal

    db = TestingSessionLocal()
    failing_use_case = GetCurrentGameUseCase(
        steam_gateway=FailingSteamGateway(),
        steam_id="76561198000000000",
        media_repository=SqlAlchemyMediaRepository(db),
    )
    failing_use_case.set_discord_override(None)

    # Override dependency to simulate failure
    app.dependency_overrides[get_current_game_use_case] = lambda: failing_use_case

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.get("/api/consuming/games")
            assert res.status_code == 204
            assert res.text == ""
    finally:
        app.dependency_overrides.pop(get_current_game_use_case, None)
        db.close()
