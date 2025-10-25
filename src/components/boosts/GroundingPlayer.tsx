import React, { useState, useEffect } from 'react';
import { Eye, Hand, Ear, Wind, Cookie, CheckCircle } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface GroundingPlayerProps {
  duration: number;
  onComplete: () => void;
}

type GroundingStep = {
  count: number;
  sense: string;
  prompt: string;
  icon: React.ElementType;
  color: string;
  examples: string[];
};

const groundingSteps: GroundingStep[] = [
  {
    count: 5,
    sense: 'SEE',
    prompt: 'Name 5 things you can see',
    icon: Eye,
    color: 'blue',
    examples: ['The wall color', 'A picture', 'Your hands', 'The ceiling', 'Light source']
  },
  {
    count: 4,
    sense: 'TOUCH',
    prompt: 'Name 4 things you can touch',
    icon: Hand,
    color: 'emerald',
    examples: ['Your chair', 'Your clothes', 'The floor', 'A nearby object']
  },
  {
    count: 3,
    sense: 'HEAR',
    prompt: 'Name 3 things you can hear',
    icon: Ear,
    color: 'violet',
    examples: ['Breathing sounds', 'Distant traffic', 'Air conditioning']
  },
  {
    count: 2,
    sense: 'SMELL',
    prompt: 'Name 2 things you can smell',
    icon: Wind,
    color: 'amber',
    examples: ['The air', 'Your clothes']
  },
  {
    count: 1,
    sense: 'TASTE',
    prompt: 'Name 1 thing you can taste',
    icon: Cookie,
    color: 'rose',
    examples: ['Your mouth']
  }
];

const GroundingPlayer: React.FC<GroundingPlayerProps> = ({ duration, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);

  const currentStep = groundingSteps[currentStepIndex];
  const Icon = currentStep.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleItemClick = (index: number) => {
    if (completed.includes(index)) return;

    audioService.softPop();
    const newCompleted = [...completed, index];
    setCompleted(newCompleted);

    if (newCompleted.length === currentStep.count) {
      setTimeout(() => {
        if (currentStepIndex < groundingSteps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
          setCompleted([]);
          audioService.success();
        } else {
          audioService.celebration();
          setTimeout(onComplete, 1000);
        }
      }, 500);
    }
  };

  const progress = ((currentStepIndex * 5 + completed.length) / 15) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon className={`w-6 h-6 text-${currentStep.color}-600`} />
            <h3 className="text-2xl font-bold text-slate-900">
              {currentStep.sense}
            </h3>
          </div>
          <p className="text-lg text-slate-700 mb-4">{currentStep.prompt}</p>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className={`bg-gradient-to-r from-${currentStep.color}-500 to-${currentStep.color}-600 h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Step {currentStepIndex + 1} of 5 • {timeLeft}s remaining
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {Array.from({ length: currentStep.count }).map((_, index) => {
            const isCompleted = completed.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleItemClick(index)}
                disabled={isCompleted}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all transform
                  ${isCompleted
                    ? `bg-${currentStep.color}-50 border-${currentStep.color}-300 scale-95`
                    : `bg-white border-slate-200 hover:border-${currentStep.color}-300 hover:bg-${currentStep.color}-50 hover:scale-102 active:scale-98`
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${isCompleted
                      ? `bg-${currentStep.color}-500`
                      : `bg-${currentStep.color}-100`
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className={`text-xl font-bold text-${currentStep.color}-700`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    {isCompleted ? (
                      <span className={`text-${currentStep.color}-900 font-medium`}>
                        Acknowledged
                      </span>
                    ) : (
                      <span className="text-slate-600">
                        Tap when you notice something
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className={`bg-${currentStep.color}-50 rounded-xl p-4 border border-${currentStep.color}-100`}>
          <p className="text-xs font-medium text-slate-700 mb-2">Examples:</p>
          <ul className="space-y-1">
            {currentStep.examples.map((example, idx) => (
              <li key={idx} className={`text-xs text-${currentStep.color}-800 flex items-center gap-2`}>
                <span className="w-1 h-1 bg-current rounded-full" />
                {example}
              </li>
            ))}
          </ul>
        </div>

        {currentStepIndex === groundingSteps.length - 1 && completed.length === currentStep.count && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              You're grounded! 🌟
            </div>
            <p className="text-sm text-slate-600">
              You've reconnected with the present moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundingPlayer;
