import React, { useState, useEffect } from 'react';
import { Brain, Zap, Calendar, Target, Heart, Eye, Sunrise, Coffee, Moon, Star, ArrowRight, Play, CheckCircle, Lightbulb, TrendingUp, Search, ArrowLeft, Sparkles, Users, Shield } from 'lucide-react';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import { useWeave } from '../contexts/WeaveContext';
import ConversationalInterface from './ConversationalInterface';
import MemoryRetrievalGuide from './MemoryRetrievalGuide';
import AdaptiveMemoryCapture from './AdaptiveMemoryCapture';
import SmartScenarioPlanner from './SmartScenarioPlanner';
import IntelligentTrainingCoach from './IntelligentTrainingCoach';
import CognitiveRegulationTools from './CognitiveRegulationTools';

interface IntelligentDashboardProps {
  onNavigate: (view: string) => void;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({ onNavigate }) => {
  const { cognitiveState, getAdaptiveMessage, getOptimalActivity } = useCognitiveState();
  const { weaves } = useWeave();
  const [focusedActivity, setFocusedActivity] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConversationalAI, setShowConversationalAI] = useState(true);

  // Update time every minute for adaptive flow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 3);

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const getTimeIcon = () => {
    const timeOfDay = getTimeOfDay();
    switch (timeOfDay) {
      case 'morning': return Sunrise;
      case 'afternoon': return Coffee;
      case 'evening': return Heart;
      case 'night': return Moon;
      default: return Sunrise;
    }
  };

  const timeOfDay = getTimeOfDay();
  const TimeIcon = getTimeIcon();
  const adaptiveMessage = getAdaptiveMessage();
  const optimalActivity = getOptimalActivity();

