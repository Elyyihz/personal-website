"""ConsumedMedia domain aggregate representing current reading, watching, and gaming media status.

Ensures synchronization of featured literature reading progress, media, and gaming activities.
"""

from datetime import datetime, timezone
from typing import Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class ConsumedMedia:
    """Domain aggregate governing the portfolio's 'Currently Consuming' content.

    Attributes:
        id (str): Singleton aggregate identifier.
        reading_title (str): Title of book currently being read.
        reading_author (str): Author of current book.
        reading_category (str): Genre classification.
        reading_cover_url (str): HTTPS URL to book cover graphic.
        reading_reference_url (str): Hyperlink to Amazon or Goodreads reference.
        reading_status (str): Reading badge status label.
        reading_current_page (int): Current page number in reading progress.
        reading_total_pages (int): Total page count for the active book.
        watching_title (str): Title of film, series, or video program.
        watching_subtitle (str): Season or commentary subtitle.
        watching_cover_url (str): Backdrop or poster graphic URL.
        watching_category (str): Visual media category descriptor.
        gaming_title (str): Title of active video game being played.
        gaming_platform (str): Platform or console (e.g. PC, Switch).
        gaming_status (str): Status descriptor of the active game.
        gaming_cover_url (str): Game artwork graphic URL.
        gaming_hours_played (float): Logged hours invested.
        updated_at (datetime): Timestamp of latest aggregate change.
    """

    def __init__(
        self,
        id: str = "default-consumed-media",
        reading_title: str = "The Man in the High Castle",
        reading_author: str = "Philip K. Dick",
        reading_category: str = "Ficção Científica & História Alternativa",
        reading_cover_url: str = "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1450379461i/2165.jpg",
        reading_reference_url: str = "https://www.amazon.com.br/s?k=The+Man+in+the+High+Castle+Philip+K.+Dick",
        reading_status: str = "Lendo Atualmente",
        reading_current_page: int = 184,
        reading_total_pages: int = 260,
        watching_title: str = "Ficção Científica & Animação",
        watching_subtitle: str = "Séries, Lore & Documentários Tech",
        watching_cover_url: str = "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80",
        watching_category: str = "Séries & Mídia",
        gaming_title: str = "Stardew Valley",
        gaming_platform: str = "PC / Steam",
        gaming_status: str = "Em Progresso (Ano 3)",
        gaming_cover_url: str = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
        gaming_hours_played: float = 142.5,
        updated_at: Optional[datetime] = None,
    ) -> None:
        """Initializes ConsumedMedia with validated reading, watching, and gaming attributes."""
        if not reading_title or not reading_title.strip():
            raise DomainValidationError("Reading title must not be empty.")

        self.id = id
        self.reading_title = reading_title.strip()
        self.reading_author = reading_author.strip()
        self.reading_category = reading_category.strip()
        self.reading_cover_url = reading_cover_url.strip()
        self.reading_reference_url = reading_reference_url.strip()
        self.reading_status = reading_status.strip()
        self.reading_current_page = max(0, reading_current_page)
        self.reading_total_pages = max(1, reading_total_pages)

        self.watching_title = watching_title.strip()
        self.watching_subtitle = watching_subtitle.strip()
        self.watching_cover_url = watching_cover_url.strip()
        self.watching_category = watching_category.strip()

        self.gaming_title = gaming_title.strip()
        self.gaming_platform = gaming_platform.strip()
        self.gaming_status = gaming_status.strip()
        self.gaming_cover_url = gaming_cover_url.strip()
        self.gaming_hours_played = max(0.0, float(gaming_hours_played))

        self.updated_at = updated_at or datetime.now(timezone.utc)

    @property
    def reading_progress_percentage(self) -> int:
        """Calculates percentage of reading completion.

        Returns:
            int: Integer percentage between 0 and 100.
        """
        if self.reading_total_pages <= 0:
            return 0
        return min(100, round((self.reading_current_page / self.reading_total_pages) * 100))

    def update_reading(
        self,
        title: str,
        author: str,
        category: str,
        cover_url: str,
        reference_url: str,
        status: str = "Lendo Atualmente",
        current_page: Optional[int] = None,
        total_pages: Optional[int] = None,
    ) -> None:
        """Updates literature reading attributes and optional page checkpoints."""
        if not title or not title.strip():
            raise DomainValidationError("Reading title cannot be empty.")

        self.reading_title = title.strip()
        self.reading_author = author.strip()
        self.reading_category = category.strip()
        self.reading_cover_url = cover_url.strip()
        self.reading_reference_url = reference_url.strip()
        self.reading_status = status.strip()

        if current_page is not None:
            self.reading_current_page = max(0, current_page)
        if total_pages is not None:
            self.reading_total_pages = max(1, total_pages)

        self.updated_at = datetime.now(timezone.utc)

    def update_reading_progress(self, current_page: int, total_pages: Optional[int] = None) -> None:
        """Updates reading progress checkpoint in pages.

        Args:
            current_page (int): Current page reached.
            total_pages (Optional[int]): Total page count update if known.
        """
        if current_page < 0:
            raise DomainValidationError("Current page cannot be negative.")

        self.reading_current_page = current_page
        if total_pages is not None and total_pages > 0:
            self.reading_total_pages = total_pages

        self.updated_at = datetime.now(timezone.utc)

    def update_watching(
        self,
        title: str,
        subtitle: str,
        cover_url: str,
        category: str,
    ) -> None:
        """Updates watching media attributes."""
        if not title or not title.strip():
            raise DomainValidationError("Watching title cannot be empty.")

        self.watching_title = title.strip()
        self.watching_subtitle = subtitle.strip()
        self.watching_cover_url = cover_url.strip()
        self.watching_category = category.strip()
        self.updated_at = datetime.now(timezone.utc)

    def update_gaming(
        self,
        title: str,
        platform: str,
        status: str,
        cover_url: str,
        hours_played: Optional[float] = None,
    ) -> None:
        """Updates active video game status and play time.

        Args:
            title (str): Game name.
            platform (str): Hardware or digital store platform.
            status (str): Progression or completion summary.
            cover_url (str): Artwork graphic URL.
            hours_played (Optional[float]): Total hours logged.
        """
        if not title or not title.strip():
            raise DomainValidationError("Gaming title cannot be empty.")

        self.gaming_title = title.strip()
        self.gaming_platform = platform.strip()
        self.gaming_status = status.strip()
        self.gaming_cover_url = cover_url.strip()

        if hours_played is not None:
            self.gaming_hours_played = max(0.0, float(hours_played))

        self.updated_at = datetime.now(timezone.utc)
