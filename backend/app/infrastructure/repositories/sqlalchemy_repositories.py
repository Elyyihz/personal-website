"""SQLAlchemy repository adapters implementing domain repository ports."""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.domain.entities.project import Project
from app.domain.entities.wishlist import WishlistItem
from app.domain.entities.media import ConsumedMedia
from app.domain.entities.hobby import HobbyInterest
from app.domain.entities.admin import AdminUser
from app.domain.entities.rag_document import RAGDocument
from app.domain.repositories.interfaces import (
    ProjectRepository,
    WishlistRepository,
    MediaRepository,
    HobbyRepository,
    AdminUserRepository,
    RAGDocumentRepository,
)
from app.infrastructure.database.models import (
    ProjectModel,
    WishlistItemModel,
    ConsumedMediaModel,
    HobbyModel,
    AdminUserModel,
    RAGDocumentModel,
)


class SqlAlchemyProjectRepository(ProjectRepository):
    """PostgreSQL / SQLite adapter for Project persistence."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get_all(self) -> List[Project]:
        models = self._session.query(ProjectModel).order_by(ProjectModel.created_at.desc()).all()
        return [self._to_entity(m) for m in models]

    async def get_by_id(self, project_id: str) -> Optional[Project]:
        model = self._session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        return self._to_entity(model) if model else None

    async def save(self, project: Project) -> Project:
        model = self._session.query(ProjectModel).filter(ProjectModel.id == project.id).first()
        if not model:
            model = ProjectModel(id=project.id)
            self._session.add(model)

        model.title = project.title
        model.description = project.description
        model.tags = project.tags
        model.github_url = project.github_url
        model.demo_url = project.demo_url
        model.featured = project.featured
        model.icon_slug = project.icon_slug
        model.created_at = project.created_at
        model.updated_at = project.updated_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, project_id: str) -> bool:
        model = self._session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        if not model:
            return False
        self._session.delete(model)
        self._session.commit()
        return True

    @staticmethod
    def _to_entity(model: ProjectModel) -> Project:
        return Project(
            id=model.id,
            title=model.title,
            description=model.description,
            tags=model.tags,
            github_url=model.github_url,
            demo_url=model.demo_url,
            featured=model.featured,
            icon_slug=model.icon_slug,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )


class SqlAlchemyWishlistRepository(WishlistRepository):
    """PostgreSQL / SQLite adapter for Wishlist item persistence."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get_all(self, category: Optional[str] = None) -> List[WishlistItem]:
        query = self._session.query(WishlistItemModel)
        if category and category != "Todos":
            query = query.filter(WishlistItemModel.category == category)
        models = query.order_by(WishlistItemModel.created_at.desc()).all()
        return [self._to_entity(m) for m in models]

    async def get_by_id(self, item_id: str) -> Optional[WishlistItem]:
        model = self._session.query(WishlistItemModel).filter(WishlistItemModel.id == item_id).first()
        return self._to_entity(model) if model else None

    async def save(self, item: WishlistItem) -> WishlistItem:
        model = self._session.query(WishlistItemModel).filter(WishlistItemModel.id == item.id).first()
        if not model:
            model = WishlistItemModel(id=item.id)
            self._session.add(model)

        model.title = item.title
        model.category = item.category
        model.subtitle = item.subtitle
        model.url = item.url
        model.tag = item.tag
        model.is_fulfilled = item.is_fulfilled
        model.created_at = item.created_at
        model.updated_at = item.updated_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, item_id: str) -> bool:
        model = self._session.query(WishlistItemModel).filter(WishlistItemModel.id == item_id).first()
        if not model:
            return False
        self._session.delete(model)
        self._session.commit()
        return True

    @staticmethod
    def _to_entity(model: WishlistItemModel) -> WishlistItem:
        return WishlistItem(
            id=model.id,
            title=model.title,
            category=model.category,
            subtitle=model.subtitle,
            url=model.url,
            tag=model.tag,
            is_fulfilled=model.is_fulfilled,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )


