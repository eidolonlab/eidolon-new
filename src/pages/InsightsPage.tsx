import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Flame } from 'lucide-react';
import AppShell from '../components/AppShell';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  total_starts: number;
  total_finishes: number;
  total_focus_minutes: number;
  current_streak_days: number;
  longest_streak_days: number;
}

export default function InsightsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total_starts: 0,
    total_finishes: 0,
    total_focus_minutes: 0,
    current_streak_days: 0,
    longest_streak_days: 0
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);

    const { data: statsData } = await supabase
      .from('adhd_user_stats')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (statsData) {
      setStats(statsData);
    }

    const { data: sessionsData } = await supabase
      .from('focus_sessions')
      .select('task, duration_preset, completed, actual_duration, started_at, reflection_emoji')
      .eq('user_id', user?.id)
      .order('started_at', { ascending: false })
      .limit(5);

    if (sessionsData) {
      setRecentSessions(sessionsData);
    }

    setLoading(false);
  }

  const completionRate = stats.total_starts > 0
    ? Math.round((stats.total_finishes / stats.total_starts) * 100)
    : 0;

  const avgSessionLength = stats.total_finishes > 0
    ? Math.round(stats.total_focus_minutes / stats.total_finishes)
    : 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your Insights</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track your progress and celebrate wins
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-violet-600 mb-2">
              <Target className="w-4 h-4" />
              <div className="text-xs font-medium">Started</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total_starts}</div>
            <div className="text-xs text-slate-500 mt-1">This week</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <div className="text-xs font-medium">Finished</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total_finishes}</div>
            <div className="text-xs text-slate-500 mt-1">{completionRate}% rate</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Clock className="w-4 h-4" />
              <div className="text-xs font-medium">Minutes</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total_focus_minutes}</div>
            <div className="text-xs text-slate-500 mt-1">Total focused</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Flame className="w-4 h-4" />
              <div className="text-xs font-medium">Streak</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.current_streak_days}</div>
            <div className="text-xs text-slate-500 mt-1">Days active</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Weekly Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Completion Rate</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900">{completionRate}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Avg Session Length</span>
              <span className="text-sm font-semibold text-slate-900">{avgSessionLength} min</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Best Streak</span>
              <span className="text-sm font-semibold text-slate-900">{stats.longest_streak_days} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Sessions</h2>
          {loading ? (
            <div className="text-sm text-slate-500 text-center py-8">Loading...</div>
          ) : recentSessions.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-8">
              No sessions yet. Start your first focus session!
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {session.reflection_emoji && (
                      <span className="text-xl">{session.reflection_emoji}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {session.task || 'Unnamed task'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(session.started_at).toLocaleDateString()} • {session.duration_preset}m preset
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {session.completed ? 'Completed' : 'Paused'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
          <h2 className="font-semibold text-slate-900 mb-2">This Week's Insight</h2>
          <p className="text-sm text-slate-700">
            {stats.total_starts > 5 ? (
              <>You're building momentum! You started {stats.total_starts} sessions this week.
              {completionRate > 70 ? ' Your completion rate is excellent—keep it up!' :
                ' Try using 5-minute starts if longer sessions feel overwhelming.'}</>
            ) : stats.total_starts > 0 ? (
              <>Great start! You've begun {stats.total_starts} session{stats.total_starts > 1 ? 's' : ''} this week.
              Consistency matters more than perfection—aim for one session per day.</>
            ) : (
              <>Ready to begin? Start with just 5 minutes today. The smallest step builds confidence and momentum.</>
            )}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
