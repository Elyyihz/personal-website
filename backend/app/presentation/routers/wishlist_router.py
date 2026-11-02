"""FastAPI router handling Wishlist entity CRUD operations with is_fulfilled support."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.application.dtos.wishlist_dto import (
    WishlistCreateDTO,
    WishlistUpdateDTO,
    WishlistResponseDTO,
)
from app.application.use_cases.wishlist_use_cases import WishlistUseCases
from app.presentation.dependencies import get_wishlist_use_cases, get_current_admin
from app.domain.exceptions.domain_exceptions import EntityNotFoundException, DomainValidationError

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=List[WishlistResponseDTO])
async def list_wishlist(
    category: Optional[str] = Query(None, description="Filter by taxonomy category"),
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
) -> List[WishlistResponseDTO]:
    """Public endpoint retrieving wishlist items."""
    return await use_cases.list_items(category=category)


@router.get("/{item_id}", response_model=WishlistResponseDTO)
async def get_wishlist_item(
    item_id: str,
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
) -> WishlistResponseDTO:
    """Public endpoint retrieving single item by ID."""
    try:
        return await use_cases.get_item(item_id)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err


@router.post("", response_model=WishlistResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_wishlist_item(
    dto: WishlistCreateDTO,
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
    _admin: None = Depends(get_current_admin),
) -> WishlistResponseDTO:
    """Protected endpoint creating a new wishlist item."""
    try:
        return await use_cases.create_item(dto)
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.put("/{item_id}", response_model=WishlistResponseDTO)
async def update_wishlist_item(
    item_id: str,
    dto: WishlistUpdateDTO,
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
    _admin: None = Depends(get_current_admin),
) -> WishlistResponseDTO:
    """Protected endpoint updating wishlist item attributes."""
    try:
        return await use_cases.update_item(item_id, dto)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
    except DomainValidationError as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err)) from err


@router.patch("/{item_id}/toggle-fulfilled", response_model=WishlistResponseDTO)
async def toggle_item_fulfilled(
    item_id: str,
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
    _admin: None = Depends(get_current_admin),
) -> WishlistResponseDTO:
    """Protected endpoint toggling the is_fulfilled boolean flag."""
    try:
        return await use_cases.toggle_fulfilled(item_id)
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err


@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
async def delete_wishlist_item(
    item_id: str,
    use_cases: WishlistUseCases = Depends(get_wishlist_use_cases),
    _admin: None = Depends(get_current_admin),
) -> dict:
    """Protected endpoint deleting a wishlist item."""
    try:
        await use_cases.delete_item(item_id)
        return {"success": True, "message": f"Wishlist item '{item_id}' deleted successfully."}
    except EntityNotFoundException as err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(err)) from err
