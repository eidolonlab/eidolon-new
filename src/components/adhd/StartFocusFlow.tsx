import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FocusSettings {
  default_duration: number;
  body_double_enabled: boolean;
  brown_noise_enabled: boolean;
  last_task: string;
}

interface Props {
  settings: FocusSettings;
  onClose: () => void;
  onSettingsUpdate: (settings: FocusSettings) => void;
  onStatsUpdate: () => void;
}

export default function StartFocusFlow({ settings, onClose, onSettingsUpdate, onStatsUpdate }: Props) {
  const { user } = useAuth();
  const [task, setTask] = useState(settings.last_task);
  const [duration, setDuration] = useState(settings.default_duration);
  const [bodyDouble, setBodyDouble] = useState(settings.body_double_enabled);
  const [brownNoise, setBrownNoise] = useState(settings.brown_noise_enabled);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [steps, setSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [reflectionEmoji, setReflectionEmoji] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (task && steps.length === 0) {
      generateSteps();
    }
  }, [task]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            finishSession(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const handleBlur = () => {
        if (isRunning && !isPaused) {
          document.title = '↩ Return to task • Eidolon';
        }
      };
      const handleFocus = () => {
        document.title = 'Eidolon';
      };

      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isRunning, isPaused]);

  function generateSteps() {
    const words = task.split(' ');
    const title = words.slice(0, 4).join(' ');
    setSteps([
      `Open tools for ${title}`,
      'Draft first sentence or step',
      'Polish and save'
    ]);
  }

  async function startSession() {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user?.id,
        task,
        duration_preset: duration,
        supports_used: {
          body_double: bodyDouble,
          brown_noise: brownNoise
        },
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (data) {
      setSessionId(data.id);
      setIsRunning(true);
      startTimeRef.current = Date.now();

      await supabase
        .from('focus_user_settings')
        .update({
          last_task: task,
          default_duration: duration,
          body_double_enabled: bodyDouble,
          brown_noise_enabled: brownNoise
        })
        .eq('user_id', user?.id);

      onSettingsUpdate({
        ...settings,
        last_task: task,
        default_duration: duration,
        body_double_enabled: bodyDouble,
        brown_noise_enabled: brownNoise
      });
    }
  }

  async function finishSession(completed: boolean) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    const actualDuration = Math.round((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);

    if (sessionId) {
      await supabase
        .from('focus_sessions')
        .update({
          completed,
          actual_duration: actualDuration,
          steps_completed: completedSteps,
          finished_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      onStatsUpdate();
    }

    if (completed) {
      setShowReflection(true);
    } else {
      onClose();
    }
  }

  async function saveReflection() {
    if (sessionId && (reflectionEmoji || reflectionText)) {
      await supabase
        .from('focus_sessions')
        .update({
          reflection_emoji: reflectionEmoji,
          reflection_text: reflectionText
        })
        .eq('id', sessionId);
    }

    if (reflectionText.trim()) {
      await supabase
        .from('meaningful_wins')
        .insert({
          user_id: user?.id,
          win_text: reflectionText,
          suggested_by_ai: false,
          completed: true,
          completed_at: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0]
        });
    }

    onClose();
  }

  function toggleStep(step: string) {
    setCompletedSteps(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const emojis = ['😊', '🎯', '💪', '��', '⚡', '🌟', '✨', '🎉'];

  if (showReflection) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Session Complete!</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">How did it go?</label>
            <div className="flex gap-2 flex-wrap">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setReflectionEmoji(emoji)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    reflectionEmoji === emoji
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What helped or what hindered? (Optional)
            </label>
            <input
              type="text"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="e.g., Timer helped, phone was distracting"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveReflection}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
            >
              Save & Close
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isRunning ? 'Focus Session' : 'Start Focus Session'}
          </h2>
          <button
            onClick={() => isRunning ? finishSession(false) : onClose()}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isRunning ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What are you working on?</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g., Draft slide 3 of presentation"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
              <div className="flex gap-3">
                {[25, 15, 5].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setDuration(mins);
                      setSecondsLeft(mins * 60);
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      duration === mins
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={bodyDouble}
                  onChange={(e) => setBodyDouble(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <div className="font-medium text-slate-900">Body-Double Mode</div>
                  <div className="text-xs text-slate-500">Ambient "someone's here" presence</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={brownNoise}
                  onChange={(e) => setBrownNoise(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <div>
                  <div className="font-medium text-slate-900">Background Sound</div>
                  <div className="text-xs text-slate-500">Brown noise for focus</div>
                </div>
              </label>
            </div>

            <button
              onClick={startSession}
              disabled={!task.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Focus
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 tabular-nums mb-2">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-lg text-slate-600">{task}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm font-medium text-slate-700 mb-3">Steps</div>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(step)}
                      onChange={() => toggleStep(step)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={`text-sm ${completedSteps.includes(step) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {step}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (isPaused) {
                    setIsPaused(false);
                    startTimeRef.current = Date.now() - ((duration * 60 - secondsLeft) * 1000);
                  } else {
                    setIsPaused(true);
                    pausedTimeRef.current += Date.now() - startTimeRef.current;
                    if (intervalRef.current) clearInterval(intervalRef.current);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={() => finishSession(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <Check className="w-5 h-5" />
                Finish
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Tip: If you switch tabs, we'll gently remind you to return—no judgment, just support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
