"""API router exposing Steam Web API telemetry and Discord Rich Presence webhook."""

from typing import Optional
from fastapi import APIRouter, Depends, Response, status

from app.application.dtos.game_dto import (
    GameStatusResponseDTO,
    DiscordRPCWebhookDTO,
)
from app.application.use_cases.game_use_cases import (
    GetCurrentGameUseCase,
    UpdateDiscordRPCUseCase,
)
from app.presentation.dependencies import (
    get_current_game_use_case,
    get_discord_rpc_use_case,
)

router = APIRouter(prefix="/consuming/games", tags=["Gaming Rich Presence"])


@router.get(
    "",
    response_model=Optional[GameStatusResponseDTO],
    summary="Get active game telemetry via Steam Web API / Discord RPC",
    responses={
        200: {"description": "Active game status payload returned successfully"},
        204: {"description": "No game currently active or Steam Web API connection offline"},
    },
)
async def get_active_game(
    response: Response,
    use_case: GetCurrentGameUseCase = Depends(get_current_game_use_case),
):
    """Exposes current gaming status with fallback to HTTP 204 No Content when idle or offline."""
    game_status = await use_case.execute()
    if not game_status:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    return game_status


@router.post(
    "/discord-rpc",
    response_model=GameStatusResponseDTO,
    summary="Webhook endpoint receiving Discord Rich Presence updates",
)
async def discord_rpc_webhook(
    dto: DiscordRPCWebhookDTO,
    use_case: UpdateDiscordRPCUseCase = Depends(get_discord_rpc_use_case),
):
    """Webhook receiving live Rich Presence notifications from local game agent."""
    return await use_case.execute(dto)
