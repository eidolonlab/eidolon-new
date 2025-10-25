import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { awardXP } from '../../lib/gamificationService';
import BreathTracePlayer from './BreathTracePlayer';
import GroundingPlayer from './GroundingPlayer';
import StretchGuidePlayer from './StretchGuidePlayer';
import ObjectFocusPlayer from './ObjectFocusPlayer';
import MomentumPlayer from './MomentumPlayer';

interface BoostActivity {
  id: string;
  name: string;
  description: string;
  duration_seconds: number;
  instructions: string[];
  encouragement_text: string[];
  pillar: string;
}

export default function ActivityPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activityId } = useParams();
  const { user } = useAuth();

  const [activity, setActivity] = useState<BoostActivity | null>(location.state?.activity || null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

  useEffect(() => {
    if (!activity && activityId) {
      loadActivity();
    } else if (activity) {
      setTimeLeft(activity.duration_seconds);
    }
  }, [activity, activityId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const loadActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('boost_activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (error) throw error;

      setActivity({
        ...data,
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
        encouragement_text: Array.isArray(data.encouragement_text) ? data.encouragement_text : []
      });
      setTimeLeft(data.duration_seconds);
    } catch (error) {
      console.error('Error loading activity:', error);
      navigate('/boosts');
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(activity?.duration_seconds || 0);
    setCurrentStep(0);
    setIsComplete(false);
  };

  const handleComplete = async () => {
    setIsRunning(false);
    setIsComplete(true);
    setShowMoodCheck(true);
  };

  const getSpecializedPlayer = () => {
    if (!activity) return null;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const commonProps = {
      duration: activity.duration_seconds,
      onComplete: handleComplete
    };

    const activityName = activity.name.toLowerCase();

    if (activityName.includes('breath')) {
      return <BreathTracePlayer {...commonProps} />;
    }
    if (activityName.includes('panic') || activityName.includes('redirect')) {
      return <GroundingPlayer {...commonProps} />;
    }
    if (activityName.includes('stretch')) {
      return <StretchGuidePlayer {...commonProps} />;
    }
    if (activityName.includes('object') || activityName.includes('focus')) {
      return <ObjectFocusPlayer {...commonProps} />;
    }
    if (activityName.includes('two minute') || activityName.includes('momentum')) {
      return <MomentumPlayer {...commonProps} />;
    }

    return null;
  };

  const specializedPlayer = getSpecializedPlayer();

  const saveCompletion = async () => {
    if (!user || !activity || !startTime) return;

    const duration = Date.now() - startTime;
    const xpAmount = 10;

    try {
      const { error } = await supabase.from('boost_completions').insert({
        user_id: user.id,
        activity_id: activity.id,
        duration_ms: duration,
        mood_before: moodBefore,
        mood_after: moodAfter,
        xp_awarded: xpAmount,
        completed_at: new Date().toISOString()
      });

      if (error) throw error;

      // Award XP for completing the activity
      await awardXP(user.id, xpAmount, `Completed boost activity: ${activity.name}`);

      // Navigate back with success message
      navigate('/boosts', {
        state: { completedActivity: activity.name }
      });
    } catch (error) {
      console.error('Error saving completion:', error);
    }
  };

  const getEncouragementMessage = () => {
    if (!activity || !activity.encouragement_text.length) return 'You\'re doing great!';
    const index = Math.floor(Math.random() * activity.encouragement_text.length);
    return activity.encouragement_text[index];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = activity ? ((activity.duration_seconds - timeLeft) / activity.duration_seconds) * 100 : 0;

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (showMoodCheck && !moodAfter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Nice Work!</h2>
            <p className="text-slate-600">How do you feel after completing this activity?</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(mood => (
              <button
                key={mood}
                onClick={() => {
                  setMoodAfter(mood);
                  saveCompletion();
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 hover:shadow-lg transition-all flex items-center justify-center text-white text-xl font-bold hover:scale-110"
              >
                {mood}
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-slate-500">1 = Low energy · 5 = High energy</p>

          <button
            onClick={() => {
              setMoodAfter(3);
              saveCompletion();
            }}
            className="mt-6 w-full text-slate-500 text-sm hover:text-slate-700"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  if (specializedPlayer && !isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-100 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
        {specializedPlayer}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-100 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Activity Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{activity.name}</h1>
          <p className="text-slate-600">{activity.description}</p>
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-slate-900">{formatTime(timeLeft)}</div>
            {isRunning && (
              <div className="text-sm text-orange-600 font-medium mt-2 animate-pulse">
                {getEncouragementMessage()}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isRunning && !isComplete && (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-full hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
            >
              <Play className="w-6 h-6" />
              <span>Start</span>
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-full hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Pause className="w-6 h-6" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="bg-slate-100 text-slate-600 font-bold py-4 px-8 rounded-full hover:shadow-lg transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border-2 border-orange-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-600" />
            Instructions
          </h3>
          <ol className="space-y-3">
            {activity.instructions.map((instruction, index) => (
              <li
                key={index}
                className={`flex gap-3 ${
                  index === currentStep && isRunning
                    ? 'text-orange-600 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-6 text-white text-center animate-fade-in">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Activity Complete!</h3>
            <p className="text-white/90">You did it! That's a win!</p>
          </div>
        )}
      </div>
    </div>
  );
}