class SqlAlchemyMediaRepository(MediaRepository):
    """PostgreSQL / SQLite adapter for singleton ConsumedMedia aggregate."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get(self) -> ConsumedMedia:
        model = self._session.query(ConsumedMediaModel).first()
        if not model:
            # Seed default media state with Philip K. Dick's 'The Man in the High Castle'
            default_entity = ConsumedMedia()
            return await self.save(default_entity)
        return self._to_entity(model)

    async def save(self, media: ConsumedMedia) -> ConsumedMedia:
        model = self._session.query(ConsumedMediaModel).filter(ConsumedMediaModel.id == media.id).first()
        if not model:
            model = ConsumedMediaModel(id=media.id)
            self._session.add(model)

        model.reading_title = media.reading_title
        model.reading_author = media.reading_author
        model.reading_category = media.reading_category
        model.reading_cover_url = media.reading_cover_url
        model.reading_reference_url = media.reading_reference_url
        model.reading_status = media.reading_status
        model.watching_title = media.watching_title
        model.watching_subtitle = media.watching_subtitle
        model.watching_cover_url = media.watching_cover_url
        model.watching_category = media.watching_category
        model.updated_at = media.updated_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    @staticmethod
    def _to_entity(model: ConsumedMediaModel) -> ConsumedMedia:
        return ConsumedMedia(
            id=model.id,
            reading_title=model.reading_title,
            reading_author=model.reading_author,
            reading_category=model.reading_category,
            reading_cover_url=model.reading_cover_url,
            reading_reference_url=model.reading_reference_url,
            reading_status=model.reading_status,
            watching_title=model.watching_title,
            watching_subtitle=model.watching_subtitle,
            watching_cover_url=model.watching_cover_url,
            watching_category=model.watching_category,
            updated_at=model.updated_at,
        )


class SqlAlchemyHobbyRepository(HobbyRepository):
    """PostgreSQL / SQLite adapter for HobbyInterest entity persistence."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get_all(self) -> List[HobbyInterest]:
        models = self._session.query(HobbyModel).order_by(HobbyModel.created_at.asc()).all()
        return [self._to_entity(m) for m in models]

    async def get_by_id(self, hobby_id: str) -> Optional[HobbyInterest]:
        model = self._session.query(HobbyModel).filter(HobbyModel.id == hobby_id).first()
        return self._to_entity(model) if model else None

    async def save(self, hobby: HobbyInterest) -> HobbyInterest:
        model = self._session.query(HobbyModel).filter(HobbyModel.id == hobby.id).first()
        if not model:
            model = HobbyModel(id=hobby.id)
            self._session.add(model)

        model.name = hobby.name
        model.category = hobby.category
        model.icon_slug = hobby.icon_slug
        model.created_at = hobby.created_at
        model.updated_at = hobby.updated_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, hobby_id: str) -> bool:
        model = self._session.query(HobbyModel).filter(HobbyModel.id == hobby_id).first()
        if not model:
            return False
        self._session.delete(model)
        self._session.commit()
        return True

    @staticmethod
    def _to_entity(model: HobbyModel) -> HobbyInterest:
        return HobbyInterest(
            id=model.id,
            name=model.name,
            category=model.category,
            icon_slug=model.icon_slug,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )


class SqlAlchemyAdminUserRepository(AdminUserRepository):
    """PostgreSQL / SQLite adapter for AdminUser credential queries."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get_by_username(self, username: str) -> Optional[AdminUser]:
        model = (
            self._session.query(AdminUserModel)
            .filter(AdminUserModel.username == username.strip().lower())
            .first()
        )
        return self._to_entity(model) if model else None

    async def save(self, user: AdminUser) -> AdminUser:
        model = (
            self._session.query(AdminUserModel)
            .filter(AdminUserModel.username == user.username.strip().lower())
            .first()
        )
        if not model:
            model = AdminUserModel(id=user.id)
            self._session.add(model)

        model.username = user.username.strip().lower()
        model.password_hash = user.password_hash
        model.created_at = user.created_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    @staticmethod
    def _to_entity(model: AdminUserModel) -> AdminUser:
        return AdminUser(
            id=model.id,
            username=model.username,
            password_hash=model.password_hash,
            created_at=model.created_at,
        )


class SqlAlchemyRAGDocumentRepository(RAGDocumentRepository):
    """PostgreSQL / SQLite adapter for RAGDocument metadata persistence."""

    def __init__(self, session: Session) -> None:
        self._session = session

    async def get_all(self) -> List[RAGDocument]:
        models = (
            self._session.query(RAGDocumentModel)
            .order_by(RAGDocumentModel.created_at.desc())
            .all()
        )
        return [self._to_entity(m) for m in models]

    async def get_by_id(self, document_id: str) -> Optional[RAGDocument]:
        model = (
            self._session.query(RAGDocumentModel)
            .filter(RAGDocumentModel.id == document_id)
            .first()
        )
        return self._to_entity(model) if model else None

    async def save(self, document: RAGDocument) -> RAGDocument:
        model = (
            self._session.query(RAGDocumentModel)
            .filter(RAGDocumentModel.id == document.id)
            .first()
        )
        if not model:
            model = RAGDocumentModel(id=document.id)
            self._session.add(model)

        model.title = document.title
        model.content = document.content
        model.category = document.category
        model.chunk_count = document.chunk_count
        model.metadata_dict = document.metadata
        model.created_at = document.created_at

        self._session.commit()
        self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, document_id: str) -> bool:
        model = (
            self._session.query(RAGDocumentModel)
            .filter(RAGDocumentModel.id == document_id)
            .first()
        )
        if not model:
            return False

        self._session.delete(model)
        self._session.commit()
        return True

    @staticmethod
    def _to_entity(model: RAGDocumentModel) -> RAGDocument:
        return RAGDocument(
            id=model.id,
            title=model.title,
            content=model.content,
            category=model.category,
            chunk_count=model.chunk_count,
            metadata=model.metadata_dict,
            created_at=model.created_at,
        )
