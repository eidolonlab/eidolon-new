import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ykdudbsxfemnfhhuwmsn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZHVkYnN4ZmVtbmZoaHV3bXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MTAsImV4cCI6MjA3NjIwNTgxMH0.GkKPH6NOJjfq9Kq05fjzQHQK2-IYoOLB08NFbykXRLI';

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
