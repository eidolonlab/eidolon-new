import React, { useState, useEffect } from 'react';
import { MoveVertical, MoveHorizontal, RotateCw, CheckCircle } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface StretchGuidePlayerProps {
  duration: number;
  onComplete: () => void;
}

type StretchStep = {
  name: string;
  duration: number;
  instruction: string;
  icon: React.ElementType;
  visual: string;
};

const stretchSteps: StretchStep[] = [
  {
    name: 'Reach Up',
    duration: 8,
    instruction: 'Reach both arms high above your head',
    icon: MoveVertical,
    visual: '🙆'
  },
  {
    name: 'Side Stretch',
    duration: 6,
    instruction: 'Lean gently to your left side',
    icon: MoveHorizontal,
    visual: '🤸'
  },
  {
    name: 'Side Stretch',
    duration: 6,
    instruction: 'Lean gently to your right side',
    icon: MoveHorizontal,
    visual: '🤸'
  },
  {
    name: 'Shoulder Rolls',
    duration: 6,
    instruction: 'Roll your shoulders backward slowly',
    icon: RotateCw,
    visual: '💪'
  },
  {
    name: 'Neck Release',
    duration: 4,
    instruction: 'Gently tilt your head side to side',
    icon: MoveHorizontal,
    visual: '😌'
  }
];

const StretchGuidePlayer: React.FC<StretchGuidePlayerProps> = ({ duration, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(stretchSteps[0].duration);
  const [totalTimeLeft, setTotalTimeLeft] = useState(duration);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = stretchSteps[currentStepIndex];
  const Icon = currentStep.icon;

  useEffect(() => {
    const totalTimer = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(totalTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(totalTimer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepTimeLeft(prev => {
        if (prev <= 1) {
          const nextIndex = currentStepIndex + 1;
          setCompletedSteps([...completedSteps, currentStepIndex]);

          if (nextIndex >= stretchSteps.length) {
            clearInterval(stepTimer);
            audioService.celebration();
            setTimeout(onComplete, 500);
            return 0;
          } else {
            audioService.success();
            setCurrentStepIndex(nextIndex);
            return stretchSteps[nextIndex].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(stepTimer);
  }, [currentStepIndex, completedSteps, onComplete]);

  const progress = (stepTimeLeft / currentStep.duration) * 100;
  const overallProgress = ((currentStepIndex + (1 - stepTimeLeft / currentStep.duration)) / stretchSteps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Stand & Stretch</h3>
          <p className="text-sm text-slate-600">Follow each stretch carefully</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full border-4 border-orange-200 relative">
            <div className="text-8xl animate-in zoom-in duration-300">
              {currentStep.visual}
            </div>
            <div
              className="absolute inset-0 rounded-full border-4 border-orange-500 transition-all duration-1000"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  {currentStep.name}
                </h4>
                <p className="text-slate-700">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Hold for...</span>
                <span className="font-bold text-orange-600">{stepTimeLeft}s</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="text-xs font-medium text-slate-600 mb-2">Progress</div>
          {stretchSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index === currentStepIndex
                  ? 'bg-orange-50 border-2 border-orange-300'
                  : completedSteps.includes(index)
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-slate-50 border-2 border-slate-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                completedSteps.includes(index)
                  ? 'bg-green-500'
                  : index === currentStepIndex
                  ? 'bg-orange-500'
                  : 'bg-slate-300'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                index === currentStepIndex ? 'font-bold text-orange-900' : 'text-slate-700'
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-orange-900 font-medium">Overall Progress</span>
            <span className="text-orange-700">{totalTimeLeft}s remaining</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StretchGuidePlayer;
