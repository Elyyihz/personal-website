"""ConsumedMedia domain aggregate representing current reading, watching, and audio media status.

Ensures synchronization of featured literature and media recommendations.
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
        watching_title (str): Title of film, series, or video program.
        watching_subtitle (str): Season or commentary subtitle.
        watching_cover_url (str): Backdrop or poster graphic URL.
        watching_category (str): Visual media category descriptor.
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
        watching_title: str = "Ficção Científica & Animação",
        watching_subtitle: str = "Séries, Lore & Documentários Tech",
        watching_cover_url: str = "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80",
        watching_category: str = "Séries & Mídia",
        updated_at: Optional[datetime] = None,
    ) -> None:
        """Initializes ConsumedMedia with validated reading and watching attributes."""
        if not reading_title or not reading_title.strip():
            raise DomainValidationError("Reading title must not be empty.")

        self.id = id
        self.reading_title = reading_title.strip()
        self.reading_author = reading_author.strip()
        self.reading_category = reading_category.strip()
        self.reading_cover_url = reading_cover_url.strip()
        self.reading_reference_url = reading_reference_url.strip()
        self.reading_status = reading_status.strip()

        self.watching_title = watching_title.strip()
        self.watching_subtitle = watching_subtitle.strip()
        self.watching_cover_url = watching_cover_url.strip()
        self.watching_category = watching_category.strip()
        self.updated_at = updated_at or datetime.now(timezone.utc)

    def update_reading(
        self,
        title: str,
        author: str,
        category: str,
        cover_url: str,
        reference_url: str,
        status: str = "Lendo Atualmente",
    ) -> None:
        """Updates literature reading attributes."""
        if not title or not title.strip():
            raise DomainValidationError("Reading title cannot be empty.")

        self.reading_title = title.strip()
        self.reading_author = author.strip()
        self.reading_category = category.strip()
        self.reading_cover_url = cover_url.strip()
        self.reading_reference_url = reference_url.strip()
        self.reading_status = status.strip()
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
