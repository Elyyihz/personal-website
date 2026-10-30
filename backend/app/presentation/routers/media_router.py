"""FastAPI router handling ConsumedMedia aggregate operations."""

from fastapi import APIRouter, Depends, HTTPException, status
from app.application.dtos.media_dto import MediaUpdateDTO, MediaResponseDTO
from app.application.use_cases.media_use_cases import MediaUseCases
from app.presentation.dependencies import get_media_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import DomainValidationError

router = APIRouter(prefix="/media", tags=["Media"])


@router.get("", response_model=MediaResponseDTO)
async def get_consumed_media(
    use_cases: MediaUseCases = Depends(get_media_use_cases),
) -> MediaResponseDTO:
    """Public endpoint retrieving the currently consumed reading and watching media."""
    return await use_cases.get_media()


@router.put("", response_model=MediaResponseDTO)
async def update_consumed_media(
    dto: MediaUpdateDTO,
    use_cases: MediaUseCases = Depends(get_media_use_cases),
    _admin: None = Depends(get_current_admin),
) -> MediaResponseDTO:
    """Protected endpoint modifying literature and multimedia consumption states."""
    try:
        return await use_cases.update_media(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err
