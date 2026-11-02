"""WishlistItem domain entity representing cataloged wishlist entries.

Supports categorization, reference URLs, tags, and explicit is_fulfilled state tracking.
"""

from datetime import datetime, timezone
from typing import Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class WishlistItem:
    """Domain model entity representing an item in the categorized wishlist.

    Attributes:
        id (str): Unique identifier for the wishlist item.
        title (str): Name of the book, hardware, or collectible.
        subtitle (Optional[str]): Author name or supplemental item details.
        category (str): Categorization taxonomy (Livros, Tech, Lifestyle & Geek).
        url (Optional[str]): Reference or purchase URL.
        tag (Optional[str]): Short descriptive badge label.
        is_fulfilled (bool): Flag indicating if item was acquired or gifted.
        created_at (datetime): Timestamp when item was recorded.
        updated_at (datetime): Timestamp of latest modification.
    """

    VALID_CATEGORIES = {"Livros", "Tech", "Lifestyle & Geek"}

    def __init__(
        self,
        id: str,
        title: str,
        category: str = "Livros",
        subtitle: Optional[str] = None,
        url: Optional[str] = None,
        tag: Optional[str] = None,
        is_fulfilled: bool = False,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ) -> None:
        """Initializes a WishlistItem enforcing domain business constraints.

        Args:
            id (str): Unique entity ID.
            title (str): Item name or book title.
            category (str): Predefined category name.
            subtitle (Optional[str]): Author or subtitle.
            url (Optional[str]): Amazon search or product URL.
            tag (Optional[str]): Badge descriptor.
            is_fulfilled (bool): Fulfillment status boolean.
            created_at (Optional[datetime]): Created timestamp UTC.
            updated_at (Optional[datetime]): Modified timestamp UTC.

        Raises:
            DomainValidationError: If title is empty or category is unsupported.
        """
        # Guard clause: Title validation
        if not title or not title.strip():
            raise DomainValidationError("Wishlist item title must not be empty.")

        clean_category = category.strip() if category else "Livros"
        if clean_category not in self.VALID_CATEGORIES:
            raise DomainValidationError(
                f"Invalid category '{clean_category}'. Allowed: {self.VALID_CATEGORIES}"
            )

        now = datetime.now(timezone.utc)
        self.id = id
        self.title = title.strip()
        self.category = clean_category
        self.subtitle = subtitle.strip() if subtitle else None
        self.url = url.strip() if url else None
        self.tag = tag.strip() if tag else None
        self.is_fulfilled = bool(is_fulfilled)
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def mark_as_fulfilled(self) -> None:
        """Marks the item as acquired or satisfied."""
        self.is_fulfilled = True
        self.updated_at = datetime.now(timezone.utc)

    def mark_as_unfulfilled(self) -> None:
        """Marks the item as pending acquisition."""
        self.is_fulfilled = False
        self.updated_at = datetime.now(timezone.utc)

    def toggle_fulfilled(self) -> None:
        """Inverts the current fulfillment state."""
        self.is_fulfilled = not self.is_fulfilled
        self.updated_at = datetime.now(timezone.utc)

    def update(
        self,
        title: str,
        category: str,
        subtitle: Optional[str] = None,
        url: Optional[str] = None,
        tag: Optional[str] = None,
        is_fulfilled: Optional[bool] = None,
    ) -> None:
        """Updates attributes of the wishlist item.

        Args:
            title (str): New title.
            category (str): New category.
            subtitle (Optional[str]): New subtitle.
            url (Optional[str]): New reference link.
            tag (Optional[str]): New tag label.
            is_fulfilled (Optional[bool]): Optional fulfillment override.

        Raises:
            DomainValidationError: If modified values violate invariants.
        """
        if not title or not title.strip():
            raise DomainValidationError("Wishlist title cannot be empty.")
        clean_category = category.strip() if category else "Livros"
        if clean_category not in self.VALID_CATEGORIES:
            raise DomainValidationError(f"Invalid category '{clean_category}'.")

        self.title = title.strip()
        self.category = clean_category
        self.subtitle = subtitle.strip() if subtitle else None
        self.url = url.strip() if url else None
        self.tag = tag.strip() if tag else None
        if is_fulfilled is not None:
            self.is_fulfilled = bool(is_fulfilled)
        self.updated_at = datetime.now(timezone.utc)