  // Handle focused activities
  if (focusedActivity === 'retrieve') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Guided Memory Retrieval</h1>
        </div>
        <MemoryRetrievalGuide
          cognitiveState={cognitiveState}
          onMemoryRetrieved={(memory) => {
            console.log('Memory retrieved:', memory);
            setFocusedActivity(null);
          }}
          onCreateWeave={() => onNavigate('weave')}
        />
      </div>
    );
  }

  if (focusedActivity === 'capture') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Memory Capture</h1>
        </div>
        <AdaptiveMemoryCapture
          cognitiveState={cognitiveState}
          onComplete={() => setFocusedActivity(null)}
        />
      </div>
    );
  }

  if (focusedActivity === 'plan') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Smart Scenario Planning</h1>
        </div>
        <SmartScenarioPlanner
          cognitiveState={cognitiveState}
          upcomingEvents={upcomingScenarios}
          onComplete={() => setFocusedActivity(null)}
        />
      </div>
    );
  }

  if (focusedActivity === 'train') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Intelligent Memory Training</h1>
        </div>
        <IntelligentTrainingCoach
          cognitiveState={cognitiveState}
          userPattern={{
            bestTimeForMemory: timeOfDay,
            averageSessionLength: 300,
            preferredDifficulty: 'medium',
            strongestSenses: ['visual', 'emotional'],
            improvementRate: 0,
            consistencyScore: 0
          }}
          onComplete={() => setFocusedActivity(null)}
        />
      </div>
    );
  }

  if (focusedActivity === 'regulate') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Memory State Optimization</h1>
        </div>
        <CognitiveRegulationTools
          cognitiveState={cognitiveState}
          onComplete={() => setFocusedActivity(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Adaptive Time-Based Hero Section */}
      <div className={`rounded-2xl border p-8 ${
        timeOfDay === 'morning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
        timeOfDay === 'afternoon' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
        timeOfDay === 'evening' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
        'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TimeIcon className={`w-8 h-8 ${
              timeOfDay === 'morning' ? 'text-yellow-600' :
              timeOfDay === 'afternoon' ? 'text-blue-600' :
              timeOfDay === 'evening' ? 'text-purple-600' :
              'text-indigo-600'
            }`} />
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {timeOfDay} Flow Active
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {adaptiveMessage}
          </p>
          
          <button
            onClick={() => setFocusedActivity(optimalActivity)}
            className={`inline-flex items-center space-x-3 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all text-lg font-medium shadow-lg ${
              timeOfDay === 'morning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              timeOfDay === 'afternoon' ? 'bg-blue-600 hover:bg-blue-700' :
              timeOfDay === 'evening' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Search className="w-6 h-6" />
            <span>
              {optimalActivity === 'retrieve' ? 'Guided Memory Retrieval' :
               optimalActivity === 'capture' ? 'Capture Today\'s Moments' :
               optimalActivity === 'plan' ? 'Smart Scenario Planning' :
               optimalActivity === 'train' ? 'Intelligent Memory Training' :
               optimalActivity === 'regulate' ? 'Memory State Optimization' :
               'Start Memory Work'}
            </span>
          </button>
          
          <div className={`mt-4 text-sm font-medium ${
            timeOfDay === 'morning' ? 'text-yellow-700' :
            timeOfDay === 'afternoon' ? 'text-blue-700' :
            timeOfDay === 'evening' ? 'text-purple-700' :
            'text-indigo-700'
          }`}>
            <span>✨ Optimized for {timeOfDay} cognitive state • Updates every minute</span>
          </div>
        </div>
      </div>

      {/* Core Memory Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setFocusedActivity('retrieve')}
          className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Search className="w-6 h-6 text-indigo-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Retrieval</h3>
          <p className="text-gray-600 mb-4">Guided recovery of forgotten experiences</p>
          <div className="text-sm text-indigo-600 font-medium">
            🧠 Evidence-based cues • Multi-sensory reconstruction
          </div>
        </button>

        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">ADHD Support</h3>
          <p className="text-gray-600 mb-4">Focus, working memory & executive function</p>
          <div className="text-sm text-blue-600 font-medium">
            🎯 Immediate relief • Evidence-based • 5-25 min sessions
          </div>
        </button>

        <button
          onClick={() => onNavigate('weave')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Weaving</h3>
          <p className="text-gray-600 mb-4">Transform moments into rich memories</p>
          <div className="text-sm text-emerald-600 font-medium">
            🌟 5-sense encoding • AI assistance • Clinical quality
          </div>
        </button>

        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-white border-2 border-gray-200 hover:border-purple-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Future Scenarios</h3>
          <p className="text-gray-600 mb-4">Rehearse events with confidence</p>
          <div className="text-sm text-purple-600 font-medium">
            🎯 Mental rehearsal • If-then planning • 2x success rate
          </div>
        </button>
      </div>

      {/* AI Memory Companion */}
      {showConversationalAI && (
        <ConversationalInterface
          cognitiveState={cognitiveState}
          upcomingEvents={upcomingScenarios}
          onActionSelect={(action) => {
            if (['weave', 'scenario', 'training', 'adhd'].includes(action)) {
              onNavigate(action);
            } else {
              setFocusedActivity(action);
            }
          }}
          onDismiss={() => setShowConversationalAI(false)}
        />
      )}

      {/* Quick Access Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => setFocusedActivity('capture')}
          className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Capture Moment</h3>
          <p className="text-gray-600 mb-4">Preserve today's meaningful experiences</p>
          <div className="text-sm text-indigo-600 font-medium">
            ⭐ Quick capture • Autobiographical coherence
          </div>
        </button>

        <button
          onClick={() => onNavigate('training')}
          className="group bg-white border-2 border-gray-200 hover:border-orange-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Training</h3>
          <p className="text-gray-600 mb-4">Strengthen recall through spaced practice</p>
          <div className="text-sm text-orange-600 font-medium">
            📈 Spaced retrieval • 50% stronger memories • Clinical metrics
          </div>
        </button>
      </div>
    </div>
  );
};

export default IntelligentDashboard;