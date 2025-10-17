import React, { useState, useEffect } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import AppShell from '../components/AppShell';
import QuickTrainingStart from '../components/training/QuickTrainingStart';
import TrainingExercise from '../components/training/TrainingExercise';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AuthForm from '../components/AuthForm';

export default function TrainPage() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [weeklyStats, setWeeklyStats] = useState({ sessions: 0, totalScore: 0 });

  useEffect(() => {
    if (user) {
      loadWeeklyStats();
    }
  }, [user]);

  const loadWeeklyStats = async () => {
    if (!user?.id) return;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data } = await supabase
      .from('training_completions')
      .select('score')
      .eq('user_id', user.id)
      .gte('completed_at', oneWeekAgo.toISOString());

    if (data) {
      setWeeklyStats({
        sessions: data.length,
        totalScore: data.reduce((sum, item) => sum + (item.score || 0), 0),
      });
    }
  };

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Train Your Brain</h1>
            <p className="text-slate-600">Sign in to access cognitive training</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cognitive Training</h1>
          <p className="text-slate-600 text-sm mt-1">
            5-minute exercises to build mental fitness
          </p>
        </div>

        {weeklyStats.sessions > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl border border-violet-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                <span className="text-xs text-slate-600">This Week</span>
              </div>
              <div className="text-2xl font-bold text-violet-600">{weeklyStats.sessions}</div>
              <div className="text-xs text-slate-600">sessions</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600">Total Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalScore}</div>
              <div className="text-xs text-slate-600">points</div>
            </div>
          </div>
        )}

        <QuickTrainingStart onStart={(moduleId) => setActiveModule(moduleId)} />
      </div>

      {activeModule && (
        <TrainingExercise
          moduleId={activeModule}
          onClose={() => {
            setActiveModule(null);
            loadWeeklyStats();
          }}
        />
      )}
    </AppShell>
  );
}
