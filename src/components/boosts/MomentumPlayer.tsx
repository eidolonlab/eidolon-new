import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { audioService } from '../../lib/audioService';

interface MomentumPlayerProps {
  duration: number;
  onComplete: () => void;
}

type MomentumPhase = 'choose' | 'prepare' | 'act';

const taskSuggestions = [
  "Reply to one email",
  "Clear your desk",
  "Write one paragraph",
  "Make that phone call",
  "Review one document",
  "Organize one folder",
  "Complete one form",
  "Draft one message"
];

const MomentumPlayer: React.FC<MomentumPlayerProps> = ({ duration, onComplete }) => {
  const [phase, setPhase] = useState<MomentumPhase>('choose');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [customTask, setCustomTask] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    if (isWorking) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            audioService.celebration();
            setTimeout(onComplete, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWorking, onComplete]);

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task);
    audioService.softPop();
  };

  const handleStartWork = () => {
    if (!selectedTask && !customTask) return;
    audioService.success();
    setPhase('act');
    setIsWorking(true);
  };

  const taskToUse = customTask || selectedTask;
  const progress = ((120 - timeLeft) / 120) * 100;

  if (phase === 'choose') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <h3 className="text-2xl font-bold text-slate-900">Two Minute Start</h3>
            </div>
            <p className="text-slate-600">Pick ONE small task to complete right now</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Or type your own task..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none text-slate-900"
              maxLength={60}
            />
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-xs font-medium text-slate-600 mb-2">Quick suggestions:</p>
            {taskSuggestions.map((task, index) => (
              <button
                key={index}
                onClick={() => handleTaskSelect(task)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTask === task
                    ? 'bg-amber-50 border-amber-400'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedTask === task
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedTask === task && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${selectedTask === task ? 'text-amber-900 font-medium' : 'text-slate-700'}`}>
                    {task}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleStartWork}
            disabled={!taskToUse}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-102 active:scale-98"
          >
            Start 2 Minutes →
          </button>

          <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-xs text-amber-800">
              <strong>The secret:</strong> You only commit to 2 minutes. Once you start, momentum often carries you further!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'act') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm text-amber-800 font-medium mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              You're doing it!
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Working On:</h3>
            <div className="bg-white rounded-xl p-4 border-2 border-amber-300 shadow-lg">
              <p className="text-lg font-medium text-slate-900">{taskToUse}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#fef3c7"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-amber-600">{timeLeft}</div>
                <div className="text-sm text-amber-700">seconds</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
              <p className="text-center text-sm font-medium text-amber-900 mb-3">
                Keep going! Momentum is building...
              </p>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-full transition-all duration-500 ${
                      progress > (i * 20) ? 'bg-amber-500' : 'bg-amber-200'
                    }`}
                    style={{
                      transform: progress > (i * 20) ? 'scaleY(1.2)' : 'scaleY(1)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-600">
                {timeLeft > 90 && "You've got this! Just started..."}
                {timeLeft <= 90 && timeLeft > 60 && "Great! You're in the flow now"}
                {timeLeft <= 60 && timeLeft > 30 && "Halfway there! Keep that momentum"}
                {timeLeft <= 30 && "Almost done! Finish strong!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MomentumPlayer;
