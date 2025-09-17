import React from 'react';
import { TrendingUp, Brain, Target, Clock, Award, Eye, Ear, Heart, BarChart3, ArrowLeft } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

const MemoryInsights: React.FC = () => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const metrics = getMetrics();

  const getInsights = () => {
    const insights = [];
    
    // Memory strength insights
    if (metrics.avgCoherenceScore > 80) {
      insights.push({
        type: 'strength',
        title: 'Excellent Memory Quality',
        description: `Your average coherence score of ${metrics.avgCoherenceScore} indicates strong autobiographical memory skills.`,
        icon: Award,
        color: 'emerald'
      });
    }
    
    // Retrieval speed insights
    if (metrics.avgRecallLatency > 0 && metrics.avgRecallLatency < 15000) {
      insights.push({
        type: 'strength',
        title: 'Fast Memory Retrieval',
        description: `Your average recall time of ${(metrics.avgRecallLatency / 1000).toFixed(1)}s shows efficient memory access.`,
        icon: Clock,
        color: 'blue'
      });
    }
    
    // Training consistency
    const recentSessions = retrievalSessions.filter(s => 
      s.startTime > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    if (recentSessions.length >= 3) {
      insights.push({
        type: 'habit',
        title: 'Consistent Training',
        description: `You've completed ${recentSessions.length} training sessions this week. Consistency builds stronger memories.`,
        icon: Target,
        color: 'purple'
      });
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Memory Insights</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered analysis of your memory training patterns and cognitive progress.
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalWeaves}</div>
              <div className="text-sm text-gray-600">Total Memories</div>
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
              <div className="text-sm text-gray-600">Avg Quality</div>
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
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">Personalized insights from your training data</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className={`p-4 bg-${insight.color}-50 rounded-lg border border-${insight.color}-200`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${insight.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 text-${insight.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Progress Chart */}
      {metrics.weeklyProgress.some(day => day > 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Training Activity</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{metrics.weeklyProgress.reduce((sum, day) => sum + day, 0)} total sessions</span>
            </div>
          </div>
          
          <div className="flex items-end space-x-2 h-32">
            {metrics.weeklyProgress.map((sessions, index) => {
              const maxSessions = Math.max(...metrics.weeklyProgress, 1);
              const height = (sessions / maxSessions) * 100;
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayIndex = (new Date().getDay() - 6 + index + 7) % 7;
              const isToday = index === 6;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100px' }}>
                    <div
                      className={`rounded-t-lg transition-all duration-500 ${
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
    </div>
  );
};

export default MemoryInsights;