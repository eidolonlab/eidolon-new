import React, { useState, useEffect } from 'react';
import { Brain, Zap, Clock, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import StartFocusFlow from './StartFocusFlow';
import RescueHub from './RescueHub';
import QuickPlanGenerator from './QuickPlanGenerator';
import XPProgressBar from '../XPProgressBar';
import AchievementBadge from '../AchievementBadge';
import AchievementUnlockModal from '../AchievementUnlockModal';
import StreakCalendar from '../StreakCalendar';
import CelebrationEffect from '../CelebrationEffect';
import OneTapFocusStart from '../OneTapFocusStart';

interface FocusSettings {
  default_duration: number;
  body_double_enabled: boolean;
  brown_noise_enabled: boolean;
  last_task: string;
}

interface WeeklyStats {
  total_starts: number;
  total_finishes: number;
  total_focus_minutes: number;
  current_streak_days: number;
}

interface Gamification {
  current_xp: number;
  level: number;
  total_xp: number;
  streak_insurance_count: number;
}

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
  earned_at?: string;
}

export default function FocusCenterHome() {
  const { user } = useAuth();
  const [showFocusFlow, setShowFocusFlow] = useState(false);
  const [showRescue, setShowRescue] = useState(false);
  const [showQuickPlan, setShowQuickPlan] = useState(false);
  const [settings, setSettings] = useState<FocusSettings>({
    default_duration: 25,
    body_double_enabled: false,
    brown_noise_enabled: false,
    last_task: ''
  });
  const [stats, setStats] = useState<WeeklyStats>({
    total_starts: 0,
    total_finishes: 0,
    total_focus_minutes: 0,
    current_streak_days: 0
  });
  const [todayWins, setTodayWins] = useState<Array<{ id: string; win_text: string; completed: boolean }>>([]);
  const [gamification, setGamification] = useState<Gamification>({
    current_xp: 0,
    level: 1,
    total_xp: 0,
    streak_insurance_count: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
      loadStats();
      loadTodayWins();
      loadGamification();
      loadAchievements();
    }
  }, [user]);

  async function loadSettings() {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('focus_user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.warn('Could not load settings:', error);
    }
  }

  async function loadStats() {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('adhd_user_stats')
        .select('total_starts, total_finishes, total_focus_minutes, current_streak_days')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.warn('Could not load stats:', error);
    }
  }

  async function loadTodayWins() {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('meaningful_wins')
        .select('id, win_text, completed')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: true })
        .limit(2);

      if (data && data.length > 0) {
        setTodayWins(data);
      }
    } catch (error) {
      console.warn('Could not load wins:', error);
    }
  }

  async function loadGamification() {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setGamification(data);
      }
    } catch (error) {
      console.warn('Could not load gamification:', error);
    }
  }

  async function loadAchievements() {
    if (!user?.id) return;
    try {
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('category', { ascending: true });

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user.id);

      if (allAchievements) {
        const earnedMap = new Map(
          (userAchievements || []).map(ua => [ua.achievement_id, ua.earned_at])
        );

        const enrichedAchievements = allAchievements.map(a => ({
          ...a,
          earned_at: earnedMap.get(a.id)
        }));

        setAchievements(enrichedAchievements);
        setEarnedAchievements(new Set(earnedMap.keys()));
      }
    } catch (error) {
      console.warn('Could not load achievements:', error);
    }
  }

  async function toggleWin(id: string, completed: boolean) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics not available');
    }

    try {
      await supabase
        .from('meaningful_wins')
        .update({ completed: !completed, completed_at: !completed ? new Date().toISOString() : null })
        .eq('id', id);
    } catch (error) {
      console.warn('Could not update win:', error);
    }

    setTodayWins(prev => prev.map(w => w.id === id ? { ...w, completed: !completed } : w));

    if (!completed) {
      setShowCelebration(true);
    }
  }

  const completionRate = stats.total_starts > 0
    ? Math.round((stats.total_finishes / stats.total_starts) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Focus Center</h1>
        <p className="text-slate-600 text-sm mt-1">
          ADHD-friendly one-tap start. Your data is private and secure.
        </p>
      </div>

      <XPProgressBar
        currentXP={gamification.current_xp}
        level={gamification.level}
        totalXP={gamification.total_xp}
        showDetails={true}
      />

      <OneTapFocusStart onStart={(duration) => {
        setSettings(prev => ({ ...prev, default_duration: duration }));
        setShowFocusFlow(true);
      }} />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowRescue(true)}
          className="flex items-center justify-center gap-2 px-6 py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-sm transition-colors"
        >
          <Zap className="w-5 h-5" />
          <span className="font-medium">Rescue 90s</span>
        </button>

        <button
          onClick={() => setShowQuickPlan(true)}
          className="flex items-center justify-center gap-2 px-6 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm transition-colors"
        >
          <Clock className="w-5 h-5" />
          <span className="font-medium">Quick Plan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-medium text-slate-900 mb-3">Today's Two Wins</h2>
        <div className="space-y-2">
          {todayWins.map(win => (
            <label key={win.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={win.completed}
                onChange={() => toggleWin(win.id, win.completed)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className={`flex-1 ${win.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {win.win_text}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-slate-500 mb-1">Starts This Week</div>
          <div className="text-2xl font-semibold text-primary-700">{stats.total_starts}</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl border border-cyan-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-slate-500 mb-1">Finishes</div>
          <div className="text-2xl font-semibold text-cyan-700">{stats.total_finishes}</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-slate-500 mb-1">Focus Minutes</div>
          <div className="text-2xl font-semibold text-amber-700">{stats.total_focus_minutes}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-xs text-slate-500 mb-1">Completion</div>
          <div className="text-2xl font-semibold text-emerald-600">{completionRate}%</div>
        </div>
      </div>

      <StreakCalendar
        streakDays={stats.current_streak_days}
        insuranceCount={gamification.streak_insurance_count}
        compact={false}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-medium text-slate-900">Achievements</h2>
          </div>
          <span className="text-sm text-slate-500">
            {earnedAchievements.size} / {achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {achievements.slice(0, 12).map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              earned={earnedAchievements.has(achievement.id)}
              size="small"
            />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-2xl border border-primary-100 p-5 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900 mb-2">AI Memory Companion</h2>
        <p className="text-sm text-slate-600 mb-3">
          Based on your patterns, here's what might help today:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFocusFlow(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
          >
            Start 5m now
          </button>
          <button
            onClick={() => setShowQuickPlan(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
          >
            Break down next task
          </button>
          <button
            onClick={() => setShowRescue(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
          >
            Rescue: Reset
          </button>
        </div>
      </div>

      {showFocusFlow && (
        <StartFocusFlow
          settings={settings}
          onClose={() => setShowFocusFlow(false)}
          onSettingsUpdate={setSettings}
          onStatsUpdate={loadStats}
          onNewAchievement={(achievement) => {
            setUnlockedAchievement(achievement);
            setShowCelebration(true);
          }}
        />
      )}

      {showRescue && (
        <RescueHub onClose={() => setShowRescue(false)} />
      )}

      {showQuickPlan && (
        <QuickPlanGenerator
          onClose={() => setShowQuickPlan(false)}
          onPlanCreated={(task) => {
            setSettings(prev => ({ ...prev, last_task: task }));
            setShowFocusFlow(true);
          }}
        />
      )}

      <CelebrationEffect
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
        intensity="medium"
      />

      {unlockedAchievement && (
        <AchievementUnlockModal
          achievement={unlockedAchievement}
          onClose={() => {
            setUnlockedAchievement(null);
            loadGamification();
            loadAchievements();
          }}
        />
      )}
    </div>
  );
}
