import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Lightbulb, Zap, Clock, CheckCircle, AlertTriangle, Award, Eye, Activity, MessageSquare, ArrowRight, Plus, X } from 'lucide-react';

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
  const [coachingMode, setCoachingMode] = useState<'assessment' | 'active_coaching' | 'strategy_building'>('assessment');
  const [userInput, setUserInput] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [coachingHistory, setCoachingHistory] = useState<Array<{
    userMessage: string;
    coachResponse: string;
    timestamp: Date;
    helpful: boolean | null;
  }>>([]);
  const [activeStrategies, setActiveStrategies] = useState<string[]>([]);
  const [currentFocusLevel, setCurrentFocusLevel] = useState(3);
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState(3);
  const [currentStressLevel, setCurrentStressLevel] = useState(3);
  const [showStrategyBuilder, setShowStrategyBuilder] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  
  const [adaptiveInsights, setAdaptiveInsights] = useState<string[]>([]);
  const [personalizedStrategies, setPersonalizedStrategies] = useState<string[]>([]);

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  const generateCoachingResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Analyze user's challenge and provide specific coaching
    if (message.includes('focus') || message.includes('concentrate') || message.includes('distracted')) {
      if (message.includes('work') || message.includes('task')) {
        return "I understand focusing at work is challenging. Try the 'Two-Minute Rule': If a task takes less than 2 minutes, do it immediately. For longer tasks, break them into 2-minute chunks. This reduces the cognitive load of task-switching. Would you like me to help you break down a specific task?";
      } else if (message.includes('reading') || message.includes('study')) {
        return "Reading focus issues are common with ADHD. Try the 'Pointer Technique': Use your finger or a pen to guide your eyes line by line. This engages your motor system and reduces mind-wandering by 40%. Also, read aloud quietly - this activates multiple brain regions. What type of material are you trying to focus on?";
      } else {
        return "Focus challenges are the core of ADHD. Here's what works: 1) Remove distractions from your environment first, 2) Use the Pomodoro Technique (25 min focus, 5 min break), 3) Try 'body doubling' - work alongside someone else. Your brain craves novelty, so change your environment every few days. What specific situation are you struggling with?";
      }
    }
    
    if (message.includes('overwhelm') || message.includes('too much') || message.includes('stressed')) {
      return "Overwhelm is your brain's way of saying 'too much information at once.' Here's immediate relief: 1) Brain dump everything onto paper (don't organize, just dump), 2) Pick only ONE thing to focus on right now, 3) Use the 4-7-8 breathing technique to calm your nervous system. Remember: You don't have to do everything today. What's the ONE most important thing you need to handle?";
    }
    
    if (message.includes('procrastination') || message.includes('putting off') || message.includes('avoid')) {
      return "Procrastination often happens because tasks feel too big or unclear. Try 'Implementation Intentions': Instead of 'I need to clean,' say 'At 2pm, I will spend 10 minutes organizing my desk.' Be specific about WHEN and WHAT. Also, pair boring tasks with something enjoyable - play music, have a special drink, or reward yourself after. What task are you avoiding?";
    }
    
    if (message.includes('memory') || message.includes('forget') || message.includes('remember')) {
      return "ADHD affects working memory - your brain's 'mental sticky notes.' Strategies that help: 1) External memory aids (phone reminders, visual cues), 2) The 'One-Touch Rule' - handle things immediately when possible, 3) Create routines so important things become automatic. For remembering conversations, try the 'Echo Technique' - repeat back key points. What do you most often forget?";
    }
    
    if (message.includes('time') || message.includes('late') || message.includes('schedule')) {
      return "Time blindness is real with ADHD. Your brain doesn't naturally track time passing. Solutions: 1) Use visual timers (not just phone alarms), 2) Time-block your calendar in 15-30 minute chunks, 3) Build in 'buffer time' - if something takes 30 minutes, schedule 45. The key is external time awareness tools. What time management challenge bothers you most?";
    }
    
    if (message.includes('emotion') || message.includes('angry') || message.includes('frustrated') || message.includes('mood')) {
      return "ADHD brains feel emotions more intensely and have trouble regulating them. This is neurological, not a character flaw. Strategies: 1) Name the emotion out loud ('I'm feeling frustrated'), 2) Use the 6-second rule - intense emotions peak and start declining after 6 seconds, 3) Physical movement helps - even 30 seconds of jumping jacks can reset your emotional state. What emotional challenge are you facing?";
    }
    
    if (message.includes('motivation') || message.includes('interest') || message.includes('boring')) {
      return "ADHD brains need dopamine to function well, and boring tasks don't provide it. Solutions: 1) 'Gamify' boring tasks - set timers, create mini-rewards, 2) Use 'body doubling' - work alongside others, 3) Pair boring tasks with stimulating elements (music, fidgets, standing), 4) Break tasks into smaller wins. Your brain needs frequent positive feedback. What feels most boring or unmotivating right now?";
    }
    
    // Default response for general questions
    return "I'm here to help with your ADHD challenges. Common areas I can coach you on: focus and concentration, overwhelm and stress, procrastination, memory and forgetfulness, time management, emotional regulation, and motivation. What's your biggest challenge right now? Be specific about the situation you're facing.";
  };

  const handleUserMessage = () => {
    if (!userInput.trim()) return;
    
    const response = generateCoachingResponse(userInput);
    const newEntry = {
      userMessage: userInput,
      coachResponse: response,
      timestamp: new Date(),
      helpful: null
    };
    
    setCoachingHistory(prev => [newEntry, ...prev]);
    setUserInput('');
  };

  const markHelpful = (index: number, helpful: boolean) => {
    setCoachingHistory(prev => prev.map((entry, i) => 
      i === index ? { ...entry, helpful } : entry
    ));
  };

  const addPersonalStrategy = (strategy: string) => {
    if (!activeStrategies.includes(strategy)) {
      setActiveStrategies(prev => [...prev, strategy]);
    }
  };

  const removeStrategy = (strategy: string) => {
    setActiveStrategies(prev => prev.filter(s => s !== strategy));
  };

  // Analyze user patterns and adapt recommendations
  useEffect(() => {
    analyzeUserPatterns();
    generatePersonalizedStrategies();
  }, [currentFocusLevel, currentEnergyLevel, currentStressLevel, profile]);

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
    if (currentFocusLevel <= 2) {
      strategies.push("Start with a 2-minute breathing exercise to center your attention");
      strategies.push("Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you hear, etc.");
    }

    if (currentEnergyLevel <= 2) {
      strategies.push("Take a 5-minute walk or do jumping jacks to boost energy");
      strategies.push("Drink water and have a healthy snack to fuel your brain");
    }

    if (currentStressLevel >= 4) {
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

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Adaptive ADHD Coach</h2>
          <p className="text-sm text-gray-600">Get personalized coaching for your ADHD challenges</p>
        </div>
      </div>

      {coachingMode === 'assessment' && (
        <div className="space-y-6">
          {/* Quick State Check */}
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h3 className="font-medium text-gray-900 mb-4">Quick Check-in</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Focus Level</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCurrentFocusLevel(level)}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        level <= currentFocusLevel 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentFocusLevel <= 2 ? 'Scattered' : 
                   currentFocusLevel <= 3 ? 'Moderate' : 'Sharp'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCurrentEnergyLevel(level)}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        level <= currentEnergyLevel 
                          ? 'bg-emerald-500 hover:bg-emerald-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentEnergyLevel <= 2 ? 'Low' : 
                   currentEnergyLevel <= 3 ? 'Moderate' : 'High'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCurrentStressLevel(level)}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        level <= currentStressLevel 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentStressLevel <= 2 ? 'Calm' : 
                   currentStressLevel <= 3 ? 'Moderate' : 'High'}
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What ADHD challenge are you facing right now?
            </label>
            <textarea
              value={currentChallenge}
              onChange={(e) => setCurrentChallenge(e.target.value)}
              placeholder="e.g., I can't focus on this work project, I keep getting distracted by my phone, I feel overwhelmed by my to-do list, I can't remember what my boss told me..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific about your situation - the more details you provide, the better I can help
            </p>
          </div>

          <button
            onClick={() => {
              if (currentChallenge.trim()) {
                const response = generateCoachingResponse(currentChallenge);
                setCoachingHistory([{
                  userMessage: currentChallenge,
                  coachResponse: response,
                  timestamp: new Date(),
                  helpful: null
                }]);
                setCoachingMode('active_coaching');
              }
            }}
            disabled={!currentChallenge.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Get Personalized Coaching
          </button>
        </div>
      )}

      {coachingMode === 'active_coaching' && (
        <div className="space-y-6">
          {/* Coaching Conversation */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {coachingHistory.map((entry, index) => (
              <div key={index} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-blue-600 text-white p-3 rounded-lg">
                    <p className="text-sm">{entry.userMessage}</p>
                  </div>
                </div>
                
                {/* Coach Response */}
                <div className="flex justify-start">
                  <div className="max-w-md bg-white border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">ADHD Coach</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{entry.coachResponse}</p>
                    
                    {/* Helpfulness Rating */}
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                      <button
                        onClick={() => markHelpful(index, true)}
                        className={`px-2 py-1 text-xs rounded ${
                          entry.helpful === true 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                        }`}
                      >
                        👍 Yes
                      </button>
                      <button
                        onClick={() => markHelpful(index, false)}
                        className={`px-2 py-1 text-xs rounded ${
                          entry.helpful === false 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        👎 No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Conversation */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask a follow-up question or describe another challenge..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
              />
              <button
                onClick={handleUserMessage}
                disabled={!userInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowStrategyBuilder(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Build Strategy</span>
              </button>
              <button
                onClick={() => setCoachingMode('assessment')}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                New Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Strategies */}
      {activeStrategies.length > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">Your Active Strategies</span>
            </div>
            <button
              onClick={() => setShowStrategyBuilder(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm"
            >
              Manage
            </button>
          </div>
          <div className="space-y-2">
            {activeStrategies.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-emerald-200">
                <span className="text-sm text-emerald-800">{strategy}</span>
                <button
                  onClick={() => removeStrategy(strategy)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Builder Modal */}
      {showStrategyBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Build Personal Strategy</h3>
              <button
                onClick={() => setShowStrategyBuilder(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create a personal strategy
                </label>
                <input
                  type="text"
                  placeholder="e.g., When I feel overwhelmed, I will write down 3 priorities"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addPersonalStrategy(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Quick Strategy Templates</h4>
                <div className="space-y-2">
                  {[
                    "When I feel distracted, I will put my phone in another room",
                    "When I feel overwhelmed, I will write down just 3 priorities",
                    "When I procrastinate, I will set a 10-minute timer and start",
                    "When I lose focus, I will take 5 deep breaths and refocus"
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        addPersonalStrategy(template);
                        setShowStrategyBuilder(false);
                      }}
                      className="w-full text-left p-2 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700 hover:bg-blue-100 transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => setCoachingMode('active_coaching')}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Get Coaching</span>
        </button>
        <button
          onClick={() => setShowStrategyBuilder(true)}
          className="flex items-center justify-center space-x-2 p-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Target className="w-4 h-4" />
          <span>Build Strategy</span>
        </button>
      </div>
    </div>
  );
};

export default AdaptiveADHDCoach;