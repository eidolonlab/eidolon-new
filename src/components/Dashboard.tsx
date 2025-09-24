import React, { useState } from 'react';
import { Plus, Calendar, Brain, TrendingUp, Clock, Target, Award, ChevronRight, Zap, Play, Star, Eye, Users, Shield, Heart, Trophy, Sparkles, MessageSquare, ArrowRight, X, Search, Sunrise, Coffee, Moon, Lightbulb, Beaker, Rocket } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import { useChallenge } from '../contexts/ChallengeContext';
import ConversationalInterface from './ConversationalInterface';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import StoryGraphPreview from './StoryGraphPreview';

interface DashboardProps {
  onNavigate: (view: 'weave' | 'scenario' | 'training' | 'insights' | 'adhd') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const { getUserLevel, getTotalXP, getActiveChallenge } = useChallenge();
  const { cognitiveState } = useCognitiveState();
  const metrics = getMetrics();
  const userLevel = getUserLevel();
  const totalXP = getTotalXP();
  const activeChallenge = getActiveChallenge();
  const [showConversationalAI, setShowConversationalAI] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLabsPreview, setShowLabsPreview] = useState(false);
  
  const recentWeaves = weaves.slice(0, 3);
  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 2);

  // Update time every minute for adaptive flow
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Adaptive flow based on time of day
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

  const getAdaptiveMessage = () => {
    const timeOfDay = getTimeOfDay();
    const { attention, energy, stress } = cognitiveState;
    
    switch (timeOfDay) {
      case 'morning':
        return energy > 70 ? 
          "Good morning! Peak cognitive state detected - ideal for multi-sensory memory weaving." :
          "Morning clarity building - perfect for autobiographical memory capture.";
      case 'afternoon':
        return attention > 70 ?
          "Afternoon focus peak! Optimal for spaced retrieval training or scenario rehearsal." :
          "Steady afternoon state - excellent for memory strengthening through practice.";
      case 'evening':
        return stress < 40 ?
          "Peaceful evening - perfect for reflection and capturing today's meaningful moments." :
          "Busy day? Let's wind down with gentle memory work that supports overnight consolidation.";
      case 'night':
        return "Late night clarity! Quick memory capture before sleep consolidation.";
      default:
        return "Ready to strengthen your memories?";
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
          action: 'adhd',
          title: 'Stress Regulation & Focus',
          description: 'Calm your mind and build attention',
          priority: 10,
          reasoning: 'High stress impairs memory formation - regulation comes first'
        }
      ];
    }
    
    if (timeOfDay === 'morning' && energy > 70 && attention > 70) {
      return [
        {
          action: 'weave',
          title: 'Multi-Sensory Memory Weaving',
          description: 'Peak state for rich memory formation',
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
        action: 'adhd',
        title: 'ADHD Support & Focus Training',
        description: 'Build attention and cognitive control',
        priority: 9,
        reasoning: 'Attention training benefits everyone and adapts to your current state'
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

  const timeOfDay = getTimeOfDay();
  const TimeIcon = getTimeIcon();
  const adaptiveMessage = getAdaptiveMessage();
  const optimalActivities = getOptimalActivities();

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
          
          {optimalActivities.length > 0 && (
            <button
              onClick={() => onNavigate(optimalActivities[0].action as any)}
              className={`inline-flex items-center space-x-3 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all text-lg font-medium shadow-lg ${
                timeOfDay === 'morning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                timeOfDay === 'afternoon' ? 'bg-blue-600 hover:bg-blue-700' :
                timeOfDay === 'evening' ? 'bg-purple-600 hover:bg-purple-700' :
                'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Brain className="w-6 h-6" />
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

      {/* Core Features Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
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
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
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
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Training</h3>
          <p className="text-gray-600 mb-4">Strengthen recall through spaced practice</p>
          <div className="text-sm text-orange-600 font-medium">
            📈 Spaced retrieval • 50% stronger memories • Clinical metrics
          </div>
        </button>
      </div>

      {/* AI Memory Companion */}
      {showConversationalAI && (
        <ConversationalInterface
          cognitiveState={cognitiveState}
          upcomingEvents={upcomingScenarios}
          onActionSelect={(action) => {
            if (action === 'weave') onNavigate('weave');
            else if (action === 'scenario') onNavigate('scenario');
            else if (action === 'training') onNavigate('training');
            else if (action === 'adhd') onNavigate('adhd');
            else if (action === 'capture') onNavigate('weave');
            else if (action === 'train') onNavigate('training');
            else if (action === 'sprint') onNavigate('adhd');
          }}
          onDismiss={() => setShowConversationalAI(false)}
        />
      )}

      {/* Eidolon Labs Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
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

        {/* Phase Roadmap */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">Development Roadmap</h3>
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phase 1 - Foundation</h4>
                    <p className="text-sm text-gray-600">Q4 2025</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-medium">
                  Live
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Memory Weaving', 'Spaced Retrieval', 'ADHD Support', 'Meaningful Wins', 'Anxiety Toolkit'].map(feature => (
                  <span key={feature} className="px-2 py-1 bg-white text-emerald-700 text-xs rounded-full border border-emerald-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phase 2 - Intelligence</h4>
                    <p className="text-sm text-gray-600">Q2 2026</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                  Development
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['StoryGraph', 'Transfer Lab', 'Context-Aware Resurfacing', 'Advanced Analytics'].map(feature => (
                  <span key={feature} className="px-2 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phase 3 - Professional</h4>
                    <p className="text-sm text-gray-600">Q3 2026</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                  Planning
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Coach Protocols', 'Protocol Marketplace', 'Team Features', 'Clinical Integration'].map(feature => (
                  <span key={feature} className="px-2 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phase 4 - AI Enhancement</h4>
                    <p className="text-sm text-gray-600">Q4 2026</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-xs font-medium">
                  Research
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Predictive Memory Analytics', 'Personalized AI Coach', 'Natural Language Interface'].map(feature => (
                  <span key={feature} className="px-2 py-1 bg-white text-indigo-700 text-xs rounded-full border border-indigo-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">StoryGraph</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Visual network of people, places, projects & promises</p>
            <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Phase 2 - Q2 2026</div>
          </div>

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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-900">Join Early Access</h3>
          </div>
          <p className="text-yellow-800 mb-4">
            Be among the first to test revolutionary memory features. Early access users help shape 
            the future of cognitive training and get lifetime benefits.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
              <Brain className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">First Access</div>
              <div className="text-xs text-gray-600">Try features before public release</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
              <Lightbulb className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Shape Development</div>
              <div className="text-xs text-gray-600">Your feedback guides feature design</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
              <Shield className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Lifetime Benefits</div>
              <div className="text-xs text-gray-600">Special pricing and exclusive features</div>
            </div>
          </div>
          <button
            onClick={() => {
              alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!');
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
          >
            Request Early Access
          </button>
        </div>

        {/* Why This Matters */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Eidolon Will Lead the Market</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🧠 Unique Approach</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• <strong>Autobiographical focus:</strong> Real memories, not abstract puzzles</p>
                <p>• <strong>Transfer-first design:</strong> Every feature improves real life</p>
                <p>• <strong>Professional integration:</strong> Built for coaches and therapists</p>
                <p>• <strong>Evidence-based:</strong> Clinical techniques, not gamification</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 Market Differentiation</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• <strong>No direct competitors</strong> in autobiographical memory training</p>
                <p>• <strong>First to offer</strong> personal memory science experiments</p>
                <p>• <strong>Only app</strong> with coach protocol customization</p>
                <p>• <strong>Unique integration</strong> of memory + anxiety + ADHD support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('training')}
          className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Search className="w-6 h-6 text-indigo-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Retrieve Memory</h3>
          <p className="text-gray-600 mb-4">Guided recovery of past experiences</p>
          <div className="text-sm text-indigo-600 font-medium">
            🧠 Evidence-based cues • Multi-sensory reconstruction
          </div>
        </button>

        <button
          onClick={() => onNavigate('weave')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Capture Moment</h3>
          <p className="text-gray-600 mb-4">Preserve today's meaningful experiences</p>
          <div className="text-sm text-emerald-600 font-medium">
            ⭐ Quick capture • Autobiographical coherence
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;