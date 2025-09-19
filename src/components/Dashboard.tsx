import React, { useState } from 'react';
import { Plus, Calendar, Brain, TrendingUp, Clock, Target, Award, ChevronRight, Zap, Play, Star, Eye, Users, Shield } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import { useChallenge } from '../contexts/ChallengeContext';
import DailyMemoryMoments from './DailyMemoryMoments';
import ProgressiveChallenges from './ProgressiveChallenges';
import RealWorldImpactTracker from './RealWorldImpactTracker';
import CognitiveStateOptimizer from './CognitiveStateOptimizer';
import ProfileInsights from './ProfileInsights';

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
                <div className="text-2xl font-bold text-gray-900">{metrics.avgCoherenceScore}</div>
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
                  <div key={weave.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      weave.type === 'past' ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{weave.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">"{weave.seed}"</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Score: {weave.coherenceScore}</span>
                        <span>•</span>
                        <span>{formatDate(weave.createdAt)}</span>
                      </div>
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
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <button
                  onClick={() => onNavigate('scenario')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{scenario.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">"{scenario.seed}"</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Scheduled: {scenario.scheduledFor ? formatDate(scenario.scheduledFor) : 'Not set'}</span>
                        {scenario.ifThenPlans && scenario.ifThenPlans.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{scenario.ifThenPlans.length} plan{scenario.ifThenPlans.length !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Progress - Only show if user has activity */}
      {metrics.weeklyProgress.some(day => day > 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">This Week's Progress</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{metrics.weeklyProgress.reduce((sum, day) => sum + day, 0)} sessions</span>
            </div>
          </div>
          
          <div className="flex items-end space-x-2 h-24">
            {metrics.weeklyProgress.map((sessions, index) => {
              const maxSessions = Math.max(...metrics.weeklyProgress, 1);
              const height = (sessions / maxSessions) * 100;
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayIndex = (new Date().getDay() - 6 + index + 7) % 7;
              const isToday = index === 6;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '80px' }}>
                    <div
                      className={`rounded-t-lg transition-all duration-300 ${
                        isToday 
                          ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                          : 'bg-gradient-to-t from-indigo-500 to-indigo-400'
                      }`}
                      style={{ height: `${height}%`, position: 'absolute', bottom: 0, width: '100%' }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-center">
                    <div className={`font-medium ${isToday ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {dayNames[dayIndex]}
                    </div>
                    <div className="text-gray-500">{sessions}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-World Impact - Show value */}
      <RealWorldImpactTracker />

      {/* Cognitive State Optimizer - Advanced Feature */}
      {weaves.length >= 3 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cognitive Optimization</h3>
                <p className="text-sm text-gray-600">AI-powered cognitive state management</p>
              </div>
            </div>
            <button
              onClick={() => setShowCognitiveOptimizer(!showCognitiveOptimizer)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showCognitiveOptimizer ? 'Hide' : 'Optimize'}
            </button>
          </div>
          
          {showCognitiveOptimizer && (
            <CognitiveStateOptimizer
              onStateChange={setCognitiveState}
              onOptimizationRecommendation={(rec) => {
                console.log('Cognitive optimization:', rec);
              }}
            />
          )}
          
          {cognitiveState && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-indigo-600">{cognitiveState.overallOptimization?.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Optimization</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-purple-600">{cognitiveState.attention?.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Attention</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-pink-600">{cognitiveState.workingMemory?.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Working Memory</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Getting Started Guide - For new users */}
      {weaves.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Eidolon!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Evidence-based memory training that strengthens your mind and builds confidence for life's important moments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Create Rich Memories</h4>
              <p className="text-sm text-gray-600">Use all five senses to build stronger, more vivid memories</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Practice Retrieval</h4>
              <p className="text-sm text-gray-600">Strengthen memories through spaced practice sessions</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Plan Success</h4>
              <p className="text-sm text-gray-600">Rehearse future scenarios to build unshakeable confidence</p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Features - Only for experienced users */}
      {weaves.length >= 5 && retrievalSessions.length >= 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Features</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Unlocked</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('insights')}
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all"
            >
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Memory Insights</div>
                <div className="text-sm text-gray-600">AI analysis of your patterns</div>
              </div>
            </button>
            
            <ProfileInsights />
          </div>
        </div>
      )}

      {/* Training Profile Analytics - Show if user has created profiles */}
      {(localStorage.getItem('eidolon-focus-profiles') || 
        localStorage.getItem('eidolon-memory-profiles') || 
        localStorage.getItem('eidolon-scenario-profiles')) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Training Profile Analytics</h3>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Wellness Tracking</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Focus Profiles</span>
              </div>
              <div className="text-sm text-blue-800">
                {JSON.parse(localStorage.getItem('eidolon-focus-profiles') || '[]').length} active profiles
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">Memory Profiles</span>
              </div>
              <div className="text-sm text-indigo-800">
                {JSON.parse(localStorage.getItem('eidolon-memory-profiles') || '[]').length} active profiles
              </div>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-900">Scenario Profiles</span>
                </div>
                <div className="text-sm text-emerald-800">
                  {JSON.parse(localStorage.getItem('eidolon-scenario-profiles') || '[]').length} active profiles
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-800">Wellness & Fitness Focus</span>
            </div>
            <p className="text-xs text-green-700">
              Training profiles are for <strong>cognitive fitness and skill building</strong> - similar to having different workout routines. 
              This is not medical testing and makes no health claims.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;