"""RSS and Atom XML feed parser infrastructure adapter.

Parses syndicated newsletter feeds using standard XML element tree processing
and normalizes item schemas for domain persistence.
"""

import email.utils
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import xml.etree.ElementTree as ET

logger = logging.getLogger("rss_parser")


class RSSFeedParser:
    """Parser adapter capable of handling both RSS 2.0 and Atom XML feeds."""

    def parse_xml(self, xml_text: str) -> List[Dict[str, Any]]:
        """Parses raw RSS/XML string into normalized article payload dictionaries.

        Args:
            xml_text (str): Raw XML payload from newsletter feed.

        Returns:
            List[Dict[str, Any]]: Extracted structured article records.
        """
        if not xml_text or not xml_text.strip():
            logger.warning("Decision taken: Empty XML feed payload received; returning empty list")
            return []

        try:
            root = ET.fromstring(xml_text.strip())
        except Exception as exc:
            logger.error("Failed to parse RSS XML syntax: %s", exc)
            return []

        # Identify feed type: RSS 2.0 or Atom
        root_tag = root.tag.lower()
        if "rss" in root_tag or root.find("channel") is not None:
            return self._parse_rss2(root)
        elif "feed" in root_tag:
            return self._parse_atom(root)

        # Fallback search for item elements
        return self._parse_generic_items(root)

    def _parse_rss2(self, root: ET.Element) -> List[Dict[str, Any]]:
        """Extracts items from standard RSS 2.0 channel element."""
        channel = root.find("channel")
        items_parent = channel if channel is not None else root
        articles: List[Dict[str, Any]] = []

        for item in items_parent.findall("item"):
            title = self._get_text(item, "title") or "Untitled Article"
            link = self._get_text(item, "link") or ""
            description = self._get_text(item, "description") or ""
            author = (
                self._get_text(item, "author")
                or self._get_text(item, "{http://purl.org/dc/elements/1.1/}creator")
                or "Elynne Lima"
            )
            pub_date_str = self._get_text(item, "pubDate")
            pub_date = self._parse_date(pub_date_str)

            # Extract category tags
            tags = [cat.text.strip() for cat in item.findall("category") if cat.text and cat.text.strip()]

            if link:
                articles.append(
                    {
                        "title": title,
                        "link": link,
                        "description": description,
                        "author": author,
                        "pub_date": pub_date,
                        "tags": tags,
                    }
                )

        logger.info("Decision taken: Parsed %d articles from RSS 2.0 feed", len(articles))
        return articles

    def _parse_atom(self, root: ET.Element) -> List[Dict[str, Any]]:
        """Extracts entries from standard Atom XML feed."""
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        articles: List[Dict[str, Any]] = []

        entries = root.findall("atom:entry", ns) or root.findall("entry")
        for entry in entries:
            title = self._get_text(entry, "atom:title", ns) or self._get_text(entry, "title") or "Untitled"

            # In Atom, link is often an attribute href
            link_elem = entry.find("atom:link", ns) or entry.find("link")
            link = ""
            if link_elem is not None:
                link = link_elem.attrib.get("href", "") or (link_elem.text or "").strip()

            summary = (
                self._get_text(entry, "atom:summary", ns)
                or self._get_text(entry, "summary")
                or self._get_text(entry, "content")
                or ""
            )

            author = (
                self._get_text(entry, "atom:author/atom:name", ns)
                or self._get_text(entry, "author/name")
                or "Elynne Lima"
            )

            date_str = (
                self._get_text(entry, "atom:published", ns)
                or self._get_text(entry, "atom:updated", ns)
                or self._get_text(entry, "published")
                or self._get_text(entry, "updated")
            )
            pub_date = self._parse_date(date_str)

            tags = []
            for cat in entry.findall("atom:category", ns) or entry.findall("category"):
                term = cat.attrib.get("term") or cat.attrib.get("label") or cat.text
                if term:
                    tags.append(term.strip())

            if link:
                articles.append(
                    {
                        "title": title,
                        "link": link,
                        "description": summary,
                        "author": author,
                        "pub_date": pub_date,
                        "tags": tags,
                    }
                )

        logger.info("Decision taken: Parsed %d articles from Atom feed", len(articles))
        return articles

    def _parse_generic_items(self, root: ET.Element) -> List[Dict[str, Any]]:
        """Fallback extractor iterating across any item/entry nodes."""
        articles = []
        for elem in root.iter():
            if elem.tag.endswith("item") or elem.tag.endswith("entry"):
                title = self._get_text(elem, "title") or "Untitled"
                link = self._get_text(elem, "link") or ""
                desc = self._get_text(elem, "description") or self._get_text(elem, "summary") or ""
                if link:
                    articles.append(
                        {
                            "title": title,
                            "link": link,
                            "description": desc,
                            "author": "Elynne Lima",
                            "pub_date": datetime.now(timezone.utc),
                            "tags": [],
                        }
                    )
        return articles

    @staticmethod
    def _get_text(parent: ET.Element, path: str, ns: Optional[Dict[str, str]] = None) -> str:
        """Helper safely extracting inner text from subelement."""
        elem = parent.find(path, ns) if ns else parent.find(path)
        if elem is not None and elem.text:
            return elem.text.strip()
        return ""

    @staticmethod
    def _parse_date(date_str: Optional[str]) -> datetime:
        """Parses RFC 822 or ISO-8601 date strings to timezone-aware UTC datetime."""
        if not date_str:
            return datetime.now(timezone.utc)

        # 1. Try RFC 822 (standard RSS: 'Sun, 01 Nov 2026 12:00:00 GMT')
        try:
            return email.utils.parsedate_to_datetime(date_str)
        except Exception:
            pass

        # 2. Try ISO 8601 (Atom: '2026-11-01T12:00:00Z')
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except Exception:
            pass

        return datetime.now(timezone.utc)
