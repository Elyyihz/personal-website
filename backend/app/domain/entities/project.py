"""Project domain entity representing featured engineering and architectural initiatives.

Encapsulates state, business validation rules, and mutation logic.
"""

from datetime import datetime, timezone
from typing import List, Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class Project:
    """Domain model entity representing a portfolio software project.

    Attributes:
        id (str): Unique identifier for the project aggregate.
        title (str): Project display name.
        description (str): Engineering narrative describing architecture and purpose.
        tags (List[str]): Technology stack keywords.
        github_url (Optional[str]): Source code repository link.
        demo_url (Optional[str]): Interactive demonstration hyperlink.
        featured (bool): Flag indicating if project is highlighted in hero banner.
        icon_slug (str): Slug referencing registered inline SVG icon.
        created_at (datetime): Timestamp when aggregate was created.
        updated_at (datetime): Timestamp of latest mutation.
    """

    def __init__(
        self,
        id: str,
        title: str,
        description: str,
        tags: Optional[List[str]] = None,
        github_url: Optional[str] = None,
        demo_url: Optional[str] = None,
        featured: bool = False,
        icon_slug: str = "code",
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ) -> None:
        """Initializes a Project entity enforcing business invariants.

        Args:
            id (str): Unique entity identifier.
            title (str): Title of the software project.
            description (str): Architectural explanation of the project.
            tags (Optional[List[str]]): Technology stack tags.
            github_url (Optional[str]): GitHub URL if hosted publicly.
            demo_url (Optional[str]): Demonstration URL.
            featured (bool): Highlighted state flag.
            icon_slug (str): Slug identifier for icon registry.
            created_at (Optional[datetime]): Creation datetime UTC.
            updated_at (Optional[datetime]): Update datetime UTC.

        Raises:
            DomainValidationError: If title or description are blank.
        """
        # Guard clause: Title must not be empty or whitespace only
        if not title or not title.strip():
            raise DomainValidationError("Project title must not be empty.")

        # Guard clause: Description must not be empty
        if not description or not description.strip():
            raise DomainValidationError("Project description must not be empty.")

        now = datetime.now(timezone.utc)
        self.id = id
        self.title = title.strip()
        self.description = description.strip()
        self.tags = list(tags) if tags else ["General"]
        self.github_url = github_url.strip() if github_url else None
        self.demo_url = demo_url.strip() if demo_url else None
        self.featured = bool(featured)
        self.icon_slug = icon_slug.strip() if icon_slug else "code"
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def update(
        self,
        title: str,
        description: str,
        tags: Optional[List[str]] = None,
        github_url: Optional[str] = None,
        demo_url: Optional[str] = None,
        featured: Optional[bool] = None,
        icon_slug: Optional[str] = None,
    ) -> None:
        """Applies mutable state updates while preserving domain invariants.

        Args:
            title (str): New title for the project.
            description (str): New architectural description.
            tags (Optional[List[str]]): New list of technology stack tags.
            github_url (Optional[str]): Updated GitHub repository URL.
            demo_url (Optional[str]): Updated demo URL.
            featured (Optional[bool]): Updated highlight flag.
            icon_slug (Optional[str]): Updated SVG icon slug.

        Raises:
            DomainValidationError: If modified title or description are invalid.
        """
        if not title or not title.strip():
            raise DomainValidationError("Updated project title must not be empty.")
        if not description or not description.strip():
            raise DomainValidationError("Updated project description must not be empty.")

        self.title = title.strip()
        self.description = description.strip()
        if tags is not None:
            self.tags = list(tags)
        self.github_url = github_url.strip() if github_url else None
        self.demo_url = demo_url.strip() if demo_url else None
        if featured is not None:
            self.featured = bool(featured)
        if icon_slug:
            self.icon_slug = icon_slug.strip()
        self.updated_at = datetime.now(timezone.utc)
