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