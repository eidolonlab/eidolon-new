import React, { useState, useEffect } from 'react';
import { Brain, Zap, Calendar, Target, Heart, Eye, Sunrise, Coffee, Moon, Star, ArrowRight, Play, CheckCircle, Lightbulb, TrendingUp, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import { useWeave } from '../contexts/WeaveContext';
import ConversationalInterface from './ConversationalInterface';
import AdaptiveMemoryCapture from './AdaptiveMemoryCapture';
import SmartScenarioPlanner from './SmartScenarioPlanner';
import IntelligentTrainingCoach from './IntelligentTrainingCoach';
import CognitiveRegulationTools from './CognitiveRegulationTools';
import MemoryRetrievalGuide from './MemoryRetrievalGuide';

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
    <div className="space-y-8">
      {/* Intelligent Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className={`w-12 h-12 bg-${flowColor}-100 rounded-xl flex items-center justify-center`}>
            <TimeIcon className={`w-6 h-6 text-${flowColor}-600`} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {cognitiveState.timeOfDay.charAt(0).toUpperCase() + cognitiveState.timeOfDay.slice(1)} Flow
            </h2>
            <p className="text-gray-600 capitalize">
              {cognitiveState.flowState} state • {cognitiveState.cognitiveLoad} cognitive load
            </p>
          </div>
        </div>
        
        <div className={`max-w-2xl mx-auto p-6 bg-gradient-to-r from-${flowColor}-50 to-${flowColor}-100 rounded-2xl border border-${flowColor}-200`}>
          <p className="text-lg text-gray-800 mb-4">{adaptiveMessage}</p>
          
          {personalizedInsights.length > 0 && (
            <div className="space-y-2">
              {personalizedInsights.map((insight, index) => (
                <p key={index} className={`text-sm text-${flowColor}-700`}>{insight}</p>
              ))}
            </div>
          )}
        </div>
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

      {/* Core Feature Access - Always Available */}
      {currentFocus === 'scenario' && (
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
            <h1 className="text-2xl font-bold text-gray-900">Future Scenario Studio</h1>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Scenario Rehearsal</h2>
              <p className="text-gray-600">Rehearse upcoming events with confidence-building techniques</p>
            </div>
            <button
              onClick={() => onNavigate('scenario')}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-lg font-medium"
            >
              Open Scenario Studio
            </button>
          </div>
        </div>
      )}

      {currentFocus === 'training' && (
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
            <h1 className="text-2xl font-bold text-gray-900">Memory Training</h1>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Spaced Retrieval Training</h2>
              <p className="text-gray-600">Practice spaced recall to strengthen your memories</p>
            </div>
            <button
              onClick={() => onNavigate('training')}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-lg font-medium"
            >
              Start Training Session
            </button>
          </div>
        </div>
      )}

      {currentFocus === 'adhd' && (
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
            <h1 className="text-2xl font-bold text-gray-900">ADHD Support Center</h1>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ADHD Support Tools</h2>
              <p className="text-gray-600">Build focus, working memory, and executive function</p>
            </div>
            <button
              onClick={() => onNavigate('adhd')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Open ADHD Support Center
            </button>
          </div>
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
        <div className="grid md:grid-cols-4 gap-6">
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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

      {/* Direct navigation fallback for core actions */}
      {!currentFocus && !showConversation && (
        <div className="text-center py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => onNavigate('weave')}
              className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all"
            >
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Memory Weaving</h3>
              <p className="text-sm text-gray-600 mt-1">Create rich memories</p>
            </button>
            
            <button
              onClick={() => onNavigate('scenario')}
              className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all"
            >
              <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Future Scenarios</h3>
              <p className="text-sm text-gray-600 mt-1">Rehearse events</p>
            </button>
            
            <button
              onClick={() => onNavigate('training')}
              className="p-6 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all"
            >
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Memory Training</h3>
              <p className="text-sm text-gray-600 mt-1">Practice recall</p>
            </button>
            
            <button
              onClick={() => onNavigate('adhd')}
              className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all"
            >
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">ADHD Support</h3>
              <p className="text-sm text-gray-600 mt-1">Build focus</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentDashboard;