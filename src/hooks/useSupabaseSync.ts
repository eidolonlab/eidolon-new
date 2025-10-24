import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSupabaseSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('Supabase sync initialized for user:', user.id);
    }
  }, [user]);

  const updateConsent = useCallback(async (analytics: boolean, research: boolean) => {
    if (user) {
      try {
        const { supabase } = await import('../lib/supabase');
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: 'consent_update',
            metadata: { analytics, research }
          });
      } catch (error) {
        console.warn('Failed to sync consent:', error);
      }
    }
  }, [user]);

  return {
    syncStatus: 'synced' as const,
    lastSyncTime: new Date(),
    updateConsent
  };
}
