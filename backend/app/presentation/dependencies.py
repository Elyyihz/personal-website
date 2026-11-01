"""FastAPI dependency injection providers adhering to Clean Architecture principles."""

from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.infrastructure.database.config import get_db, settings
from app.infrastructure.security.password_hasher import BcryptPasswordHasher
from app.infrastructure.security.token_provider import JwtTokenProvider
from app.infrastructure.repositories.sqlalchemy_repositories import (
    SqlAlchemyProjectRepository,
    SqlAlchemyWishlistRepository,
    SqlAlchemyMediaRepository,
    SqlAlchemyHobbyRepository,
    SqlAlchemyAdminUserRepository,
    SqlAlchemyRAGDocumentRepository,
    SqlAlchemyArticleRepository,
)
from app.infrastructure.vector_store.qdrant_vector_store import QdrantVectorStoreAdapter
from app.infrastructure.llm.gemini_gateway import GeminiLLMGateway
from app.infrastructure.rss.rss_parser import RSSFeedParser
from app.infrastructure.steam.steam_gateway import SteamWebAPIGateway
from app.application.use_cases.project_use_cases import ProjectUseCases
from app.application.use_cases.wishlist_use_cases import WishlistUseCases
from app.application.use_cases.media_use_cases import MediaUseCases
from app.application.use_cases.hobby_use_cases import HobbyUseCases
from app.application.use_cases.auth_use_cases import AuthUseCases
from app.application.use_cases.rag_use_cases import (
    IngestRAGDocumentUseCase,
    ListRAGDocumentsUseCase,
    DeleteRAGDocumentUseCase,
    SearchKnowledgeBaseUseCase,
)
from app.application.use_cases.chat_use_cases import LangGraphRAGChatUseCase
from app.application.use_cases.newsletter_use_cases import (
    SyncNewsletterFeedUseCase,
    ListArticlesUseCase,
)
from app.application.use_cases.game_use_cases import (
    GetCurrentGameUseCase,
    UpdateDiscordRPCUseCase,
)
from app.application.dtos.auth_dto import AdminProfileResponseDTO
from app.domain.exceptions.domain_exceptions import AuthenticationFailedException

security_scheme = HTTPBearer(auto_error=False)

password_hasher = BcryptPasswordHasher()
token_provider = JwtTokenProvider(
    secret_key=settings.jwt_secret_key,
    algorithm=settings.jwt_algorithm,
    expiration_seconds=settings.jwt_expiration_seconds,
)

vector_store = QdrantVectorStoreAdapter(
    storage_path=settings.qdrant_storage_path,
    collection_name="elyy_knowledge_base",
    vector_size=768,
)
gemini_gateway = GeminiLLMGateway(
    api_key=settings.gemini_api_key,
)
rss_parser = RSSFeedParser()
steam_gateway = SteamWebAPIGateway(
    api_key=settings.steam_api_key,
)


def get_vector_store() -> QdrantVectorStoreAdapter:
    """Provides singleton Qdrant vector store adapter."""
    return vector_store


def get_gemini_gateway() -> GeminiLLMGateway:
    """Provides singleton Gemini LLM gateway."""
    return gemini_gateway


def get_ingest_rag_use_case(
    db: Session = Depends(get_db),
    vstore: QdrantVectorStoreAdapter = Depends(get_vector_store),
    llm: GeminiLLMGateway = Depends(get_gemini_gateway),
) -> IngestRAGDocumentUseCase:
    """Provides instantiated IngestRAGDocumentUseCase."""
    return IngestRAGDocumentUseCase(
        document_repository=SqlAlchemyRAGDocumentRepository(db),
        vector_store_repository=vstore,
        llm_gateway=llm,
    )


def get_list_rag_use_case(db: Session = Depends(get_db)) -> ListRAGDocumentsUseCase:
    """Provides instantiated ListRAGDocumentsUseCase."""
    return ListRAGDocumentsUseCase(document_repository=SqlAlchemyRAGDocumentRepository(db))


def get_delete_rag_use_case(
    db: Session = Depends(get_db),
    vstore: QdrantVectorStoreAdapter = Depends(get_vector_store),
) -> DeleteRAGDocumentUseCase:
    """Provides instantiated DeleteRAGDocumentUseCase."""
    return DeleteRAGDocumentUseCase(
        document_repository=SqlAlchemyRAGDocumentRepository(db),
        vector_store_repository=vstore,
    )


