"""Application Use Cases for Elyy.init newsletter syndication and synchronization."""

import logging
import uuid
from typing import List, Optional
import httpx

from app.domain.entities.article import Article
from app.domain.repositories.interfaces import ArticleRepository
from app.infrastructure.rss.rss_parser import RSSFeedParser
from app.application.dtos.newsletter_dto import (
    ArticleResponseDTO,
    NewsletterSyncRequestDTO,
    NewsletterSyncResponseDTO,
)
from app.application.use_cases.rag_use_cases import IngestRAGDocumentUseCase
from app.application.dtos.rag_dto import RAGIngestTextDTO

logger = logging.getLogger("newsletter_use_cases")


class SyncNewsletterFeedUseCase:
    """Orchestrates pulling or parsing RSS feeds, deduplicating articles, and updating knowledge."""

    def __init__(
        self,
        article_repository: ArticleRepository,
        rss_parser: RSSFeedParser,
        rag_ingest_use_case: Optional[IngestRAGDocumentUseCase] = None,
    ) -> None:
        """Initializes use case with repository and parser dependencies.

        Args:
            article_repository (ArticleRepository): Storage port for articles.
            rss_parser (RSSFeedParser): XML/Atom parser adapter.
            rag_ingest_use_case (Optional[IngestRAGDocumentUseCase]): Optional RAG indexing.
        """
        self.article_repo = article_repository
        self.parser = rss_parser
        self.rag_ingest = rag_ingest_use_case

    async def execute(self, dto: NewsletterSyncRequestDTO) -> NewsletterSyncResponseDTO:
        """Executes feed synchronization from XML content or remote URL.

        Args:
            dto (NewsletterSyncRequestDTO): Request parameters.

        Returns:
            NewsletterSyncResponseDTO: Number of new articles synchronized.
        """
        logger.info("Step started: Synchronizing Elyy.init newsletter feed")

        xml_text = dto.xml_content
        if not xml_text and dto.rss_url:
            logger.info("Decision taken: Fetching RSS feed from remote URL '%s'", dto.rss_url)
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(dto.rss_url)
                    if resp.status_code == 200:
                        xml_text = resp.text
                    else:
                        logger.warning(
                            "Decision taken: Remote RSS fetch failed with HTTP %d for url=%s",
                            resp.status_code,
                            dto.rss_url,
                        )
            except Exception as exc:
                logger.warning("Decision taken: Network exception fetching RSS feed: %s", exc)

        if not xml_text:
            all_articles = await self.article_repo.get_all()
            return NewsletterSyncResponseDTO(
                synced_count=0,
                total_articles=len(all_articles),
                message="Nenhum conteúdo XML fornecido ou feed remoto inacessível.",
            )

        # 1. Parse XML items
        raw_items = self.parser.parse_xml(xml_text)
        logger.info("Decision taken: Parser extracted %d item(s) from XML", len(raw_items))

        synced_count = 0
        for item in raw_items:
            existing = await self.article_repo.get_by_link(item["link"])
            if existing:
                continue

            article_id = f"art-{uuid.uuid4().hex[:10]}"
            article = Article(
                id=article_id,
                title=item["title"],
                link=item["link"],
                description=item["description"],
                pub_date=item["pub_date"],
                author=item["author"],
                tags=item["tags"],
            )
            await self.article_repo.save(article)
            synced_count += 1

            # Index into RAG knowledge base if use case is provided
            if self.rag_ingest:
                try:
                    rag_dto = RAGIngestTextDTO(
                        title=f"Artigo: {article.title}",
                        content=f"Título: {article.title}\nLink: {article.link}\nResumo: {article.description}",
                        category="article",
                        tags=article.tags,
                        metadata={"article_id": article.id, "link": article.link},
                    )
                    await self.rag_ingest.execute(rag_dto)
                except Exception as rag_err:
                    logger.warning("RAG indexing for article '%s' skipped: %s", article.title, rag_err)

        total_articles = len(await self.article_repo.get_all())
        logger.info(
            "Step concluded: Synchronized %d new articles. Total registered: %d",
            synced_count,
            total_articles,
        )

        return NewsletterSyncResponseDTO(
            synced_count=synced_count,
            total_articles=total_articles,
            message=f"{synced_count} novos artigos da Elyy.init sincronizados com sucesso.",
        )


class ListArticlesUseCase:
    """Use case retrieving registered newsletter articles."""

    def __init__(self, article_repository: ArticleRepository) -> None:
        """Initializes list use case with repository port."""
        self.article_repo = article_repository

    async def execute(self) -> List[ArticleResponseDTO]:
        """Returns all registered articles ordered by publication date."""
        articles = await self.article_repo.get_all()
        return [
            ArticleResponseDTO(
                id=a.id,
                title=a.title,
                link=a.link,
                description=a.description,
                pub_date=a.pub_date,
                author=a.author,
                tags=a.tags,
                content_html=a.content_html,
                created_at=a.created_at,
            )
            for a in articles
        ]
