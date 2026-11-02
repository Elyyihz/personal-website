"""Application Use Cases for Steam Web API and Discord RPC Rich Presence."""

import logging
from datetime import datetime, timezone
from typing import Optional

from app.domain.entities.game_status import GameStatus
from app.domain.repositories.interfaces import SteamGatewayInterface, MediaRepository
from app.application.dtos.game_dto import (
    GameStatusResponseDTO,
    DiscordRPCWebhookDTO,
)

logger = logging.getLogger("game_use_cases")

# Shared thread-safe in-memory cache for live Discord Rich Presence pushes
_discord_rpc_cache: Optional[GameStatus] = None


class GetCurrentGameUseCase:
    """Use case querying active Steam session or Discord RPC presence.

    Attributes:
        steam_gateway (SteamGatewayInterface): Gateway to Steam Web API.
        steam_id (str): Target Steam 64-bit ID.
        media_repo (MediaRepository): Relational store for media state.
    """

    def __init__(
        self,
        steam_gateway: SteamGatewayInterface,
        steam_id: str,
        media_repository: MediaRepository,
    ) -> None:
        """Initializes the game telemetry use case.

        Args:
            steam_gateway (SteamGatewayInterface): Steam API integration port.
            steam_id (str): Steam 64-bit ID.
            media_repository (MediaRepository): Media persistence repository.
        """
        self.steam_gateway = steam_gateway
        self.steam_id = (steam_id or "").strip()
        self.media_repo = media_repository

    def set_discord_override(self, status: Optional[GameStatus]) -> None:
        """Sets an in-memory active Discord RPC game override."""
        global _discord_rpc_cache
        _discord_rpc_cache = status

    async def execute(self) -> Optional[GameStatusResponseDTO]:
        """Retrieves active game telemetry or falls back to None (HTTP 204).

        Returns:
            Optional[GameStatusResponseDTO]: Populated status if in-game, otherwise None.
        """
        logger.info("Step started: Evaluating live gaming presence for steam_id=%s", self.steam_id)

        # 1. Check active Discord RPC override first (instant push)
        global _discord_rpc_cache
        if _discord_rpc_cache and _discord_rpc_cache.is_playing:
            logger.info(
                "Decision taken: Using active Discord RPC presence for game='%s'",
                _discord_rpc_cache.title,
            )
            return self._map_to_dto(_discord_rpc_cache)

        # 2. Query Steam Web API if steam_id is configured
        if self.steam_id:
            try:
                active_game = await self.steam_gateway.get_active_game(self.steam_id)
                if active_game and active_game.is_playing:
                    logger.info(
                        "Decision taken: Active Steam game detected '%s' (appid=%s)",
                        active_game.title,
                        active_game.game_id,
                    )
                    return self._map_to_dto(active_game)
            except Exception as exc:
                logger.warning(
                    "Decision taken: Steam Web API unreachable (%s); falling back to HTTP 204",
                    exc,
                )
                return None

        # 3. If no live game is executing, return None to trigger HTTP 204
        logger.info("Step concluded: No live game active; signaling HTTP 204 No Content")
        return None

    @staticmethod
    def _map_to_dto(game: GameStatus) -> GameStatusResponseDTO:
        """Maps domain entity to presentation DTO."""
        return GameStatusResponseDTO(
            game_id=game.game_id,
            title=game.title,
            is_playing=game.is_playing,
            platform=game.platform,
            status_message=game.status_message,
            banner_url=game.banner_url,
            playtime_2weeks_minutes=game.playtime_2weeks_minutes,
            total_playtime_minutes=game.total_playtime_minutes,
            total_hours=game.total_hours,
            hours_last_2weeks=game.hours_last_2weeks,
            last_played_at=game.last_played_at,
        )


class UpdateDiscordRPCUseCase:
    """Use case processing incoming Discord Rich Presence webhooks."""

    def __init__(
        self,
        game_use_case: GetCurrentGameUseCase,
        media_repository: MediaRepository,
    ) -> None:
        """Initializes Discord RPC use case.

        Args:
            game_use_case (GetCurrentGameUseCase): Live game telemetry holder.
            media_repository (MediaRepository): Media repository to sync state.
        """
        self.game_use_case = game_use_case
        self.media_repo = media_repository

    async def execute(self, dto: DiscordRPCWebhookDTO) -> GameStatusResponseDTO:
        """Processes Discord RPC webhook and updates aggregate presence.

        Args:
            dto (DiscordRPCWebhookDTO): Webhook payload.

        Returns:
            GameStatusResponseDTO: Updated active game presence.
        """
        logger.info("Step started: Ingesting Discord RPC payload for '%s'", dto.title)

        status_msg = dto.state or dto.details or "Playing"
        if dto.state and dto.details:
            status_msg = f"{dto.details} ({dto.state})"

        game = GameStatus(
            title=dto.title,
            is_playing=True,
            platform=dto.platform,
            status_message=status_msg,
            banner_url=dto.banner_url,
            total_playtime_minutes=int((dto.hours_played or 0) * 60),
            last_played_at=datetime.now(timezone.utc),
        )

        self.game_use_case.set_discord_override(game)

        # Sync with ConsumedMedia aggregate
        media = await self.media_repo.get()
        media.update_gaming(
            title=game.title,
            platform=game.platform,
            status=game.status_message,
            cover_url=game.banner_url or media.gaming_cover_url,
            hours_played=dto.hours_played if dto.hours_played is not None else media.gaming_hours_played,
        )
        await self.media_repo.save(media)

        logger.info("Step concluded: Discord RPC registered for game='%s'", game.title)
        return GetCurrentGameUseCase._map_to_dto(game)
