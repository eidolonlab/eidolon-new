import React, { useState, useEffect } from 'react';
import { Activity, Brain, Zap, Target, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';

interface NeurofeedbackTrainerProps {
  onComplete: (results: {
    profileName?: string;
    sessionDuration: number;
    averageCoherence: number;
    peakCoherence: number;
    improvementRate: number;
  }) => void;
}

const NeurofeedbackTrainer: React.FC<NeurofeedbackTrainerProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [coherenceLevel, setCoherenceLevel] = useState(50);
  const [targetCoherence, setTargetCoherence] = useState(70);
  const [sessionTime, setSessionTime] = useState(0);
  const [coherenceHistory, setCoherenceHistory] = useState<number[]>([]);
  const [breathingRate, setBreathingRate] = useState(6); // breaths per minute
  const [isInCoherence, setIsInCoherence] = useState(false);
  const [coherenceStreak, setCoherenceStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [useCustomProfile, setUseCustomProfile] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<Array<{
    name: string;
    sessions: number;
    avgCoherence: number;
    maxStreak: number;
    lastUsed: Date;
  }>>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved profiles
  useEffect(() => {
    const saved = localStorage.getItem('eidolon-coherence-profiles');
    if (saved) {
      const profiles = JSON.parse(saved).map((p: any) => ({
        ...p,
        lastUsed: new Date(p.lastUsed)
      }));
      setSavedProfiles(profiles);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        updateCoherence();
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, breathingRate]);

  const updateCoherence = () => {
    // Simulate heart rate variability coherence based on breathing
    const baseCoherence = 50;
    const breathingBonus = Math.sin(sessionTime * (breathingRate / 60) * 2 * Math.PI) * 20;
    const focusBonus = isInCoherence ? 15 : -5;
    const randomVariation = (Math.random() - 0.5) * 10;
    
    const newCoherence = Math.max(0, Math.min(100, 
      baseCoherence + breathingBonus + focusBonus + randomVariation
    ));
    
    setCoherenceLevel(newCoherence);
    setCoherenceHistory(prev => [...prev.slice(-59), newCoherence]); // Keep last 60 seconds
    
    // Update coherence state
    if (newCoherence >= targetCoherence) {
      setIsInCoherence(true);
      setCoherenceStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setIsInCoherence(false);
      setCoherenceStreak(0);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setSessionTime(0);
    setCoherenceHistory([]);
    setCoherenceStreak(0);
    setMaxStreak(0);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const endSession = () => {
    setIsActive(false);
    
    if (coherenceHistory.length > 0) {
      const averageCoherence = coherenceHistory.reduce((sum, val) => sum + val, 0) / coherenceHistory.length;
      const peakCoherence = Math.max(...coherenceHistory);
      const improvementRate = coherenceHistory.length > 30 ? 
        (coherenceHistory.slice(-15).reduce((sum, val) => sum + val, 0) / 15) - 
        (coherenceHistory.slice(0, 15).reduce((sum, val) => sum + val, 0) / 15) : 0;
      
      // Update profile data if using custom profile
      if (useCustomProfile && profileName.trim()) {
        updateProfileData(averageCoherence);
      }
      
      onComplete({
        profileName: useCustomProfile ? profileName : undefined,
        sessionDuration: sessionTime,
        averageCoherence,
        peakCoherence,
        improvementRate
      });
    }
  };

  const updateProfileData = (averageCoherence: number) => {
    const profiles = [...savedProfiles];
    const existingIndex = profiles.findIndex(p => p.name === profileName.trim());
    
    if (existingIndex >= 0) {
      const existing = profiles[existingIndex];
      profiles[existingIndex] = {
        ...existing,
        sessions: existing.sessions + 1,
        avgCoherence: (existing.avgCoherence * existing.sessions + averageCoherence) / (existing.sessions + 1),
        maxStreak: Math.max(existing.maxStreak, maxStreak),
        lastUsed: new Date()
      };
    } else {
      profiles.push({
        name: profileName.trim(),
        sessions: 1,
        avgCoherence: averageCoherence,
        maxStreak: maxStreak,
        lastUsed: new Date()
      });
    }
    
    setSavedProfiles(profiles);
    localStorage.setItem('eidolon-coherence-profiles', JSON.stringify(profiles));
  };

  const getCoherenceColor = () => {
    if (coherenceLevel >= 80) return 'emerald';
    if (coherenceLevel >= 60) return 'blue';
    if (coherenceLevel >= 40) return 'yellow';
    return 'red';
  };

  const getBreathingGuidance = () => {
    const phase = Math.floor((sessionTime * breathingRate / 60) % 1 * 4);
    switch (phase) {
      case 0: return { text: 'Breathe In...', color: 'blue', scale: 1.1 };
      case 1: return { text: 'Hold...', color: 'purple', scale: 1.2 };
      case 2: return { text: 'Breathe Out...', color: 'emerald', scale: 1.0 };
      case 3: return { text: 'Hold...', color: 'indigo', scale: 0.9 };
      default: return { text: 'Breathe...', color: 'blue', scale: 1.0 };
    }
  };

  const breathingGuidance = getBreathingGuidance();
  const coherenceColor = getCoherenceColor();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-h-[85vh] overflow-y-auto pb-safe">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Coherence Training</h2>
          <p className="text-sm text-gray-600">Heart rate variability for attention regulation</p>
        </div>
      </div>

      {!isActive && sessionTime === 0 ? (
        // Setup
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">Coherence Training</span>
            </div>
            <p className="text-sm text-emerald-800">
              This training synchronizes your heart rate, breathing, and brain waves to create 
              a coherent state that improves focus, reduces stress, and enhances cognitive performance.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breathing Rate (breaths per minute)
            </label>
            <div className="flex space-x-2">
              {[4, 5, 6, 7, 8].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setBreathingRate(rate)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    breathingRate === rate
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Most people find 5-6 breaths per minute optimal for coherence
            </p>
          </div>

          {/* Training Profile Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useCoherenceProfile"
                checked={useCustomProfile}
                onChange={(e) => setUseCustomProfile(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="useCoherenceProfile" className="text-sm text-gray-700">
                Create named coherence profile (track different training conditions)
              </label>
            </div>
            
            {useCustomProfile && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coherence Training Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Morning Meditation, Pre-Work, Stress Relief"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Track coherence training in different contexts or times of day
                  </p>
                </div>
                
                {/* Existing Profiles */}
                {savedProfiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or select existing profile:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {savedProfiles.map((profile, index) => (
                        <button
                          key={index}
                          onClick={() => setProfileName(profile.name)}
                          className={`p-2 text-left border rounded-lg transition-colors ${
                            profileName === profile.name
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{profile.name}</div>
                          <div className="text-xs text-gray-500">
                            {profile.sessions} sessions • Avg: {Math.round(profile.avgCoherence)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={startSession}
            disabled={useCustomProfile && !profileName.trim()}
            className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium"
          >
            {useCustomProfile && profileName.trim() ? 
              `Start "${profileName}" Coherence Training` : 
              'Continue Main Coherence Training'
            }
          </button>
        </div>
      ) : (
        // Active Session
        <div className="space-y-6">
          {/* Coherence Meter */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={coherenceColor === 'emerald' ? '#10b981' : 
                         coherenceColor === 'blue' ? '#3b82f6' :
                         coherenceColor === 'yellow' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - coherenceLevel / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold text-${coherenceColor}-600`}>
                    {Math.round(coherenceLevel)}
                  </div>
                  <div className="text-xs text-gray-500">Coherence</div>
                </div>
              </div>
            </div>

            {/* Breathing Guide */}
            <div 
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-1000 bg-${breathingGuidance.color}-100 border-4 border-${breathingGuidance.color}-300`}
              style={{ transform: `scale(${breathingGuidance.scale})` }}
            >
              <span className={`text-sm font-medium text-${breathingGuidance.color}-700`}>
                {breathingGuidance.text}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Session: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-bold text-${coherenceColor}-600`}>
                {coherenceStreak}s
              </div>
              <div className="text-xs text-gray-600">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{maxStreak}s</div>
              <div className="text-xs text-gray-600">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-indigo-600">{breathingRate}</div>
              <div className="text-xs text-gray-600">Breaths/min</div>
            </div>
          </div>

          {/* Coherence Waveform */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="h-16 flex items-end space-x-1">
              {coherenceHistory.slice(-30).map((value, index) => (
                <div
                  key={index}
                  className={`w-2 bg-${coherenceColor}-500 rounded-t transition-all duration-300`}
                  style={{ height: `${(value / 100) * 64}px` }}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Real-time coherence pattern (last 30 seconds)
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={isActive ? pauseSession : () => setIsActive(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </button>
            
            <button
              onClick={endSession}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Complete Session
            </button>
          </div>

          {/* Real-time Feedback */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isInCoherence ? 
                `🎯 Excellent! You're in coherence. Keep this rhythm going.` :
                coherenceLevel >= 60 ?
                `📈 Good coherence building. Focus on smooth, rhythmic breathing.` :
                `🌱 Finding your rhythm. Breathe slowly and evenly.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeurofeedbackTrainer;