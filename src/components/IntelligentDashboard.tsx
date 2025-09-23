import React, { useState, useEffect } from 'react';
import { Brain, Zap, Calendar, Target, Heart, Eye, Sunrise, Coffee, Moon, Star, ArrowRight, Play, CheckCircle, Lightbulb, TrendingUp, Search, ArrowLeft, Sparkles, Users, Shield } from 'lucide-react';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import { useWeave } from '../contexts/WeaveContext';
import ConversationalInterface from './ConversationalInterface';
import AdaptiveMemoryCapture from './AdaptiveMemoryCapture';
import SmartScenarioPlanner from './SmartScenarioPlanner';
import IntelligentTrainingCoach from './IntelligentTrainingCoach';
import CognitiveRegulationTools from './CognitiveRegulationTools';
import MemoryRetrievalGuide from './MemoryRetrievalGuide';
import LabsPreview from './LabsPreview';

interface IntelligentDashboardProps {
  onNavigate: (view: string) => void;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({ onNavigate }) => {
  const { cognitiveState, userPattern, getOptimalActivity, getAdaptiveMessage, getInterfaceMode } = useCognitiveState();
  const { weaves, getMetrics } = useWeave();
  const [showConversation, setShowConversation] = useState(true);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>([]);
  const [showLabsPreview, setShowLabsPreview] = useState(false);

  const metrics = getMetrics();
  const interfaceMode = getInterfaceMode();
  const optimalActivity = getOptimalActivity();
  const adaptiveMessage = getAdaptiveMessage();

  useEffect(() => {
    detectUpcomingEvents();
    generatePersonalizedInsights();
  }, [weaves, cognitiveState]);

  const detectUpcomingEvents = () => {
    const futureScenarios = weaves.filter(w => 
      w.type === 'future' && 
      w.scheduledFor && 
      w.scheduledFor > new Date() &&
      w.scheduledFor < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    ).sort((a, b) => a.scheduledFor!.getTime() - b.scheduledFor!.getTime());

    setUpcomingEvents(futureScenarios);
  };

  const generatePersonalizedInsights = () => {
    const insights = [];
    
    if (userPattern.consistencyScore > 80) {
      insights.push("🔥 Amazing consistency! You're building a powerful memory habit.");
    }
    
    if (userPattern.improvementRate > 10) {
      insights.push("📈 Your recall accuracy improved significantly this week!");
    }
    
    if (cognitiveState.timeOfDay === userPattern.bestTimeForMemory) {
      insights.push("⭐ Perfect timing! This is when your memory works best.");
    }
    
    if (weaves.length > 10 && metrics.avgCoherenceScore > 85) {
      insights.push("🧠 You're developing expert-level memory skills!");
    }

    setPersonalizedInsights(insights);
  };

  const getTimeIcon = () => {
    switch (cognitiveState.timeOfDay) {
      case 'morning': return Sunrise;
      case 'afternoon': return Coffee;
      case 'evening': return Star;
      case 'night': return Moon;
    }
  };

  const getFlowStateColor = () => {
    switch (cognitiveState.flowState) {
      case 'peak': return 'emerald';
      case 'focused': return 'blue';
      case 'building': return 'yellow';
      case 'disrupted': return 'red';
    }
  };

  const TimeIcon = getTimeIcon();
  const flowColor = getFlowStateColor();

  // Simplified interface for low cognitive states
  if (interfaceMode === 'simple') {
    return (
      <div className="space-y-6">
        {/* Gentle State Indicator */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Take it easy</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            I notice you might be feeling stressed or tired. Let's start with something gentle.
          </p>
        </div>

        {/* Simple Actions */}
        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={() => setCurrentFocus('breathe')}
            className="w-full p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">2-Minute Breathing</h3>
                <p className="text-sm text-gray-600">Reset your nervous system</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentFocus('capture')}
            className="w-full p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Capture One Moment</h3>
                <p className="text-sm text-gray-600">Something good from today</p>
              </div>
            </div>
          </button>
        </div>

        {currentFocus === 'breathe' && <CognitiveRegulationTools onComplete={() => setCurrentFocus(null)} />}
        {currentFocus === 'capture' && <AdaptiveMemoryCapture onComplete={() => setCurrentFocus(null)} />}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - ADHD Focus */}
      <div className="text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Struggling with <span className="text-red-600">Focus & Attention</span>?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Get immediate relief with evidence-based ADHD support. Build sustained attention, working memory, 
            and executive function with tools designed by cognitive scientists.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => onNavigate('adhd')}
              className="group bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-200 hover:shadow-2xl transform hover:scale-105"
            >
              🧠 Start ADHD Support Now
            </button>
            <p className="text-lg text-emerald-600 font-semibold">
              ✨ 25-40% improvement in sustained attention • Research-backed
            </p>
          </div>
        </div>
      </div>

      {/* Core Features - Marketing Focus */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 p-8 rounded-2xl transition-all duration-200 hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <ArrowRight className="w-6 h-6 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">ADHD Support</h3>
          <p className="text-gray-600 mb-4">Focus, working memory & executive function training</p>
          <div className="text-sm text-blue-600 font-medium">
            🎯 Immediate relief • Evidence-based • 5-25 min sessions
          </div>
        </button>

        <button
          onClick={() => onNavigate('weave')}
          className="group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 p-8 rounded-2xl transition-all duration-200 hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <ArrowRight className="w-6 h-6 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Memory Weaving</h3>
          <p className="text-gray-600 mb-4">Transform moments into rich, multi-sensory memories</p>
          <div className="text-sm text-purple-600 font-medium">
            🌟 5-sense encoding • AI assistance • Clinical quality
          </div>
        </button>

        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-300 p-8 rounded-2xl transition-all duration-200 hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Future Scenarios</h3>
          <p className="text-gray-600 mb-4">Rehearse events with confidence-building techniques</p>
          <div className="text-sm text-emerald-600 font-medium">
            🎯 Mental rehearsal • If-then planning • 2x success rate
          </div>
        </button>

        <button
          onClick={() => onNavigate('training')}
          className="group bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:border-orange-300 p-8 rounded-2xl transition-all duration-200 hover:shadow-xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <ArrowRight className="w-6 h-6 text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Memory Training</h3>
          <p className="text-gray-600 mb-4">Strengthen recall through spaced practice</p>
          <div className="text-sm text-orange-600 font-medium">
            📈 Spaced retrieval • 50% stronger memories • Clinical metrics
          </div>
        </button>
      </div>

      {/* Conversational Interface */}
      {showConversation && (
        <ConversationalInterface
          cognitiveState={cognitiveState}
          upcomingEvents={upcomingEvents}
          onActionSelect={(action) => {
            setCurrentFocus(action);
            setShowConversation(false);
          }}
          onDismiss={() => setShowConversation(false)}
        />
      )}

      {currentFocus === 'capture' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Memory Capture</h1>
          </div>
          <AdaptiveMemoryCapture 
            cognitiveState={cognitiveState}
            onComplete={() => {
              setCurrentFocus(null);
              setShowConversation(true);
            }}
          />
        </div>
      )}

      {currentFocus === 'retrieve' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Memory Retrieval Guide</h1>
          </div>
          <MemoryRetrievalGuide
            cognitiveState={cognitiveState}
            onMemoryRetrieved={(memory) => {
              console.log('Memory retrieved:', memory);
              setCurrentFocus(null);
              setShowConversation(true);
            }}
            onCreateWeave={() => onNavigate('weave')}
          />
        </div>
      )}

