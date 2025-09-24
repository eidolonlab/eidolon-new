import React, { useState, useEffect } from 'react';
import { Brain, Search, Star, Target, Calendar, ArrowRight, Sunrise, Coffee, Heart, Moon, Shield, Sparkles, Users, Beaker, Rocket, Lightbulb, TrendingUp, Plus, X, Play, CheckCircle, Award, Eye, Activity, MessageSquare, Zap, Clock } from 'lucide-react';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import { useWeave } from '../contexts/WeaveContext';
import ConversationalInterface from './ConversationalInterface';
import MemoryRetrievalGuide from './MemoryRetrievalGuide';
import AdaptiveMemoryCapture from './AdaptiveMemoryCapture';
import SmartScenarioPlanner from './SmartScenarioPlanner';
import IntelligentTrainingCoach from './IntelligentTrainingCoach';
import CognitiveRegulationTools from './CognitiveRegulationTools';
import LabsPreview from './LabsPreview';

interface IntelligentDashboardProps {
  onNavigate: (view: 'weave' | 'scenario' | 'training' | 'insights' | 'adhd') => void;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({ onNavigate }) => {
  const { cognitiveState, userPattern, getAdaptiveMessage, getOptimalActivity, getProgressiveLayer } = useCognitiveState();
  const { weaves } = useWeave();
  const [focusedActivity, setFocusedActivity] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLabsDetails, setShowLabsDetails] = useState(false);
  const [showConversationalAI, setShowConversationalAI] = useState(false);
  const [showStoryGraphModal, setShowStoryGraphModal] = useState(false);
  const [showLabsModal, setShowLabsModal] = useState(false);

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

  // Handle focused activities with proper navigation
  if (focusedActivity === 'retrieve') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
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
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Adaptive Memory Capture</h1>
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
            <ArrowRight className="w-5 h-5 rotate-180" />
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
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Intelligent Memory Training</h1>
        </div>
        <IntelligentTrainingCoach
          cognitiveState={cognitiveState}
          userPattern={userPattern}
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
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Cognitive Regulation</h1>
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
      {/* ADHD Focus Hero Section */}
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Struggling with Focus & Attention?
        </h1>
        
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
          Get immediate relief with evidence-based ADHD support. Build sustained attention, 
          working memory, and executive function with tools designed by cognitive scientists.
        </p>
        
        <button
          onClick={() => onNavigate('adhd')}
          className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
        >
          <Brain className="w-6 h-6" />
          <span>Start ADHD Support Now</span>
        </button>
        
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>25-40% improvement in sustained attention</span>
          </div>
          <span>•</span>
          <span>Research-backed</span>
        </div>
      </div>

      {/* Core Features Grid */}
      {/* AI Memory Companion - Subtle and Contextual */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Memory Companion</h3>
              <p className="text-sm text-gray-600">{getAdaptiveMessage()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowConversationalAI(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            Get Recommendations
          </button>
        </div>
        
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-sm text-indigo-700">
            <Clock className="w-4 h-4" />
            <span>Optimal for {getOptimalActivity()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-indigo-700">
            <Brain className="w-4 h-4" />
            <span>Flow state: {cognitiveState.flowState}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-indigo-700">
            <TrendingUp className="w-4 h-4" />
            <span>Layer {getProgressiveLayer()} features</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ADHD Support Card */}
        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">ADHD Support</h3>
          <p className="text-blue-100 text-sm mb-4">
            Focus, working memory & executive function training
          </p>
          
          <div className="space-y-2 text-xs text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <span>Immediate relief • Evidence-based</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <span>5-25 min sessions</span>
            </div>
          </div>
        </button>

        {/* Memory Weaving Card */}
        <button
          onClick={() => onNavigate('weave')}
          className="group bg-white border-2 border-gray-200 hover:border-purple-300 p-6 rounded-2xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Memory Weaving</h3>
          <p className="text-gray-600 text-sm mb-4">
            Transform moments into rich, multi-sensory memories
          </p>
          
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>5-sense encoding • AI assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Clinical quality</span>
            </div>
          </div>
        </button>

        {/* Future Scenarios Card */}
        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Future Scenarios</h3>
          <p className="text-gray-600 text-sm mb-4">
            Rehearse events with confidence-building techniques
          </p>
          
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-purple-500" />
              <span>Mental rehearsal • If-then planning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-purple-500" />
              <span>2x success rate</span>
            </div>
          </div>
        </button>

        {/* Memory Training Card */}
        <button
          onClick={() => onNavigate('training')}
          className="group bg-white border-2 border-gray-200 hover:border-orange-300 p-6 rounded-2xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Memory Training</h3>
          <p className="text-gray-600 text-sm mb-4">
            Strengthen recall through spaced practice
          </p>
          
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-blue-500" />
              <span>Spaced retrieval • 50% stronger memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-blue-500" />
              <span>Clinical metrics</span>
            </div>
          </div>
        </button>
      </div>

      {/* AI Memory Companion - Optional */}
      {showConversationalAI && (
        <ConversationalInterface
          cognitiveState={cognitiveState}
          upcomingEvents={upcomingScenarios}
          onActionSelect={(action) => {
            if (['weave', 'scenario', 'training', 'adhd'].includes(action)) {
              onNavigate(action as any);
            } else {
              setFocusedActivity(action);
            }
          }}
          onDismiss={() => setShowConversationalAI(false)}
        />
      )}

      {/* Eidolon Labs - Shows when AI companion is dismissed */}
      {!showConversationalAI && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Eidolon Labs</h2>
              <p className="text-sm text-gray-600">Preview next-generation memory features</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-purple-600 font-medium mb-2">5 revolutionary features in development</div>
            <button
              onClick={() => setShowLabsModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Explore Labs Preview
            </button>
          </div>
        </div>
      )}

      {/* Labs Preview Modal */}
      {showLabsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Eidolon Labs - Revolutionary Features</h2>
              <button
                onClick={() => setShowLabsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LabsPreview onClose={() => setShowLabsModal(false)} />
          </div>
        </div>
      )}

      {/* Bottom Action Cards - Always Visible */}
      <div className="grid md:grid-cols-2 gap-6 mt-16">
        {/* Retrieve Memory Card */}
        <button
          onClick={() => setFocusedActivity('retrieve')}
          className="group bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">Retrieve Memory</h3>
          <p className="text-indigo-100 text-lg mb-4">Guided recovery of past experiences</p>
          
          <div className="flex items-center space-x-2 text-indigo-200">
            <Brain className="w-4 h-4" />
            <span className="text-sm">Evidence-based cues • Multi-sensory reconstruction</span>
          </div>
        </button>

        {/* Capture Moment Card */}
        <button
          onClick={() => setFocusedActivity('capture')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-8 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-emerald-100 group-hover:bg-emerald-200 rounded-2xl flex items-center justify-center transition-colors">
              <Star className="w-8 h-8 text-emerald-600" />
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Capture Moment</h3>
          <p className="text-gray-600 text-lg mb-4">Preserve today's meaningful experiences</p>
          
          <div className="flex items-center space-x-2 text-emerald-600">
            <Star className="w-4 h-4" />
            <span className="text-sm">Quick capture • Autobiographical coherence</span>
          </div>
        </button>
      </div>

      {/* Toggle AI Companion */}
      {!showConversationalAI && (
        <div className="text-center">
          <button
            onClick={() => setShowConversationalAI(true)}
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Show AI Memory Companion</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default IntelligentDashboard;