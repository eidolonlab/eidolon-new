import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Zap, Sparkles, Activity, Clock, ChevronRight, Flame, TrendingUp, Lock } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import { supabase } from '../lib/supabase';
import SwitchControlPage from '../components/boosts/SwitchControlPage';
import BodyBalancePage from '../components/boosts/BodyBalancePage';
import ActivityPlayer from '../components/boosts/ActivityPlayer';

interface BoostStreak {
  current_streak: number;
  longest_streak: number;
  total_boosts_completed: number;
  total_xp_earned: number;
}

interface PillarCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  route: string;
  isActive: boolean;
  comingSoon?: boolean;
  activitiesCount?: number;
}

function PillarCard({ title, description, icon, gradient, route, isActive, comingSoon, activitiesCount }: PillarCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => !comingSoon && navigate(route)}
      className={`relative overflow-hidden rounded-2xl p-6 ${gradient} transition-all duration-300 ${
        comingSoon
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-slate-700">
          <Lock className="w-3 h-3" />
          <span>Coming Soon</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
          {icon}
        </div>
        {!comingSoon && (
          <ChevronRight className="w-6 h-6 text-white/80" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/90 text-sm mb-3 leading-relaxed">{description}</p>

      {isActive && activitiesCount && (
        <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
          <Activity className="w-4 h-4" />
          <span>{activitiesCount} activities ready</span>
        </div>
      )}
    </div>
  );
}

function BoostsHome() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<BoostStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayBoosts, setTodayBoosts] = useState(0);

  useEffect(() => {
    if (user) {
      loadStreakData();
      loadTodayBoosts();
    }
  }, [user]);

  const loadStreakData = async () => {
    try {
      const { data, error } = await supabase
        .from('boost_streaks')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setStreak(data);
    } catch (error) {
      console.error('Error loading streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayBoosts = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('boost_completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);

      if (error) throw error;
      setTodayBoosts(count || 0);
    } catch (error) {
      console.error('Error loading today boosts:', error);
    }
  };

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl mb-4">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Boosts</h1>
            <p className="text-slate-600">Sign in to access focus support tools</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Boosts</h1>
              <p className="text-slate-600">Tiny actions. Real momentum.</p>
            </div>
          </div>
        </div>

        {/* Daily Progress Card */}
        {!loading && (
          <div className="mb-8 bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Today's Progress
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{streak?.current_streak || 0}</div>
                  <div className="text-xs text-slate-600">day streak</div>
                </div>
                {(streak?.current_streak || 0) > 0 && (
                  <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
                <div className="text-2xl font-bold text-slate-900">{todayBoosts}</div>
                <div className="text-xs text-slate-600">boosts today</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
                <div className="text-2xl font-bold text-slate-900">{streak?.total_boosts_completed || 0}</div>
                <div className="text-xs text-slate-600">total boosts</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
                <div className="text-2xl font-bold text-orange-600">{streak?.total_xp_earned || 0}</div>
                <div className="text-xs text-slate-600">XP earned</div>
              </div>
            </div>
          </div>
        )}

        {/* Pillars Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Your Boost</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PillarCard
              title="Switch Control"
              description="Break the loop. Start momentum. Quick interventions to shift your attention."
              icon={<Activity className="w-8 h-8 text-white" />}
              gradient="bg-gradient-to-br from-orange-400 to-amber-500"
              route="/boosts/switch-control"
              isActive={true}
              activitiesCount={5}
            />

            <PillarCard
              title="Strength Engine"
              description="Celebrate your unique powers. Track wins, spark energy, channel positivity."
              icon={<Sparkles className="w-8 h-8 text-white" />}
              gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
              route="/boosts/strength-engine"
              isActive={false}
              comingSoon={true}
            />

            <PillarCard
              title="Body Balance"
              description="10-min daily coordination boost. Light activities for focus and attention."
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              gradient="bg-gradient-to-br from-blue-400 to-cyan-500"
              route="/boosts/body-balance"
              isActive={true}
              activitiesCount={6}
            />

            <PillarCard
              title="Time Navigation"
              description="See time. Feel urgency. Act now. Visual tools to collapse time blindness."
              icon={<Clock className="w-8 h-8 text-white" />}
              gradient="bg-gradient-to-br from-rose-400 to-pink-500"
              route="/boosts/time-navigation"
              isActive={false}
              comingSoon={true}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-20 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Important:</strong> Eidolon provides focus support strategies for personal development.
            This is not medical advice or treatment. Consult healthcare providers for ADHD diagnosis or treatment.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

export default function BoostsPage() {
  return (
    <Routes>
      <Route index element={<BoostsHome />} />
      <Route path="switch-control" element={<SwitchControlPage />} />
      <Route path="switch-control/activity/:activityId" element={<ActivityPlayer />} />
      <Route path="body-balance" element={<BodyBalancePage />} />
      <Route path="body-balance/activity/:activityId" element={<ActivityPlayer />} />
    </Routes>
  );
}
