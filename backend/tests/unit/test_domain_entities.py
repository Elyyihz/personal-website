"""Unit tests for Domain Entities following TDD discipline.

Validates core business rules, entity instantiation, and mutations in isolation.
"""

from datetime import datetime, timezone
import pytest

from app.domain.entities.project import Project
from app.domain.entities.wishlist import WishlistItem
from app.domain.entities.media import ConsumedMedia
from app.domain.entities.hobby import HobbyInterest
from app.domain.entities.admin import AdminUser
from app.domain.exceptions.domain_exceptions import DomainValidationError


def test_project_entity_creation_and_mutation():
    """Validates Project entity creation, validation, and update rules."""
    project = Project(
        id="proj-1",
        title="Doc Semantic Equivalence Engine",
        description="Async RAG legal compliance engine",
        tags=["FastAPI", "LangGraph"],
        github_url="https://github.com/Elyyihz/doc-semantic",
        demo_url=None,
        featured=True,
        icon_slug="code",
    )

    assert project.id == "proj-1"
    assert project.title == "Doc Semantic Equivalence Engine"
    assert project.featured is True
    assert project.icon_slug == "code"

    # Test mutation
    project.update(
        title="Updated Engine",
        description="New description",
        tags=["Python", "vLLM"],
        github_url=None,
        demo_url="https://demo.example.com",
        featured=False,
        icon_slug="sparkles",
    )

    assert project.title == "Updated Engine"
    assert project.featured is False
    assert project.icon_slug == "sparkles"
    assert project.demo_url == "https://demo.example.com"


def test_project_entity_validation_empty_title():
    """Validates that Project entity raises DomainValidationError if title is empty."""
    with pytest.raises(DomainValidationError):
        Project(
            id="proj-invalid",
            title="",
            description="Valid description",
            tags=["Python"],
        )


def test_wishlist_item_creation_and_fulfillment_toggle():
    """Validates WishlistItem entity creation, mutation, and is_fulfilled toggle."""
    item = WishlistItem(
        id="wish-1",
        title="The Man in the High Castle",
        subtitle="Philip K. Dick",
        category="Livros",
        url="https://amazon.com.br/dp/test",
        tag="Ficção Científica",
        is_fulfilled=False,
    )

    assert item.id == "wish-1"
    assert item.title == "The Man in the High Castle"
    assert item.is_fulfilled is False

    # Toggle fulfillment
    item.toggle_fulfilled()
    assert item.is_fulfilled is True

    item.mark_as_unfulfilled()
    assert item.is_fulfilled is False

    item.mark_as_fulfilled()
    assert item.is_fulfilled is True


def test_consumed_media_creation_and_update():
    """Validates ConsumedMedia aggregate updates."""
    media = ConsumedMedia(
        id="media-singleton",
        reading_title="The Man in the High Castle",
        reading_author="Philip K. Dick",
        reading_category="Ficção Científica",
        reading_cover_url="https://example.com/cover.jpg",
        reading_reference_url="https://example.com/ref",
        reading_status="Lendo Atualmente",
        watching_title="Sci-Fi Series",
        watching_subtitle="Season 1",
        watching_cover_url="https://example.com/watch.jpg",
        watching_category="Séries",
    )

    assert media.reading_title == "The Man in the High Castle"
    assert media.watching_title == "Sci-Fi Series"

    media.update_reading(
        title="Babel",
        author="R.F. Kuang",
        category="Dark Academia",
        cover_url="https://example.com/babel.jpg",
        reference_url="https://example.com/babel",
        status="Lido",
    )

    assert media.reading_title == "Babel"
    assert media.reading_author == "R.F. Kuang"
    assert media.reading_status == "Lido"


def test_hobby_interest_creation_and_update():
    """Validates HobbyInterest entity creation and attribute modification."""
    hobby = HobbyInterest(
        id="hobby-1",
        name="Stardew Valley",
        category="Cozy Gaming",
        icon_slug="plant",
    )

    assert hobby.name == "Stardew Valley"
    assert hobby.icon_slug == "plant"

    hobby.update(name="Pokémon", category="Lore & Gaming", icon_slug="gamepad")
    assert hobby.name == "Pokémon"
    assert hobby.icon_slug == "gamepad"


def test_admin_user_creation():
    """Validates AdminUser entity initialization."""
    admin = AdminUser(
        id="admin-1",
        username="elyyihz",
        password_hash="mock_hash_value",
    )

    assert admin.username == "elyyihz"
    assert admin.password_hash == "mock_hash_value"
