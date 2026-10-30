"""Domain repository interfaces (Ports) establishing contracts for persistence adapters.

Strictly decouples the domain core from concrete storage engines (SQLAlchemy, PostgreSQL, In-Memory).
"""

from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.project import Project
from app.domain.entities.wishlist import WishlistItem
from app.domain.entities.media import ConsumedMedia
from app.domain.entities.hobby import HobbyInterest
from app.domain.entities.admin import AdminUser


class ProjectRepository(ABC):
    """Port interface for Project entity persistence operations."""

    @abstractmethod
    async def get_all(self) -> List[Project]:
        """Retrieves all project aggregates ordered by creation."""
        pass

    @abstractmethod
    async def get_by_id(self, project_id: str) -> Optional[Project]:
        """Retrieves project by unique identifier."""
        pass

    @abstractmethod
    async def save(self, project: Project) -> Project:
        """Persists or updates project aggregate."""
        pass

    @abstractmethod
    async def delete(self, project_id: str) -> bool:
        """Removes project by unique identifier."""
        pass


class WishlistRepository(ABC):
    """Port interface for WishlistItem entity persistence operations."""

    @abstractmethod
    async def get_all(self, category: Optional[str] = None) -> List[WishlistItem]:
        """Retrieves all wishlist items optionally filtered by category."""
        pass

    @abstractmethod
    async def get_by_id(self, item_id: str) -> Optional[WishlistItem]:
        """Retrieves wishlist item by unique identifier."""
        pass

    @abstractmethod
    async def save(self, item: WishlistItem) -> WishlistItem:
        """Persists or updates wishlist item."""
        pass

    @abstractmethod
    async def delete(self, item_id: str) -> bool:
        """Removes wishlist item by identifier."""
        pass


class MediaRepository(ABC):
    """Port interface for singleton ConsumedMedia aggregate persistence."""

    @abstractmethod
    async def get(self) -> ConsumedMedia:
        """Retrieves the active consumed media aggregate."""
        pass

    @abstractmethod
    async def save(self, media: ConsumedMedia) -> ConsumedMedia:
        """Persists updated consumed media state."""
        pass


class HobbyRepository(ABC):
    """Port interface for HobbyInterest entity persistence operations."""

    @abstractmethod
    async def get_all(self) -> List[HobbyInterest]:
        """Retrieves all registered hobby and affinity aggregates."""
        pass

    @abstractmethod
    async def get_by_id(self, hobby_id: str) -> Optional[HobbyInterest]:
        """Retrieves hobby by identifier."""
        pass

    @abstractmethod
    async def save(self, hobby: HobbyInterest) -> HobbyInterest:
        """Persists or updates hobby aggregate."""
        pass

    @abstractmethod
    async def delete(self, hobby_id: str) -> bool:
        """Removes hobby by identifier."""
        pass


class AdminUserRepository(ABC):
    """Port interface for AdminUser credential and session queries."""

    @abstractmethod
    async def get_by_username(self, username: str) -> Optional[AdminUser]:
        """Retrieves admin by login username."""
        pass

    @abstractmethod
    async def save(self, user: AdminUser) -> AdminUser:
        """Persists or updates admin credentials."""
        pass
