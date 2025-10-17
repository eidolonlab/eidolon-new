import React, { useState, useEffect } from 'react';
import { Brain, Search, Star, Target, Calendar, ArrowRight, Sunrise, Coffee, Heart, Moon, Shield, Sparkles, Users, Beaker, Rocket, Lightbulb, TrendingUp, Plus, X, Play, CheckCircle, Award, Eye, Activity, MessageSquare, Zap, Clock } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLabsDetails, setShowLabsDetails] = useState(false);
  const [showConversationalAI, setShowConversationalAI] = useState(false);
  const [showStoryGraphModal, setShowStoryGraphModal] = useState(false);
  const [showLabsModal, setShowLabsModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'capture') {
    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'plan') {
    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'train') {
    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'regulate') {
    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
    );
  }

  if (isLoading) {
    return <LoadingSpinner variant="brain" message="Loading your memory dashboard..." fullScreen />;
  }

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      {/* ADHD Focus Hero Section */}
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Brain className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Strengthen Your Memory, Master Your Future
        </h1>

        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
          Transform fleeting moments into lasting memories with evidence-based training.
          Use multi-sensory weaving and mental rehearsal to build cognitive resilience that lasts a lifetime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('weave')}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Create your first memory weave"
          >
            <Sparkles className="w-6 h-6" />
            <span>Create Your First Memory</span>
          </button>

          <button
            onClick={() => onNavigate('scenario')}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-700 rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-md hover:shadow-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Plan a future scenario"
          >
            <Calendar className="w-6 h-6" />
            <span>Plan Future Success</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>40% stronger memory recall</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span>2x goal achievement rate</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Privacy-first design</span>
          </div>
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
          onClick={() => onNavigate('weave')}
          className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Create new memory weave with multi-sensory details"
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Memory Weaving</h3>
          <p className="text-purple-100 text-sm mb-4">
            Transform moments into rich, multi-sensory memories
          </p>

          <div className="space-y-2 text-xs text-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span>5-sense encoding • AI assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span>Clinical quality</span>
            </div>
          </div>
        </button>

        {/* Future Scenarios Card */}
        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Plan and rehearse future scenarios"
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Future Scenarios</h3>
          <p className="text-emerald-100 text-sm mb-4">
            Rehearse events with confidence-building techniques
          </p>

          <div className="space-y-2 text-xs text-emerald-200">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span>Mental rehearsal • If-then planning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span>2x success rate</span>
            </div>
          </div>
        </button>

        {/* Memory Training Card */}
        <button
          onClick={() => onNavigate('training')}
          className="group bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Practice memory retrieval and strengthening"
        >
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Memory Training</h3>
          <p className="text-orange-100 text-sm mb-4">
            Strengthen recall through spaced practice
          </p>

          <div className="space-y-2 text-xs text-orange-200">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span>Spaced retrieval • 50% stronger memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span>Clinical metrics</span>
            </div>
          </div>
        </button>

        {/* ADHD Support Card - moved to 4th position */}
        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Access ADHD support tools and training"
        >
          <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Focus Support</h3>
          <p className="text-gray-600 text-sm mb-4">
            Attention training for better concentration
          </p>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-blue-500" />
              <span>Evidence-based • 5-25 min sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-blue-500" />
              <span>Builds sustained attention</span>
            </div>
          </div>
        </button>
      </div>

      {/* AI Memory Companion - Optional */}
      {showConversationalAI && (
        <ErrorBoundary fallback={
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">AI companion temporarily unavailable</p>
            <button
              onClick={() => setShowConversationalAI(false)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        }>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <ConversationalInterface
              cognitiveState={cognitiveState}
              upcomingEvents={upcomingScenarios}
              onActionSelect={(action) => {
                if (['weave', 'scenario', 'training', 'adhd'].includes(action)) {
                  onNavigate(action as any);
                } else {
                  setFocusedActivity(action);
                }
                setShowConversationalAI(false);
              }}
              onDismiss={() => setShowConversationalAI(false)}
            />
          </div>
        </div>
        </ErrorBoundary>
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
          className="group bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Start guided memory retrieval session"
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
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-8 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Capture and preserve a meaningful moment"
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
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Show AI memory companion for personalized recommendations"
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Show AI Memory Companion</span>
            </div>
          </button>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
};

export default IntelligentDashboard;