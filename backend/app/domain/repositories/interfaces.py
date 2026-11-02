"""Domain repository interfaces (Ports) establishing contracts for persistence adapters.

Strictly decouples the domain core from concrete storage engines (SQLAlchemy, PostgreSQL, In-Memory).
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Optional

from app.domain.entities.project import Project
from app.domain.entities.wishlist import WishlistItem
from app.domain.entities.media import ConsumedMedia
from app.domain.entities.hobby import HobbyInterest
from app.domain.entities.admin import AdminUser
from app.domain.entities.rag_document import RAGDocument
from app.domain.entities.document_chunk import DocumentChunk
from app.domain.entities.chat_session import ChatMessage
from app.domain.entities.article import Article
from app.domain.entities.game_status import GameStatus


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


class RAGDocumentRepository(ABC):
    """Port interface for RAGDocument metadata persistence operations."""

    @abstractmethod
    async def get_all(self) -> List[RAGDocument]:
        """Retrieves all indexed RAG documents."""
        pass

    @abstractmethod
    async def get_by_id(self, document_id: str) -> Optional[RAGDocument]:
        """Retrieves a document by its unique identifier."""
        pass

    @abstractmethod
    async def save(self, document: RAGDocument) -> RAGDocument:
        """Persists or updates a RAGDocument metadata record."""
        pass

    @abstractmethod
    async def delete(self, document_id: str) -> bool:
        """Deletes a RAGDocument metadata record by identifier."""
        pass


class VectorStoreRepository(ABC):
    """Port interface for dense vector persistence and similarity retrieval."""

    @abstractmethod
    async def upsert_chunks(self, chunks: List[DocumentChunk]) -> int:
        """Inserts or replaces dense vector embeddings for document chunks.

        Args:
            chunks (List[DocumentChunk]): Document chunk entities with embeddings.

        Returns:
            int: Number of chunks successfully stored.
        """
        pass

    @abstractmethod
    async def search_similar_chunks(
        self,
        query_vector: List[float],
        limit: int = 4,
        score_threshold: Optional[float] = None,
    ) -> List[DocumentChunk]:
        """Performs nearest-neighbor vector similarity search.

        Args:
            query_vector (List[float]): Dense query embedding vector.
            limit (int): Maximum number of top chunks to return.
            score_threshold (float): Minimum similarity score cutoff.

        Returns:
            List[DocumentChunk]: Ranked sequence of relevant chunks.
        """
        pass

    @abstractmethod
    async def delete_by_document_id(self, document_id: str) -> bool:
        """Purges all vector embeddings associated with a parent document ID.

        Args:
            document_id (str): Target parent document identifier.

        Returns:
            bool: True if chunks were found and removed.
        """
        pass

    @abstractmethod
    async def count_chunks(self) -> int:
        """Returns total number of indexed vector chunks."""
        pass


class LLMGatewayInterface(ABC):
    """Port interface for LLM inference and dense embedding generation."""

    @abstractmethod
    async def embed_text(self, text: str) -> List[float]:
        """Generates a dense vector embedding for a single text chunk.

        Args:
            text (str): Input text chunk.

        Returns:
            List[float]: High-dimensional vector embedding.
        """
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for an ordered batch of text chunks.

        Args:
            texts (List[str]): Batch of text inputs.

        Returns:
            List[List[float]]: List of corresponding embedding vectors.
        """
        pass

    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> str:
        """Generates non-streaming conversational response from LLM.

        Args:
            prompt (str): User query augmented with retrieved context.
            system_instruction (str): Persona and behavioral system rules.
            history (Optional[List[ChatMessage]]): Prior conversation turns.

        Returns:
            str: Generated natural language answer.
        """
        pass

    @abstractmethod
    async def generate_stream(
        self,
        prompt: str,
        system_instruction: str,
        history: Optional[List[ChatMessage]] = None,
    ) -> AsyncGenerator[str, None]:
        """Yields streaming conversational response tokens from LLM.

        Args:
            prompt (str): User query augmented with retrieved context.
            system_instruction (str): Persona and behavioral system rules.
            history (Optional[List[ChatMessage]]): Prior conversation turns.

        Yields:
            str: Incremental response token chunks.
        """
        pass


class ArticleRepository(ABC):
    """Port interface for Article entity persistence operations."""

    @abstractmethod
    async def get_all(self) -> List[Article]:
        """Retrieves all synchronized newsletter articles ordered by publication date."""
        pass

    @abstractmethod
    async def get_by_id(self, article_id: str) -> Optional[Article]:
        """Retrieves article by unique identifier."""
        pass

    @abstractmethod
    async def get_by_link(self, link: str) -> Optional[Article]:
        """Retrieves article by canonical URL link."""
        pass

    @abstractmethod
    async def save(self, article: Article) -> Article:
        """Persists or updates an individual article."""
        pass

    @abstractmethod
    async def save_batch(self, articles: List[Article]) -> int:
        """Persists an ordered sequence of articles."""
        pass

    @abstractmethod
    async def delete(self, article_id: str) -> bool:
        """Removes article by identifier."""
        pass


class SteamGatewayInterface(ABC):
    """Port interface for communicating with Steam Web API telemetry."""

    @abstractmethod
    async def get_active_game(self, steam_id: str) -> Optional[GameStatus]:
        """Queries Steam Web API for the currently played game.

        Args:
            steam_id (str): Steam 64-bit ID.

        Returns:
            Optional[GameStatus]: Active game entity if playing, else None.
        """
        pass

    @abstractmethod
    async def get_recently_played_games(self, steam_id: str) -> List[GameStatus]:
        """Queries Steam Web API for recently played games in the last 2 weeks.

        Args:
            steam_id (str): Steam 64-bit ID.

        Returns:
            List[GameStatus]: Sequence of recently played games.
        """
        pass
