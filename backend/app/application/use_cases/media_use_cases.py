"""Application Use Cases for ConsumedMedia aggregate management."""

import logging
from typing import Optional
from app.domain.entities.media import ConsumedMedia
from app.domain.repositories.interfaces import MediaRepository
from app.application.dtos.media_dto import (
    MediaUpdateDTO,
    MediaResponseDTO,
    MediaReadingDTO,
    MediaWatchingDTO,
    MediaGamingDTO,
    ReadingProgressWebhookDTO,
    GamingStatusWebhookDTO,
)

logger = logging.getLogger("media_use_cases")


class MediaUseCases:
    """Orchestrates literature reading, multimedia consumption, and gaming status state."""

    def __init__(self, repository: MediaRepository) -> None:
        """Initializes use case with injected media repository port."""
        self._repo = repository

    async def get_media(self) -> MediaResponseDTO:
        """Retrieves active consumed media state."""
        entity = await self._repo.get()
        return self._map_to_dto(entity)

    async def update_media(self, dto: MediaUpdateDTO) -> MediaResponseDTO:
        """Updates reading, watching, and gaming sections of the media aggregate."""
        entity = await self._repo.get()

        entity.update_reading(
            title=dto.reading.title,
            author=dto.reading.author,
            category=dto.reading.category,
            cover_url=dto.reading.cover_url,
            reference_url=dto.reading.reference_url,
            status=dto.reading.status,
            current_page=dto.reading.current_page,
            total_pages=dto.reading.total_pages,
        )

        entity.update_watching(
            title=dto.watching.title,
            subtitle=dto.watching.subtitle,
            cover_url=dto.watching.cover_url,
            category=dto.watching.category,
        )

        if dto.gaming:
            entity.update_gaming(
                title=dto.gaming.title,
                platform=dto.gaming.platform,
                status=dto.gaming.status,
                cover_url=dto.gaming.cover_url,
                hours_played=dto.gaming.hours_played,
            )

        saved = await self._repo.save(entity)
        return self._map_to_dto(saved)

    async def update_reading_progress(self, dto: ReadingProgressWebhookDTO) -> MediaResponseDTO:
        """Updates reading page progress via webhook or manual checkpoint.

        Args:
            dto (ReadingProgressWebhookDTO): New page progression checkpoint.

        Returns:
            MediaResponseDTO: Updated aggregate state.
        """
        logger.info("Step started: Updating reading progress page=%d", dto.current_page)
        entity = await self._repo.get()

        entity.update_reading_progress(
            current_page=dto.current_page,
            total_pages=dto.total_pages,
        )

        saved = await self._repo.save(entity)
        logger.info(
            "Step concluded: Reading progress updated to %d/%d (%d%%)",
            saved.reading_current_page,
            saved.reading_total_pages,
            saved.reading_progress_percentage,
        )
        return self._map_to_dto(saved)

    async def update_gaming_status(self, dto: GamingStatusWebhookDTO) -> MediaResponseDTO:
        """Updates active video game title, platform, status, or hours logged.

        Args:
            dto (GamingStatusWebhookDTO): Game update payload.

        Returns:
            MediaResponseDTO: Updated aggregate state.
        """
        logger.info("Step started: Updating gaming status for game='%s'", dto.title)
        entity = await self._repo.get()

        entity.update_gaming(
            title=dto.title,
            platform=dto.platform or entity.gaming_platform,
            status=dto.status or entity.gaming_status,
            cover_url=dto.cover_url or entity.gaming_cover_url,
            hours_played=dto.hours_played if dto.hours_played is not None else entity.gaming_hours_played,
        )

        saved = await self._repo.save(entity)
        logger.info("Step concluded: Gaming status updated for '%s'", saved.gaming_title)
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
                current_page=entity.reading_current_page,
                total_pages=entity.reading_total_pages,
                progress_percentage=entity.reading_progress_percentage,
            ),
            watching=MediaWatchingDTO(
                title=entity.watching_title,
                subtitle=entity.watching_subtitle,
                cover_url=entity.watching_cover_url,
                category=entity.watching_category,
            ),
            gaming=MediaGamingDTO(
                title=entity.gaming_title,
                platform=entity.gaming_platform,
                status=entity.gaming_status,
                cover_url=entity.gaming_cover_url,
                hours_played=entity.gaming_hours_played,
            ),
            updated_at=entity.updated_at,
        )
