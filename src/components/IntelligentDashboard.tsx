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

      {/* Layer 3: Advanced - Eidolon Labs */}
      {progressiveLayer >= 3 && (
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
                  <p className="text-sm text-gray-600 mb-2">Visual network of people, places, projects & promises</p>
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
                  <div className="text-xs text-purple-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for interactive demo →
                  </div>
                </button>

                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-gray-900">Transfer Lab</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">N-of-1 experiments to prove what works for you</p>
                  <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Meaningful Wins</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Track real-world outcomes instead of abstract scores</p>
                  <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Coach Protocols</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Drag-and-drop protocol builder for professionals</p>
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Phase 3 - Q3 2026</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Anxiety Regulation</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">60-120 second acute relief + preventive tools</p>
                  <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Predictive Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">AI-powered memory performance forecasting</p>
                  <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Phase 4 - Q4 2026</div>
                </div>
              </div>

              {/* Early Access Signup */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-yellow-900">Join Early Access</h3>
                </div>
                <p className="text-yellow-800 mb-4">
                  Be among the first to test revolutionary memory features. Early access users help shape 
                  the future of cognitive training and get lifetime benefits.
                </p>
                <button
                  onClick={() => {
                    alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!');
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
                >
                  Request Early Access
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Eidolon Labs - Hidden Feature Preview */}
      {!showConversationalAI && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eidolon Labs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Revolutionary memory features in development. These innovations will set Eidolon apart from every competitor.
            </p>
          </div>

          {/* Revolutionary Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => {
                // Show StoryGraph modal
                alert('🧠 StoryGraph Preview\n\nVisual network of people, places, projects & promises. No competitor offers autobiographical memory mapping!\n\nInteractive demo coming soon...');
              }}
              className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">StoryGraph</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Visual network of people, places, projects & promises</p>
              <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
            </button>

            <div className="p-4 bg-white rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900">Transfer Lab</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">N-of-1 experiments to prove what works for you</p>
              <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Meaningful Wins</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Track real-world outcomes instead of abstract scores</p>
              <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Coach Protocols</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Drag-and-drop protocol builder for professionals</p>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Phase 3 - Q3 2026</div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Anxiety Regulation</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">60-120 second acute relief + preventive tools</p>
              <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-900">Predictive Analytics</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">AI-powered memory performance forecasting</p>
              <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Phase 4 - Q4 2026</div>
            </div>
          </div>

          {/* Early Access Signup */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-semibold text-yellow-900">Join Early Access</h3>
            </div>
            <p className="text-yellow-800 mb-4">
              Be among the first to test revolutionary memory features. Early access users help shape 
              the future of cognitive training and get lifetime benefits.
            </p>
            <button
              onClick={() => {
                alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!');
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
            >
              Request Early Access
            </button>
          </div>
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

      {/* Eidolon Labs - Hidden Feature Preview */}
      {!showConversationalAI && (
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
                  Revolutionary memory features in development. These innovations will set Eidolon apart from every competitor.
                </p>
              </div>

              {/* Revolutionary Features Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setShowStoryGraphModal(true)}
                  className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">StoryGraph</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Visual network of people, places, projects & promises</p>
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
                  <div className="text-xs text-purple-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for interactive demo →
                  </div>
                </button>

                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-gray-900">Transfer Lab</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">N-of-1 experiments to prove what works for you</p>
                  <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Meaningful Wins</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Track real-world outcomes instead of abstract scores</p>
                  <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Coach Protocols</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Drag-and-drop protocol builder for professionals</p>
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Phase 3 - Q3 2026</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Anxiety Regulation</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">60-120 second acute relief + preventive tools</p>
                  <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Phase 1 - Available Now</div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">Predictive Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">AI-powered memory performance forecasting</p>
                  <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Phase 4 - Q4 2026</div>
                </div>
              </div>

              {/* Early Access Signup */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-yellow-900">Join Early Access</h3>
                </div>
                <p className="text-yellow-800 mb-4">
                  Be among the first to test revolutionary memory features. Early access users help shape 
                  the future of cognitive training and get lifetime benefits.
                </p>
                <button
                  onClick={() => {
                    alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!');
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
                >
                  Request Early Access
                </button>
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