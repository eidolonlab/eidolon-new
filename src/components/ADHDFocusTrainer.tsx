import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, RotateCcw, Target, Zap, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface ADHDFocusTrainerProps {
  onComplete: (results: {
    duration: number;
    distractions: number;
    focusScore: number;
    taskCompleted: boolean;
  }) => void;
}

const ADHDFocusTrainer: React.FC<ADHDFocusTrainerProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [distractionCount, setDistractionCount] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [focusBreaks, setFocusBreaks] = useState<Date[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusTasks = [
    "Write down 3 specific things you want to accomplish today",
    "Organize one small area of your workspace or room",
    "Read and summarize a short article or email",
    "Plan tomorrow's most important task in detail",
    "Write a brief reflection on something you learned recently",
    "Create a simple to-do list for the next 2 hours",
    "Practice deep breathing while focusing on your breath count",
    "Write down 5 things you're grateful for with specific details"
  ];

  const durations = [
    { minutes: 5, label: '5 min', description: 'Quick focus burst' },
    { minutes: 10, label: '10 min', description: 'Standard session' },
    { minutes: 15, label: '15 min', description: 'Deep focus' },
    { minutes: 25, label: '25 min', description: 'Pomodoro technique' }
  ];

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const startSession = () => {
    setIsActive(true);
    setStartTime(new Date());
    setTimeRemaining(selectedDuration);
    setDistractionCount(0);
    setFocusBreaks([]);
    setTaskCompleted(false);
    
    // Select random task
    const randomTask = focusTasks[Math.floor(Math.random() * focusTasks.length)];
    setCurrentTask(randomTask);
  };

  const pauseSession = () => {
    setIsActive(false);
    setFocusBreaks(prev => [...prev, new Date()]);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const recordDistraction = () => {
    setDistractionCount(prev => prev + 1);
    // Brief pause to acknowledge the distraction
    setIsActive(false);
    setTimeout(() => setIsActive(true), 2000);
  };

  const handleComplete = () => {
    setIsActive(false);
    
    if (startTime) {
      const actualDuration = selectedDuration - timeRemaining;
      const focusScore = Math.max(0, 100 - (distractionCount * 10) - (focusBreaks.length * 5));
      
      onComplete({
        duration: actualDuration,
        distractions: distractionCount,
        focusScore,
        taskCompleted
      });
    }
  };

  const reset = () => {
    setIsActive(false);
    setTimeRemaining(selectedDuration);
    setDistractionCount(0);
    setFocusBreaks([]);
    setTaskCompleted(false);
    setStartTime(null);
    setCurrentTask('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((selectedDuration - timeRemaining) / selectedDuration) * 100;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Focus Training</h2>
          <p className="text-sm text-gray-600">Build sustained attention and reduce distractibility</p>
        </div>
      </div>

      {!isActive && timeRemaining === selectedDuration ? (
        // Setup Phase
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Choose Session Duration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.minutes}
                  onClick={() => {
                    setSelectedDuration(duration.minutes * 60);
                    setTimeRemaining(duration.minutes * 60);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedDuration === duration.minutes * 60
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{duration.label}</div>
                  <div className="text-xs text-gray-600">{duration.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">How Focus Training Works</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Sustained attention:</strong> Focus on one task for the entire duration</p>
              <p>• <strong>Distraction awareness:</strong> Notice when your mind wanders</p>
              <p>• <strong>Gentle redirection:</strong> Return focus without self-judgment</p>
              <p>• <strong>Progress tracking:</strong> Build attention span over time</p>
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Play className="w-5 h-5" />
            <span>Start {formatTime(selectedDuration)} Focus Session</span>
          </button>
        </div>
      ) : (
        // Active Session
        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(getProgressPercentage())}% complete
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mt-4">
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
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{Math.round(getProgressPercentage())}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Task */}
          {currentTask && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">Focus Task</span>
              </div>
              <p className="text-indigo-800">{currentTask}</p>
              <div className="mt-3 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="taskComplete"
                  checked={taskCompleted}
                  onChange={(e) => setTaskCompleted(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="taskComplete" className="text-sm text-indigo-700">
                  I completed this task
                </label>
              </div>
            </div>
          )}

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{distractionCount}</div>
              <div className="text-xs text-gray-600">Distractions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{focusBreaks.length}</div>
              <div className="text-xs text-gray-600">Breaks</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {Math.max(0, 100 - (distractionCount * 10) - (focusBreaks.length * 5))}
              </div>
              <div className="text-xs text-gray-600">Focus Score</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={recordDistraction}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>I Got Distracted</span>
            </button>
            
            <button
              onClick={isActive ? pauseSession : resumeSession}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </button>
            
            <button
              onClick={reset}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Encouragement */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timeRemaining > selectedDuration * 0.8 ? "You're doing great! Stay focused on your task." :
               timeRemaining > selectedDuration * 0.5 ? "Halfway there! Your attention is strengthening." :
               timeRemaining > selectedDuration * 0.2 ? "Almost done! You're building real focus skills." :
               "Final stretch! You're proving you can sustain attention."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ADHDFocusTrainer;