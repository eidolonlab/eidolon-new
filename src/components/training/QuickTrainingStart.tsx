import React, { useState } from 'react';
import { Brain, Eye, Zap, Timer, Play, TrendingUp } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ElementType;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const trainingModules: TrainingModule[] = [
  {
    id: 'working-memory',
    title: 'Working Memory',
    description: 'Remember and manipulate information',
    duration: '5 min',
    icon: Brain,
    color: 'violet',
    difficulty: 'beginner',
  },
  {
    id: 'sustained-attention',
    title: 'Sustained Attention',
    description: 'Build focus endurance',
    duration: '7 min',
    icon: Eye,
    color: 'blue',
    difficulty: 'beginner',
  },
  {
    id: 'executive-function',
    title: 'Executive Function',
    description: 'Plan and prioritize tasks',
    duration: '8 min',
    icon: Zap,
    color: 'emerald',
    difficulty: 'intermediate',
  },
  {
    id: 'micro-attention',
    title: 'Micro-Attention',
    description: 'Quick focus drills',
    duration: '2 min',
    icon: Timer,
    color: 'amber',
    difficulty: 'beginner',
  },
];

interface QuickTrainingStartProps {
  onStart?: (moduleId: string) => void;
  activeModule?: string | null;
}

const QuickTrainingStart: React.FC<QuickTrainingStartProps> = ({ onStart, activeModule = null }) => {
  const [localActiveModule, setLocalActiveModule] = useState<string | null>(null);

  const handleStart = (moduleId: string) => {
    audioService.softPop();
    if (onStart) {
      setTimeout(() => {
        onStart(moduleId);
      }, 300);
    } else {
      setLocalActiveModule(moduleId);
      setTimeout(() => {
        window.location.href = `/train/${moduleId}`;
      }, 300);
    }
  };

  const currentActiveModule = activeModule ?? localActiveModule;

  const recommendedModule = trainingModules[0];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-violet-900 mb-1">Recommended for You</h3>
            <p className="text-sm text-violet-700">
              Start with Working Memory - it's the foundation for all cognitive skills
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleStart(recommendedModule.id)}
        disabled={currentActiveModule !== null}
        className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8" fill="currentColor" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold">{recommendedModule.title}</div>
            <div className="text-violet-100 text-sm">{recommendedModule.duration} training</div>
          </div>
        </div>
      </button>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 px-1">Other Training Modules</h3>
        <div className="grid grid-cols-1 gap-2">
          {trainingModules.slice(1).map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => handleStart(module.id)}
                disabled={currentActiveModule !== null}
                className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:bg-violet-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${module.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${module.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900">{module.title}</h4>
                    <p className="text-xs text-slate-600 truncate">{module.description}</p>
                  </div>
                  <div className="text-xs font-medium text-slate-500">{module.duration}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Training Tips</h3>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex gap-2">
            <span>•</span>
            <span>Train daily for 5-10 minutes</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Start easy and progress gradually</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Combine with Focus sessions for best results</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuickTrainingStart;
