import React from 'react';
import * as Icons from 'lucide-react';
import { X } from 'lucide-react';

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
}

interface Props {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementUnlockModal({ achievement, onClose }: Props) {
  if (!achievement) return null;

  const IconComponent = (Icons as any)[achievement.icon] || Icons.Award;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl shadow-amber-500/30">
            <IconComponent className="w-12 h-12 text-white" />
          </div>

          <div>
            <div className="text-sm font-medium text-blue-600 mb-1">Achievement Unlocked!</div>
            <h2 className="text-2xl font-bold text-slate-900">{achievement.name}</h2>
            <p className="text-slate-600 mt-2">{achievement.description}</p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-sm font-medium text-blue-700">+{achievement.xp_reward} XP</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
