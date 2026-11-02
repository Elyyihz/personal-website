"""Newsletter Article entity module.

Represents a published technical article synchronized from the Elyy.init RSS feed.
"""

from datetime import datetime, timezone
from typing import List, Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class Article:
    """Domain entity representing a technical article published on the Elyy.init newsletter.

    Attributes:
        id (str): Unique article identifier.
        title (str): Published headline.
        link (str): Canonical URL to the article.
        description (str): Synopsis or summary excerpt.
        pub_date (datetime): Publication timestamp.
        author (str): Article author name.
        tags (List[str]): Topical tags or categories.
        content_html (Optional[str]): Full or sanitized article body.
        created_at (datetime): Synchronization registration timestamp.
    """

    def __init__(
        self,
        id: str,
        title: str,
        link: str,
        description: str,
        pub_date: Optional[datetime] = None,
        author: str = "Elynne Lima",
        tags: Optional[List[str]] = None,
        content_html: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ) -> None:
        """Initializes and validates an Article entity.

        Args:
            id (str): Unique identifier.
            title (str): Headline.
            link (str): Canonical URL.
            description (str): Article summary.
            pub_date (Optional[datetime]): Publication datetime.
            author (str): Author signature.
            tags (Optional[List[str]]): Categories.
            content_html (Optional[str]): HTML text.
            created_at (Optional[datetime]): Sync date.

        Raises:
            DomainValidationError: If title or link are empty.
        """
        if not title or not title.strip():
            raise DomainValidationError("Article title cannot be empty.")
        if not link or not link.strip():
            raise DomainValidationError("Article link cannot be empty.")

        self.id = id.strip()
        self.title = title.strip()
        self.link = link.strip()
        self.description = description.strip() if description else ""
        self.pub_date = pub_date or datetime.now(timezone.utc)
        self.author = author.strip() if author else "Elynne Lima"
        self.tags = [t.strip() for t in tags if t.strip()] if tags else []
        self.content_html = content_html
        self.created_at = created_at or datetime.now(timezone.utc)
