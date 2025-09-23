import React, { useState } from 'react';
import { Plus, Calendar, Brain, TrendingUp, Clock, Target, Award, ChevronRight, Zap, Play, Star, Eye, Users, Shield, Heart, Trophy } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import { useChallenge } from '../contexts/ChallengeContext';
import DailyMemoryMoments from './DailyMemoryMoments';
import ProgressiveChallenges from './ProgressiveChallenges';
import RealWorldImpactTracker from './RealWorldImpactTracker';
import CognitiveStateOptimizer from './CognitiveStateOptimizer';
import ProfileInsights from './ProfileInsights';
import StoryGraph from './StoryGraph';
import FocusSprints from './FocusSprints';
import AnxietyRegulationToolkit from './AnxietyRegulationToolkit';
import TransferLab from './TransferLab';
import MeaningfulWinsTracker from './MeaningfulWinsTracker';

interface DashboardProps {
  onNavigate: (view: 'weave' | 'scenario' | 'training' | 'insights' | 'adhd') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const { getUserLevel, getTotalXP, getActiveChallenge } = useChallenge();
  const metrics = getMetrics();
  const userLevel = getUserLevel();
  const totalXP = getTotalXP();
  const activeChallenge = getActiveChallenge();
  const [showCognitiveOptimizer, setShowCognitiveOptimizer] = useState(false);
  const [cognitiveState, setCognitiveState] = useState<any>(null);
  const [showStoryGraph, setShowStoryGraph] = useState(false);
  const [showFocusSprints, setShowFocusSprints] = useState(false);
  const [showAnxietyToolkit, setShowAnxietyToolkit] = useState(false);
  const [showTransferLab, setShowTransferLab] = useState(false);
  const [showMeaningfulWins, setShowMeaningfulWins] = useState(false);
  
