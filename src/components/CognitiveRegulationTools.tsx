import React, { useState, useEffect } from 'react';
import { Heart, Brain, Clock, Play, Pause, CheckCircle, Zap, Target, Activity } from 'lucide-react';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface CognitiveRegulationToolsProps {
  cognitiveState?: CognitiveState;
  onComplete: () => void;
}

const CognitiveRegulationTools: React.FC<CognitiveRegulationToolsProps> = ({ cognitiveState, onComplete }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes default
  const [currentStep, setCurrentStep] = useState(0);
  const [beforeRating, setBeforeRating] = useState(5);
  const [afterRating, setAfterRating] = useState(5);
  const [sessionPhase, setSessionPhase] = useState<'setup' | 'active' | 'complete'>('setup');

  const techniques = {
    breathing: {
      name: '4-7-8 Breathing',
      duration: 120,
      description: 'Calm your nervous system with rhythmic breathing',
      steps: [
        'Exhale completely through your mouth',
        'Close your mouth, inhale through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat this cycle'
      ],
      color: 'blue'
    },
    grounding: {
      name: '5-4-3-2-1 Grounding',
      duration: 90,
      description: 'Ground yourself in the present moment',
      steps: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      color: 'emerald'
    },
    progressive: {
      name: 'Progressive Relaxation',
      duration: 180,
      description: 'Release physical tension systematically',
      steps: [
        'Tense your toes for 5 seconds, then release',
        'Tense your calves, then release',
        'Continue up through legs, abdomen, arms',
        'Tense your shoulders, then release',
        'Finish with face muscles - scrunch and release'
      ],
      color: 'purple'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionPhase('complete');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startTechnique = (techniqueKey: string) => {
    const technique = techniques[techniqueKey as keyof typeof techniques];
    setSelectedTechnique(techniqueKey);
    setTimeRemaining(technique.duration);
    setCurrentStep(0);
    setSessionPhase('active');
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionPhase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cognitive Regulation</h2>
          <p className="text-gray-600">Reset your nervous system for optimal performance</p>
        </div>

        {/* Stress Level Check */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How stressed or overwhelmed do you feel right now? (1-10)
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => setBeforeRating(level)}
                className={`w-8 h-8 rounded-full transition-colors ${
                  level <= beforeRating 
                    ? level <= 3 ? 'bg-green-500' :
                      level <= 6 ? 'bg-yellow-500' :
                      level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                    : 'bg-gray-300'
                }`}
              >
                <span className="text-white text-xs font-bold">{level}</span>
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {beforeRating <= 3 ? 'Mild stress - any technique will help' :
             beforeRating <= 6 ? 'Moderate stress - breathing or grounding recommended' :
             beforeRating <= 8 ? 'High stress - immediate regulation needed' :
             'Severe stress - start with breathing technique'}
          </div>
        </div>

        {/* Technique Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Choose Your Technique</h3>
          {Object.entries(techniques).map(([key, technique]) => (
            <button
              key={key}
              onClick={() => startTechnique(key)}
              className={`w-full p-4 bg-${technique.color}-50 border border-${technique.color}-200 rounded-xl hover:bg-${technique.color}-100 transition-all text-left`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{technique.name}</h4>
                <span className="text-sm text-gray-500">{Math.round(technique.duration / 60)} min</span>
              </div>
              <p className="text-sm text-gray-600">{technique.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (sessionPhase === 'active' && selectedTechnique) {
    const technique = techniques[selectedTechnique as keyof typeof techniques];
    const progress = ((technique.duration - timeRemaining) / technique.duration) * 100;
    const currentInstruction = technique.steps[Math.min(currentStep, technique.steps.length - 1)];

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-${technique.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Heart className={`w-8 h-8 text-${technique.color}-600`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{technique.name}</h2>
          <div className="text-4xl font-bold text-gray-900 mb-2">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-600">Follow the guided instructions</div>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={technique.color === 'blue' ? '#3b82f6' : 
                       technique.color === 'emerald' ? '#10b981' : '#8b5cf6'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-lg font-bold text-${technique.color}-600`}>
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Instruction */}
        <div className={`p-4 bg-${technique.color}-50 rounded-xl border border-${technique.color}-200 mb-6`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className={`w-4 h-4 text-${technique.color}-600`} />
            <span className={`font-medium text-${technique.color}-900`}>Step {currentStep + 1}</span>
          </div>
          <p className={`text-${technique.color}-800`}>{currentInstruction}</p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center space-x-2 px-4 py-2 bg-${technique.color}-600 text-white rounded-lg hover:bg-${technique.color}-700 transition-colors`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>
          
          <button
            onClick={() => {
              if (currentStep < technique.steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              }
            }}
            disabled={currentStep >= technique.steps.length - 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'complete') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Regulation Complete</h2>
          <p className="text-gray-600">How are you feeling now?</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stress level after technique (1-10)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setAfterRating(level)}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    level <= afterRating 
                      ? level <= 3 ? 'bg-green-500' :
                        level <= 6 ? 'bg-yellow-500' :
                        level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span className="text-white text-xs font-bold">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {beforeRating > afterRating && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-emerald-900">Improvement Detected!</span>
              </div>
              <p className="text-emerald-800">
                Stress reduced by {beforeRating - afterRating} points 
                ({Math.round(((beforeRating - afterRating) / beforeRating) * 100)}% improvement)
              </p>
            </div>
          )}

          <button
            onClick={onComplete}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Continue with Clearer Mind
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CognitiveRegulationTools;