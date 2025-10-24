import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zunlfjxeuwgwtzydnwkr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bmxmanhldXdnd3R6eWRud2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzE5MDEsImV4cCI6MjA3MzY0NzkwMX0.YaZz6RiqxFiDbcCyt5z5lCFmpuatCA5irtOEcL03BdM';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
