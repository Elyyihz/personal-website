"""Application Use Cases for ConsumedMedia aggregate management."""

from app.domain.entities.media import ConsumedMedia
from app.domain.repositories.interfaces import MediaRepository
from app.application.dtos.media_dto import (
    MediaUpdateDTO,
    MediaResponseDTO,
    MediaReadingDTO,
    MediaWatchingDTO,
)


class MediaUseCases:
    """Orchestrates literature reading and multimedia consumption state."""

    def __init__(self, repository: MediaRepository) -> None:
        """Initializes use case with injected media repository port."""
        self._repo = repository

    async def get_media(self) -> MediaResponseDTO:
        """Retrieves active consumed media state."""
        entity = await self._repo.get()
        return self._map_to_dto(entity)

    async def update_media(self, dto: MediaUpdateDTO) -> MediaResponseDTO:
        """Updates reading and watching sections of the media aggregate."""
        entity = await self._repo.get()

        entity.update_reading(
            title=dto.reading.title,
            author=dto.reading.author,
            category=dto.reading.category,
            cover_url=dto.reading.cover_url,
            reference_url=dto.reading.reference_url,
            status=dto.reading.status,
        )

        entity.update_watching(
            title=dto.watching.title,
            subtitle=dto.watching.subtitle,
            cover_url=dto.watching.cover_url,
            category=dto.watching.category,
        )

        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    @staticmethod
    def _map_to_dto(entity: ConsumedMedia) -> MediaResponseDTO:
        """Maps domain entity to response DTO."""
        return MediaResponseDTO(
            id=entity.id,
            reading=MediaReadingDTO(
                title=entity.reading_title,
                author=entity.reading_author,
                category=entity.reading_category,
                cover_url=entity.reading_cover_url,
                reference_url=entity.reading_reference_url,
                status=entity.reading_status,
            ),
            watching=MediaWatchingDTO(
                title=entity.watching_title,
                subtitle=entity.watching_subtitle,
                cover_url=entity.watching_cover_url,
                category=entity.watching_category,
            ),
            updated_at=entity.updated_at,
        )
