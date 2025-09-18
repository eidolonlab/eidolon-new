import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Lightbulb, Zap, Clock, CheckCircle, AlertTriangle, Award, Eye, Activity } from 'lucide-react';

interface ADHDProfile {
  attentionSpan: number;
  distractibilityLevel: number;
  hyperactivityLevel: number;
  impulsivityLevel: number;
  workingMemoryCapacity: number;
  executiveFunctionLevel: number;
  optimalFocusTime: number;
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening';
  triggerPatterns: string[];
  successStrategies: string[];
}

interface AdaptiveADHDCoachProps {
  onRecommendation: (recommendation: {
    type: 'focus' | 'break' | 'strategy' | 'environment';
    message: string;
    action?: () => void;
  }) => void;
}

const AdaptiveADHDCoach: React.FC<AdaptiveADHDCoachProps> = ({ onRecommendation }) => {
  const [profile, setProfile] = useState<ADHDProfile>({
    attentionSpan: 15, // minutes
    distractibilityLevel: 3, // 1-5 scale
    hyperactivityLevel: 3,
    impulsivityLevel: 3,
    workingMemoryCapacity: 4, // digit span
    executiveFunctionLevel: 3,
    optimalFocusTime: 15,
    bestTimeOfDay: 'morning',
    triggerPatterns: [],
    successStrategies: []
  });
  
  const [currentState, setCurrentState] = useState<{
    focusLevel: number;
    energyLevel: number;
    stressLevel: number;
    timeOfDay: string;
    environment: string;
  }>({
    focusLevel: 3,
    energyLevel: 3,
    stressLevel: 2,
    timeOfDay: getTimeOfDay(),
    environment: 'quiet'
  });

  const [adaptiveInsights, setAdaptiveInsights] = useState<string[]>([]);
  const [personalizedStrategies, setPersonalizedStrategies] = useState<string[]>([]);

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  // Analyze user patterns and adapt recommendations
  useEffect(() => {
    analyzeUserPatterns();
    generatePersonalizedStrategies();
    provideRealTimeRecommendations();
  }, [currentState, profile]);

  const analyzeUserPatterns = () => {
    const sessions = JSON.parse(localStorage.getItem('eidolon-adhd-sessions') || '[]');
    const insights = [];

    // Time of day analysis
    const morningPerformance = sessions.filter((s: any) => 
      new Date(s.date).getHours() < 12
    ).reduce((avg: number, s: any) => avg + (s.results.focusScore || 0), 0) / 
    sessions.filter((s: any) => new Date(s.date).getHours() < 12).length || 0;

    const afternoonPerformance = sessions.filter((s: any) => 
      new Date(s.date).getHours() >= 12 && new Date(s.date).getHours() < 17
    ).reduce((avg: number, s: any) => avg + (s.results.focusScore || 0), 0) / 
    sessions.filter((s: any) => new Date(s.date).getHours() >= 12 && new Date(s.date).getHours() < 17).length || 0;

    if (morningPerformance > afternoonPerformance + 10) {
      insights.push("You perform 15% better in the morning - schedule important tasks early");
      setProfile(prev => ({ ...prev, bestTimeOfDay: 'morning' }));
    } else if (afternoonPerformance > morningPerformance + 10) {
      insights.push("Your afternoon focus is stronger - consider later training sessions");
      setProfile(prev => ({ ...prev, bestTimeOfDay: 'afternoon' }));
    }

    // Attention span optimization
    const successfulSessions = sessions.filter((s: any) => s.results.focusScore >= 70);
    if (successfulSessions.length > 3) {
      const avgSuccessfulDuration = successfulSessions.reduce((avg: number, s: any) => 
        avg + (s.results.duration || 0), 0) / successfulSessions.length;
      
      if (avgSuccessfulDuration > 0) {
        insights.push(`Your optimal focus time is ${Math.round(avgSuccessfulDuration / 60)} minutes`);
        setProfile(prev => ({ ...prev, optimalFocusTime: Math.round(avgSuccessfulDuration / 60) }));
      }
    }

    // Distraction pattern analysis
    const highDistractionSessions = sessions.filter((s: any) => s.results.distractions > 3);
    if (highDistractionSessions.length > 2) {
      insights.push("Consider using noise-canceling headphones or changing your environment");
    }

    setAdaptiveInsights(insights);
  };

  const generatePersonalizedStrategies = () => {
    const strategies = [];

    // Based on current state
    if (currentState.focusLevel <= 2) {
      strategies.push("Start with a 2-minute breathing exercise to center your attention");
      strategies.push("Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you hear, etc.");
    }

    if (currentState.energyLevel <= 2) {
      strategies.push("Take a 5-minute walk or do jumping jacks to boost energy");
      strategies.push("Drink water and have a healthy snack to fuel your brain");
    }

    if (currentState.stressLevel >= 4) {
      strategies.push("Use progressive muscle relaxation before starting tasks");
      strategies.push("Break large tasks into smaller, manageable chunks");
    }

    // Based on profile
    if (profile.hyperactivityLevel >= 4) {
      strategies.push("Use a fidget tool or stress ball during focus sessions");
      strategies.push("Try standing or walking while doing certain tasks");
    }

    if (profile.impulsivityLevel >= 4) {
      strategies.push("Use the 10-second rule: count to 10 before making decisions");
      strategies.push("Write down impulses instead of acting on them immediately");
    }

    setPersonalizedStrategies(strategies.slice(0, 3));
  };

  const provideRealTimeRecommendations = () => {
    // Smart recommendations based on current state
    if (currentState.focusLevel <= 2 && currentState.energyLevel >= 3) {
      onRecommendation({
        type: 'strategy',
        message: "Your energy is good but focus is low. Try a 5-minute working memory exercise to prime your attention."
      });
    }

    if (currentState.stressLevel >= 4) {
      onRecommendation({
        type: 'break',
        message: "Stress level is high. Take a 3-minute breathing break before continuing."
      });
    }

    if (profile.bestTimeOfDay === currentState.timeOfDay && currentState.focusLevel >= 3) {
      onRecommendation({
        type: 'focus',
        message: "This is your optimal time! Consider tackling your most challenging task now."
      });
    }
  };

  const updateCurrentState = (key: keyof typeof currentState, value: any) => {
    setCurrentState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Adaptive ADHD Coach</h2>
          <p className="text-sm text-gray-600">AI-powered attention and executive function support</p>
        </div>
      </div>

      {/* Current State Check-in */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
        <h3 className="font-medium text-gray-900 mb-4">How are you feeling right now?</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Level</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => updateCurrentState('focusLevel', level)}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    level <= currentState.focusLevel 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentState.focusLevel <= 2 ? 'Scattered' : 
               currentState.focusLevel <= 3 ? 'Moderate' : 'Sharp'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => updateCurrentState('energyLevel', level)}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    level <= currentState.energyLevel 
                      ? 'bg-emerald-500 hover:bg-emerald-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentState.energyLevel <= 2 ? 'Low' : 
               currentState.energyLevel <= 3 ? 'Moderate' : 'High'}
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Strategies */}
      {personalizedStrategies.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">Personalized Strategies</span>
          </div>
          <div className="space-y-2">
            {personalizedStrategies.map((strategy, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-indigo-800">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Insights */}
      {adaptiveInsights.length > 0 && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-900">Your Patterns</span>
          </div>
          <div className="space-y-2">
            {adaptiveInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-emerald-800">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveADHDCoach;