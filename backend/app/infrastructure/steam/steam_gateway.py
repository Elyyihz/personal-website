"""Steam Web API infrastructure gateway adapter.

Integrates with Steam API endpoints to extract real-time player telemetry and recently played games.
"""

import logging
from typing import List, Optional
import httpx

from app.domain.entities.game_status import GameStatus
from app.domain.repositories.interfaces import SteamGatewayInterface

logger = logging.getLogger("steam_gateway")


class SteamWebAPIGateway(SteamGatewayInterface):
    """Concrete Steam Web API client gateway.

    Attributes:
        api_key (str): Steam Web API authorization token.
    """

    def __init__(self, api_key: str) -> None:
        """Initializes Steam Web API client.

        Args:
            api_key (str): Valve Steam Web API credential.
        """
        self.api_key = (api_key or "").strip()

    async def get_active_game(self, steam_id: str) -> Optional[GameStatus]:
        """Queries Steam GetPlayerSummaries to inspect whether user is in-game.

        Args:
            steam_id (str): Steam 64-bit ID.

        Returns:
            Optional[GameStatus]: Live game status entity if currently running a game.
        """
        if not self.api_key or not steam_id or self.api_key.startswith("seu_"):
            logger.debug("Decision taken: Steam API key or steam_id missing/placeholder; skipping call")
            return None

        url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        params = {
            "key": self.api_key,
            "steamids": steam_id,
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code != 200:
                    logger.warning("Steam GetPlayerSummaries returned HTTP %d", res.status_code)
                    return None

                data = res.json()
                players = data.get("response", {}).get("players", [])
                if not players:
                    return None

                player = players[0]
                game_title = player.get("gameextrainfo")
                game_id = player.get("gameid")

                if game_title:
                    banner = f"https://cdn.akamai.steamstatic.com/steam/apps/{game_id}/header.jpg" if game_id else None
                    return GameStatus(
                        game_id=game_id,
                        title=game_title,
                        is_playing=True,
                        platform="Steam / Linux",
                        status_message="Playing on Steam",
                        banner_url=banner,
                    )
        except Exception as exc:
            logger.warning("Steam API GetPlayerSummaries request failed: %s", exc)
            raise ConnectionError(f"Steam Web API error: {exc}") from exc

        return None

    async def get_recently_played_games(self, steam_id: str) -> List[GameStatus]:
        """Queries Steam GetRecentlyPlayedGames for past 14-day history.

        Args:
            steam_id (str): Steam 64-bit ID.

        Returns:
            List[GameStatus]: Recent game entities.
        """
        if not self.api_key or not steam_id or self.api_key.startswith("seu_"):
            return []

        url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/"
        params = {
            "key": self.api_key,
            "steamid": steam_id,
            "format": "json",
        }

        games: List[GameStatus] = []
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    raw_games = data.get("response", {}).get("games", [])
                    for g in raw_games:
                        appid = str(g.get("appid", ""))
                        banner = f"https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg" if appid else None
                        games.append(
                            GameStatus(
                                game_id=appid,
                                title=g.get("name", "Unknown Game"),
                                is_playing=False,
                                platform="Steam / Linux",
                                status_message="Played recently",
                                banner_url=banner,
                                playtime_2weeks_minutes=g.get("playtime_2weeks", 0),
                                total_playtime_minutes=g.get("playtime_forever", 0),
                            )
                        )
        except Exception as exc:
            logger.warning("Steam GetRecentlyPlayedGames failed: %s", exc)

        return games
