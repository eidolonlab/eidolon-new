import React, { useState, useEffect } from 'react';
import { Armchair, CheckCircle } from 'lucide-react';

interface PlankHoldPlayerProps {
  duration: number;
  onComplete: () => void;
}

type FormPhase = 'ready' | 'holding' | 'challenge';

const PlankHoldPlayer: React.FC<PlankHoldPlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<FormPhase>('ready');
  const [formScore, setFormScore] = useState(100);

  useEffect(() => {
    if (phase === 'ready') {
      const startTimer = setTimeout(() => {
        setPhase('holding');
      }, 3000);
      return () => clearTimeout(startTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'holding') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }

        if (prev <= 10) {
          setPhase('challenge');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  useEffect(() => {
    if (phase !== 'holding' && phase !== 'challenge') return;

    const formInterval = setInterval(() => {
      setFormScore(prev => {
        const variation = Math.random() * 4 - 2;
        const newScore = Math.max(85, Math.min(100, prev + variation));
        return Math.round(newScore);
      });
    }, 1500);

    return () => clearInterval(formInterval);
  }, [phase]);

  const progress = ((duration - timeLeft) / duration) * 100;

  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Armchair className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Get Ready!</h3>
            <p className="text-slate-600">Prepare your plank position</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
            <div className="text-7xl mb-6 animate-bounce">🤸</div>
            <h4 className="text-xl font-bold text-indigo-900 mb-4">Proper Plank Form:</h4>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-indigo-800">Elbows directly under shoulders</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-indigo-800">Body in straight line from head to heels</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-indigo-800">Core engaged, don't let hips sag</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-indigo-800">Breathe steadily, don't hold breath</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-lg font-semibold text-indigo-700 animate-pulse">
            Starting in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Plank Hold</h3>
          <p className="text-sm text-slate-600">Hold strong! You've got this!</p>
        </div>

        <div className="mb-8 relative">
          <div className="w-full aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border-4 border-indigo-300 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />

            <div className="relative z-10 text-center">
              <div className="text-7xl mb-4 animate-subtle-bounce">
                {phase === 'challenge' ? '💪' : '🤸'}
              </div>
              <div className="text-6xl font-bold text-indigo-900 mb-2">{timeLeft}s</div>
              <div className={`text-sm font-medium ${
                phase === 'challenge' ? 'text-orange-700 animate-pulse' : 'text-indigo-700'
              }`}>
                {phase === 'challenge' ? 'FINAL PUSH!' : 'Keep holding!'}
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${formScore >= 95 ? 'bg-emerald-500' : formScore >= 90 ? 'bg-yellow-500' : 'bg-orange-500'} animate-pulse`} />
              <span className="text-sm text-slate-700">Form Quality</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">{formScore}%</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 text-center">
              <div className="text-3xl font-bold text-indigo-600">{duration - timeLeft}s</div>
              <div className="text-xs text-indigo-700">Time Held</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.round((duration - timeLeft) / duration * 100)}%</div>
              <div className="text-xs text-purple-700">Complete</div>
            </div>
          </div>

          <div className={`rounded-xl p-4 border-2 transition-colors ${
            phase === 'challenge'
              ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
              : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
          }`}>
            <p className="text-sm font-semibold text-slate-900 mb-2">
              {phase === 'challenge' ? '🔥 Final Push!' : 'Form Checklist:'}
            </p>
            <ul className="space-y-2">
              {phase === 'challenge' ? (
                <>
                  <li className="flex items-center gap-2 text-sm text-orange-800">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span>You're almost there! Don't give up!</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-orange-800">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span>Every second counts! Stay strong!</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2 text-sm text-indigo-800">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Keep your core tight</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-indigo-800">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Don't let your hips drop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-indigo-800">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Breathe evenly and steadily</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {timeLeft > 20 && (
            <div className="text-center text-sm text-indigo-700">
              Great form! You're doing amazing!
            </div>
          )}
          {timeLeft <= 20 && timeLeft > 10 && (
            <div className="text-center text-sm text-purple-700 font-medium">
              Halfway there! Keep that core engaged!
            </div>
          )}
          {timeLeft <= 10 && (
            <div className="text-center text-sm text-orange-700 font-bold animate-pulse">
              Final {timeLeft} seconds! You've got this! 💪
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlankHoldPlayer;
