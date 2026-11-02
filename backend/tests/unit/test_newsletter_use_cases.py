"""Unit tests for Newsletter RSS Feed Parsing and Synchronization use cases."""

from datetime import datetime, timezone
from typing import List, Optional
import pytest

from app.domain.entities.article import Article
from app.domain.repositories.interfaces import ArticleRepository
from app.application.dtos.newsletter_dto import NewsletterSyncRequestDTO
from app.application.use_cases.newsletter_use_cases import (
    SyncNewsletterFeedUseCase,
    ListArticlesUseCase,
)
from app.infrastructure.rss.rss_parser import RSSFeedParser


class InMemoryArticleRepository(ArticleRepository):
    """In-memory test double for newsletter article persistence."""

    def __init__(self):
        self.articles = {}

    async def get_all(self) -> List[Article]:
        return sorted(self.articles.values(), key=lambda a: a.pub_date, reverse=True)

    async def get_by_id(self, article_id: str) -> Optional[Article]:
        return self.articles.get(article_id)

    async def get_by_link(self, link: str) -> Optional[Article]:
        for article in self.articles.values():
            if article.link == link:
                return article
        return None

    async def save(self, article: Article) -> Article:
        self.articles[article.id] = article
        return article

    async def save_batch(self, articles: List[Article]) -> int:
        for a in articles:
            self.articles[a.id] = a
        return len(articles)

    async def delete(self, article_id: str) -> bool:
        return bool(self.articles.pop(article_id, None))


SAMPLE_RSS_XML = """<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Elyy.init</title>
  <link>https://elyy.init</link>
  <description>Technical articles on Clean Architecture, RAG, and AI Systems.</description>
  <item>
    <title>Clean Architecture &amp; DDD em Microserviços Python</title>
    <link>https://elyy.init/clean-architecture-ddd-python</link>
    <description>Guia prático sobre isolamento do domínio, inversão de controle e regras de dependência estritas.</description>
    <pubDate>Sun, 01 Nov 2026 12:00:00 GMT</pubDate>
    <author>Elynne Lima</author>
    <category>Clean Architecture</category>
    <category>DDD</category>
  </item>
  <item>
    <title>Orquestração Determinística de Agentes com LangGraph e Qdrant</title>
    <link>https://elyy.init/deterministic-agents-langgraph</link>
    <description>Como eliminar alucinações de agentes usando grafos de estados estritos e busca vetorial densa.</description>
    <pubDate>Sat, 31 Oct 2026 15:30:00 GMT</pubDate>
    <author>Elynne Lima</author>
    <category>LangGraph</category>
    <category>Qdrant</category>
  </item>
</channel>
</rss>
"""


def test_rss_parser_extracts_items():
    """Validates RSSFeedParser extracting structured item payloads from raw XML."""
    parser = RSSFeedParser()
    items = parser.parse_xml(SAMPLE_RSS_XML)

    assert len(items) == 2
    assert items[0]["title"] == "Clean Architecture & DDD em Microserviços Python"
    assert items[0]["link"] == "https://elyy.init/clean-architecture-ddd-python"
    assert "Clean Architecture" in items[0]["tags"]
    assert items[0]["author"] == "Elynne Lima"
    assert isinstance(items[0]["pub_date"], datetime)


@pytest.mark.asyncio
async def test_sync_newsletter_use_case():
    """Validates full newsletter synchronization workflow avoiding duplicate links."""
    repo = InMemoryArticleRepository()
    parser = RSSFeedParser()

    use_case = SyncNewsletterFeedUseCase(
        article_repository=repo,
        rss_parser=parser,
    )

    req = NewsletterSyncRequestDTO(xml_content=SAMPLE_RSS_XML)
    res = await use_case.execute(req)

    assert res.synced_count == 2
    assert res.total_articles == 2

    # Listing verification
    list_case = ListArticlesUseCase(article_repository=repo)
    articles = await list_case.execute()
    assert len(articles) == 2
    assert articles[0].title == "Clean Architecture & DDD em Microserviços Python"

    # Idempotency / duplicate check
    res_second = await use_case.execute(req)
    assert res_second.synced_count == 0  # No new duplicates inserted
    assert res_second.total_articles == 2
