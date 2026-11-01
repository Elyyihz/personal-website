"""Unit tests for Steam Web API and Discord RPC Game use cases.

Validates active game retrieval, Discord RPC webhook processing, and connection failure fallback to HTTP 204.
"""

from typing import List, Optional
import pytest

from app.domain.entities.game_status import GameStatus
from app.domain.entities.media import ConsumedMedia
from app.domain.repositories.interfaces import SteamGatewayInterface, MediaRepository
from app.application.dtos.game_dto import DiscordRPCWebhookDTO
from app.application.use_cases.game_use_cases import (
    GetCurrentGameUseCase,
    UpdateDiscordRPCUseCase,
)


class MockSteamGateway(SteamGatewayInterface):
    """Mock test double for Steam Web API."""

    def __init__(self, active_game: Optional[GameStatus] = None, should_fail: bool = False):
        self.active_game = active_game
        self.should_fail = should_fail

    async def get_active_game(self, steam_id: str) -> Optional[GameStatus]:
        if self.should_fail:
            raise ConnectionError("Steam API connection timed out.")
        return self.active_game

    async def get_recently_played_games(self, steam_id: str) -> List[GameStatus]:
        if self.should_fail:
            raise ConnectionError("Steam API connection timed out.")
        return [self.active_game] if self.active_game else []


class MockMediaRepository(MediaRepository):
    """Mock repository for media state."""

    def __init__(self):
        self.media = ConsumedMedia()

    async def get(self) -> ConsumedMedia:
        return self.media

    async def save(self, media: ConsumedMedia) -> ConsumedMedia:
        self.media = media
        return self.media


@pytest.mark.asyncio
async def test_get_current_game_when_playing():
    """Validates successful retrieval of currently playing Steam game."""
    active = GameStatus(
        game_id="413150",
        title="Stardew Valley",
        is_playing=True,
        platform="Steam / Linux",
        status_message="Farming right now...",
        banner_url="https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
        playtime_2weeks_minutes=300,
        total_playtime_minutes=8550,
    )
    gateway = MockSteamGateway(active_game=active)
    media_repo = MockMediaRepository()

    use_case = GetCurrentGameUseCase(
        steam_gateway=gateway,
        steam_id="76561198000000000",
        media_repository=media_repo,
    )

    result = await use_case.execute()
    assert result is not None
    assert result.title == "Stardew Valley"
    assert result.is_playing is True
    assert result.total_hours == 142.5


@pytest.mark.asyncio
async def test_get_current_game_connection_failure_fallback():
    """Validates fallback to None (HTTP 204) when Steam Web API fails or is unreachable."""
    failing_gateway = MockSteamGateway(should_fail=True)
    media_repo = MockMediaRepository()

    use_case = GetCurrentGameUseCase(
        steam_gateway=failing_gateway,
        steam_id="76561198000000000",
        media_repository=media_repo,
    )

    # When Steam API connection fails, the use case safely swallows the error and returns None
    result = await use_case.execute()
    assert result is None  # Signals HTTP 204


@pytest.mark.asyncio
async def test_discord_rpc_webhook_updates_status():
    """Validates Discord Rich Presence webhook updating active game."""
    gateway = MockSteamGateway(active_game=None)
    media_repo = MockMediaRepository()

    use_case = GetCurrentGameUseCase(
        steam_gateway=gateway,
        steam_id="76561198000000000",
        media_repository=media_repo,
    )

    discord_use_case = UpdateDiscordRPCUseCase(
        game_use_case=use_case,
        media_repository=media_repo,
    )

    dto = DiscordRPCWebhookDTO(
        title="Paleo Pines",
        state="Caring for Dinosaurs",
        details="In Valley",
        platform="Discord RPC / Linux",
    )

    updated = await discord_use_case.execute(dto)
    assert updated.title == "Paleo Pines"
    assert updated.is_playing is True
    assert "Caring for Dinosaurs" in updated.status_message

    # Verify that get_current_game now returns the Discord RPC game
    current = await use_case.execute()
    assert current is not None
    assert current.title == "Paleo Pines"
