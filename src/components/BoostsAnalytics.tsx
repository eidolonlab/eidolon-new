import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Users, Activity, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BoostStats {
  total_completions: number;
  unique_users: number;
  avg_completions_per_user: number;
  most_popular_pillar: string;
  total_xp_awarded: number;
}

interface PillarStats {
  pillar: string;
  completions: number;
  unique_users: number;
}

export default function BoostsAnalytics() {
  const [stats, setStats] = useState<BoostStats | null>(null);
  const [pillarStats, setPillarStats] = useState<PillarStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);

      // Get overall stats
      const { data: completions, error: completionsError } = await supabase
        .from('boost_completions')
        .select('user_id, xp_awarded')
        .gte('completed_at', startDate.toISOString());

      if (completionsError) throw completionsError;

      const uniqueUsers = new Set(completions?.map(c => c.user_id) || []).size;
      const totalCompletions = completions?.length || 0;
      const totalXP = completions?.reduce((sum, c) => sum + (c.xp_awarded || 0), 0) || 0;

      // Get pillar stats
      const { data: pillarData, error: pillarError } = await supabase
        .from('boost_completions')
        .select(`
          user_id,
          boost_activities!inner(pillar)
        `)
        .gte('completed_at', startDate.toISOString());

      if (pillarError) throw pillarError;

      const pillarMap = new Map<string, Set<string>>();
      pillarData?.forEach((item: any) => {
        const pillar = item.boost_activities?.pillar;
        if (pillar) {
          if (!pillarMap.has(pillar)) {
            pillarMap.set(pillar, new Set());
          }
          pillarMap.get(pillar)!.add(item.user_id);
        }
      });

      const pillarStatsArray = Array.from(pillarMap.entries()).map(([pillar, users]) => ({
        pillar,
        completions: pillarData?.filter((item: any) => item.boost_activities?.pillar === pillar).length || 0,
        unique_users: users.size
      }));

      const mostPopular = pillarStatsArray.sort((a, b) => b.completions - a.completions)[0]?.pillar || 'N/A';

      setStats({
        total_completions: totalCompletions,
        unique_users: uniqueUsers,
        avg_completions_per_user: uniqueUsers > 0 ? totalCompletions / uniqueUsers : 0,
        most_popular_pillar: mostPopular,
        total_xp_awarded: totalXP
      });

      setPillarStats(pillarStatsArray);
    } catch (error) {
      console.error('Error loading boost stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPillarName = (pillar: string) => {
    const names: Record<string, string> = {
      switch_control: 'Switch Control',
      strength_engine: 'Strength Engine',
      body_balance: 'Body Balance',
      time_navigation: 'Time Navigation'
    };
    return names[pillar] || pillar;
  };

  const getPillarColor = (pillar: string) => {
    const colors: Record<string, string> = {
      switch_control: 'from-orange-400 to-amber-500',
      strength_engine: 'from-emerald-400 to-teal-500',
      body_balance: 'from-blue-400 to-cyan-500',
      time_navigation: 'from-rose-400 to-pink-500'
    };
    return colors[pillar] || 'from-slate-400 to-slate-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Boosts Analytics</h2>
            <p className="text-slate-600 text-sm">ADHD Enhancement System Performance</p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats?.total_completions || 0}</div>
          <div className="text-sm text-slate-600">Boosts Completed</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-slate-500">Active</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats?.unique_users || 0}</div>
          <div className="text-sm text-slate-600">Unique Users</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-slate-500">Avg</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {stats?.avg_completions_per_user.toFixed(1) || 0}
          </div>
          <div className="text-sm text-slate-600">Per User</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats?.total_xp_awarded || 0}</div>
          <div className="text-sm text-slate-600">XP Awarded</div>
        </div>
      </div>

      {/* Pillar Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Pillar Performance</h3>
        <div className="space-y-4">
          {pillarStats.map(pillar => (
            <div key={pillar.pillar} className="flex items-center gap-4">
              <div className={`w-32 text-sm font-semibold text-slate-900`}>
                {getPillarName(pillar.pillar)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{pillar.completions} completions</span>
                  <span className="text-xs text-slate-600">{pillar.unique_users} users</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getPillarColor(pillar.pillar)} transition-all duration-500`}
                    style={{
                      width: `${((pillar.completions / (stats?.total_completions || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-slate-900">
                {((pillar.completions / (stats?.total_completions || 1)) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Popular Pillar */}
      {stats && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-600" />
            <div>
              <div className="text-sm text-slate-600">Most Popular Pillar</div>
              <div className="text-xl font-bold text-slate-900">{getPillarName(stats.most_popular_pillar)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
