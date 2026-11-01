/**
 * TypeScript interface representing active or recent game telemetry
 * synchronized with Steam Web API or Discord Rich Presence.
 */
export interface GameTelemetryStatus {
  game_id?: string | null;
  title: string;
  is_playing: boolean;
  platform: string;
  status_message: string;
  banner_url?: string | null;
  playtime_2weeks_minutes?: number;
  total_playtime_minutes?: number;
  total_hours: number;
  hours_last_2weeks: number;
  last_played_at?: string;
}
