
export type LogType = 'morning' | 'night';

export interface DayLogEntry {
  id: string;
  user_id: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  type: LogType;
  video_url: string;
  created_at?: string;
}

export type AppTab = 'dashboard' | 'record' | 'library';

export interface DailyStatus {
  hasMorning: boolean;
  hasNight: boolean;
}

export interface Statistics {
  streak: number;
  totalVideosThisMonth: number;
}
