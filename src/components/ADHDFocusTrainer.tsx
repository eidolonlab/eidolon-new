import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, RotateCcw, Target, Zap, Clock, CheckCircle, AlertCircle, TrendingUp, Eye, Lightbulb } from 'lucide-react';

interface ADHDFocusTrainerProps {
  onComplete: (results: {
    profileName?: string;
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
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [personalizedTasks, setPersonalizedTasks] = useState<string[]>([]);
  const [focusZone, setFocusZone] = useState<'building' | 'peak' | 'declining'>('building');
  const [profileName, setProfileName] = useState('');
  const [useCustomProfile, setUseCustomProfile] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<Array<{
    name: string;
    sessions: number;
    avgFocusScore: number;
    avgDuration: number;
    lastUsed: Date;
  }>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusTasks = [
    "Write down 3 specific things you want to accomplish today",
    "Organize one small area of your workspace or room",
    "Read and summarize a short article or email",
    "Plan tomorrow's most important task in detail",
    "Write a brief reflection on something you learned recently",
    "Create a simple to-do list for the next 2 hours",
    "Practice deep breathing while focusing on your breath count",
    "Write down 5 things you're grateful for with specific details",
    "Organize your digital desktop or phone home screen",
    "Read one article and write a 3-sentence summary",
    "Plan your ideal evening routine in detail",
    "Write a letter to your future self about today"
  ];

  // Load saved profiles
  useEffect(() => {
    const saved = localStorage.getItem('eidolon-focus-profiles');
    if (saved) {
      const profiles = JSON.parse(saved).map((p: any) => ({
        ...p,
        lastUsed: new Date(p.lastUsed)
      }));
      setSavedProfiles(profiles);
    }
  }, []);

  const durations = [
    { minutes: 5, label: '5 min', description: 'Quick focus burst' },
    { minutes: 10, label: '10 min', description: 'Standard session' },
    { minutes: 15, label: '15 min', description: 'Deep focus' },
    { minutes: 25, label: '25 min', description: 'Pomodoro technique' }
  ];

  // Generate personalized tasks based on user's current state and history
  useEffect(() => {
    generatePersonalizedTasks();
    assessFocusZone();
  }, [distractionCount, timeRemaining, selectedDuration]);

  const generatePersonalizedTasks = () => {
    const tasks = [];
    const timeLeft = timeRemaining;
    const sessionProgress = ((selectedDuration - timeRemaining) / selectedDuration) * 100;
    
    if (sessionProgress < 25) {
      tasks.push("Start with organizing one small area of your workspace");
      tasks.push("Write down your top 3 priorities for today");
    } else if (sessionProgress < 50) {
      tasks.push("Tackle a moderately challenging task you've been avoiding");
      tasks.push("Practice a skill you want to improve");
    } else if (sessionProgress < 75) {
      tasks.push("Focus on detailed work that requires sustained attention");
      tasks.push("Complete a task that needs careful planning");
    } else {
      tasks.push("Finish strong with a satisfying completion task");
      tasks.push("Reflect on what you've accomplished in this session");
    }
    
    setPersonalizedTasks(tasks);
  };

  const assessFocusZone = () => {
    const sessionProgress = ((selectedDuration - timeRemaining) / selectedDuration) * 100;
    const distractionRate = distractionCount / Math.max(1, (selectedDuration - timeRemaining) / 60);
    
    if (sessionProgress < 30 || distractionRate > 2) {
      setFocusZone('building');
    } else if (sessionProgress < 80 && distractionRate < 1) {
      setFocusZone('peak');
    } else {
      setFocusZone('declining');
    }
  };

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
    
    if (adaptiveMode) {
      // Adaptive response based on distraction count
      if (distractionCount >= 3) {
        // Suggest a micro-break
        setIsActive(false);
        setTimeout(() => {
          alert("💡 Micro-break: Take 30 seconds to look out a window or do deep breathing");
          setIsActive(true);
        }, 1000);
      } else {
        // Brief acknowledgment
        setIsActive(false);
        setTimeout(() => setIsActive(true), 1500);
      }
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    
    if (startTime) {
      const actualDuration = selectedDuration - timeRemaining;
      const focusScore = Math.max(0, 100 - (distractionCount * 10) - (focusBreaks.length * 5));
      
      // Update profile data if using custom profile
      if (useCustomProfile && profileName.trim()) {
        updateProfileData(focusScore, actualDuration);
      }
      
      onComplete({
        profileName: useCustomProfile ? profileName : undefined,
        duration: actualDuration,
        distractions: distractionCount,
        focusScore,
        taskCompleted
      });
    }
  };

  const updateProfileData = (focusScore: number, duration: number) => {
    const profiles = [...savedProfiles];
    const existingIndex = profiles.findIndex(p => p.name === profileName.trim());
    
    if (existingIndex >= 0) {
      const existing = profiles[existingIndex];
      profiles[existingIndex] = {
        ...existing,
        sessions: existing.sessions + 1,
        avgFocusScore: (existing.avgFocusScore * existing.sessions + focusScore) / (existing.sessions + 1),
        avgDuration: (existing.avgDuration * existing.sessions + duration) / (existing.sessions + 1),
        lastUsed: new Date()
      };
    } else {
      profiles.push({
        name: profileName.trim(),
        sessions: 1,
        avgFocusScore: focusScore,
        avgDuration: duration,
        lastUsed: new Date()
      });
    }
    
    setSavedProfiles(profiles);
    localStorage.setItem('eidolon-focus-profiles', JSON.stringify(profiles));
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

          {/* Adaptive Features Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="adaptive"
              checked={adaptiveMode}
              onChange={(e) => setAdaptiveMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="adaptive" className="text-sm text-gray-700">
              Enable adaptive coaching (AI adjusts based on your performance)
            </label>
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
          {/* Focus Zone Indicator */}
          <div className={`p-4 rounded-lg border ${
            focusZone === 'peak' ? 'bg-emerald-50 border-emerald-200' :
            focusZone === 'building' ? 'bg-blue-50 border-blue-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Eye className={`w-4 h-4 ${
                focusZone === 'peak' ? 'text-emerald-600' :
                focusZone === 'building' ? 'text-blue-600' :
                'text-yellow-600'
              }`} />
              <span className={`font-medium ${
                focusZone === 'peak' ? 'text-emerald-900' :
                focusZone === 'building' ? 'text-blue-900' :
                'text-yellow-900'
              }`}>
                {focusZone === 'peak' ? 'Peak Focus Zone' :
                 focusZone === 'building' ? 'Building Focus' :
                 'Focus Declining'}
              </span>
            </div>
            <p className={`text-sm ${
              focusZone === 'peak' ? 'text-emerald-800' :
              focusZone === 'building' ? 'text-blue-800' :
              'text-yellow-800'
            }`}>
              {focusZone === 'peak' ? 
                'Excellent! This is your optimal focus time. Tackle your most challenging tasks now.' :
                focusZone === 'building' ?
                'Your attention is warming up. Start with moderate difficulty tasks.' :
                'Focus is naturally declining. Consider lighter tasks or take a break soon.'
              }
            </p>
          </div>

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

          {/* Personalized Task Suggestions */}
          {personalizedTasks.length > 0 && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">Suggested Focus Tasks</span>
              </div>
              <div className="space-y-2">
                {personalizedTasks.map((task, index) => (
                  <div key={index} className="text-sm text-indigo-800 bg-white rounded p-2 border border-indigo-200">
                    • {task}
                  </div>
                ))}
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
            
            {/* Training Profile Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useProfile"
                  checked={useCustomProfile}
                  onChange={(e) => setUseCustomProfile(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="useProfile" className="text-sm text-gray-700">
                  Create named training profile (track progress separately)
                </label>
              </div>
              
              {useCustomProfile && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Focus Training Profile Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g., Morning Focus, Post-Coffee, Deep Work"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Track different focus training conditions separately
                    </p>
                  </div>
                  
                  {/* Existing Profiles */}
                  {savedProfiles.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or select existing profile:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {savedProfiles.map((profile, index) => (
                          <button
                            key={index}
                            onClick={() => setProfileName(profile.name)}
                            className={`p-2 text-left border rounded-lg transition-colors ${
                              profileName === profile.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-sm">{profile.name}</div>
                            <div className="text-xs text-gray-500">
                              {profile.sessions} sessions • Avg: {Math.round(profile.avgFocusScore)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </button>
            
            <button
              onClick={reset}
              disabled={useCustomProfile && !profileName.trim()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                Start {formatTime(selectedDuration)} 
                {useCustomProfile && profileName.trim() ? ` "${profileName}"` : ''} Focus Session
              </span>
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