def get_search_knowledge_use_case(
    vstore: QdrantVectorStoreAdapter = Depends(get_vector_store),
    llm: GeminiLLMGateway = Depends(get_gemini_gateway),
) -> SearchKnowledgeBaseUseCase:
    """Provides instantiated SearchKnowledgeBaseUseCase."""
    return SearchKnowledgeBaseUseCase(
        vector_store_repository=vstore,
        llm_gateway=llm,
    )


def get_chat_use_case(
    vstore: QdrantVectorStoreAdapter = Depends(get_vector_store),
    llm: GeminiLLMGateway = Depends(get_gemini_gateway),
) -> LangGraphRAGChatUseCase:
    """Provides instantiated LangGraphRAGChatUseCase."""
    return LangGraphRAGChatUseCase(
        vector_store_repository=vstore,
        llm_gateway=llm,
    )


def get_sync_newsletter_use_case(
    db: Session = Depends(get_db),
    rag_ingest: IngestRAGDocumentUseCase = Depends(get_ingest_rag_use_case),
) -> SyncNewsletterFeedUseCase:
    """Provides instantiated SyncNewsletterFeedUseCase with optional RAG integration."""
    return SyncNewsletterFeedUseCase(
        article_repository=SqlAlchemyArticleRepository(db),
        rss_parser=rss_parser,
        rag_ingest_use_case=rag_ingest,
    )


def get_list_articles_use_case(db: Session = Depends(get_db)) -> ListArticlesUseCase:
    """Provides instantiated ListArticlesUseCase."""
    return ListArticlesUseCase(article_repository=SqlAlchemyArticleRepository(db))


def get_current_game_use_case(
    db: Session = Depends(get_db),
) -> GetCurrentGameUseCase:
    """Provides instantiated GetCurrentGameUseCase."""
    return GetCurrentGameUseCase(
        steam_gateway=steam_gateway,
        steam_id=settings.steam_id,
        media_repository=SqlAlchemyMediaRepository(db),
    )


def get_discord_rpc_use_case(
    game_cases: GetCurrentGameUseCase = Depends(get_current_game_use_case),
    db: Session = Depends(get_db),
) -> UpdateDiscordRPCUseCase:
    """Provides instantiated UpdateDiscordRPCUseCase."""
    return UpdateDiscordRPCUseCase(
        game_use_case=game_cases,
        media_repository=SqlAlchemyMediaRepository(db),
    )


def get_auth_use_cases(db: Session = Depends(get_db)) -> AuthUseCases:
    """Provides instantiated AuthUseCases."""
    repo = SqlAlchemyAdminUserRepository(db)
    return AuthUseCases(
        admin_repo=repo,
        hasher=password_hasher,
        token_provider=token_provider,
        token_expiry_seconds=settings.jwt_expiration_seconds,
    )


def get_project_use_cases(db: Session = Depends(get_db)) -> ProjectUseCases:
    """Provides instantiated ProjectUseCases."""
    return ProjectUseCases(repository=SqlAlchemyProjectRepository(db))


def get_wishlist_use_cases(db: Session = Depends(get_db)) -> WishlistUseCases:
    """Provides instantiated WishlistUseCases."""
    return WishlistUseCases(repository=SqlAlchemyWishlistRepository(db))


def get_media_use_cases(db: Session = Depends(get_db)) -> MediaUseCases:
    """Provides instantiated MediaUseCases."""
    return MediaUseCases(repository=SqlAlchemyMediaRepository(db))


def get_hobby_use_cases(db: Session = Depends(get_db)) -> HobbyUseCases:
    """Provides instantiated HobbyUseCases."""
    return HobbyUseCases(repository=SqlAlchemyHobbyRepository(db))


async def get_current_admin(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security_scheme)] = None,
    auth_cases: AuthUseCases = Depends(get_auth_use_cases),
) -> AdminProfileResponseDTO:
    """Extracts and verifies JWT bearer token guarding administrative endpoints."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials are required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return await auth_cases.verify_token(credentials.credentials)
    except AuthenticationFailedException as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(err),
            headers={"WWW-Authenticate": "Bearer"},
        ) from err
