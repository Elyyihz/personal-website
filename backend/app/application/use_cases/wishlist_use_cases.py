"""Application Use Cases for WishlistItem entity operations.

Provides listing, creation, updates, fulfillment state toggling, and deletion.
"""

import uuid
from typing import List, Optional

from app.domain.entities.wishlist import WishlistItem
from app.domain.repositories.interfaces import WishlistRepository
from app.domain.exceptions.domain_exceptions import EntityNotFoundException
from app.application.dtos.wishlist_dto import (
    WishlistCreateDTO,
    WishlistUpdateDTO,
    WishlistResponseDTO,
)


class WishlistUseCases:
    """Orchestrates Wishlist domain aggregate operations."""

    def __init__(self, repository: WishlistRepository) -> None:
        """Initializes use case with injected repository port."""
        self._repo = repository

    async def list_items(self, category: Optional[str] = None) -> List[WishlistResponseDTO]:
        """Lists wishlist items, optionally filtered by category."""
        entities = await self._repo.get_all(category=category)
        return [self._map_to_dto(e) for e in entities]

    async def get_item(self, item_id: str) -> WishlistResponseDTO:
        """Retrieves a single wishlist item."""
        entity = await self._repo.get_by_id(item_id)
        if not entity:
            raise EntityNotFoundException(f"Wishlist item '{item_id}' not found.")
        return self._map_to_dto(entity)

    async def create_item(self, dto: WishlistCreateDTO) -> WishlistResponseDTO:
        """Creates a new wishlist item."""
        entity = WishlistItem(
            id=f"wish-{uuid.uuid4().hex[:8]}",
            title=dto.title,
            category=dto.category,
            subtitle=dto.subtitle,
            url=dto.url,
            tag=dto.tag,
            is_fulfilled=dto.is_fulfilled,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def update_item(self, item_id: str, dto: WishlistUpdateDTO) -> WishlistResponseDTO:
        """Updates an existing wishlist item."""
        entity = await self._repo.get_by_id(item_id)
        if not entity:
            raise EntityNotFoundException(f"Wishlist item '{item_id}' not found.")

        entity.update(
            title=dto.title,
            category=dto.category,
            subtitle=dto.subtitle,
            url=dto.url,
            tag=dto.tag,
            is_fulfilled=dto.is_fulfilled,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def toggle_fulfilled(self, item_id: str) -> WishlistResponseDTO:
        """Toggles the fulfillment boolean flag on an item."""
        entity = await self._repo.get_by_id(item_id)
        if not entity:
            raise EntityNotFoundException(f"Wishlist item '{item_id}' not found.")

        entity.toggle_fulfilled()
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def delete_item(self, item_id: str) -> bool:
        """Deletes a wishlist item by ID."""
        entity = await self._repo.get_by_id(item_id)
        if not entity:
            raise EntityNotFoundException(f"Wishlist item '{item_id}' not found.")
        return await self._repo.delete(item_id)

    @staticmethod
    def _map_to_dto(entity: WishlistItem) -> WishlistResponseDTO:
        """Maps domain entity to response DTO."""
        return WishlistResponseDTO(
            id=entity.id,
            title=entity.title,
            category=entity.category,
            subtitle=entity.subtitle,
            url=entity.url,
            tag=entity.tag,
            is_fulfilled=entity.is_fulfilled,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
