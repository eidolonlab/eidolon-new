import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CognitiveState {
  attention: number; // 0-100
  energy: number; // 0-100
  stress: number; // 0-100
  mood: number; // 0-100
  cognitiveLoad: 'light' | 'medium' | 'high';
  optimalActivity: 'capture' | 'weave' | 'train' | 'plan' | 'rest';
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
    optimalActivity: 'capture',
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

  // Auto-update time of day
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
    
    // High stress = need regulation first
    if (stress > 70) return 'regulate';
    
    // Low energy = light activities
    if (energy < 40) return 'capture';
    
    // High attention + energy = complex work
    if (attention > 70 && energy > 70) {
      if (timeOfDay === userPattern.bestTimeForMemory) return 'weave';
      return 'train';
    }
    
    // Medium state = scenario planning
    if (attention > 50) return 'plan';
    
    // Default = capture moments
    return 'capture';
  };

  const getAdaptiveMessage = (): string => {
    const { attention, energy, stress, timeOfDay } = cognitiveState;
    const activity = getOptimalActivity();
    
    const messages = {
      morning: {
        high: "Good morning! Your mind is sharp - perfect for creating rich memories.",
        medium: "Morning energy building - great time to capture yesterday's moments.",
        low: "Gentle morning start - how about a quick memory from last night?"
      },
      afternoon: {
        high: "Afternoon focus peak! Ideal for memory training or scenario planning.",
        medium: "Steady afternoon energy - good for reviewing and strengthening memories.",
        low: "Afternoon lull - perfect for gentle memory capture or breathing exercises."
      },
      evening: {
        high: "Evening clarity! Great time to plan tomorrow or reflect on today.",
        medium: "Winding down - capture today's meaningful moments while they're fresh.",
        low: "Peaceful evening - gentle memory work or gratitude practice?"
      },
      night: {
        high: "Late night energy! Quick memory capture before rest.",
        medium: "Quiet night reflection - what stood out from today?",
        low: "Rest time approaching - gentle breathing or tomorrow's intention?"
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