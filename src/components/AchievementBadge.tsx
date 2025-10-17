import React from 'react';
import * as Icons from 'lucide-react';

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
  earned_at?: string;
}

interface Props {
  achievement: Achievement;
  earned: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function AchievementBadge({ achievement, earned, size = 'medium' }: Props) {
  const IconComponent = (Icons as any)[achievement.icon] || Icons.Award;

  const sizes = {
    small: { container: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-xs' },
    medium: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-sm' },
    large: { container: 'w-32 h-32', icon: 'w-12 h-12', text: 'text-base' }
  };

  const sizeClasses = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses.container} rounded-2xl flex items-center justify-center transition-all duration-300 ${
          earned
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 scale-100'
            : 'border-2 border-dashed border-slate-300 bg-white/50 opacity-50 scale-95 hover:opacity-70 hover:scale-100'
        }`}
      >
        <IconComponent
          className={`${sizeClasses.icon} ${earned ? 'text-white' : 'text-slate-300'}`}
        />
      </div>
      <div className="text-center max-w-[100px]">
        <div className={`font-medium ${earned ? 'text-slate-900' : 'text-slate-400'} ${sizeClasses.text}`}>
          {achievement.name}
        </div>
        {earned && achievement.earned_at && (
          <div className="text-xs text-slate-500 mt-0.5">
            {new Date(achievement.earned_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
