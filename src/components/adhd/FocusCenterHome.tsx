import React, { useState, useEffect } from 'react';
import { Brain, Zap, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import StartFocusFlow from './StartFocusFlow';
import RescueHub from './RescueHub';
import QuickPlanGenerator from './QuickPlanGenerator';

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

  useEffect(() => {
    if (user) {
      loadSettings();
      loadStats();
      loadTodayWins();
    }
  }, [user]);

  async function loadSettings() {
    const { data } = await supabase
      .from('focus_user_settings')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setSettings(data);
    } else {
      const newSettings = {
        user_id: user?.id,
        default_duration: 25,
        body_double_enabled: false,
        brown_noise_enabled: false,
        last_task: ''
      };
      await supabase.from('focus_user_settings').insert(newSettings);
      setSettings(newSettings);
    }
  }

  async function loadStats() {
    const { data } = await supabase
      .from('adhd_user_stats')
      .select('total_starts, total_finishes, total_focus_minutes, current_streak_days')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setStats(data);
    }
  }

  async function loadTodayWins() {
    const { data } = await supabase
      .from('meaningful_wins')
      .select('id, win_text, completed')
      .eq('user_id', user?.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: true })
      .limit(2);

    if (data && data.length > 0) {
      setTodayWins(data);
    } else {
      const aiWins = [
        { win_text: 'Start one 5-minute focus block', suggested_by_ai: true },
        { win_text: 'Complete smallest task on your list', suggested_by_ai: true }
      ];

      const { data: inserted } = await supabase
        .from('meaningful_wins')
        .insert(aiWins.map(w => ({
          user_id: user?.id,
          ...w,
          date: new Date().toISOString().split('T')[0]
        })))
        .select('id, win_text, completed');

      if (inserted) setTodayWins(inserted);
    }
  }

  async function toggleWin(id: string, completed: boolean) {
    await supabase
      .from('meaningful_wins')
      .update({ completed: !completed, completed_at: !completed ? new Date().toISOString() : null })
      .eq('id', id);

    setTodayWins(prev => prev.map(w => w.id === id ? { ...w, completed: !completed } : w));
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setShowFocusFlow(true)}
          className="flex items-center justify-center gap-2 px-6 py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-sm transition-colors"
        >
          <Brain className="w-5 h-5" />
          <span className="font-medium">Start {settings.default_duration}m</span>
        </button>

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
                className="mt-1 h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              <span className={`flex-1 ${win.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {win.win_text}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Starts This Week</div>
          <div className="text-2xl font-semibold text-slate-900">{stats.total_starts}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Finishes</div>
          <div className="text-2xl font-semibold text-slate-900">{stats.total_finishes}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Focus Minutes</div>
          <div className="text-2xl font-semibold text-slate-900">{stats.total_focus_minutes}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Completion</div>
          <div className="text-2xl font-semibold text-violet-600">{completionRate}%</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-5">
        <h2 className="text-lg font-medium text-slate-900 mb-2">AI Memory Companion</h2>
        <p className="text-sm text-slate-600 mb-3">
          Based on your patterns, here's what might help today:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFocusFlow(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-violet-700 hover:bg-violet-100 transition-colors border border-violet-200"
          >
            Start 5m now
          </button>
          <button
            onClick={() => setShowQuickPlan(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-violet-700 hover:bg-violet-100 transition-colors border border-violet-200"
          >
            Break down next task
          </button>
          <button
            onClick={() => setShowRescue(true)}
            className="px-3 py-1.5 bg-white rounded-full text-sm text-violet-700 hover:bg-violet-100 transition-colors border border-violet-200"
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
    </div>
  );
}
