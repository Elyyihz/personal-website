"""Application Use Cases for Project domain entity management.

Implements orchestration logic independent of presentation frameworks.
"""

import uuid
from typing import List

from app.domain.entities.project import Project
from app.domain.repositories.interfaces import ProjectRepository
from app.domain.exceptions.domain_exceptions import EntityNotFoundException
from app.application.dtos.project_dto import ProjectCreateDTO, ProjectUpdateDTO, ProjectResponseDTO


class ProjectUseCases:
    """Orchestrates Project business workflows and domain operations."""

    def __init__(self, repository: ProjectRepository) -> None:
        """Initializes use case with injected repository port.

        Args:
            repository (ProjectRepository): Project storage adapter.
        """
        self._repo = repository

    async def list_projects(self) -> List[ProjectResponseDTO]:
        """Lists all projects ordered by creation."""
        entities = await self._repo.get_all()
        return [self._map_to_dto(e) for e in entities]

    async def get_project(self, project_id: str) -> ProjectResponseDTO:
        """Retrieves single project by ID."""
        entity = await self._repo.get_by_id(project_id)
        if not entity:
            raise EntityNotFoundException(f"Project with ID '{project_id}' not found.")
        return self._map_to_dto(entity)

    async def create_project(self, dto: ProjectCreateDTO) -> ProjectResponseDTO:
        """Creates and stores a new project aggregate."""
        entity = Project(
            id=f"proj-{uuid.uuid4().hex[:8]}",
            title=dto.title,
            description=dto.description,
            tags=dto.tags,
            github_url=dto.github_url,
            demo_url=dto.demo_url,
            featured=dto.featured,
            icon_slug=dto.icon_slug,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def update_project(self, project_id: str, dto: ProjectUpdateDTO) -> ProjectResponseDTO:
        """Applies modifications to an existing project entity."""
        entity = await self._repo.get_by_id(project_id)
        if not entity:
            raise EntityNotFoundException(f"Project with ID '{project_id}' not found.")

        entity.update(
            title=dto.title,
            description=dto.description,
            tags=dto.tags,
            github_url=dto.github_url,
            demo_url=dto.demo_url,
            featured=dto.featured,
            icon_slug=dto.icon_slug,
        )
        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def delete_project(self, project_id: str) -> bool:
        """Deletes a project by ID."""
        entity = await self._repo.get_by_id(project_id)
        if not entity:
            raise EntityNotFoundException(f"Project with ID '{project_id}' not found.")
        return await self._repo.delete(project_id)

    @staticmethod
    def _map_to_dto(entity: Project) -> ProjectResponseDTO:
        """Maps domain entity to response DTO."""
        return ProjectResponseDTO(
            id=entity.id,
            title=entity.title,
            description=entity.description,
            tags=entity.tags,
            github_url=entity.github_url,
            demo_url=entity.demo_url,
            featured=entity.featured,
            icon_slug=entity.icon_slug,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
