"""Unit tests for GameStatus domain entity."""

from datetime import datetime, timezone
import pytest

from app.domain.entities.game_status import GameStatus
from app.domain.exceptions.domain_exceptions import DomainValidationError


def test_game_status_creation_and_properties():
    """Validates GameStatus entity properties and calculated attributes."""
    game = GameStatus(
        game_id="413150",
        title="Stardew Valley",
        is_playing=True,
        platform="Steam / Linux",
        status_message="Farming right now...",
        banner_url="https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
        playtime_2weeks_minutes=320,
        total_playtime_minutes=8550,
    )

    assert game.game_id == "413150"
    assert game.title == "Stardew Valley"
    assert game.is_playing is True
    assert game.platform == "Steam / Linux"
    assert game.total_hours == 142.5
    assert game.hours_last_2weeks == 5.3


def test_game_status_validation():
    """Validates invariant validation on game title."""
    with pytest.raises(DomainValidationError, match="Game title cannot be empty"):
        GameStatus(
            game_id="123",
            title="   ",
            is_playing=False,
        )
