"""FastAPI router managing Spotify OAuth 2.0 authentication and currently-playing playback state."""

import base64
import urllib.parse
from typing import List, Optional
import httpx
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel
from app.infrastructure.database.config import settings

router = APIRouter(prefix="/spotify", tags=["Spotify API"])

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_CURRENTLY_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing"
SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1"

# In-memory token cache for background renewal optimization
_cached_access_token: Optional[str] = None


class SpotifyArtistDTO(BaseModel):
    name: str


class SpotifyImageDTO(BaseModel):
    url: str
    height: Optional[int] = None
    width: Optional[int] = None


class SpotifyTrackDTO(BaseModel):
    title: str
    artist: str
    album: str
    album_image_url: str
    song_url: str
    is_playing: bool
    progress_ms: int
    duration_ms: int
    played_at: Optional[str] = None
    source: str = "currently-playing"


class SpotifyPlaybackResponseDTO(BaseModel):
    is_active: bool
    is_fallback_mock: bool
    track: Optional[SpotifyTrackDTO] = None
    message: str = "Playback state resolved"


FALLBACK_MOCK = SpotifyTrackDTO(
    title="Let Me Down Slowly",
    artist="Alec Benjamin",
    album="Narrated For You",
    album_image_url="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    song_url="https://open.spotify.com/track/2qxmye6gAegTMjLKEBoR1d",
    is_playing=False,
    progress_ms=0,
    duration_ms=169000,
    source="mock",
)


async def get_refreshed_access_token() -> Optional[str]:
    """Exchanges configured refresh token for fresh access token via OAuth 2.0 flow.

    Returns:
        Optional[str]: Fresh Bearer access token string or None if credentials missing.
    """
    global _cached_access_token

    client_id = settings.spotify_client_id
    client_secret = settings.spotify_client_secret
    refresh_token = settings.spotify_refresh_token

    if not client_id or not client_secret or not refresh_token:
        return None

    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            SPOTIFY_TOKEN_URL,
            headers={
                "Authorization": f"Basic {auth_header}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
            },
        )

        if response.status_code == 200:
            payload = response.json()
            _cached_access_token = payload.get("access_token")
            return _cached_access_token

    return None


@router.get("/login")
def get_spotify_login_url() -> dict:
    """Generates the Spotify OAuth 2.0 authorization URL demanding user-read-currently-playing."""
    client_id = settings.spotify_client_id
    redirect_uri = settings.spotify_redirect_uri
    scope = "user-read-currently-playing user-read-recently-played"

    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SPOTIFY_CLIENT_ID is not configured in backend environment.",
        )

    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": scope,
    }
    url = f"{SPOTIFY_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return {"authorize_url": url}


@router.get("/callback")
async def spotify_oauth_callback(
    code: str = Query(..., description="Authorization code from Spotify accounts redirect"),
) -> dict:
    """Exchanges received authorization code for access and refresh tokens."""
    client_id = settings.spotify_client_id
    client_secret = settings.spotify_client_secret
    redirect_uri = settings.spotify_redirect_uri

    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            SPOTIFY_TOKEN_URL,
            headers={
                "Authorization": f"Basic {auth_header}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
            },
        )

        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Token exchange failed: {resp.text}",
            )

        tokens = resp.json()
        return {
            "message": "Authorization code exchanged successfully.",
            "refresh_token": tokens.get("refresh_token"),
            "access_token": tokens.get("access_token"),
            "expires_in": tokens.get("expires_in"),
        }


@router.get("/currently-playing", response_model=SpotifyPlaybackResponseDTO)
async def get_currently_playing() -> SpotifyPlaybackResponseDTO:
    """Queries Spotify Web API for currently-playing track with HTTP 204 fallback.

    Requires user-read-currently-playing scope. Automatically requests fresh token
    using SPOTIFY_REFRESH_TOKEN in the background.
    """
    access_token = await get_refreshed_access_token()

    # Guard clause: No live credentials provided, serve graceful fallback mock
    if not access_token:
        return SpotifyPlaybackResponseDTO(
            is_active=False,
            is_fallback_mock=True,
            track=FALLBACK_MOCK,
            message="Spotify credentials not configured on backend. Serving curated demonstration fallback.",
        )

    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient(timeout=8.0) as client:
        # Step 1: Query Currently Playing endpoint
        current_resp = await client.get(SPOTIFY_CURRENTLY_PLAYING_URL, headers=headers)

        # HTTP 200 with track payload
        if current_resp.status_code == 200:
            data = current_resp.json()
            item = data.get("item")
            if item:
                images = item.get("album", {}).get("images", [])
                cover_url = images[0]["url"] if images else FALLBACK_MOCK.album_image_url
                artists = ", ".join([a["name"] for a in item.get("artists", [])])

                track = SpotifyTrackDTO(
                    title=item.get("name", "Unknown Title"),
                    artist=artists or "Unknown Artist",
                    album=item.get("album", {}).get("name", "Single"),
                    album_image_url=cover_url,
                    song_url=item.get("external_urls", {}).get("spotify", "https://open.spotify.com"),
                    is_playing=data.get("is_playing", False),
                    progress_ms=data.get("progress_ms", 0),
                    duration_ms=item.get("duration_ms", 0),
                    source="currently-playing",
                )
                return SpotifyPlaybackResponseDTO(
                    is_active=True,
                    is_fallback_mock=False,
                    track=track,
                    message="Currently playing track loaded successfully.",
                )

        # Step 2: Handle HTTP 204 (No Content / Spotify paused or closed) -> Check Recently Played
        recent_resp = await client.get(SPOTIFY_RECENTLY_PLAYED_URL, headers=headers)
        if recent_resp.status_code == 200:
            recent_data = recent_resp.json()
            items = recent_data.get("items", [])
            if items:
                first = items[0]
                item = first.get("track", {})
                images = item.get("album", {}).get("images", [])
                cover_url = images[0]["url"] if images else FALLBACK_MOCK.album_image_url
                artists = ", ".join([a["name"] for a in item.get("artists", [])])

                track = SpotifyTrackDTO(
                    title=item.get("name", "Unknown Title"),
                    artist=artists or "Unknown Artist",
                    album=item.get("album", {}).get("name", "Single"),
                    album_image_url=cover_url,
                    song_url=item.get("external_urls", {}).get("spotify", "https://open.spotify.com"),
                    is_playing=False,
                    progress_ms=0,
                    duration_ms=item.get("duration_ms", 0),
                    played_at=first.get("played_at"),
                    source="recently-played",
                )
                return SpotifyPlaybackResponseDTO(
                    is_active=False,
                    is_fallback_mock=False,
                    track=track,
                    message="Spotify playback idle (HTTP 204). Showing recently played track.",
                )

    # Fallback state if both endpoints yield empty
    return SpotifyPlaybackResponseDTO(
        is_active=False,
        is_fallback_mock=True,
        track=FALLBACK_MOCK,
        message="Spotify player inactive or offline. Displaying fallback track.",
    )
