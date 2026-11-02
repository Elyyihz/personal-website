"""FastAPI router handling ConsumedMedia aggregate operations and webhooks."""

from fastapi import APIRouter, Depends, HTTPException, status
from app.application.dtos.media_dto import (
    MediaUpdateDTO,
    MediaResponseDTO,
    ReadingProgressWebhookDTO,
    GamingStatusWebhookDTO,
)
from app.application.use_cases.media_use_cases import MediaUseCases
from app.presentation.dependencies import get_media_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import DomainValidationError

router = APIRouter(prefix="/media", tags=["Currently Consuming"])


@router.get("", response_model=MediaResponseDTO)
async def get_consumed_media(
    use_cases: MediaUseCases = Depends(get_media_use_cases),
) -> MediaResponseDTO:
    """Public endpoint retrieving literature, multimedia, and active gaming state."""
    return await use_cases.get_media()


@router.put("", response_model=MediaResponseDTO)
async def update_consumed_media(
    dto: MediaUpdateDTO,
    use_cases: MediaUseCases = Depends(get_media_use_cases),
    _admin: None = Depends(get_current_admin),
) -> MediaResponseDTO:
    """Protected endpoint modifying literature, watching, and gaming consumption states."""
    try:
        return await use_cases.update_media(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.post("/reading/progress", response_model=MediaResponseDTO)
async def update_reading_progress(
    dto: ReadingProgressWebhookDTO,
    use_cases: MediaUseCases = Depends(get_media_use_cases),
) -> MediaResponseDTO:
    """Webhook / automated endpoint updating literature reading progress (page checkpoint)."""
    try:
        return await use_cases.update_reading_progress(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.post("/gaming/status", response_model=MediaResponseDTO)
async def update_gaming_status(
    dto: GamingStatusWebhookDTO,
    use_cases: MediaUseCases = Depends(get_media_use_cases),
) -> MediaResponseDTO:
    """Webhook / automated endpoint updating active gaming status and play time."""
    try:
        return await use_cases.update_gaming_status(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.post("/webhook", response_model=MediaResponseDTO)
async def media_generic_webhook(
    reading: ReadingProgressWebhookDTO,
    use_cases: MediaUseCases = Depends(get_media_use_cases),
) -> MediaResponseDTO:
    """Generic webhook endpoint for external reading trackers (e.g. Goodreads, Kindle, CLI)."""
    return await use_cases.update_reading_progress(reading)
