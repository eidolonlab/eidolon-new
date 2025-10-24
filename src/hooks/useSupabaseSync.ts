import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSupabaseSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Placeholder for Supabase sync logic
      console.log('Supabase sync initialized for user:', user.id);
    }
  }, [user]);

  return {
    syncStatus: 'synced' as const,
    lastSyncTime: new Date()
  };
}
