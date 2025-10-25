import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';

interface BreathTracePlayerProps {
  duration: number;
  onComplete: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const BreathTracePlayer: React.FC<BreathTracePlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const breathingCycle = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 1
  };

  const totalCycleTime = Object.values(breathingCycle).reduce((a, b) => a + b, 0);
  const totalCycles = Math.floor(duration / totalCycleTime);

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
    const phaseTimer = setInterval(() => {
      setPhaseTime(prev => {
        const nextTime = prev + 0.1;
        const currentPhaseDuration = breathingCycle[phase];

        if (nextTime >= currentPhaseDuration) {
          if (phase === 'inhale') {
            setPhase('hold');
          } else if (phase === 'hold') {
            setPhase('exhale');
          } else if (phase === 'exhale') {
            setPhase('rest');
          } else {
            setPhase('inhale');
            setCycleCount(prev => prev + 1);
          }
          return 0;
        }
        return nextTime;
      });
    }, 100);

    return () => clearInterval(phaseTimer);
  }, [phase]);

  const getCircleScale = () => {
    const progress = phaseTime / breathingCycle[phase];
    if (phase === 'inhale') {
      return 0.4 + (progress * 0.6);
    } else if (phase === 'exhale') {
      return 1 - (progress * 0.6);
    } else if (phase === 'hold') {
      return 1;
    }
    return 0.4;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe out...';
      case 'rest':
        return 'Rest...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-cyan-400 to-teal-400';
      case 'exhale':
        return 'from-teal-400 to-blue-400';
      case 'rest':
        return 'from-blue-300 to-blue-400';
    }
  };

  const scale = getCircleScale();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wind className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-900">Breath Trace</h3>
        </div>
        <p className="text-sm text-slate-600">Follow the expanding circle</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        <div
          className={`absolute rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-100 ease-linear`}
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            opacity: 0.3 + (scale * 0.2)
          }}
        />

        <div
          className={`absolute rounded-full border-4 bg-gradient-to-br ${getPhaseColor()} transition-all duration-100 ease-linear`}
          style={{
            width: `${scale * 80}%`,
            height: `${scale * 80}%`,
            opacity: 0.5 + (scale * 0.3)
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {getPhaseText()}
            </div>
            <div className="text-sm text-blue-700">
              {Math.ceil(breathingCycle[phase] - phaseTime)}s
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-slate-600">Cycle {cycleCount + 1}/{totalCycles}</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="text-slate-600">{timeLeft}s remaining</div>
        </div>

        <div className="max-w-md mx-auto bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs text-blue-800">
            <strong>Breathe with the circle:</strong> As it expands, breathe in deeply.
            When it holds, hold your breath. As it contracts, breathe out slowly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathTracePlayer;
