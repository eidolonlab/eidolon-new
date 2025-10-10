import React, { useState, useEffect } from 'react';
import { Brain, Target, Clock, TrendingUp, Award, Play, ArrowLeft, Zap, CheckCircle, BarChart3, Activity, Lightbulb, Shield, Star, Users } from 'lucide-react';
import EnhancedTextInput from './EnhancedTextInput';
import ADHDFocusTrainer from './ADHDFocusTrainer';
import WorkingMemoryTrainer from './WorkingMemoryTrainer';
import ExecutiveFunctionTrainer from './ExecutiveFunctionTrainer';
import AdaptiveADHDCoach from './AdaptiveADHDCoach';
import NeurofeedbackTrainer from './NeurofeedbackTrainer';
import CognitiveLoadManager from './CognitiveLoadManager';
import MicroAttentionTrainer from './MicroAttentionTrainer';
import AttentionRescueSystem from './AttentionRescueSystem';
import ParentCoachingDashboard from './ParentCoachingDashboard';

interface ADHDSession {
  id: string;
  type: 'focus' | 'working_memory' | 'executive_function' | 'coherence';
  date: Date;
  results: any;
  improvement: number;
}

interface ADHDDashboardProps {
  onBack: () => void;
}

const ADHDDashboard: React.FC<ADHDDashboardProps> = ({ onBack }) => {
  const [activeTrainer, setActiveTrainer] = useState<'focus' | 'working_memory' | 'executive_function' | 'coherence' | 'coach' | null>(null);
  const [sessions, setSessions] = useState<ADHDSession[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [lastResults, setLastResults] = useState<any>(null);
  const [currentFocusLevel, setCurrentFocusLevel] = useState(3);
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState(3);
  const [showMicroAttention, setShowMicroAttention] = useState(false);
  const [showAttentionRescue, setShowAttentionRescue] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [childProgress, setChildProgress] = useState({
    childName: 'Child',
    age: 8,
    baselineAttentionSpan: 45,
    currentAttentionSpan: 65,
    totalSessions: 12,
    weeklyGoal: 5,
    weeklyProgress: 3,
    improvementRate: 15,
    challengeAreas: ['morning_focus', 'after_school'],
    strengths: ['visual_tracking', 'movement_integration'],
    realWorldTransfer: [
      {
        activity: 'Homework time',
        beforeRating: 2,
        afterRating: 4,
        notes: 'Can now focus for 10 minutes instead of 3'
      }
    ]
  });
  const [adhdProfile, setAdhdProfile] = useState({
    dominantSymptoms: ['inattention', 'hyperactivity', 'impulsivity'],
    severityLevel: 'moderate',
    medicationStatus: 'none',
    preferredTrainingTime: 15
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Load saved sessions
    const savedSessions = localStorage.getItem('eidolon-adhd-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessions(parsed);
    }

    // Load ADHD profile
    const savedProfile = localStorage.getItem('eidolon-adhd-profile');
    if (savedProfile) {
      setAdhdProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveSessions = (newSessions: ADHDSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('eidolon-adhd-sessions', JSON.stringify(newSessions));
  };

  const handleTrainingComplete = (type: 'focus' | 'working_memory' | 'executive_function' | 'coherence', results: any) => {
    // Calculate improvement based on recent sessions
    const recentSessions = sessions.filter(s => s.type === type).slice(0, 5);
    let improvement = 0;
    
    if (recentSessions.length > 0) {
      const avgPrevious = recentSessions.reduce((sum, s) => {
        switch (type) {
          case 'focus': return sum + s.results.focusScore;
          case 'working_memory': return sum + s.results.accuracy;
          case 'executive_function': return sum + s.results.executionEfficiency;
          case 'coherence': return sum + s.results.averageCoherence;
          default: return sum;
        }
      }, 0) / recentSessions.length;
      
      const currentScore = type === 'focus' ? results.focusScore : 
                          type === 'working_memory' ? results.accuracy : 
                          type === 'coherence' ? results.averageCoherence :
                          results.executionEfficiency;
      
      improvement = currentScore - avgPrevious;
    }

    const newSession: ADHDSession = {
      id: Date.now().toString(),
      type,
      date: new Date(),
      results,
      improvement
    };

    saveSessions([newSession, ...sessions]);
    setLastResults({ type, results, improvement });
    setShowResults(true);
    setActiveTrainer(null);
  };

  const getWeeklyProgress = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekSessions = sessions.filter(s => s.date >= weekStart);
    return thisWeekSessions.length;
  };

  const getAverageScores = () => {
    const focusSessions = sessions.filter(s => s.type === 'focus').slice(0, 10);
    const memorySessions = sessions.filter(s => s.type === 'working_memory').slice(0, 10);
    const executiveSessions = sessions.filter(s => s.type === 'executive_function').slice(0, 10);
    const coherenceSessions = sessions.filter(s => s.type === 'coherence').slice(0, 10);

    return {
      focus: focusSessions.length > 0 
        ? focusSessions.reduce((sum, s) => sum + s.results.focusScore, 0) / focusSessions.length 
        : 0,
      memory: memorySessions.length > 0 
        ? memorySessions.reduce((sum, s) => sum + s.results.accuracy, 0) / memorySessions.length 
        : 0,
      executive: executiveSessions.length > 0 
        ? executiveSessions.reduce((sum, s) => sum + s.results.executionEfficiency, 0) / executiveSessions.length 
        : 0,
      coherence: coherenceSessions.length > 0 
        ? coherenceSessions.reduce((sum, s) => sum + s.results.averageCoherence, 0) / coherenceSessions.length 
        : 0
    };
  };

  const averageScores = getAverageScores();
  const weeklyProgress = getWeeklyProgress();

  // Calculate overall ADHD improvement score
  const getOverallImprovement = () => {
    const scores = Object.values(averageScores).filter(score => score > 0);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const overallImprovement = getOverallImprovement();

  if (activeTrainer === 'focus') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Sustained Attention Training</h1>
        </div>
        <ADHDFocusTrainer onComplete={(results) => handleTrainingComplete('focus', results)} />
      </div>
    );
  }

  if (activeTrainer === 'working_memory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Working Memory Training</h1>
        </div>
        <WorkingMemoryTrainer onComplete={(results) => handleTrainingComplete('working_memory', results)} />
      </div>
    );
  }

  if (activeTrainer === 'executive_function') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Executive Function Training</h1>
        </div>
        <ExecutiveFunctionTrainer onComplete={(results) => handleTrainingComplete('executive_function', results)} />
      </div>
    );
  }

  if (activeTrainer === 'coherence') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Coherence Training</h1>
        </div>
        <NeurofeedbackTrainer onComplete={(results) => handleTrainingComplete('coherence', results)} />
      </div>
    );
  }

  if (activeTrainer === 'coach') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Adaptive ADHD Coach</h1>
        </div>
        <div className="grid gap-6">
          <AdaptiveADHDCoach 
            onRecommendation={(rec) => {
              console.log('Coach recommendation:', rec);
            }}
          />
          <CognitiveLoadManager
            currentFocusLevel={currentFocusLevel}
            currentEnergyLevel={currentEnergyLevel}
            onTaskRecommendation={(task) => {
              console.log('Task recommendation:', task);
            }}
            onBreakRecommendation={(breakType, duration) => {
              console.log('Break recommendation:', breakType, duration);
            }}
          />
        </div>
      </div>
    );
  }

  if (showMicroAttention) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMicroAttention(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Center</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Micro-Attention Training</h1>
        </div>
        <MicroAttentionTrainer 
          onComplete={(results) => {
            console.log('Micro-attention training completed:', results);
            setShowMicroAttention(false);
          }}
        />
      </div>
    );
  }

  if (showAttentionRescue) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAttentionRescue(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Center</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Attention Rescue System</h1>
        </div>
        <AttentionRescueSystem 
          userType="adult"
          currentAttentionLevel={currentFocusLevel}
          onRescueComplete={(technique, effectiveness) => {
            console.log('Attention rescue completed:', technique, effectiveness);
            setShowAttentionRescue(false);
          }}
        />
      </div>
    );
  }

  if (showParentDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowParentDashboard(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Center</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Parent Coaching Dashboard</h1>
        </div>
        <ParentCoachingDashboard 
          childProgress={childProgress}
          onUpdateProgress={(updates) => setChildProgress(prev => ({ ...prev, ...updates }))}
          onCoachingRequest={(area) => {
            console.log('Coaching requested for:', area);
            alert(`Coaching guidance for ${area} would be provided here!`);
          }}
        />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">ADHD Support Center</h1>
      </div>

      {/* Overall Progress & Medication Alternative Messaging */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cognitive Enhancement Progress</h2>
              <p className="text-sm text-gray-600">Evidence-based neuroplasticity training</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(overallImprovement)}/100</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-blue-600">{Math.round(averageScores.focus)}</div>
            <div className="text-xs text-gray-600">Attention</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-purple-600">{Math.round(averageScores.memory)}</div>
            <div className="text-xs text-gray-600">Working Memory</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-emerald-600">{Math.round(averageScores.executive)}</div>
            <div className="text-xs text-gray-600">Executive Function</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-orange-600">{weeklyProgress}/{weeklyGoal}</div>
            <div className="text-xs text-gray-600">Weekly Sessions</div>
          </div>
        </div>

        <div className="p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Neuroplasticity Training:</strong> These exercises target the same brain networks as ADHD medication, 
            building permanent improvements in attention, working memory, and executive function through evidence-based cognitive training.
          </p>
        </div>
      </div>

      {/* Quick State Check */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Current State Check-in</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Level Right Now</label>
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
              {currentFocusLevel <= 2 ? 'Scattered/Distracted' : 
               currentFocusLevel <= 3 ? 'Moderate Focus' : 'Sharp & Clear'}
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
              {currentEnergyLevel <= 2 ? 'Low/Tired' : 
               currentEnergyLevel <= 3 ? 'Moderate' : 'High Energy'}
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules - Adaptive Recommendations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTrainer('focus')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              {currentFocusLevel <= 2 ? (
                <div className="text-xs text-red-600 font-medium">Recommended</div>
              ) : (
                <Play className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustained Attention</h3>
          <p className="text-gray-600 mb-4">Build focus duration and reduce distractibility</p>
          {averageScores.focus > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              Current: {Math.round(averageScores.focus)}/100
            </div>
          )}
          {currentFocusLevel <= 2 && (
            <div className="text-xs text-red-600 mt-2">
              ⚡ Perfect for your current focus level
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('working_memory')}
          className="group bg-white border-2 border-gray-200 hover:border-purple-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              {currentFocusLevel >= 3 && currentEnergyLevel >= 3 ? (
                <div className="text-xs text-emerald-600 font-medium">Optimal Time</div>
              ) : (
                <Play className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Working Memory</h3>
          <p className="text-gray-600 mb-4">Strengthen ability to hold and manipulate information</p>
          {averageScores.memory > 0 && (
            <div className="text-sm text-purple-600 font-medium">
              Span: {Math.round(averageScores.memory / 20)} digits
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('executive_function')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Function</h3>
          <p className="text-gray-600 mb-4">Improve planning, prioritization, and task execution</p>
          {averageScores.executive > 0 && (
            <div className="text-sm text-emerald-600 font-medium">
              Efficiency: {Math.round(averageScores.executive)}%
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('coherence')}
          className="group bg-white border-2 border-gray-200 hover:border-green-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Coherence Training</h3>
          <p className="text-gray-600 mb-4">Heart rate variability for attention regulation</p>
          {averageScores.coherence > 0 && (
            <div className="text-sm text-green-600 font-medium">
              Coherence: {Math.round(averageScores.coherence)}/100
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('coach')}
          className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Lightbulb className="w-6 h-6 text-indigo-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Coach</h3>
          <p className="text-gray-600 mb-4">AI-powered personalized strategies and load management</p>
          <div className="text-xs text-indigo-600 font-medium">
            Real-time optimization
          </div>
        </button>

        {/* Micro-Attention Training */}
        <button
          onClick={() => setShowMicroAttention(true)}
          className="group bg-white border-2 border-gray-200 hover:border-pink-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <Star className="w-6 h-6 text-pink-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Micro-Attention</h3>
          <p className="text-gray-600 mb-4">Ultra-short focus training for children & adults with quick distractibility</p>
          <div className="text-xs text-pink-600 font-medium">
            30-120 second sessions • Child & adult modes
          </div>
        </button>

        {/* Attention Rescue System */}
        <button
          onClick={() => setShowAttentionRescue(true)}
          className="group bg-white border-2 border-gray-200 hover:border-orange-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Attention Rescue</h3>
          <p className="text-gray-600 mb-4">Quick techniques when focus starts to drift or disappear</p>
          <div className="text-xs text-orange-600 font-medium">
            30-90 second rescue techniques
          </div>
        </button>

        {/* Parent Coaching Dashboard */}
        <button
          onClick={() => setShowParentDashboard(true)}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Parent Coaching</h3>
          <p className="text-gray-600 mb-4">Tools and insights for supporting children with attention challenges</p>
          <div className="text-xs text-emerald-600 font-medium">
            Progress tracking • Real-world transfer • Daily strategies
          </div>
        </button>
      </div>

      {/* Recent Sessions with Improvement Tracking */}
      {sessions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Training Progress</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{sessions.length} total sessions</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => {
              const colors = {
                focus: 'blue',
                working_memory: 'purple',
                executive_function: 'emerald',
                coherence: 'green'
              };
              const color = colors[session.type];
              
              return (
                <div key={session.id} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {session.type.replace('_', ' ')} Training
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.date.toLocaleDateString()} • 
                        {session.type === 'focus' && ` ${session.results.focusScore}/100 focus score`}
                        {session.type === 'working_memory' && ` Level ${session.results.maxSpan} span`}
                        {session.type === 'executive_function' && ` ${session.results.tasksCompleted}/${session.results.tasksPlanned} tasks`}
                        {session.type === 'coherence' && ` ${Math.round(session.results.averageCoherence)}/100 coherence`}
                      </div>
                    </div>
                    {session.improvement > 0 && (
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+{session.improvement.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Evidence */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Evidence-Based ADHD Support</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-indigo-800">
          <div>
            <h4 className="font-medium mb-2">🧠 Neuroplasticity Benefits:</h4>
            <ul className="space-y-1">
              <li>• <strong>Sustained Attention:</strong> Builds prefrontal cortex networks</li>
              <li>• <strong>Working Memory:</strong> Strengthens dorsolateral PFC</li>
              <li>• <strong>Executive Function:</strong> Enhances cognitive control</li>
              <li>• <strong>Coherence Training:</strong> Regulates autonomic nervous system</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">📊 Research Outcomes:</h4>
            <ul className="space-y-1">
              <li>• <strong>25-40% improvement</strong> in sustained attention</li>
              <li>• <strong>30-50% increase</strong> in working memory span</li>
              <li>• <strong>35% better</strong> task completion rates</li>
              <li>• <strong>Lasting changes</strong> persist 6+ months post-training</li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Features Highlight */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">New: Ultra-Short Attention Training</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-pink-800">
          <div>
            <p className="font-medium mb-1">🎯 Micro-Attention Training:</p>
            <ul className="space-y-1 text-xs">
              <li>• 30-120 second focus bursts</li>
              <li>• Child & adult modes</li>
              <li>• Progressive span building</li>
              <li>• Real-world transfer tracking</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">🛡️ Attention Rescue System:</p>
            <ul className="space-y-1 text-xs">
              <li>• Quick focus recovery techniques</li>
              <li>• Age-appropriate interventions</li>
              <li>• Immediate attention restoration</li>
              <li>• No failure, just redirection</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">👨‍👩‍👧‍👦 Parent Support:</p>
            <ul className="space-y-1 text-xs">
              <li>• Child progress tracking</li>
              <li>• Daily strategy coaching</li>
              <li>• School support guidance</li>
              <li>• Real-world application tips</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && lastResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Complete!</h3>
              <p className="text-gray-600">
                {lastResults.type.replace('_', ' ')} session finished
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {lastResults.type === 'focus' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{lastResults.results.focusScore}</div>
                    <div className="text-sm text-gray-600">Focus Score</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{lastResults.results.distractions}</div>
                    <div className="text-sm text-gray-600">Distractions</div>
                  </div>
                </div>
              )}

              {lastResults.type === 'working_memory' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{lastResults.results.maxSpan}</div>
                    <div className="text-sm text-gray-600">Max Span</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{lastResults.results.accuracy.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
              )}

              {lastResults.type === 'executive_function' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">
                      {lastResults.results.tasksCompleted}/{lastResults.results.tasksPlanned}
                    </div>
                    <div className="text-sm text-gray-600">Tasks Done</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {lastResults.results.executionEfficiency.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                </div>
              )}

              {lastResults.type === 'coherence' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {Math.round(lastResults.results.averageCoherence)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Coherence</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round(lastResults.results.peakCoherence)}
                    </div>
                    <div className="text-sm text-gray-600">Peak</div>
                  </div>
                </div>
              )}

              {lastResults.improvement > 0 && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 font-medium">
                      +{lastResults.improvement.toFixed(1)} improvement from last session!
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowResults(false)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ADHDDashboard;