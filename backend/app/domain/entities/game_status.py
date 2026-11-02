"""Game status entity module.

Represents live gaming rich presence from Steam Web API or Discord RPC.
"""

from datetime import datetime, timezone
from typing import Optional
from app.domain.exceptions.domain_exceptions import DomainValidationError


class GameStatus:
    """Domain entity representing real-time game telemetry and rich presence.

    Attributes:
        game_id (Optional[str]): Platform game ID (e.g. Steam appid).
        title (str): Game title.
        is_playing (bool): Whether user is actively executing the game.
        platform (str): Operating platform (Steam / Linux, Discord RPC).
        status_message (str): Dynamic status (e.g. 'Farming right now...').
        banner_url (Optional[str]): Graphic banner or capsule artwork URL.
        playtime_2weeks_minutes (int): Minutes played over the last 14 days.
        total_playtime_minutes (int): Total lifetime play time in minutes.
        last_played_at (Optional[datetime]): Timestamp of the last logged session.
    """

    def __init__(
        self,
        title: str,
        game_id: Optional[str] = None,
        is_playing: bool = False,
        platform: str = "Steam / Linux",
        status_message: str = "Playing",
        banner_url: Optional[str] = None,
        playtime_2weeks_minutes: int = 0,
        total_playtime_minutes: int = 0,
        last_played_at: Optional[datetime] = None,
    ) -> None:
        """Initializes and validates a GameStatus entity.

        Args:
            title (str): Game name.
            game_id (Optional[str]): Platform game identifier.
            is_playing (bool): Active execution flag.
            platform (str): Game platform or RPC source.
            status_message (str): Descriptive status text.
            banner_url (Optional[str]): Artwork URL.
            playtime_2weeks_minutes (int): Recent playtime in minutes.
            total_playtime_minutes (int): Total playtime in minutes.
            last_played_at (Optional[datetime]): Timestamp of play.

        Raises:
            DomainValidationError: If title is empty.
        """
        if not title or not title.strip():
            raise DomainValidationError("Game title cannot be empty")

        self.title = title.strip()
        self.game_id = str(game_id).strip() if game_id else None
        self.is_playing = bool(is_playing)
        self.platform = platform.strip() if platform else "Steam / Linux"
        self.status_message = status_message.strip() if status_message else "Playing"
        self.banner_url = banner_url.strip() if banner_url else None
        self.playtime_2weeks_minutes = max(0, playtime_2weeks_minutes)
        self.total_playtime_minutes = max(0, total_playtime_minutes)
        self.last_played_at = last_played_at or datetime.now(timezone.utc)

    @property
    def total_hours(self) -> float:
        """Calculates total hours played rounded to 1 decimal place."""
        return round(self.total_playtime_minutes / 60.0, 1)

    @property
    def hours_last_2weeks(self) -> float:
        """Calculates recent 2-week hours played rounded to 1 decimal place."""
        return round(self.playtime_2weeks_minutes / 60.0, 1)
