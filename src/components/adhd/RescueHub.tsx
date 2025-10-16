import React, { useState, useEffect } from 'react';
import { X, Heart, Target, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onClose: () => void;
}

type RescueType = 'overwhelm' | 'distraction' | 'emotion';

export default function RescueHub({ onClose }: Props) {
  const { user } = useAuth();
  const [rescueType, setRescueType] = useState<RescueType>('overwhelm');
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            finishRescue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  async function startRescue() {
    const { data } = await supabase
      .from('rescue_sessions')
      .insert({
        user_id: user?.id,
        rescue_type: rescueType
      })
      .select('id')
      .single();

    if (data) {
      setSessionId(data.id);
      setIsActive(true);
    }
  }

  async function finishRescue() {
    setIsActive(false);
    setShowRating(true);

    if (sessionId) {
      await supabase
        .from('rescue_sessions')
        .update({
          duration_seconds: 90 - secondsLeft
        })
        .eq('id', sessionId);
    }
  }

  async function saveRating() {
    if (sessionId && rating > 0) {
      await supabase
        .from('rescue_sessions')
        .update({ helpful_rating: rating })
        .eq('id', sessionId);
    }
    onClose();
  }

  const rescueConfig = {
    overwhelm: {
      title: 'Overwhelm → Reset',
      icon: Heart,
      color: 'rose',
      steps: [
        'Exhale for 6 seconds, inhale for 4 seconds — repeat 3 times',
        'Name the task in one line (out loud): "I\'m doing ___ for 5 minutes"',
        'Press Start 5m and begin with the smallest piece'
      ]
    },
    distraction: {
      title: 'Distraction → Refocus',
      icon: Target,
      color: 'blue',
      steps: [
        'Fix your eyes on one object for 20 seconds (gaze anchor)',
        'Close distractions: one click back to your work tab',
        'Say: "For the next 5 minutes, I\'m doing ___"',
        'Press Start 5m and begin immediately'
      ]
    },
    emotion: {
      title: 'Emotional Spike → De-fuse',
      icon: Sparkles,
      color: 'amber',
      steps: [
        'Say out loud: "I\'m noticing the thought/feeling of ___" (defusion)',
        'Take 3 slow exhales; relax your jaw and shoulders',
        'Ask: "What\'s the kind action right now?"',
        'Pick the tiniest helpful step and do it'
      ]
    }
  };

  const config = rescueConfig[rescueType];
  const Icon = config.icon;

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (showRating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">How helpful was that?</h2>

          <div className="flex gap-2 justify-center mb-6">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                  rating >= num
                    ? 'bg-violet-600 text-white scale-110'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveRating}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-${config.color}-100`}>
              <Icon className={`w-5 h-5 text-${config.color}-600`} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{config.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setRescueType('overwhelm')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              rescueType === 'overwhelm'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overwhelm
          </button>
          <button
            onClick={() => setRescueType('distraction')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              rescueType === 'distraction'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Distraction
          </button>
          <button
            onClick={() => setRescueType('emotion')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              rescueType === 'emotion'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Emotion
          </button>
        </div>

        {isActive && (
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-slate-900 tabular-nums mb-2">
              {formatTime(secondsLeft)}
            </div>
            <div className="text-sm text-slate-500">Follow the steps below</div>
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <ol className="space-y-3">
            {config.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-${config.color}-100 text-${config.color}-700 flex items-center justify-center text-sm font-medium`}>
                  {i + 1}
                </div>
                <div className="flex-1 text-sm text-slate-700 leading-relaxed">{step}</div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-slate-500 mb-4 text-center">
          Take your time with each step. This is about regulation, not speed.
        </p>

        <div className="flex gap-3">
          {!isActive ? (
            <>
              <button
                onClick={startRescue}
                className={`flex-1 px-4 py-3 bg-${config.color}-600 hover:bg-${config.color}-700 text-white rounded-xl font-medium transition-colors`}
              >
                Start Rescue
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={finishRescue}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
            >
              I'm Ready to Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
