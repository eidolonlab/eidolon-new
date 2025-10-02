import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import { createSampleWeaves, createSampleRetrievalSessions } from '../utils/sampleData';

export interface Weave {
  id: string;
  type: 'past' | 'future';
  seed: string;
  title: string;
  narrative: string;
  sensoryDetails: {
    visual: string;
    auditory: string;
    olfactory: string;
    tactile: string;
    emotional: string;
  };
  createdAt: Date;
  lastRetrieved?: Date;
  retrievalCount: number;
  coherenceScore: number;
  tags: string[];
  ifThenPlans?: string[];
  scheduledFor?: Date;
  completed?: boolean;
  cues?: {
    photos?: string[];
    visualType?: 'photo' | 'video';
    music?: string;
    colors?: string[];
    location?: {
      name: string;
      lat?: number;
      lng?: number;
    };
    scents?: string[];
  };
  bridgeData?: {
    factualAnchors: string[];
    dateVerified?: boolean;
    locationVerified?: boolean;
    peopleInvolved?: string[];
  };
  errorlessMode?: boolean;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  profileName?: string;
}

export interface RetrievalSession {
  id: string;
  weaveId: string;
  startTime: Date;
  endTime?: Date;
  latencyMs: number;
  detailsRecalled: number;
  accuracy: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WeaveContextType {
  weaves: Weave[];
  retrievalSessions: RetrievalSession[];
  addWeave: (weave: Omit<Weave, 'id' | 'createdAt' | 'retrievalCount' | 'coherenceScore'>) => void;
  updateWeave: (id: string, updates: Partial<Weave>) => void;
  deleteWeave: (id: string) => void;
  addRetrievalSession: (session: Omit<RetrievalSession, 'id'>) => void;
  getWeaveById: (id: string) => Weave | undefined;
  getMetrics: () => {
    totalWeaves: number;
    avgCoherenceScore: number;
    avgRecallLatency: number;
    completionRate: number;
    weeklyProgress: number[];
  };
}

const WeaveContext = createContext<WeaveContextType | undefined>(undefined);

export const useWeave = () => {
  const context = useContext(WeaveContext);
  if (!context) {
    throw new Error('useWeave must be used within a WeaveProvider');
  }
  return context;
};

export const WeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weaves, setWeaves] = useState<Weave[]>([]);
  const [retrievalSessions, setRetrievalSessions] = useState<RetrievalSession[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWeaves = localStorage.getItem('eidolon-weaves');
    const savedSessions = localStorage.getItem('eidolon-sessions');
    
    if (savedWeaves) {
      const parsedWeaves = JSON.parse(savedWeaves).map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        lastRetrieved: w.lastRetrieved ? new Date(w.lastRetrieved) : undefined,
        scheduledFor: w.scheduledFor ? new Date(w.scheduledFor) : undefined,
      }));
      setWeaves(parsedWeaves);
    } else {
      // Load sample data if no saved data exists
      const sampleWeaves = createSampleWeaves();
      setWeaves(sampleWeaves);
      localStorage.setItem('eidolon-weaves', JSON.stringify(sampleWeaves));
    }
    
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      }));
      setRetrievalSessions(parsedSessions);
    } else {
      // Load sample sessions if no saved data exists
      const sampleSessions = createSampleRetrievalSessions();
      setRetrievalSessions(sampleSessions);
      localStorage.setItem('eidolon-sessions', JSON.stringify(sampleSessions));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('eidolon-weaves', JSON.stringify(weaves));
  }, [weaves]);

  useEffect(() => {
    localStorage.setItem('eidolon-sessions', JSON.stringify(retrievalSessions));
  }, [retrievalSessions]);

  // Initialize Supabase sync after data is loaded
  const { trackEvent } = useSupabaseSync(weaves, retrievalSessions);

  const calculateCoherenceScore = (narrative: string, sensoryDetails: Weave['sensoryDetails']): number => {
    // Simple coherence scoring based on narrative length, detail richness, and structure
    const narrativeScore = Math.min(narrative.length / 200, 1) * 40; // Up to 40 points for length
    const detailScore = Object.values(sensoryDetails).filter(d => d.length > 10).length * 10; // 10 points per detailed sense
    const structureScore = (narrative.match(/\./g) || []).length > 2 ? 20 : 10; // Basic structure check
    
    return Math.round(Math.min(narrativeScore + detailScore + structureScore, 100));
  };

  const addWeave = (weaveData: Omit<Weave, 'id' | 'createdAt' | 'retrievalCount' | 'coherenceScore'>) => {
    const newWeave: Weave = {
      ...weaveData,
      id: Date.now().toString(),
      createdAt: new Date(),
      retrievalCount: 0,
      coherenceScore: calculateCoherenceScore(weaveData.narrative, weaveData.sensoryDetails),
    };
    
    setWeaves(prev => [newWeave, ...prev]);
    
    console.log('Weave added:', newWeave);
    console.log('Total weaves now:', weaves.length + 1);
    
    // Track weave creation
    trackEvent('weave_created', {
      type: newWeave.type,
      coherence_score: newWeave.coherenceScore,
      difficulty_level: newWeave.difficultyLevel,
      errorless_mode: newWeave.errorlessMode
    });
  };

  const updateWeave = (id: string, updates: Partial<Weave>) => {
    setWeaves(prev => prev.map(weave => 
      weave.id === id 
        ? { 
            ...weave, 
            ...updates,
            coherenceScore: updates.narrative || updates.sensoryDetails 
              ? calculateCoherenceScore(
                  updates.narrative || weave.narrative, 
                  updates.sensoryDetails || weave.sensoryDetails
                )
              : weave.coherenceScore
          }
        : weave
    ));
  };

  const deleteWeave = (id: string) => {
    setWeaves(prev => prev.filter(weave => weave.id !== id));
    setRetrievalSessions(prev => prev.filter(session => session.weaveId !== id));
  };

  const addRetrievalSession = (sessionData: Omit<RetrievalSession, 'id'>) => {
    const newSession: RetrievalSession = {
      ...sessionData,
      id: Date.now().toString(),
    };
    
    setRetrievalSessions(prev => [newSession, ...prev]);
    
    // Update weave retrieval stats
    updateWeave(sessionData.weaveId, {
      lastRetrieved: sessionData.startTime,
      retrievalCount: (getWeaveById(sessionData.weaveId)?.retrievalCount || 0) + 1,
    });
    
    // Track retrieval session
    trackEvent('retrieval_session', {
      latency_ms: sessionData.latencyMs,
      accuracy: sessionData.accuracy,
      difficulty: sessionData.difficulty,
      details_recalled: sessionData.detailsRecalled
    });
  };

  const getWeaveById = (id: string) => {
    return weaves.find(weave => weave.id === id);
  };

  const getMetrics = () => {
    const totalWeaves = weaves.length;
    const avgCoherenceScore = totalWeaves > 0 
      ? weaves.reduce((sum, w) => sum + w.coherenceScore, 0) / totalWeaves 
      : 0;
    
    const avgRecallLatency = retrievalSessions.length > 0
      ? retrievalSessions.reduce((sum, s) => sum + s.latencyMs, 0) / retrievalSessions.length
      : 0;
    
    const futureWeaves = weaves.filter(w => w.type === 'future');
    const completedFutureWeaves = futureWeaves.filter(w => w.completed);
    const completionRate = futureWeaves.length > 0 
      ? (completedFutureWeaves.length / futureWeaves.length) * 100 
      : 0;
    
    // Weekly progress (last 7 days of retrieval sessions)
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      return retrievalSessions.filter(s => 
        s.startTime >= dayStart && s.startTime <= dayEnd
      ).length;
    });

    return {
      totalWeaves,
      avgCoherenceScore: Math.round(avgCoherenceScore),
      avgQualityScore: Math.round(avgCoherenceScore),
      avgRecallLatency: Math.round(avgRecallLatency),
      completionRate: Math.round(completionRate),
      weeklyProgress,
    };
  };

  return (
    <WeaveContext.Provider value={{
      weaves,
      retrievalSessions,
      addWeave,
      updateWeave,
      deleteWeave,
      addRetrievalSession,
      getWeaveById,
      getMetrics,
    }}>
      {children}
    </WeaveContext.Provider>
  );
};