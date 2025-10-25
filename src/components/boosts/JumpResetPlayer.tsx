import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface JumpResetPlayerProps {
  duration: number;
  onComplete: () => void;
}

const JumpResetPlayer: React.FC<JumpResetPlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [jumpCount, setJumpCount] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [energy, setEnergy] = useState(0);

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

  const handleJump = () => {
    if (isJumping) return;

    setIsJumping(true);
    setJumpCount(prev => prev + 1);
    setEnergy(prev => Math.min(100, prev + 5));
    audioService.softPop();

    setTimeout(() => {
      setIsJumping(false);
    }, 400);
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const targetJumps = Math.floor(duration / 3);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-orange-600" />
            <h3 className="text-2xl font-bold text-slate-900">Jump Reset</h3>
          </div>
          <p className="text-sm text-slate-600">Quick energy burst - Jump whenever you're ready!</p>
        </div>

        <div className="mb-8 relative">
          <button
            onClick={handleJump}
            className="w-full aspect-square max-w-xs mx-auto relative focus:outline-none active:scale-95 transition-transform"
          >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 transition-all duration-200 ${
              isJumping ? 'scale-125 opacity-50' : 'scale-100 opacity-100'
            }`} />

            <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 transition-all duration-200 ${
              isJumping ? 'scale-125 opacity-50' : 'scale-100 opacity-100'
            }`} />

            <div className={`absolute inset-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 border-4 border-orange-500 flex items-center justify-center transition-all duration-200 ${
              isJumping ? 'scale-0' : 'scale-100'
            }`}>
              <div className="text-center">
                <div className={`text-6xl mb-2 transition-transform duration-200 ${
                  isJumping ? 'translate-y-[-20px]' : 'translate-y-0'
                }`}>
                  🏃
                </div>
                <div className="text-sm font-bold text-white">TAP TO JUMP!</div>
              </div>
            </div>

            {isJumping && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl animate-in zoom-in duration-200">⚡</div>
              </div>
            )}
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 text-center">
              <div className="text-2xl font-bold text-orange-600">{jumpCount}</div>
              <div className="text-xs text-orange-700">Jumps</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-center">
              <div className="text-2xl font-bold text-amber-600">{timeLeft}s</div>
              <div className="text-xs text-amber-700">Time Left</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
              <div className="text-2xl font-bold text-emerald-600">{energy}%</div>
              <div className="text-xs text-emerald-700">Energy</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-900">Energy Level</span>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="w-full bg-orange-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-3">How to Jump:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-orange-800">
                <span className="text-orange-500 font-bold">1.</span>
                <span>Tap the circle or jump in place</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-orange-800">
                <span className="text-orange-500 font-bold">2.</span>
                <span>Jump as high as you comfortably can</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-orange-800">
                <span className="text-orange-500 font-bold">3.</span>
                <span>Land softly on the balls of your feet</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-orange-800">
                <span className="text-orange-500 font-bold">4.</span>
                <span>Try for {targetJumps} jumps in {duration} seconds!</span>
              </li>
            </ul>
          </div>

          {jumpCount === 0 && timeLeft < duration - 3 && (
            <div className="text-center text-sm text-orange-700 font-medium animate-pulse">
              Start jumping! Tap the circle!
            </div>
          )}
          {jumpCount > 0 && jumpCount < targetJumps / 2 && (
            <div className="text-center text-sm text-amber-700 font-medium">
              Great start! Keep going! 🔥
            </div>
          )}
          {jumpCount >= targetJumps / 2 && jumpCount < targetJumps && (
            <div className="text-center text-sm text-emerald-700 font-medium">
              Awesome! You're on fire! ⚡
            </div>
          )}
          {jumpCount >= targetJumps && (
            <div className="text-center text-sm text-green-700 font-bold animate-pulse">
              Target reached! You're amazing! 🌟
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JumpResetPlayer;