      {currentFocus === 'weave' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Multi-Sensory Memory Weaving</h3>
          <p className="text-gray-600 mb-6">Peak cognitive state detected - perfect for rich autobiographical memory formation with 5-sense encoding.</p>
          <button
            onClick={() => onNavigate('weave')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Begin Memory Weaving Session
          </button>
        </div>
      )}

      {currentFocus === 'plan' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Smart Scenario Planning</h1>
          </div>
          <SmartScenarioPlanner
            cognitiveState={cognitiveState}
            upcomingEvents={upcomingEvents}
            onComplete={() => {
              setCurrentFocus(null);
              setShowConversation(true);
            }}
          />
        </div>
      )}

      {currentFocus === 'train' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Intelligent Training Coach</h1>
          </div>
          <IntelligentTrainingCoach
            cognitiveState={cognitiveState}
            userPattern={userPattern}
            onComplete={() => {
              setCurrentFocus(null);
              setShowConversation(true);
            }}
          />
        </div>
      )}

      {currentFocus === 'regulate' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Cognitive State Optimization</h1>
          </div>
          <CognitiveRegulationTools
            cognitiveState={cognitiveState}
            onComplete={() => {
              setCurrentFocus(null);
              setShowConversation(true);
            }}
          />
        </div>
      )}

      {currentFocus === 'sprint' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentFocus(null);
                setShowConversation(true);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Focused Attention Training</h1>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Sustained Concentration</h2>
              <p className="text-gray-600">Train your ability to maintain focus for extended periods</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">How It Works</h3>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• Choose a focus duration (5-25 minutes)</p>
                  <p>• Work on a single task without switching</p>
                  <p>• Track distractions honestly when they occur</p>
                  <p>• Build your attention span gradually over time</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('adhd')}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                Start Focus Training Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adaptive Progress Display */}
      {weaves.length > 0 && interfaceMode !== 'simple' && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.totalWeaves}</div>
                <div className="text-sm text-gray-600">Memories Created</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.avgCoherenceScore}</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{userPattern.consistencyScore.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{cognitiveState.flowState}</div>
                <div className="text-sm text-gray-600">Flow State</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {event.scheduledFor && new Date(event.scheduledFor).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentFocus('plan')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Rehearse
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions - Context Aware */}
      {!currentFocus && (
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentFocus('retrieve')}
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-2xl transition-all duration-200 hover:shadow-xl text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Retrieve Memory</h3>
            <p className="text-white opacity-90">Guided recovery of past experiences</p>
            <div className="mt-3 text-sm text-white opacity-75">
              🧠 Evidence-based cues • Multi-sensory reconstruction
            </div>
          </button>

          <button
            onClick={() => setCurrentFocus('capture')}
            className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-8 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Capture Moment</h3>
            <p className="text-gray-600">Preserve today's meaningful experiences</p>
            <div className="mt-3 text-sm text-gray-500">
              ⭐ Quick capture • Autobiographical coherence
            </div>
          </button>
        </div>
      )}

      {/* Labs Preview Modal */}
      {showLabsPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Eidolon Labs</h2>
                  <p className="text-sm text-gray-600">Revolutionary memory features in development</p>
                </div>
              </div>
              <button
                onClick={() => setShowLabsPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <LabsPreview onClose={() => setShowLabsPreview(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default IntelligentDashboard;