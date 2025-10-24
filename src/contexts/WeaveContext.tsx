import React, { createContext, useContext, useState, useEffect } from 'react';

interface Weave {
  id: string;
  type: 'past' | 'future';
  title: string;
  seed: string;
  narrative?: string;
  createdAt: Date;
  scheduledFor?: Date;
  location?: string;
  ifThenPlans?: string[];
  visualMemory?: string;
  visualType?: 'photo' | 'video';
  profileName?: string;
}

interface WeaveContextType {
  weaves: Weave[];
  addWeave: (weave: Omit<Weave, 'id' | 'createdAt'>) => void;
  updateWeave: (id: string, updates: Partial<Weave>) => void;
  deleteWeave: (id: string) => void;
}

const WeaveContext = createContext<WeaveContextType | undefined>(undefined);

export function WeaveProvider({ children }: { children: React.ReactNode }) {
  const [weaves, setWeaves] = useState<Weave[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('eidolon-weaves');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt),
          scheduledFor: w.scheduledFor ? new Date(w.scheduledFor) : undefined,
        }));
        setWeaves(withDates);
      } catch (error) {
        console.warn('Failed to load weaves:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eidolon-weaves', JSON.stringify(weaves));
  }, [weaves]);

  const addWeave = (weave: Omit<Weave, 'id' | 'createdAt'>) => {
    const newWeave: Weave = {
      ...weave,
      id: `weave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    setWeaves(prev => [newWeave, ...prev]);
  };

  const updateWeave = (id: string, updates: Partial<Weave>) => {
    setWeaves(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWeave = (id: string) => {
    setWeaves(prev => prev.filter(w => w.id !== id));
  };

  return (
    <WeaveContext.Provider value={{ weaves, addWeave, updateWeave, deleteWeave }}>
      {children}
    </WeaveContext.Provider>
  );
}

export function useWeave() {
  const context = useContext(WeaveContext);
  if (context === undefined) {
    throw new Error('useWeave must be used within a WeaveProvider');
  }
  return context;
}
