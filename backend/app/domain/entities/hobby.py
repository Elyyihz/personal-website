"""HobbyInterest domain entity representing personal interests and affinities.

Powers the 'O Que Eu Gosto' section with customizable names, categories, and icon slugs.
"""

from datetime import datetime, timezone
from typing import Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class HobbyInterest:
    """Domain model entity representing a hobby or affinity item.

    Attributes:
        id (str): Unique identifier.
        name (str): Designation of interest (e.g. 'Stardew Valley', 'Cafés Especiais').
        category (str): Sub-genre or thematic grouping.
        icon_slug (str): Slug mapping to inline SVG icon in the registry.
        created_at (datetime): Timestamp when aggregate was created.
        updated_at (datetime): Timestamp of latest update.
    """

    def __init__(
        self,
        id: str,
        name: str,
        category: str,
        icon_slug: str = "heart",
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ) -> None:
        """Initializes a HobbyInterest enforcing non-empty requirements."""
        if not name or not name.strip():
            raise DomainValidationError("Hobby name must not be empty.")
        if not category or not category.strip():
            raise DomainValidationError("Hobby category must not be empty.")

        now = datetime.now(timezone.utc)
        self.id = id
        self.name = name.strip()
        self.category = category.strip()
        self.icon_slug = icon_slug.strip() if icon_slug else "heart"
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def update(
        self,
        name: str,
        category: str,
        icon_slug: Optional[str] = None,
    ) -> None:
        """Updates hobby attributes while maintaining invariants."""
        if not name or not name.strip():
            raise DomainValidationError("Updated hobby name must not be empty.")
        if not category or not category.strip():
            raise DomainValidationError("Updated hobby category must not be empty.")

        self.name = name.strip()
        self.category = category.strip()
        if icon_slug:
            self.icon_slug = icon_slug.strip()
        self.updated_at = datetime.now(timezone.utc)
