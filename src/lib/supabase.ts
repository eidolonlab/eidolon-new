import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl,
  urlLength: supabaseUrl?.length,
  keyLength: supabaseAnonKey?.length
});

// Check if Supabase is properly configured
const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-project-url' &&
  supabaseAnonKey !== 'your-anon-key' &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

let supabase: any;
export { supabase, isSupabaseConfigured };

if (!isSupabaseConfigured) {
  console.warn('Supabase not configured - running in local-only mode', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  // Create a dummy client that doesn't make network requests
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } }
      })
    },
    from: () => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
        order: () => ({ 
          single: () => Promise.resolve({ data: null, error: null }),
          eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null })
    }),
    rpc: () => Promise.resolve({ data: null, error: null })
  };
} else {
  console.log('Supabase configured successfully');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Types for our database
export interface DatabaseUser {
  id: string;
  email?: string;
  created_at: string;
  last_active: string;
  consent_analytics: boolean;
  consent_research: boolean;
  is_anonymous: boolean;
  user_hash: string;
}

export interface DatabaseMemoryWeave {
  id: string;
  user_hash: string;
  weave_type: 'past' | 'future';
  coherence_score: number;
  sensory_richness_score: number;
  narrative_length: number;
  tags: string[];
  difficulty_level: 'easy' | 'medium' | 'hard';
  errorless_mode: boolean;
  created_at: string;
  completed: boolean;
  scheduled_for?: string;
  retrieval_count: number;
  last_retrieved?: string;
}

export interface DatabaseRetrievalSession {
  id: string;
  user_hash: string;
  weave_id: string;
  start_time: string;
  end_time?: string;
  latency_ms: number;
  details_recalled: number;
  accuracy_score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  errorless_mode: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_weaves: number;
  total_sessions: number;
  avg_coherence_score: number;
  avg_recall_latency: number;
  active_users_7d: number;
  completion_rate: number;
}

export interface CohortData {
  cohort_week: string;
  users_count: number;
  avg_coherence: number;
  avg_sessions: number;
  retention_rate: number;
}

// Admin functions
export const adminAPI = {
  async getStats(): Promise<AdminStats> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data;
  },

  async getCohortAnalysis(daysBack = 30): Promise<CohortData[]> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase.rpc('get_cohort_analysis', { days_back: daysBack });
    if (error) throw error;
    return data;
  },

  async getRecentWeaves(limit = 50): Promise<DatabaseMemoryWeave[]> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase
      .from('memory_weaves')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getRecentSessions(limit = 100): Promise<DatabaseRetrievalSession[]> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase
      .from('retrieval_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// User data sync functions
export const userAPI = {
  async createOrUpdateUser(userData: {
    email?: string;
    consent_analytics: boolean;
    consent_research: boolean;
    is_anonymous: boolean;
  }): Promise<DatabaseUser> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured - running in local-only mode');
    }
    
    // Generate a privacy-preserving hash for the user
    const userHash = await generateUserHash();
    
    // First try to insert a new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        user_hash: userHash,
        last_active: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async syncMemoryWeave(weave: any, userHash: string): Promise<void> {
    if (!userHash || !isSupabaseConfigured) return; // Skip if user hasn't consented or Supabase not configured
    
    const weaveData: Partial<DatabaseMemoryWeave> = {
      user_hash: userHash,
      weave_type: weave.type,
      coherence_score: weave.coherenceScore,
      sensory_richness_score: calculateSensoryRichness(weave.sensoryDetails),
      narrative_length: weave.narrative?.length || 0,
      tags: weave.tags || [],
      difficulty_level: weave.difficultyLevel || 'medium',
      errorless_mode: weave.errorlessMode || false,
      completed: weave.completed || false,
      scheduled_for: weave.scheduledFor?.toISOString(),
      retrieval_count: weave.retrievalCount || 0,
      last_retrieved: weave.lastRetrieved?.toISOString()
    };

    const { error } = await supabase
      .from('memory_weaves')
      .upsert(weaveData);
    
    if (error) throw error;
  },

  async syncRetrievalSession(session: any, userHash: string): Promise<void> {
    if (!userHash || !isSupabaseConfigured) return; // Skip if user hasn't consented or Supabase not configured
    
    const sessionData: Partial<DatabaseRetrievalSession> = {
      user_hash: userHash,
      weave_id: session.weaveId,
      start_time: session.startTime.toISOString(),
      end_time: session.endTime?.toISOString(),
      latency_ms: session.latencyMs,
      details_recalled: session.detailsRecalled,
      accuracy_score: session.accuracy,
      difficulty: session.difficulty,
      errorless_mode: session.errorlessMode || false
    };

    const { error } = await supabase
      .from('retrieval_sessions')
      .insert(sessionData);
    
    if (error) throw error;
  },

  async trackAnalyticsEvent(eventType: string, eventData: any, userHash: string): Promise<void> {
    if (!userHash || !isSupabaseConfigured) return; // Skip if user hasn't consented or Supabase not configured
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_hash: userHash,
        event_type: eventType,
        event_data: eventData,
        session_id: getSessionId()
      });
    
    if (error) console.warn('Analytics tracking failed:', error);
  }
};

// Utility functions
async function generateUserHash(): Promise<string> {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const data = new TextEncoder().encode(timestamp + random);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

function calculateSensoryRichness(sensoryDetails: any): number {
  if (!sensoryDetails) return 0;
  
  const senses = ['visual', 'auditory', 'olfactory', 'tactile', 'emotional'];
  const filledSenses = senses.filter(sense => 
    sensoryDetails[sense] && sensoryDetails[sense].length > 10
  );
  
  return Math.round((filledSenses.length / senses.length) * 100);
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('eidolon-session-id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessionStorage.setItem('eidolon-session-id', sessionId);
  }
  return sessionId;
}