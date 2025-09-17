import { useEffect, useState } from 'react';
import { supabase, userAPI } from '../lib/supabase';
import type { Weave, RetrievalSession } from '../contexts/WeaveContext';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && !url.includes('your-project-id') && !key.includes('your-anon-key');
};

interface SyncStatus {
  isConnected: boolean;
  userHash: string | null;
  consentGiven: boolean;
  lastSync: Date | null;
}

export const useSupabaseSync = (weaves: Weave[], retrievalSessions: RetrievalSession[]) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    userHash: null,
    consentGiven: false,
    lastSync: null
  });

  // Initialize user and check consent
  useEffect(() => {
    initializeUser();
  }, []);

  // Sync data when weaves or sessions change
  useEffect(() => {
    if (syncStatus.consentGiven && syncStatus.userHash) {
      syncDataToSupabase();
    }
  }, [weaves, retrievalSessions, syncStatus.consentGiven, syncStatus.userHash]);

  const initializeUser = async () => {
    // Don't attempt API calls if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setSyncStatus({
        isConnected: false,
        userHash: null,
        consentGiven: false,
        lastSync: null
      });
      return;
    }

    try {
      // Check if user has given consent
      const consent = localStorage.getItem('eidolon-consent');
      if (!consent) {
        // No consent given yet, don't make any API calls
        setSyncStatus({
          isConnected: false,
          userHash: null,
          consentGiven: false,
          lastSync: null
        });
        return;
      }

      const consentData = JSON.parse(consent);
      
      if (consentData.analytics || consentData.research) {
        // User has given consent, create/update user record
        const userData = await userAPI.createOrUpdateUser({
          consent_analytics: consentData.analytics || false,
          consent_research: consentData.research || false,
          is_anonymous: true // Always anonymous for privacy
        });

        setSyncStatus({
          isConnected: true,
          userHash: userData.user_hash,
          consentGiven: true,
          lastSync: null
        });

        // Store user hash for future use
        localStorage.setItem('eidolon-user-hash', userData.user_hash);
      } else {
        // User has not given consent for data sharing
        setSyncStatus({
          isConnected: false,
          userHash: null,
          consentGiven: false,
          lastSync: null
        });
      }
    } catch (error) {
      console.warn('Failed to initialize user (this is normal if no consent given):', error);
      setSyncStatus(prev => ({ ...prev, isConnected: false }));
    }
  };

  const syncDataToSupabase = async () => {
    if (!syncStatus.userHash || !syncStatus.consentGiven) {
      return; // Don't sync if no consent or user hash
    }

    // Don't attempt API calls if Supabase is not configured
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      // Sync all weaves
      for (const weave of weaves) {
        await userAPI.syncMemoryWeave(weave, syncStatus.userHash);
      }

      // Sync all retrieval sessions
      for (const session of retrievalSessions) {
        await userAPI.syncRetrievalSession(session, syncStatus.userHash);
      }

      // Track sync event
      await userAPI.trackAnalyticsEvent('data_sync', {
        weaves_count: weaves.length,
        sessions_count: retrievalSessions.length
      }, syncStatus.userHash);

      setSyncStatus(prev => ({ ...prev, lastSync: new Date() }));
    } catch (error) {
      console.warn('Data sync failed:', error);
    }
  };

  const updateConsent = async (analytics: boolean, research: boolean) => {
    try {
      // Update local consent
      const consentData = {
        necessary: true,
        analytics,
        research,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('eidolon-consent', JSON.stringify(consentData));

      if (analytics || research) {
        // User gave consent, initialize sync
        await initializeUser();
      } else {
        // User revoked consent, stop syncing
        setSyncStatus({
          isConnected: false,
          userHash: null,
          consentGiven: false,
          lastSync: null
        });
        localStorage.removeItem('eidolon-user-hash');
      }
    } catch (error) {
      console.error('Failed to update consent:', error);
    }
  };

  const trackEvent = async (eventType: string, eventData: any = {}) => {
    if (!isSupabaseConfigured()) {
      return; // Don't track if Supabase is not configured
    }
    
    if (syncStatus.consentGiven && syncStatus.userHash) {
      await userAPI.trackAnalyticsEvent(eventType, eventData, syncStatus.userHash);
    }
  };

  return {
    syncStatus,
    updateConsent,
    trackEvent,
    forceSync: syncDataToSupabase
  };
};