"""API router exposing Elyy.init newsletter syndication, RSS parsing, and webhook endpoints."""

from typing import List
from fastapi import APIRouter, Depends, Request, status

from app.presentation.dependencies import (
    get_sync_newsletter_use_case,
    get_list_articles_use_case,
)
from app.application.dtos.newsletter_dto import (
    ArticleResponseDTO,
    NewsletterSyncRequestDTO,
    NewsletterSyncResponseDTO,
)
from app.application.use_cases.newsletter_use_cases import (
    SyncNewsletterFeedUseCase,
    ListArticlesUseCase,
)

router = APIRouter(prefix="/newsletter", tags=["Newsletter Elyy.init"])


@router.get("/articles", response_model=List[ArticleResponseDTO])
async def list_newsletter_articles(
    use_case: ListArticlesUseCase = Depends(get_list_articles_use_case),
) -> List[ArticleResponseDTO]:
    """Public endpoint retrieving synchronized Elyy.init technical articles."""
    return await use_case.execute()


@router.post("/sync", response_model=NewsletterSyncResponseDTO)
async def sync_newsletter_feed(
    dto: NewsletterSyncRequestDTO,
    use_case: SyncNewsletterFeedUseCase = Depends(get_sync_newsletter_use_case),
) -> NewsletterSyncResponseDTO:
    """Cronjob or manual sync endpoint parsing Elyy.init RSS/XML feed."""
    return await use_case.execute(dto)


@router.post("/webhook", response_model=NewsletterSyncResponseDTO, status_code=status.HTTP_200_OK)
async def newsletter_webhook(
    request: Request,
    use_case: SyncNewsletterFeedUseCase = Depends(get_sync_newsletter_use_case),
) -> NewsletterSyncResponseDTO:
    """Webhook endpoint accepting raw RSS/XML or JSON publication notifications from CMS/Substack/Ghost."""
    content_type = request.headers.get("content-type", "").lower()

    if "application/xml" in content_type or "text/xml" in content_type:
        raw_xml = (await request.body()).decode("utf-8")
        dto = NewsletterSyncRequestDTO(xml_content=raw_xml)
    else:
        try:
            body = await request.json()
            xml_content = body.get("xml_content")
            rss_url = body.get("rss_url", "https://elyy.init/feed.xml")
            dto = NewsletterSyncRequestDTO(rss_url=rss_url, xml_content=xml_content)
        except Exception:
            dto = NewsletterSyncRequestDTO(rss_url="https://elyy.init/feed.xml")

    return await use_case.execute(dto)
