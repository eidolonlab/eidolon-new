import { useEffect, useState } from 'react';
import { supabase, userAPI } from '../lib/supabase';
import { Weave, RetrievalSession } from '../contexts/WeaveContext';

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
    try {
      // Check if user has given consent
      const consent = localStorage.getItem('eidolon-consent');
      const consentData = consent ? JSON.parse(consent) : null;
      
      if (consentData?.analytics || consentData?.research) {
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
      }
    } catch (error) {
      console.warn('Failed to initialize user:', error);
      setSyncStatus(prev => ({ ...prev, isConnected: false }));
    }
  };

  const syncDataToSupabase = async () => {
    if (!syncStatus.userHash) return;

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