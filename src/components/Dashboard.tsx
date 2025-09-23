import React, { useState } from 'react';
import { Plus, Calendar, Brain, TrendingUp, Clock, Target, Award, ChevronRight, Zap, Play, Star, Eye, Users, Shield, Heart, Trophy, Sparkles, MessageSquare, ArrowRight, X, Search } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import { useChallenge } from '../contexts/ChallengeContext';
import ConversationalInterface from './ConversationalInterface';
import { useCognitiveState } from '../contexts/CognitiveStateContext';

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
  
  const recentWeaves = weaves.slice(0, 3);
  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      {/* ADHD Support Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Struggling with Focus & Attention?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Get immediate relief with evidence-based ADHD support. Build sustained attention, working memory, 
            and executive function with tools designed by cognitive scientists.
          </p>
          
          <button
            onClick={() => onNavigate('adhd')}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-lg font-medium shadow-lg hover:shadow-xl"
          >
            <Brain className="w-6 h-6" />
            <span>Start ADHD Support Now</span>
          </button>
          
          <div className="mt-4 text-sm text-blue-700">
            <span className="font-medium">✨ 25-40% improvement in sustained attention • Research-backed</span>
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
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eidolon Labs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Peek behind the curtain at revolutionary memory features in development. 
            These innovations will set Eidolon apart from every competitor in the cognitive training space.
          </p>
        </div>

        {/* Phase Roadmap */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-700">1</span>
              </div>
              <span className="font-semibold text-emerald-900">Phase 1 - Foundation</span>
            </div>
            <div className="text-sm text-emerald-800 mb-2">Q4 2025 - Live Now</div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-700 bg-white rounded px-2 py-1">Memory Weaving</div>
              <div className="text-xs text-emerald-700 bg-white rounded px-2 py-1">Spaced Retrieval</div>
              <div className="text-xs text-emerald-700 bg-white rounded px-2 py-1">ADHD Support</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700">2</span>
              </div>
              <span className="font-semibold text-blue-900">Phase 2 - Intelligence</span>
            </div>
            <div className="text-sm text-blue-800 mb-2">Q2 2026</div>
            <div className="space-y-1">
              <div className="text-xs text-blue-700 bg-white rounded px-2 py-1">StoryGraph</div>
              <div className="text-xs text-blue-700 bg-white rounded px-2 py-1">Transfer Lab</div>
              <div className="text-xs text-blue-700 bg-white rounded px-2 py-1">Context-Aware AI</div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-purple-700">3</span>
              </div>
              <span className="font-semibold text-purple-900">Phase 3 - Professional</span>
            </div>
            <div className="text-sm text-purple-800 mb-2">Q3 2026</div>
            <div className="space-y-1">
              <div className="text-xs text-purple-700 bg-white rounded px-2 py-1">Coach Protocols</div>
              <div className="text-xs text-purple-700 bg-white rounded px-2 py-1">Team Features</div>
              <div className="text-xs text-purple-700 bg-white rounded px-2 py-1">Clinical Integration</div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-700">4</span>
              </div>
              <span className="font-semibold text-indigo-900">Phase 4 - AI Enhancement</span>
            </div>
            <div className="text-sm text-indigo-800 mb-2">Q4 2026</div>
            <div className="space-y-1">
              <div className="text-xs text-indigo-700 bg-white rounded px-2 py-1">Predictive Analytics</div>
              <div className="text-xs text-indigo-700 bg-white rounded px-2 py-1">AI Coach</div>
              <div className="text-xs text-indigo-700 bg-white rounded px-2 py-1">Natural Language</div>
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
            <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Phase 1 - Live Now</div>
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
            <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Phase 1 - Live Now</div>
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

        {/* Early Access CTA */}
        <div className="text-center">
          <button
            onClick={() => alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg"
          >
            🚀 Request Early Access to Labs Features
          </button>
          <p className="text-sm text-gray-600 mt-3">
            Be among the first to test revolutionary memory features and help shape the future of cognitive training
          </p>
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