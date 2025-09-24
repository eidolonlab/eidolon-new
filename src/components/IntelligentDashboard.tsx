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

  const getOptimalActivities = () => {
    const timeOfDay = getTimeOfDay();
    const { attention, energy, stress } = cognitiveState;
    
    if (timeOfDay === 'night') {
      return [
        {
          action: 'capture',
          title: 'Gentle Memory Capture',
          description: 'Preserve today\'s moments before sleep',
          priority: 10,
          reasoning: 'Night time is optimal for gentle reflection and memory consolidation preparation'
        }
      ];
    }
    
    if (stress > 60) {
      return [
        {
          action: 'regulate',
          title: 'Memory State Optimization',
          description: 'Calm your mind for better encoding',
          priority: 10,
          reasoning: 'High stress impairs memory formation - regulation comes first'
        }
      ];
    }
    
    if (timeOfDay === 'morning' && energy > 70 && attention > 70) {
      return [
        {
          action: 'retrieve',
          title: 'Guided Memory Retrieval',
          description: 'Peak state for memory reconstruction',
          priority: 9,
          reasoning: 'Morning cortisol and high attention create optimal encoding conditions'
        },
        {
          action: 'adhd',
          title: 'Advanced Focus Training',
          description: 'Build sustained attention capacity',
          priority: 8,
          reasoning: 'High energy state perfect for challenging attention exercises'
        }
      ];
    }
    
    return [
      {
        action: 'retrieve',
        title: 'Guided Memory Retrieval',
        description: 'Recover forgotten experiences',
        priority: 9,
        reasoning: 'Evidence-based cues help reconstruct autobiographical memories'
      },
      {
        action: 'capture',
        title: 'Memory Capture',
        description: 'Preserve meaningful moments',
        priority: 7,
        reasoning: 'Always beneficial for autobiographical memory strength'
      }
    ];
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Memory State Optimization</h1>
        </div>
        <CognitiveRegulationTools
          cognitiveState={cognitiveState}
          onComplete={() => setFocusedActivity(null)}
        />
      </div>
    );
  }

  const timeOfDay = getTimeOfDay();
  const TimeIcon = getTimeIcon();
  const adaptiveMessage = getAdaptiveMessage();
  const optimalActivities = getOptimalActivities();
  const progressiveLayer = getProgressiveLayer();

  return (
    <div className="space-y-8">
      {/* Layer 1: Essential - Always Visible */}
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
          
          {optimalActivities.length > 0 && (
            <button
              onClick={() => setFocusedActivity(optimalActivities[0].action)}
              className={`inline-flex items-center space-x-3 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all text-lg font-medium shadow-lg ${
                timeOfDay === 'morning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                timeOfDay === 'afternoon' ? 'bg-blue-600 hover:bg-blue-700' :
                timeOfDay === 'evening' ? 'bg-purple-600 hover:bg-purple-700' :
                'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Search className="w-6 h-6" />
              <span>{optimalActivities[0].title}</span>
            </button>
          )}
          
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

      {/* AI Memory Companion */}
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

      {/* Layer 2: Contextual - Appears when relevant */}
      {progressiveLayer >= 2 && (
        <div className="grid md:grid-cols-4 gap-6">
          <button
            onClick={() => onNavigate('adhd')}
            className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <Play className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ADHD Support</h3>
            <p className="text-gray-600 mb-4">Focus, working memory & executive function training</p>
            <div className="text-sm text-blue-600 font-medium">
              🎯 Immediate relief • Evidence-based • 5-25 min sessions
            </div>
          </button>

          <button
            onClick={() => onNavigate('weave')}
            className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <Play className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Weaving</h3>
            <p className="text-gray-600 mb-4">Transform moments into rich, multi-sensory memories</p>
            <div className="text-sm text-indigo-600 font-medium">
              🌟 5-sense encoding • AI assistance • Clinical quality
            </div>
          </button>

          <button
            onClick={() => onNavigate('scenario')}
            className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <Play className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Future Scenarios</h3>
            <p className="text-gray-600 mb-4">Rehearse events with confidence-building techniques</p>
            <div className="text-sm text-emerald-600 font-medium">
              🎯 Mental rehearsal • If-then planning • 2x success rate
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
              <Play className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Training</h3>
            <p className="text-gray-600 mb-4">Strengthen recall through spaced practice</p>
            <div className="text-sm text-orange-600 font-medium">
              📈 Spaced retrieval • 50% stronger memories • Clinical metrics
            </div>
          </button>
        </div>
      )}

      {/* Quick Actions - Always Available */}
      <div className="grid md:grid-cols-2 gap-6">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Retrieve Memory</h3>
          <p className="text-gray-600 mb-4">Guided recovery of past experiences</p>
          <div className="text-sm text-indigo-600 font-medium">
            🧠 Evidence-based cues • Multi-sensory reconstruction
          </div>
        </button>

        <button
          onClick={() => setFocusedActivity('capture')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Capture Moment</h3>
          <p className="text-gray-600 mb-4">Preserve today's meaningful experiences</p>
          <div className="text-sm text-emerald-600 font-medium">
            ⭐ Quick capture • Autobiographical coherence
          </div>
        </button>
      </div>

      {/* AI Memory Companion - Show by default, hide Eidolon Labs when open */}
      {!showConversationalAI ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI Memory Companion</h3>
                <p className="text-sm text-gray-600">Personalized recommendations based on your state</p>
              </div>
            </div>
            <button
              onClick={() => setShowConversationalAI(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Message */}
          <div className="text-center mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-900 font-medium text-lg">
              {timeOfDay === 'morning' ? 'Morning clarity is building!' :
               timeOfDay === 'afternoon' ? 'Afternoon focus is looking good!' :
               timeOfDay === 'evening' ? 'Evening reflection time!' :
               'Night time for gentle memory work!'}
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-4 mb-8">
            <h4 className="font-medium text-gray-900 text-lg">Recommended for you right now:</h4>
            
            {optimalActivities.slice(0, 3).map((activity, index) => {
              const icons = {
                adhd: Shield,
                capture: Star,
                retrieve: Search,
                train: Target,
                regulate: Heart,
                plan: Calendar
              };
              const ActionIcon = icons[activity.action as keyof typeof icons] || Brain;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (['weave', 'scenario', 'training', 'adhd'].includes(activity.action)) {
                      onNavigate(activity.action as any);
                    } else {
                      setFocusedActivity(activity.action);
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <ActionIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Priority: {activity.priority}/10</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`🧠 AI Reasoning:\n\n${activity.reasoning}`);
                          }}
                          className="text-indigo-600 hover:text-indigo-700 underline"
                        >
                          Why?
                        </button>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* All Features Available */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">All Features Available</h4>
              <span className="text-xs text-gray-500">Access anytime, optimized for your state</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('scenario')}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">Future scenario rehearsal</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Mental rehearsal with implementation intentions</p>
              </button>

              <button
                onClick={() => onNavigate('training')}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Target className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">Memory training</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Evidence-based retrieval training</p>
              </button>

              <button
                onClick={() => onNavigate('adhd')}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">ADHD support</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Attention and cognitive control training</p>
              </button>

              <button
                onClick={() => onNavigate('weave')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">Memory weaving</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Transform moments into vivid memories</p>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              💡 Recommendations above are optimized for your current state, but all features work anytime
            </p>
          </div>
        </div>
      ) : null}

      {/* Layer 3: Advanced - Eidolon Labs */}
      {progressiveLayer >= 3 && showConversationalAI && (
        <div className="text-center">
          <button
            onClick={() => setShowLabsDetails(!showLabsDetails)}
            className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <Beaker className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">Eidolon Labs</div>
                <div className="text-purple-100 text-sm">6 revolutionary features in development</div>
              </div>
              <ArrowRight className={`w-5 h-5 transition-transform ${showLabsDetails ? 'rotate-90' : ''}`} />
            </div>
          </button>
          
          {showLabsDetails && (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eidolon Labs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Peek behind the curtain at revolutionary memory features in development. 
                  These innovations will set Eidolon apart from every competitor in the cognitive training space.
                </p>
              </div>

              {/* Competitive Advantage Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-indigo-900">Our Competitive Edge</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-white rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-900 mb-1">🧠 Narrative-Based Cognition</div>
                    <div className="text-indigo-700">Autobiographical memory vs. abstract puzzles</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-900 mb-1">🎯 Real-Life Transfer</div>
                    <div className="text-indigo-700">Meaningful wins vs. game scores</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-900 mb-1">👥 Professional Integration</div>
                    <div className="text-indigo-700">Coach protocols vs. solo training</div>
                  </div>
                </div>
              </div>

              {/* Revolutionary Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setShowStoryGraphModal(true)}
                  className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">StoryGraph</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Interactive memory network visualization</p>
                  <div className="text-xs text-purple-600 font-medium">🚀 Revolutionary • Click to preview</div>
                </button>

                <div className="p-4 bg-white rounded-lg border border-purple-200 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Memory Insights</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">AI-powered pattern recognition in your memories</p>
                  <div className="text-xs text-purple-600 font-medium">🧠 Deep learning • Q2 2024</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Predictive Coaching</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Anticipate memory challenges before they occur</p>
                  <div className="text-xs text-purple-600 font-medium">🔮 Predictive AI • Q3 2024</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Memory Lens</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">AR overlay for real-world memory enhancement</p>
                  <div className="text-xs text-purple-600 font-medium">🥽 AR/VR • 2025</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Biometric Sync</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Heart rate, sleep, stress integration</p>
                  <div className="text-xs text-purple-600 font-medium">📱 Wearables • Q4 2024</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-purple-200 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Neural Feedback</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">EEG-guided memory training optimization</p>
                  <div className="text-xs text-purple-600 font-medium">🧠 Neurofeedback • 2025</div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-800">
                  <Clock className="w-4 h-4" />
                  <span>6 features • 18 months development • $2M+ investment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* StoryGraph Modal */}
      {showStoryGraphModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">StoryGraph - Interactive Preview</h2>
              <button
                onClick={() => setShowStoryGraphModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <StoryGraphPreview
                onEarlyAccess={() => {
                  alert('🎉 StoryGraph Early Access Interest Recorded!\n\nWe\'ll notify you when this revolutionary feature becomes available for testing. Thank you for your interest in the future of memory training!');
                  setShowStoryGraphModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentDashboard;