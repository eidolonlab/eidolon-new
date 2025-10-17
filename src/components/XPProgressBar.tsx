import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  currentXP: number;
  level: number;
  totalXP: number;
  showDetails?: boolean;
}

function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function getXPProgressInLevel(totalXP: number, level: number): { current: number; needed: number; percentage: number } {
  let xpSoFar = 0;
  for (let i = 1; i < level; i++) {
    xpSoFar += calculateXPForLevel(i);
  }

  const xpInCurrentLevel = totalXP - xpSoFar;
  const xpNeededForNextLevel = calculateXPForLevel(level);
  const percentage = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    percentage
  };
}

export default function XPProgressBar({ currentXP, level, totalXP, showDetails = true }: Props) {
  const progress = getXPProgressInLevel(totalXP, level);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Level {level}</div>
            {showDetails && (
              <div className="text-xs text-slate-500">
                {progress.current} / {progress.needed} XP
              </div>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="text-xs font-medium text-blue-600">
            {totalXP.toLocaleString()} total XP
          </div>
        )}
      </div>

      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse-gentle"></div>
        </div>
      </div>
    </div>
  );
}
