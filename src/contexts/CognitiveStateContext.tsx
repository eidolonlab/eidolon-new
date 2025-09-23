import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CognitiveState {
  attention: number; // 0-100
  energy: number; // 0-100
  stress: number; // 0-100
  mood: number; // 0-100
  cognitiveLoad: 'light' | 'medium' | 'high';
  optimalActivity: 'retrieve' | 'capture' | 'plan' | 'train' | 'regulate';
  flowState: 'disrupted' | 'building' | 'focused' | 'peak';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  lastUpdated: Date;
}

export interface UserPattern {
  bestTimeForMemory: string;
  averageSessionLength: number;
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  strongestSenses: string[];
  improvementRate: number;
  consistencyScore: number;
}

interface CognitiveStateContextType {
  cognitiveState: CognitiveState;
  userPattern: UserPattern;
  updateCognitiveState: (updates: Partial<CognitiveState>) => void;
  getOptimalActivity: () => string;
  getAdaptiveMessage: () => string;
  getInterfaceMode: () => 'simple' | 'standard' | 'advanced';
}

const CognitiveStateContext = createContext<CognitiveStateContextType | undefined>(undefined);

export const useCognitiveState = () => {
  const context = useContext(CognitiveStateContext);
  if (!context) {
    throw new Error('useCognitiveState must be used within a CognitiveStateProvider');
  }
  return context;
};