  const recentWeaves = weaves.slice(0, 3);
  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 2);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getNextRecommendation = () => {
    // Smart recommendation based on user state
    if (weaves.length === 0) {
      return {
        title: "Create your first memory",
        description: "Start with a simple, positive memory from recent days",
        action: () => onNavigate('weave'),
        icon: Plus,
        color: 'indigo'
      };
    }
    
    if (weaves.length > 0 && retrievalSessions.length === 0) {
      return {
        title: "Practice memory retrieval",
        description: "Strengthen your memories through spaced practice",
        action: () => onNavigate('training'),
        icon: Brain,
        color: 'emerald'
      };
    }
    
    if (weaves.filter(w => w.type === 'future').length === 0) {
      return {
        title: "Plan a future scenario",
        description: "Rehearse an upcoming event to build confidence",
        action: () => onNavigate('scenario'),
        icon: Calendar,
        color: 'blue'
      };
    }
    
    // Default recommendation for active users
    const oldestWeave = weaves
      .filter(w => w.type === 'past')
      .sort((a, b) => (a.lastRetrieved?.getTime() || 0) - (b.lastRetrieved?.getTime() || 0))[0];
    
    if (oldestWeave) {
      return {
        title: `Practice "${oldestWeave.title}"`,
        description: "This memory is ready for retrieval training",
        action: () => onNavigate('training'),
        icon: Target,
        color: 'orange'
      };
    }
    
    return {
      title: "View your insights",
      description: "See patterns and progress in your memory training",
      action: () => onNavigate('insights'),
      icon: TrendingUp,
      color: 'purple'
    };
  };

  const recommendation = getNextRecommendation();
  const RecommendationIcon = recommendation.icon;

  return (
    <div className="space-y-8">
      {/* Welcome & Smart Recommendation */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back to your memory journey
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Build richer memories, rehearse future scenarios, and track your cognitive progress.
        </p>
        
        {/* Smart Next Action */}
        <div className={`max-w-md mx-auto p-6 bg-gradient-to-r from-${recommendation.color}-500 to-${recommendation.color}-600 text-white rounded-2xl`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <RecommendationIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">{recommendation.title}</h3>
              <p className="text-sm opacity-90">{recommendation.description}</p>
            </div>
          </div>
          <button
            onClick={recommendation.action}
            className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-medium transition-all"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Core Actions - Simplified */}
      <div className="grid md:grid-cols-4 gap-6">
        <button
          onClick={() => onNavigate('weave')}
          className="group bg-white border-2 border-gray-200 hover:border-indigo-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memory Weave</h3>
          <p className="text-gray-600 text-left">Transform simple moments into rich, multi-sensory memories</p>
        </button>

        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Future Scenario</h3>
          <p className="text-gray-600 text-left">Rehearse upcoming events with confidence-building techniques</p>
        </button>

        <button
          onClick={() => onNavigate('training')}
          className="group bg-white border-2 border-gray-200 hover:border-orange-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Brain className="w-6 h-6 text-orange-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Training</h3>
          <p className="text-gray-600 text-left">Practice spaced recall to strengthen your memories</p>
        </button>
        
        <button
          onClick={() => onNavigate('adhd')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">ADHD Support</h3>
          <p className="text-gray-600 text-left">Build focus, working memory, and executive function</p>
        </button>
      </div>

      {/* Key Metrics - Simplified */}
      {weaves.length > 0 && (
        <div className="grid md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.totalWeaves}</div>
                <div className="text-sm text-gray-600">Memories</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.avgQualityScore}%</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.avgRecallLatency > 0 ? `${(metrics.avgRecallLatency / 1000).toFixed(1)}s` : '—'}
                </div>
                <div className="text-sm text-gray-600">Recall Speed</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">L{userLevel}</div>
                <div className="text-sm text-gray-600">{totalXP} XP</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Active Challenge Banner */}
      {activeChallenge && (
        <div className={`bg-gradient-to-r from-${activeChallenge.color}-500 to-${activeChallenge.color}-600 text-white rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Active Challenge: {activeChallenge.title}</h3>
                <p className="text-sm opacity-90">{activeChallenge.progressMessage}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">+{activeChallenge.rewards.xp}</div>
              <div className="text-sm opacity-75">XP Reward</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Daily Memory Moments - Core Feature */}
      <DailyMemoryMoments />
      
      {/* Progressive Challenges - Engagement Driver */}
      <ProgressiveChallenges />

      {/* Recent Activity - Only if user has content */}
      {(recentWeaves.length > 0 || upcomingScenarios.length > 0) && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Weaves */}
          {recentWeaves.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Memories</h3>
                <button
                  onClick={() => onNavigate('insights')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View insights
                </button>
              </div>
              
              <div className="space-y-4">
                {recentWeaves.map((weave) => (
                  <div key={weave.id} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{weave.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(weave.createdAt)} • {weave.type === 'past' ? 'Memory' : 'Scenario'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (weave.qualityScore || 0) / 20
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Scenarios */}
          {upcomingScenarios.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Scenarios</h3>
                <button
                  onClick={() => onNavigate('scenario')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Plan more
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{scenario.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {scenario.scheduledFor && formatDate(scenario.scheduledFor)} • Ready to practice
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('training')}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-World Impact Tracker */}
      <RealWorldImpactTracker />

      {/* Advanced Tools - Conditional Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cognitive State Optimizer */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cognitive State</h3>
            </div>
            <button
              onClick={() => setShowCognitiveOptimizer(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Optimize your mental state for peak memory performance
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last check: 2h ago</span>
            <span className="text-green-600 font-medium">Optimal</span>
          </div>
        </div>

        {/* Story Graph */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Story Graph</h3>
            </div>
            <button
              onClick={() => setShowStoryGraph(true)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Visualize connections between your memories and experiences
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{weaves.length} memories mapped</span>
            <span className="text-purple-600 font-medium">View network</span>
          </div>
        </div>

        {/* Focus Sprints */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Focus Sprints</h3>
            </div>
            <button
              onClick={() => setShowFocusSprints(true)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Play className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Structured attention training for ADHD support
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Next: 25min session</span>
            <span className="text-orange-600 font-medium">Start now</span>
          </div>
        </div>

        {/* Anxiety Regulation Toolkit */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Anxiety Toolkit</h3>
            </div>
            <button
              onClick={() => setShowAnxietyToolkit(true)}
              className="text-green-600 hover:text-green-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Evidence-based techniques for managing anxiety and stress
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>5 techniques available</span>
            <span className="text-green-600 font-medium">Practice</span>
          </div>
        </div>

        {/* Transfer Lab */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Transfer Lab</h3>
            </div>
            <button
              onClick={() => setShowTransferLab(true)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Apply memory skills to real-world challenges and goals
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>3 active transfers</span>
            <span className="text-indigo-600 font-medium">Explore</span>
          </div>
        </div>

        {/* Meaningful Wins Tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Meaningful Wins</h3>
            </div>
            <button
              onClick={() => setShowMeaningfulWins(true)}
              className="text-yellow-600 hover:text-yellow-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Track and celebrate your personal growth and achievements
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>12 wins recorded</span>
            <span className="text-yellow-600 font-medium">Add win</span>
          </div>
        </div>
      </div>

      {/* Profile Insights - Always visible for engaged users */}
      {weaves.length >= 5 && <ProfileInsights />}

      {/* Modal Components */}
      {showCognitiveOptimizer && (
        <CognitiveStateOptimizer
          onClose={() => setShowCognitiveOptimizer(false)}
          onStateChange={setCognitiveState}
        />
      )}

      {showStoryGraph && (
        <StoryGraph
          weaves={weaves}
          onClose={() => setShowStoryGraph(false)}
        />
      )}

      {showFocusSprints && (
        <FocusSprints
          onClose={() => setShowFocusSprints(false)}
        />
      )}

      {showAnxietyToolkit && (
        <AnxietyRegulationToolkit
          onClose={() => setShowAnxietyToolkit(false)}
        />
      )}

      {showTransferLab && (
        <TransferLab
          onClose={() => setShowTransferLab(false)}
        />
      )}

      {showMeaningfulWins && (
        <MeaningfulWinsTracker
          onClose={() => setShowMeaningfulWins(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;