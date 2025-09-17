import React from 'react';
import { Plus, Calendar, Brain, TrendingUp, Clock, Target, Award, ChevronRight, Zap, Play } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import MemoryInsights from './MemoryInsights';

interface DashboardProps {
  onNavigate: (view: 'weave' | 'scenario' | 'retrieval') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { weaves, getMetrics } = useWeave();
  const metrics = getMetrics();
  
  const recentWeaves = weaves.slice(0, 3);
  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 3);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back to your memory journey
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build richer memories, rehearse future scenarios, and track your cognitive progress with evidence-based techniques.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('weave')}
          className="group bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Plus className="w-8 h-8" />
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Create Memory Weave</h3>
          <p className="text-indigo-100">Transform a simple seed into a rich, multi-sensory memory</p>
        </button>

        <button
          onClick={() => onNavigate('scenario')}
          className="group bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Plan Future Scenario</h3>
          <p className="text-emerald-100">Rehearse upcoming events with if-then strategies</p>
        </button>

        <button
          onClick={() => onNavigate('retrieval')}
          className="group bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8" />
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Retrieval Training</h3>
          <p className="text-orange-100">Practice spaced recall to strengthen memories</p>
        </button>
      </div>
      
      {/* Smart Recommendations */}
      {weaves.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">AI-powered suggestions based on your training patterns</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Training Recommendation */}
            {(() => {
              const oldestWeave = weaves
                .filter(w => w.type === 'past')
                .sort((a, b) => (a.lastRetrieved?.getTime() || 0) - (b.lastRetrieved?.getTime() || 0))[0];
              
              if (oldestWeave) {
                const daysSinceRetrieval = oldestWeave.lastRetrieved 
                  ? Math.floor((Date.now() - oldestWeave.lastRetrieved.getTime()) / (1000 * 60 * 60 * 24))
                  : 999;
                
                return (
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Play className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Recommended Training</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      "{oldestWeave.title}" hasn't been practiced in {daysSinceRetrieval === 999 ? 'a while' : `${daysSinceRetrieval} days`}
                    </p>
                    <button
                      onClick={() => onNavigate('retrieval')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Start Training →
                    </button>
                  </div>
                );
              }
              return null;
            })()}
            
            {/* Scenario Recommendation */}
            {(() => {
              const upcomingScenario = weaves
                .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
                .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))[0];
              
              if (upcomingScenario) {
                const daysUntil = Math.ceil((upcomingScenario.scheduledFor!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Upcoming Event</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      "{upcomingScenario.title}" is in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={() => onNavigate('scenario')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Review Plans →
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.totalWeaves}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Total Weaves</h4>
          <p className="text-sm text-gray-600">Memories & scenarios created</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.avgCoherenceScore}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Coherence Score</h4>
          <p className="text-sm text-gray-600">Average narrative quality</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {metrics.avgRecallLatency > 0 ? `${(metrics.avgRecallLatency / 1000).toFixed(1)}s` : '—'}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Recall Speed</h4>
          <p className="text-sm text-gray-600">Average retrieval time</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Follow-Through</h4>
          <p className="text-sm text-gray-600">Scenario completion rate</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Weaves */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Memory Weaves</h3>
            <button
              onClick={() => onNavigate('weave')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {recentWeaves.length > 0 ? (
            <div className="space-y-4">
              {recentWeaves.map((weave) => (
                <div key={weave.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    weave.type === 'past' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{weave.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">Seed: "{weave.seed}"</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Score: {weave.coherenceScore}</span>
                      <span>•</span>
                      <span>{formatDate(weave.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No memory weaves yet. Create your first one!</p>
            </div>
          )}
        </div>

        {/* Upcoming Scenarios */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Scenarios</h3>
            <button
              onClick={() => onNavigate('scenario')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {upcomingScenarios.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming scenarios. Plan your next event!</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Progress Chart */}
      {metrics.weeklyProgress.some(day => day > 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Training Activity</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{metrics.weeklyProgress.reduce((sum, day) => sum + day, 0)} sessions this week</span>
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
                      className={`rounded-t-lg transition-all duration-300 ${
                        isToday 
                          ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                          : 'bg-gradient-to-t from-indigo-500 to-indigo-400'
                      }`}
                      style={{ height: `${height}%`, position: 'absolute', bottom: 0, width: '100%' }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    <div className={`font-medium ${isToday ? 'text-emerald-600' : ''}`}>
                      {dayNames[dayIndex]}
                    </div>
                    <div className="text-gray-500">{sessions}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Daily training sessions</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                <span>Past days</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI-Powered Memory Insights */}
      {weaves.length > 0 && (
        <MemoryInsights />
      )}
    </div>
  );
};

export default Dashboard;