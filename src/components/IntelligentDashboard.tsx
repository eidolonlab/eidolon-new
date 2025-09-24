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
      {/* AI Memory Companion */}
      {!showConversationalAI ? (
        <div className="text-center">
          <button
            onClick={() => setShowConversationalAI(true)}
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">AI Memory Companion</div>
                <div className="text-indigo-100 text-sm">Personalized recommendations based on your state</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      ) : (
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

      {/* AI Memory Companion */}
      {!showConversationalAI ? (
        <div className="text-center">
          <button
            onClick={() => setShowConversationalAI(true)}
            className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">AI Memory Companion</div>
                <div className="text-indigo-100 text-sm">Personalized recommendations based on your state</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      ) : (
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