import React, { useState, useEffect } from 'react';
import { Activity, Users, Clock, TrendingUp, Filter, Download, Calendar, Eye } from 'lucide-react';
import { environmentManager, UserActivity } from '../lib/environmentManager';
import { supabase } from '../lib/supabase';

interface ActivityStats {
  total_activities: number;
  unique_users: number;
  avg_session_duration: number;
  top_activities: { type: string; count: number }[];
  activities_by_environment: { env: string; count: number }[];
  activities_by_day: { date: string; count: number }[];
}

export const UserActivityAnalytics: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    total_activities: 0,
    unique_users: 0,
    avg_session_duration: 0,
    top_activities: [],
    activities_by_environment: [],
    activities_by_day: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [timeRange, filterType]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Calculate date filter
      let dateFilter = null;
      if (timeRange !== 'all') {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        dateFilter = new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
      }

      // Build query
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }

      if (filterType !== 'all') {
        query = query.eq('activity_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setActivities(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: UserActivity[]) => {
    const uniqueUsers = new Set(data.map(a => a.user_id)).size;
    const totalActivities = data.length;

    const avgDuration = data.reduce((sum, a) => sum + (a.session_duration_ms || 0), 0) /
                        (data.filter(a => a.session_duration_ms).length || 1);

    // Top activities
    const activityCounts: Record<string, number> = {};
    data.forEach(a => {
      activityCounts[a.activity_type] = (activityCounts[a.activity_type] || 0) + 1;
    });
    const topActivities = Object.entries(activityCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Activities by environment
    const envCounts: Record<string, number> = {};
    data.forEach(a => {
      envCounts[a.environment] = (envCounts[a.environment] || 0) + 1;
    });
    const activitiesByEnvironment = Object.entries(envCounts)
      .map(([env, count]) => ({ env, count }));

    // Activities by day (last 7 days)
    const dayCounts: Record<string, number> = {};
    data.forEach(a => {
      const date = new Date(a.created_at).toISOString().split('T')[0];
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });
    const activitiesByDay = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    setStats({
      total_activities: totalActivities,
      unique_users: uniqueUsers,
      avg_session_duration: avgDuration,
      top_activities: topActivities,
      activities_by_environment: activitiesByEnvironment,
      activities_by_day: activitiesByDay
    });
  };

  const exportData = () => {
    const csv = [
      ['Timestamp', 'User ID', 'Activity Type', 'Environment', 'Duration (ms)', 'User Agent'],
      ...activities.map(a => [
        new Date(a.created_at).toISOString(),
        a.user_id,
        a.activity_type,
        a.environment,
        a.session_duration_ms?.toString() || '0',
        a.user_agent || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-activities-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Activity Analytics</h2>
          <p className="text-gray-600 mt-1">Track and analyze user behavior across all environments</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="weave_created">Weave Created</option>
              <option value="weave_modified">Weave Modified</option>
              <option value="session_started">Session Started</option>
              <option value="environment_switched">Environment Switched</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_activities.toLocaleString()}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unique_users.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Session</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatDuration(stats.avg_session_duration)}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activities/User</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.unique_users ? (stats.total_activities / stats.unique_users).toFixed(1) : '0'}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Activities</h3>
          <div className="space-y-3">
            {stats.top_activities.map((activity, index) => {
              const percentage = (activity.count / stats.total_activities) * 100;
              return (
                <div key={activity.type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{formatActivityType(activity.type)}</span>
                    <span className="text-gray-900 font-semibold">{activity.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activities by Environment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities by Environment</h3>
          <div className="space-y-3">
            {stats.activities_by_environment.map((env) => {
              const percentage = (env.count / stats.total_activities) * 100;
              const colors: Record<string, string> = {
                production: 'bg-green-600',
                staging: 'bg-yellow-600',
                dev: 'bg-blue-600'
              };
              return (
                <div key={env.env}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{env.env}</span>
                    <span className="text-gray-900 font-semibold">{env.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[env.env] || 'bg-gray-600'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline (Last 7 Days)</h3>
        <div className="flex items-end justify-between h-48 space-x-2">
          {stats.activities_by_day.map((day) => {
            const maxCount = Math.max(...stats.activities_by_day.map(d => d.count));
            const height = (day.count / maxCount) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center h-40">
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${day.count} activities`}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">{day.count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Environment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading activities...</td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No activities found</td>
                </tr>
              ) : (
                activities.slice(0, 50).map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(activity.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {activity.user_id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatActivityType(activity.activity_type)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.environment === 'production' ? 'bg-green-100 text-green-800' :
                        activity.environment === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.session_duration_ms ? formatDuration(activity.session_duration_ms) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(activity.user_id)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserActivityAnalytics;
