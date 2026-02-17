
import { DayLogEntry, LogType } from '../types';
import { supabase } from './supabase';

export const saveLog = async (blob: Blob, type: LogType, dateStr: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const fileName = `${user.id}/${Date.now()}.mp4`;
  
  // 1. Upload to Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('videos')
    .upload(fileName, blob);

  if (uploadError) throw uploadError;

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);

  // 3. Save metadata to DB
  const { error: dbError } = await supabase
    .from('logs')
    .insert({
      user_id: user.id,
      type,
      date_str: dateStr,
      video_url: publicUrl,
      timestamp: Date.now()
    });

  if (dbError) throw dbError;
};

export const getAllLogs = async (): Promise<DayLogEntry[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(row => ({
    id: row.id,
    user_id: row.user_id,
    timestamp: row.timestamp,
    dateStr: row.date_str,
    type: row.type as LogType,
    video_url: row.video_url
  }));
};

export const deleteLog = async (id: string, videoUrl: string): Promise<void> => {
  // Delete DB record
  const { error: dbError } = await supabase
    .from('logs')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;

  // Attempt to delete from storage (optional, based on your bucket setup)
  // Logic to parse filename from URL would be needed here for full cleanup
};
