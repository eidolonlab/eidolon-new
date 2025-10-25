import React, { useState, useEffect } from 'react';
import { Target, Star } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface PatternThrowPlayerProps {
  duration: number;
  onComplete: () => void;
}

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

const positions: Position[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];

const PatternThrowPlayer: React.FC<PatternThrowPlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentTarget, setCurrentTarget] = useState<Position>('center');
  const [hitCount, setHitCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const targetInterval = setInterval(() => {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setCurrentTarget(randomPosition);
    }, 2500);

    return () => clearInterval(targetInterval);
  }, []);

  const handleTargetHit = (position: Position) => {
    if (position === currentTarget) {
      audioService.success();
      setHitCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setCurrentTarget(randomPosition);
    } else {
      audioService.error?.();
      setStreak(0);
    }
  };

  const getPositionClasses = (position: Position) => {
    const baseClasses = 'absolute w-20 h-20 rounded-full transition-all duration-300';
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
    };
    return `${baseClasses} ${positions[position]}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const accuracy = hitCount > 0 ? Math.round((hitCount / (duration - timeLeft)) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-6 h-6 text-violet-600" />
            <h3 className="text-2xl font-bold text-slate-900">Pattern Throw</h3>
          </div>
          <p className="text-sm text-slate-600">Tap the glowing target as fast as you can!</p>
        </div>

        <div className="mb-6 relative h-80 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-4 border-violet-200 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          {positions.map((position) => (
            <button
              key={position}
              onClick={() => handleTargetHit(position)}
              className={`${getPositionClasses(position)} ${
                currentTarget === position
                  ? 'bg-gradient-to-br from-violet-400 to-purple-500 scale-110 animate-pulse shadow-xl'
                  : 'bg-violet-200 scale-90 opacity-30'
              } border-4 border-white flex items-center justify-center focus:outline-none active:scale-95`}
            >
              {currentTarget === position && (
                <Target className="w-10 h-10 text-white" />
              )}
            </button>
          ))}

          <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
            <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-sm font-bold text-violet-900">
              {timeLeft}s
            </div>
            {streak >= 3 && (
              <div className="bg-emerald-500 text-white rounded-lg px-3 py-1 text-sm font-bold animate-in zoom-in">
                🔥 {streak} Streak!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-violet-50 rounded-xl p-3 border border-violet-200 text-center">
            <div className="text-2xl font-bold text-violet-600">{hitCount}</div>
            <div className="text-xs text-violet-700">Hits</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-600">{streak}</div>
            <div className="text-xs text-purple-700">Streak</div>
          </div>
          <div className="bg-fuchsia-50 rounded-xl p-3 border border-fuchsia-200 text-center">
            <div className="text-2xl font-bold text-fuchsia-600">{accuracy}%</div>
            <div className="text-xs text-fuchsia-700">Speed</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-violet-900">Progress</span>
              <Star className="w-4 h-4 text-violet-600" />
            </div>
            <div className="w-full bg-violet-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
            <p className="text-sm font-semibold text-violet-900 mb-3">Benefits:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="text-violet-500 font-bold">•</span>
                <span>Hand-eye coordination training</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="text-violet-500 font-bold">•</span>
                <span>Reaction time improvement</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="text-violet-500 font-bold">•</span>
                <span>Focus and attention practice</span>
              </li>
            </ul>
          </div>

          {hitCount === 0 && timeLeft < duration - 2 && (
            <div className="text-center text-sm text-violet-700 font-medium animate-pulse">
              Tap the glowing target! 🎯
            </div>
          )}
          {hitCount >= 5 && hitCount < 10 && (
            <div className="text-center text-sm text-purple-700 font-medium">
              You're on fire! Keep it up! 🔥
            </div>
          )}
          {hitCount >= 10 && (
            <div className="text-center text-sm text-emerald-700 font-bold">
              Amazing reflexes! You're a pro! ⚡
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternThrowPlayer;