export const CognitiveStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    attention: 75,
    energy: 70,
    stress: 30,
    mood: 75,
    cognitiveLoad: 'medium',
    optimalActivity: 'retrieve',
    flowState: 'building',
    timeOfDay: getTimeOfDay(),
    lastUpdated: new Date()
  });

  const [userPattern, setUserPattern] = useState<UserPattern>({
    bestTimeForMemory: 'morning',
    averageSessionLength: 300,
    preferredDifficulty: 'medium',
    strongestSenses: ['visual', 'emotional'],
    improvementRate: 0,
    consistencyScore: 0
  });

  function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  // Auto-update time of day every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCognitiveState(prev => ({
        ...prev,
        timeOfDay: getTimeOfDay(),
        lastUpdated: new Date()
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Analyze user patterns from localStorage data
  useEffect(() => {
    analyzeUserPatterns();
  }, []);

  const analyzeUserPatterns = () => {
    const savedWeaves = localStorage.getItem('eidolon-weaves');
    const savedSessions = localStorage.getItem('eidolon-sessions');
    
    if (!savedWeaves || !savedSessions) return;

    const weaves = JSON.parse(savedWeaves);
    const sessions = JSON.parse(savedSessions);

    // Analyze best time for memory work
    const timePerformance = {
      morning: { count: 0, avgScore: 0 },
      afternoon: { count: 0, avgScore: 0 },
      evening: { count: 0, avgScore: 0 }
    };

    weaves.forEach((weave: any) => {
      const hour = new Date(weave.createdAt).getHours();
      const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      timePerformance[timeSlot].count++;
      timePerformance[timeSlot].avgScore += weave.coherenceScore || 0;
    });

    // Find best time
    let bestTime = 'morning';
    let bestScore = 0;
    Object.entries(timePerformance).forEach(([time, data]) => {
      if (data.count > 0) {
        const avgScore = data.avgScore / data.count;
        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestTime = time;
        }
      }
    });

    // Analyze strongest senses
    const senseStrength = { visual: 0, auditory: 0, olfactory: 0, tactile: 0, emotional: 0 };
    weaves.forEach((weave: any) => {
      if (weave.sensoryDetails) {
        Object.entries(weave.sensoryDetails).forEach(([sense, detail]: [string, any]) => {
          if (detail && detail.length > 20) {
            senseStrength[sense as keyof typeof senseStrength]++;
          }
        });
      }
    });

    const strongestSenses = Object.entries(senseStrength)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([sense]) => sense);

    setUserPattern({
      bestTimeForMemory: bestTime,
      averageSessionLength: sessions.length > 0 ? 
        sessions.reduce((sum: number, s: any) => sum + (s.latencyMs || 0), 0) / sessions.length / 1000 : 300,
      preferredDifficulty: 'medium', // Could be calculated from success rates
      strongestSenses,
      improvementRate: calculateImprovementRate(sessions),
      consistencyScore: calculateConsistencyScore(weaves)
    });
  };

  const calculateImprovementRate = (sessions: any[]) => {
    if (sessions.length < 5) return 0;
    const recent = sessions.slice(0, 5);
    const older = sessions.slice(-5);
    const recentAvg = recent.reduce((sum, s) => sum + (s.accuracy || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.accuracy || 0), 0) / older.length;
    return recentAvg - olderAvg;
  };

  const calculateConsistencyScore = (weaves: any[]) => {
    if (weaves.length < 7) return 0;
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });
    
    const activeDays = last7Days.filter(day => 
      weaves.some(w => new Date(w.createdAt).toDateString() === day)
    );
    
    return (activeDays.length / 7) * 100;
  };

  const updateCognitiveState = (updates: Partial<CognitiveState>) => {
    setCognitiveState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date()
    }));
  };

  const getOptimalActivity = (): string => {
    const { attention, energy, stress, timeOfDay } = cognitiveState;
    
    // Night flow - only gentle activities
    if (timeOfDay === 'night') return 'capture';
    
    // High stress = need regulation first
    if (stress > 70) return 'regulate';
    
    // Low energy = light activities
    if (energy < 40) return 'capture';
    
    // High attention + energy = complex work
    if (attention > 70 && energy > 70) {
      if (timeOfDay === userPattern.bestTimeForMemory) return 'retrieve';
      return 'train';
    }
    
    // Medium state = scenario planning
    if (attention > 50) return 'plan';
    
    // Default = guided retrieval
    return 'retrieve';
  };

  const getAdaptiveMessage = (): string => {
    const { attention, energy, stress, timeOfDay } = cognitiveState;
    
    const messages = {
      morning: {
        high: "Good morning! Peak cognitive state detected - ideal for guided memory retrieval and multi-sensory encoding.",
        medium: "Morning clarity building - perfect for autobiographical memory recovery with intelligent cues.",
        low: "Gentle morning start - stress regulation will optimize your memory systems."
      },
      afternoon: {
        high: "Afternoon focus peak! Optimal for spaced retrieval training and memory strengthening.",
        medium: "Steady afternoon state - excellent for guided memory recovery and scenario rehearsal.",
        low: "Natural afternoon dip - gentle memory capture and reflection work well now."
      },
      evening: {
        high: "Evening clarity! Perfect for reflection and capturing today's meaningful moments.",
        medium: "Reflection time - capture today's highlights and prepare for tomorrow's scenarios.",
        low: "Peaceful evening - gentle memory work supports overnight consolidation."
      },
      night: {
        high: "Late night clarity! Quick memory capture before sleep consolidation.",
        medium: "Pre-sleep reflection - capture today's highlights for overnight processing.",
        low: "Rest preparation - gentle regulation supports memory consolidation during sleep."
      }
    };

    const energyLevel = energy > 70 ? 'high' : energy > 40 ? 'medium' : 'low';
    return messages[timeOfDay][energyLevel];
  };

  const getInterfaceMode = (): 'simple' | 'standard' | 'advanced' => {
    const { attention, stress, cognitiveLoad } = cognitiveState;
    
    if (stress > 60 || attention < 40) return 'simple';
    if (cognitiveLoad === 'high' && attention > 70) return 'advanced';
    return 'standard';
  };

  return (
    <CognitiveStateContext.Provider value={{
      cognitiveState,
      userPattern,
      updateCognitiveState,
      getOptimalActivity,
      getAdaptiveMessage,
      getInterfaceMode
    }}>
      {children}
    </CognitiveStateContext.Provider>
  );
};