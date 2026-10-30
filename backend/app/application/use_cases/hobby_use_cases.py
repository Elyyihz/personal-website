"""Application Use Cases for HobbyInterest management."""

import uuid
from typing import List

from app.domain.entities.hobby import HobbyInterest
from app.domain.repositories.interfaces import HobbyRepository
from app.domain.exceptions.domain_exceptions import EntityNotFoundException
from app.application.dtos.hobby_dto import HobbyCreateDTO, HobbyUpdateDTO, HobbyResponseDTO


class HobbyUseCases:
    """Orchestrates Hobby/Affinity management operations."""

    def __init__(self, repository: HobbyRepository) -> None:
        """Initializes use case with injected repository port."""
        self._repo = repository

    async def list_hobbies(self) -> List[HobbyResponseDTO]:
        """Lists all registered hobbies."""
        entities = await self._repo.get_all()
        return [self._map_to_dto(e) for e in entities]

    async def get_hobby(self, hobby_id: str) -> HobbyResponseDTO:
        """Retrieves single hobby by ID."""
        entity = await self._repo.get_by_id(hobby_id)
        if not entity:
            raise EntityNotFoundException(f"Hobby with ID '{hobby_id}' not found.")
        return self._map_to_dto(entity)

    async def create_hobby(self, dto: HobbyCreateDTO) -> HobbyResponseDTO:
        """Creates a new hobby entity."""
        entity = HobbyInterest(
            id=f"hobby-{uuid.uuid4().hex[:8]}",
            name=dto.name,
            category=dto.category,
            icon_slug=dto.icon_slug,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def update_hobby(self, hobby_id: str, dto: HobbyUpdateDTO) -> HobbyResponseDTO:
        """Updates an existing hobby entity."""
        entity = await self._repo.get_by_id(hobby_id)
        if not entity:
            raise EntityNotFoundException(f"Hobby with ID '{hobby_id}' not found.")

        entity.update(
            name=dto.name,
            category=dto.category,
            icon_slug=dto.icon_slug,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def delete_hobby(self, hobby_id: str) -> bool:
        """Deletes hobby by ID."""
        entity = await self._repo.get_by_id(hobby_id)
        if not entity:
            raise EntityNotFoundException(f"Hobby with ID '{hobby_id}' not found.")
        return await self._repo.delete(hobby_id)

    @staticmethod
    def _map_to_dto(entity: HobbyInterest) -> HobbyResponseDTO:
        """Maps domain entity to response DTO."""
        return HobbyResponseDTO(
            id=entity.id,
            name=entity.name,
            category=entity.category,
            icon_slug=entity.icon_slug,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
