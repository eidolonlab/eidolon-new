import React, { useState, useEffect } from 'react';
import { Users, Heart, TrendingUp, Clock, Target, Award, Lightbulb, Calendar, Star, Brain, Activity, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

interface ChildProgress {
  childName: string;
  age: number;
  baselineAttentionSpan: number;
  currentAttentionSpan: number;
  totalSessions: number;
  weeklyGoal: number;
  weeklyProgress: number;
  improvementRate: number;
  challengeAreas: string[];
  strengths: string[];
  realWorldTransfer: Array<{
    activity: string;
    beforeRating: number;
    afterRating: number;
    notes: string;
  }>;
}

interface ParentCoachingDashboardProps {
  childProgress: ChildProgress;
  onUpdateProgress: (updates: Partial<ChildProgress>) => void;
  onCoachingRequest: (area: string) => void;
}

const ParentCoachingDashboard: React.FC<ParentCoachingDashboardProps> = ({
  childProgress,
  onUpdateProgress,
  onCoachingRequest
}) => {
  const [showTransferTracking, setShowTransferTracking] = useState(false);
  const [newTransferActivity, setNewTransferActivity] = useState({
    activity: '',
    beforeRating: 3,
    afterRating: 3,
    notes: ''
  });
  const [coachingInsights, setCoachingInsights] = useState<string[]>([]);
  const [weeklyRecommendations, setWeeklyRecommendations] = useState<string[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    generateCoachingInsights();
    generateWeeklyRecommendations();
  }, [childProgress]);

  const generateCoachingInsights = () => {
    const insights = [];
    const { currentAttentionSpan, baselineAttentionSpan, improvementRate, totalSessions } = childProgress;
    
    // Progress insights
    if (currentAttentionSpan > baselineAttentionSpan * 1.5) {
      insights.push(`🎉 Excellent progress! ${childProgress.childName}'s attention span has improved by ${Math.round(((currentAttentionSpan - baselineAttentionSpan) / baselineAttentionSpan) * 100)}%`);
    } else if (currentAttentionSpan > baselineAttentionSpan * 1.2) {
      insights.push(`📈 Good improvement! Attention span is building steadily with consistent practice`);
    } else if (totalSessions < 5) {
      insights.push(`🌱 Early stages - building foundation. Consistency is more important than duration right now`);
    }

    // Session frequency insights
    if (childProgress.weeklyProgress >= childProgress.weeklyGoal) {
      insights.push(`⭐ Meeting weekly goals! This consistency is building strong attention habits`);
    } else if (childProgress.weeklyProgress < childProgress.weeklyGoal / 2) {
      insights.push(`💡 Consider shorter, more frequent sessions. Even 2-3 minutes daily is better than longer, infrequent sessions`);
    }

    // Age-appropriate insights
    if (childProgress.age <= 6) {
      insights.push(`🧸 At age ${childProgress.age}, 2-3 minute attention spans are normal. Focus on fun and engagement over duration`);
    } else if (childProgress.age <= 8) {
      insights.push(`🎯 Age ${childProgress.age} can typically focus for 4-6 minutes. Building toward this gradually`);
    } else {
      insights.push(`🚀 Age ${childProgress.age} can work toward 8-10 minute sustained attention with practice`);
    }

    setCoachingInsights(insights.slice(0, 3));
  };

  const generateWeeklyRecommendations = () => {
    const recommendations = [];
    const { weeklyProgress, weeklyGoal, challengeAreas, strengths } = childProgress;
    
    // Frequency recommendations
    if (weeklyProgress < weeklyGoal) {
      recommendations.push(`🗓️ Aim for ${Math.ceil((weeklyGoal - weeklyProgress) / 7)} more sessions this week`);
    }

    // Challenge area support
    if (challengeAreas.includes('morning_focus')) {
      recommendations.push(`🌅 Try morning sessions when cortisol naturally supports attention`);
    }
    if (challengeAreas.includes('after_school')) {
      recommendations.push(`🍎 After school: start with 5-minute movement break, then micro-focus training`);
    }

    // Strength leveraging
    if (strengths.includes('visual_tracking')) {
      recommendations.push(`👀 Leverage visual strength: use visual schedules and tracking games in daily life`);
    }
    if (strengths.includes('movement_integration')) {
      recommendations.push(`🤸 Use movement: standing desk, fidget tools, or walking while listening`);
    }

    // Real-world application
    recommendations.push(`🏠 Practice focus skills during: homework time, bedtime stories, or family conversations`);

    setWeeklyRecommendations(recommendations.slice(0, 4));
  };

  const addTransferActivity = () => {
    if (!newTransferActivity.activity.trim()) return;

    const newTransfer = [...childProgress.realWorldTransfer, newTransferActivity];
    onUpdateProgress({ realWorldTransfer: newTransfer });
    
    setNewTransferActivity({
      activity: '',
      beforeRating: 3,
      afterRating: 3,
      notes: ''
    });
    setShowTransferTracking(false);
  };

  const getProgressColor = (improvement: number) => {
    if (improvement > 20) return 'emerald';
    if (improvement > 10) return 'blue';
    if (improvement > 0) return 'yellow';
    return 'gray';
  };

  const improvementPercentage = childProgress.baselineAttentionSpan > 0 ? 
    ((childProgress.currentAttentionSpan - childProgress.baselineAttentionSpan) / childProgress.baselineAttentionSpan) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Parent Coaching Dashboard</h2>
          <p className="text-sm text-gray-600">Supporting {childProgress.childName}'s attention development</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">{childProgress.currentAttentionSpan}s</div>
          <div className="text-sm text-gray-600">Current Span</div>
          <div className="text-xs text-emerald-700 mt-1">
            Started at {childProgress.baselineAttentionSpan}s
          </div>
        </div>
        
        <div className={`text-center p-4 bg-${getProgressColor(improvementPercentage)}-50 rounded-lg`}>
          <div className={`text-2xl font-bold text-${getProgressColor(improvementPercentage)}-600`}>
            +{Math.round(improvementPercentage)}%
          </div>
          <div className="text-sm text-gray-600">Improvement</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{childProgress.totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {childProgress.weeklyProgress}/{childProgress.weeklyGoal}
          </div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
      </div>

      {/* Coaching Insights */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">AI Coaching Insights</span>
        </div>
        <div className="space-y-2">
          {coachingInsights.map((insight, index) => (
            <div key={index} className="text-sm text-indigo-800">
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Recommendations */}
      <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-emerald-900">This Week's Focus</span>
        </div>
        <div className="space-y-2">
          {weeklyRecommendations.map((rec, index) => (
            <div key={index} className="text-sm text-emerald-800">
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Transfer Tracking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Real-World Application</h3>
          <button
            onClick={() => setShowTransferTracking(true)}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            Track Progress
          </button>
        </div>
        
        {childProgress.realWorldTransfer.length > 0 ? (
          <div className="space-y-3">
            {childProgress.realWorldTransfer.slice(0, 3).map((transfer, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{transfer.activity}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {transfer.beforeRating} → {transfer.afterRating}
                    </span>
                    {transfer.afterRating > transfer.beforeRating && (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                </div>
                {transfer.notes && (
                  <p className="text-sm text-gray-600">{transfer.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start tracking how attention training helps in daily activities</p>
          </div>
        )}
      </div>

      {/* Transfer Tracking Modal */}
      {showTransferTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Real-World Progress</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity or Situation
                </label>
                <input
                  type="text"
                  value={newTransferActivity.activity}
                  onChange={(e) => setNewTransferActivity(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="e.g., Homework time, Bedtime story, Family dinner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Before Training
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewTransferActivity(prev => ({ ...prev, beforeRating: rating }))}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          rating <= newTransferActivity.beforeRating 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus After Training
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewTransferActivity(prev => ({ ...prev, afterRating: rating }))}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          rating <= newTransferActivity.afterRating 
                            ? 'bg-emerald-500 hover:bg-emerald-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newTransferActivity.notes}
                  onChange={(e) => setNewTransferActivity(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any observations about improvements or challenges..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addTransferActivity}
                  disabled={!newTransferActivity.activity.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Progress
                </button>
                <button
                  onClick={() => setShowTransferTracking(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coaching Action Cards */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <button
          onClick={() => onCoachingRequest('daily_strategies')}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Daily Strategies</span>
          </div>
          <p className="text-sm text-blue-800">Get personalized tips for supporting attention at home</p>
        </button>

        <button
          onClick={() => onCoachingRequest('school_support')}
          className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-900">School Support</span>
          </div>
          <p className="text-sm text-purple-800">Strategies to share with teachers and school staff</p>
        </button>
      </div>
    </div>
  );
};

export default ParentCoachingDashboard;