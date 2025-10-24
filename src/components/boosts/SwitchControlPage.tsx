import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Play, CheckCircle, Timer, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BoostActivity {
  id: string;
  name: string;
  description: string;
  duration_seconds: number;
  difficulty_level: number;
  type: string;
  instructions: string[];
  encouragement_text: string[];
}

interface ActivityCardProps {
  activity: BoostActivity;
  onStart: () => void;
  completed: boolean;
}

function ActivityCard({ activity, onStart, completed }: ActivityCardProps) {
  const difficultyColors = {
    1: 'bg-emerald-100 text-emerald-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-amber-100 text-amber-700',
  };

  const difficultyLabel = {
    1: 'Easy',
    2: 'Medium',
    3: 'Challenging',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-orange-300 transition-all p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900">{activity.name}</h3>
            {completed && (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              difficultyColors[activity.difficulty_level as keyof typeof difficultyColors]
            }`}>
              {difficultyLabel[activity.difficulty_level as keyof typeof difficultyLabel]}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {activity.duration_seconds}s
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
      >
        <Play className="w-4 h-4" />
        <span>Start</span>
      </button>
    </div>
  );
}

export default function SwitchControlPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activities, setActivities] = useState<BoostActivity[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    loadCompletedToday();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('boost_activities')
        .select('*')
        .eq('pillar', 'switch_control')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error loading activities:', error);
        throw error;
      }

      if (data) {
        const formattedActivities = data.map(activity => ({
          ...activity,
          instructions: Array.isArray(activity.instructions) ? activity.instructions : [],
          encouragement_text: Array.isArray(activity.encouragement_text) ? activity.encouragement_text : []
        }));
        console.log('Loaded activities:', formattedActivities.length);
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedToday = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('boost_completions')
        .select('activity_id')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);

      if (error) throw error;

      setCompletedToday(new Set(data.map(c => c.activity_id)));
    } catch (error) {
      console.error('Error loading completed activities:', error);
    }
  };

  const handleStartActivity = (activity: BoostActivity) => {
    navigate(`/boosts/switch-control/activity/${activity.id}`, {
      state: { activity }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/boosts')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Boosts</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Switch Control</h1>
              <p className="text-sm text-slate-600">Break the loop. Start momentum.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-2">Quick Attention Shifts</h2>
              <p className="text-white/90 text-sm leading-relaxed">
                These micro-interventions help you shift from unhelpful mind states (rumination, distraction)
                into momentum and engagement. Pick any activity and start right now!
              </p>
            </div>
          </div>
        </div>

        {/* Completed Today Summary */}
        {completedToday.size > 0 && (
          <div className="mb-6 bg-white rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                {completedToday.size} {completedToday.size === 1 ? 'activity' : 'activities'} completed today!
              </span>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No activities available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStart={() => handleStartActivity(activity)}
                completed={completedToday.has(activity.id)}
              />
            ))}
          </div>
        )}

        {/* Bottom Disclaimer */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Non-medical focus support:</strong> These activities are designed to help you shift
            attention and build momentum. Not a substitute for professional mental health treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
