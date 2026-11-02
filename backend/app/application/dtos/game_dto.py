"""Data Transfer Objects for Steam Web API and Discord Rich Presence telemetry."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class GameStatusResponseDTO(BaseModel):
    """Payload schema for serialized active or recent gaming status."""

    game_id: Optional[str] = Field(default=None, description="Steam appid or platform ID")
    title: str = Field(..., description="Name of the game")
    is_playing: bool = Field(default=False, description="True if actively in-game right now")
    platform: str = Field(default="Steam / Linux", description="Platform or client")
    status_message: str = Field(default="Playing", description="Status note (e.g. Farming right now...)")
    banner_url: Optional[str] = Field(default=None, description="Game header or banner graphic URL")
    playtime_2weeks_minutes: int = Field(default=0, description="Minutes logged in the past 2 weeks")
    total_playtime_minutes: int = Field(default=0, description="Total lifetime minutes logged")
    total_hours: float = Field(default=0.0, description="Calculated total hours")
    hours_last_2weeks: float = Field(default=0.0, description="Calculated 2-week hours")
    last_played_at: datetime = Field(default_factory=datetime.utcnow, description="Last played timestamp")


class DiscordRPCWebhookDTO(BaseModel):
    """Payload schema for Discord Rich Presence webhook notifications."""

    title: str = Field(..., min_length=1, description="Active game title")
    state: Optional[str] = Field(default=None, description="Game state (e.g. Caring for Dinosaurs)")
    details: Optional[str] = Field(default=None, description="Activity details (e.g. In Valley)")
    platform: str = Field(default="Discord RPC / Linux", description="Client identifier")
    banner_url: Optional[str] = Field(default=None, description="Optional custom artwork URL")
    hours_played: Optional[float] = Field(default=None, description="Optional logged hours")
