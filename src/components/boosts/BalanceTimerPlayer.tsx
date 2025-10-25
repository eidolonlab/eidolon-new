import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle } from 'lucide-react';

interface BalanceTimerPlayerProps {
  duration: number;
  onComplete: () => void;
  exerciseName: string;
}

const BalanceTimerPlayer: React.FC<BalanceTimerPlayerProps> = ({ duration, onComplete, exerciseName }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [wobbleIntensity, setWobbleIntensity] = useState(0);

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
    const wobbleInterval = setInterval(() => {
      setWobbleIntensity(Math.random() * 5);
    }, 800);

    return () => clearInterval(wobbleInterval);
  }, []);

  const progress = ((duration - timeLeft) / duration) * 100;
  const isEyesClosed = exerciseName.toLowerCase().includes('eyes-closed');

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-900">{exerciseName}</h3>
          </div>
          <p className="text-sm text-slate-600">
            {isEyesClosed ? 'Keep your eyes closed and maintain balance' : 'Hold your balance steady'}
          </p>
        </div>

        <div className="mb-8 relative">
          <div className="w-64 h-64 mx-auto relative">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 transition-all duration-500"
              style={{
                transform: `rotate(${wobbleIntensity * 2}deg) scale(${1 + wobbleIntensity * 0.01})`
              }}
            />

            <div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 transition-all duration-500"
              style={{
                transform: `rotate(${-wobbleIntensity * 3}deg) scale(${1 + wobbleIntensity * 0.015})`
              }}
            />

            <div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 border-4 border-blue-400 transition-all duration-500"
              style={{
                transform: `rotate(${wobbleIntensity * 4}deg) scale(${1 + wobbleIntensity * 0.02})`
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {isEyesClosed && timeLeft > duration - 3 ? (
                  <div className="text-4xl mb-2 animate-pulse">👁️</div>
                ) : isEyesClosed && timeLeft <= duration - 3 ? (
                  <div className="text-4xl mb-2">🙈</div>
                ) : (
                  <div className="text-5xl mb-2">🧘</div>
                )}
                <div className="text-5xl font-bold text-blue-900">{timeLeft}s</div>
              </div>
            </div>

            <div
              className="absolute -inset-2 rounded-full border-4 border-dashed border-blue-300 transition-all duration-500"
              style={{
                transform: `rotate(${wobbleIntensity * 6}deg)`
              }}
            />
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-12 rounded-full transition-all duration-300 ${
                  wobbleIntensity < (i + 1) ? 'bg-emerald-500' : 'bg-red-400'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">Stability Indicator</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Progress</span>
              <span className="text-sm text-blue-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-3">Tips:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Fix your gaze on a point ahead (or close eyes if instructed)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Engage your core muscles</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Breathe steadily and relax</span>
              </li>
            </ul>
          </div>

          {timeLeft > duration / 2 && (
            <div className="text-center text-sm text-blue-700 animate-in fade-in duration-500">
              {isEyesClosed && timeLeft <= duration - 3 ? "Eyes closed - feel your balance!" : "You're doing great! Keep it steady..."}
            </div>
          )}
          {timeLeft <= duration / 2 && timeLeft > 5 && (
            <div className="text-center text-sm text-emerald-700 font-medium animate-in fade-in duration-500">
              Halfway there! Keep holding strong!
            </div>
          )}
          {timeLeft <= 5 && (
            <div className="text-center text-sm text-orange-700 font-bold animate-in fade-in duration-500">
              Almost done! Finish strong!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceTimerPlayer;
