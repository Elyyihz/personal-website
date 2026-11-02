"""FastAPI router handling Hobby/Interest entity CRUD operations."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.application.dtos.hobby_dto import (
    HobbyCreateDTO,
    HobbyUpdateDTO,
    HobbyResponseDTO,
)
from app.application.use_cases.hobby_use_cases import HobbyUseCases
from app.presentation.dependencies import get_hobby_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import EntityNotFoundException, DomainValidationError

router = APIRouter(prefix="/hobbies", tags=["Hobbies & Interests"])


@router.get("", response_model=List[HobbyResponseDTO])
async def list_hobbies(
    use_cases: HobbyUseCases = Depends(get_hobby_use_cases),
) -> List[HobbyResponseDTO]:
    """Public endpoint retrieving all personal affinities and hobbies."""
    return await use_cases.list_hobbies()


@router.get("/{hobby_id}", response_model=HobbyResponseDTO)
async def get_hobby(
    hobby_id: str,
    use_cases: HobbyUseCases = Depends(get_hobby_use_cases),
) -> HobbyResponseDTO:
    """Public endpoint retrieving hobby by identifier."""
    try:
        return await use_cases.get_hobby(hobby_id)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err


@router.post("", response_model=HobbyResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_hobby(
    dto: HobbyCreateDTO,
    use_cases: HobbyUseCases = Depends(get_hobby_use_cases),
    _admin: None = Depends(get_current_admin),
) -> HobbyResponseDTO:
    """Protected endpoint creating a new hobby entry with icon slug."""
    try:
        return await use_cases.create_hobby(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.put("/{hobby_id}", response_model=HobbyResponseDTO)
async def update_hobby(
    hobby_id: str,
    dto: HobbyUpdateDTO,
    use_cases: HobbyUseCases = Depends(get_hobby_use_cases),
    _admin: None = Depends(get_current_admin),
) -> HobbyResponseDTO:
    """Protected endpoint modifying an existing hobby."""
    try:
        return await use_cases.update_hobby(hobby_id, dto)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.delete("/{hobby_id}", status_code=status.HTTP_200_OK)
async def delete_hobby(
    hobby_id: str,
    use_cases: HobbyUseCases = Depends(get_hobby_use_cases),
    _admin: None = Depends(get_current_admin),
) -> dict:
    """Protected endpoint removing a hobby entry."""
    try:
        await use_cases.delete_hobby(hobby_id)
        return {"success": True, "message": f"Hobby '{hobby_id}' deleted successfully."}
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
