
import { createClient } from '@supabase/supabase-js';

// Usando as credenciais fornecidas
const SUPABASE_URL = 'https://ddlxasmnzoegpsfkxmvt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbHhhc21uem9lZ3BzZmt4bXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzQyNDYsImV4cCI6MjA4NjkxMDI0Nn0.huJKokP0bi6SqHhovdoB8EZNHeDuGJI91JF-PsntsWs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
