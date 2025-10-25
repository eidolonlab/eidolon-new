import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeftRight } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface WallTouchSprintPlayerProps {
  duration: number;
  onComplete: () => void;
}

const WallTouchSprintPlayer: React.FC<WallTouchSprintPlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [touchCount, setTouchCount] = useState(0);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setIsReady(false);
    }, 3000);

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (isReady) return;

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
  }, [isReady, onComplete]);

  const handleTouch = (side: 'left' | 'right') => {
    if (side === currentSide) {
      audioService.success();
      setTouchCount(prev => prev + 1);
      setCurrentSide(side === 'left' ? 'right' : 'left');
    }
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const touchesPerSecond = touchCount > 0 ? (touchCount / (duration - timeLeft)).toFixed(1) : '0.0';

  if (isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Zap className="w-16 h-16 text-cyan-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Get Ready!</h3>
            <p className="text-slate-600">Wall Touch Sprint starting soon...</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-200">
            <div className="text-7xl mb-6">🏃‍♂️</div>
            <h4 className="text-xl font-bold text-cyan-900 mb-4">How to Play:</h4>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold text-lg">1.</span>
                <span className="text-sm text-cyan-800">Tap the glowing wall (left or right)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold text-lg">2.</span>
                <span className="text-sm text-cyan-800">Move to the opposite side</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold text-lg">3.</span>
                <span className="text-sm text-cyan-800">Keep alternating as fast as you can!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold text-lg">4.</span>
                <span className="text-sm text-cyan-800">Or actually run and touch your walls!</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-lg font-semibold text-cyan-700 animate-pulse">
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
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowLeftRight className="w-6 h-6 text-cyan-600" />
            <h3 className="text-2xl font-bold text-slate-900">Wall Touch Sprint</h3>
          </div>
          <p className="text-sm text-slate-600">Tap the glowing side!</p>
        </div>

        <div className="mb-6 relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-4 border-slate-300 overflow-hidden">
          <button
            onClick={() => handleTouch('left')}
            className={`absolute left-0 top-0 bottom-0 w-1/2 transition-all duration-200 border-r-2 border-slate-400 focus:outline-none active:scale-95 ${
              currentSide === 'left'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-2xl'
                : 'bg-slate-200 opacity-50'
            }`}
          >
            <div className="h-full flex flex-col items-center justify-center">
              {currentSide === 'left' && (
                <>
                  <div className="text-6xl mb-4 animate-bounce">👈</div>
                  <div className="text-4xl font-bold text-white mb-2">LEFT</div>
                  <div className="text-sm text-cyan-100 font-medium">TAP HERE!</div>
                </>
              )}
            </div>
          </button>

          <button
            onClick={() => handleTouch('right')}
            className={`absolute right-0 top-0 bottom-0 w-1/2 transition-all duration-200 border-l-2 border-slate-400 focus:outline-none active:scale-95 ${
              currentSide === 'right'
                ? 'bg-gradient-to-l from-blue-400 to-blue-500 shadow-2xl'
                : 'bg-slate-200 opacity-50'
            }`}
          >
            <div className="h-full flex flex-col items-center justify-center">
              {currentSide === 'right' && (
                <>
                  <div className="text-6xl mb-4 animate-bounce">👉</div>
                  <div className="text-4xl font-bold text-white mb-2">RIGHT</div>
                  <div className="text-sm text-blue-100 font-medium">TAP HERE!</div>
                </>
              )}
            </div>
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-full px-4 py-2 text-2xl font-bold text-slate-900 shadow-lg z-10">
            {timeLeft}s
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-200 text-center">
            <div className="text-2xl font-bold text-cyan-600">{touchCount}</div>
            <div className="text-xs text-cyan-700">Touches</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{touchesPerSecond}</div>
            <div className="text-xs text-blue-700">Per Second</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
            <div className="text-2xl font-bold text-emerald-600">{Math.round(progress)}%</div>
            <div className="text-xs text-emerald-700">Complete</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
            <div className="w-full bg-cyan-200 rounded-full h-3 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
            <p className="text-sm font-semibold text-cyan-900 mb-3">Benefits:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-cyan-800">
                <Zap className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Quick movement coordination</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-cyan-800">
                <Zap className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Cardiovascular burst</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-cyan-800">
                <Zap className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Agility improvement</span>
              </li>
            </ul>
          </div>

          {touchCount === 0 && timeLeft < duration - 2 && (
            <div className="text-center text-sm text-cyan-700 font-medium animate-pulse">
              Start tapping the glowing side! 👈👉
            </div>
          )}
          {touchCount >= 5 && touchCount < 10 && (
            <div className="text-center text-sm text-blue-700 font-medium">
              You're fast! Keep moving! ⚡
            </div>
          )}
          {touchCount >= 10 && (
            <div className="text-center text-sm text-emerald-700 font-bold">
              Lightning speed! Amazing! 🔥
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallTouchSprintPlayer;
