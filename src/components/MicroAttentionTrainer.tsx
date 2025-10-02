import React, { useState, useEffect, useRef } from 'react';
import { Brain, Target, Clock, Star, Zap, Play, Pause, RotateCcw, Award, TrendingUp, Users, Heart, Eye, Activity, Sparkles, Shield, Rocket } from 'lucide-react';

interface MicroAttentionSession {
  id: string;
  userType: 'child' | 'adult';
  duration: number;
  successRate: number;
  attentionBreaks: number;
  completedTasks: number;
  date: Date;
  profileName?: string;
  transferSkills: string[];
}

interface AttentionTask {
  id: string;
  type: 'visual_tracking' | 'audio_following' | 'breathing_sync' | 'story_focus' | 'movement_focus';
  duration: number;
  difficulty: 'micro' | 'mini' | 'short' | 'medium';
  description: string;
  childFriendly: boolean;
  adultVersion: string;
  childVersion: string;
}

interface MicroAttentionTrainerProps {
  onComplete: (results: {
    profileName?: string;
    userType: 'child' | 'adult';
    totalDuration: number;
    successRate: number;
    attentionSpanImprovement: number;
    transferSkills: string[];
  }) => void;
}

const MicroAttentionTrainer: React.FC<MicroAttentionTrainerProps> = ({ onComplete }) => {
  const [userType, setUserType] = useState<'child' | 'adult' | null>(null);
  const [sessionState, setSessionState] = useState<'setup' | 'training' | 'break' | 'complete'>('setup');
  const [currentTask, setCurrentTask] = useState<AttentionTask | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [attentionBreaks, setAttentionBreaks] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [attentionLevel, setAttentionLevel] = useState(5);
  const [profileName, setProfileName] = useState('');
  const [useCustomProfile, setUseCustomProfile] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<MicroAttentionSession[]>([]);
  const [parentMode, setParentMode] = useState(false);
  const [childAge, setChildAge] = useState(8);
  const [realWorldTransfer, setRealWorldTransfer] = useState<string[]>([]);

  const attentionTasks: AttentionTask[] = [
    {
      id: 'visual-tracking',
      type: 'visual_tracking',
      duration: 30,
      difficulty: 'micro',
      description: 'Follow the moving object with your eyes',
      childFriendly: true,
      childVersion: '🌟 Follow the magic star as it dances around the screen!',
      adultVersion: 'Track the moving target to build sustained visual attention'
    },
    {
      id: 'breathing-sync',
      type: 'breathing_sync',
      duration: 45,
      difficulty: 'micro',
      description: 'Breathe in sync with the visual guide',
      childFriendly: true,
      childVersion: '🫁 Help the balloon grow and shrink with your breathing!',
      adultVersion: 'Synchronize breathing with visual cues for attention regulation'
    },
    {
      id: 'story-focus',
      type: 'story_focus',
      duration: 60,
      difficulty: 'mini',
      description: 'Listen to a short story and answer questions',
      childFriendly: true,
      childVersion: '📚 Listen to the adventure and help solve the mystery!',
      adultVersion: 'Focused listening exercise with comprehension check'
    },
    {
      id: 'movement-focus',
      type: 'movement_focus',
      duration: 90,
      difficulty: 'mini',
      description: 'Controlled movement while maintaining attention',
      childFriendly: true,
      childVersion: '🤸 Dance and move while keeping your eyes on the target!',
      adultVersion: 'Kinesthetic attention training with movement integration'
    },
    {
      id: 'audio-following',
      type: 'audio_following',
      duration: 120,
      difficulty: 'short',
      description: 'Follow audio cues and respond at the right moments',
      childFriendly: true,
      childVersion: '🎵 Listen for the special sounds and tap when you hear them!',
      adultVersion: 'Auditory attention training with selective listening'
    }
  ];

  useEffect(() => {
    loadSessionHistory();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeCurrentTask();
            return 0;
          }
          return prev - 1;
        });
        setTotalSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const loadSessionHistory = () => {
    const saved = localStorage.getItem('eidolon-micro-attention-history');
    if (saved) {
      const history = JSON.parse(saved).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessionHistory(history);
    }
  };

  const saveSessionHistory = (newHistory: MicroAttentionSession[]) => {
    setSessionHistory(newHistory);
    localStorage.setItem('eidolon-micro-attention-history', JSON.stringify(newHistory));
  };

  const startTraining = () => {
    if (!userType) return;
    
    setSessionState('training');
    selectNextTask();
  };

  const selectNextTask = () => {
    // Progressive task selection based on completed tasks and user type
    const availableTasks = attentionTasks.filter(task => {
      if (userType === 'child') {
        return task.childFriendly && task.duration <= (30 + completedTasks * 15);
      } else {
        return task.duration <= (45 + completedTasks * 20);
      }
    });

    const nextTask = availableTasks[completedTasks % availableTasks.length];
    setCurrentTask(nextTask);
    setTimeRemaining(nextTask.duration);
    setIsActive(true);
    
    // Generate age-appropriate encouragement
    generateEncouragement(nextTask);
  };

  const generateEncouragement = (task: AttentionTask) => {
    if (userType === 'child') {
      const childEncouragement = [
        "🌟 You're building super focus powers!",
        "🚀 Your attention is getting stronger every second!",
        "⭐ Amazing! You're becoming a focus superhero!",
        "🎯 Wow! Your brain is learning to pay attention like a champion!",
        "🏆 Incredible focus! You're training your attention muscles!"
      ];
      setEncouragement(childEncouragement[Math.floor(Math.random() * childEncouragement.length)]);
    } else {
      const adultEncouragement = [
        "🧠 Building sustained attention networks through neuroplasticity",
        "🎯 Each second of focus strengthens your attention control",
        "⚡ Developing executive attention and cognitive control",
        "🔬 Training your brain's attention regulation systems",
        "📈 Progressive attention building - you're improving!"
      ];
      setEncouragement(adultEncouragement[Math.floor(Math.random() * adultEncouragement.length)]);
    }
  };

  const recordAttentionBreak = () => {
    setAttentionBreaks(prev => prev + 1);
    setCurrentStreak(0);
    
    // Provide immediate support
    setSessionState('break');
    setIsActive(false);
    
    if (userType === 'child') {
      setEncouragement("🌈 That's okay! Let's take a quick brain break and try again!");
    } else {
      setEncouragement("💡 Attention wandered? That's normal! Let's reset and continue building.");
    }
  };

  const resumeFromBreak = () => {
    setSessionState('training');
    setIsActive(true);
    
    if (userType === 'child') {
      setEncouragement("🚀 Ready for more focus adventures? You've got this!");
    } else {
      setEncouragement("🎯 Attention reset complete. Continuing progressive training.");
    }
  };

  const completeCurrentTask = () => {
    setCompletedTasks(prev => prev + 1);
    setCurrentStreak(prev => {
      const newStreak = prev + 1;
      setMaxStreak(current => Math.max(current, newStreak));
      return newStreak;
    });
    setIsActive(false);

    // Check if session should continue
    if (completedTasks >= 4 || totalSessionTime >= 300) { // Max 5 tasks or 5 minutes
      completeSession();
    } else {
      // Brief celebration before next task
      if (userType === 'child') {
        setEncouragement(`🎉 Task complete! You focused for ${currentTask?.duration} seconds! Ready for the next adventure?`);
      } else {
        setEncouragement(`✅ Task completed! Attention sustained for ${currentTask?.duration}s. Building to next level.`);
      }
      
      setTimeout(() => {
        selectNextTask();
      }, 2000);
    }
  };

  const completeSession = () => {
    const successRate = completedTasks > 0 ? ((completedTasks - attentionBreaks) / completedTasks) * 100 : 0;
    const attentionSpanImprovement = calculateImprovement();
    
    // Save session
    const newSession: MicroAttentionSession = {
      id: Date.now().toString(),
      userType: userType!,
      duration: totalSessionTime,
      successRate,
      attentionBreaks,
      completedTasks,
      date: new Date(),
      profileName: useCustomProfile ? profileName : undefined,
      transferSkills: realWorldTransfer
    };

    saveSessionHistory([newSession, ...sessionHistory]);
    
    setSessionState('complete');
    
    onComplete({
      profileName: useCustomProfile ? profileName : undefined,
      userType: userType!,
      totalDuration: totalSessionTime,
      successRate,
      attentionSpanImprovement,
      transferSkills: realWorldTransfer
    });
  };

  const calculateImprovement = () => {
    const recentSessions = sessionHistory.filter(s => s.userType === userType).slice(0, 5);
    if (recentSessions.length === 0) return 0;
    
    const avgPreviousDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
    return ((totalSessionTime - avgPreviousDuration) / avgPreviousDuration) * 100;
  };

  const restartSession = () => {
    setSessionState('setup');
    setCompletedTasks(0);
    setAttentionBreaks(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setTotalSessionTime(0);
    setIsActive(false);
    setCurrentTask(null);
  };

  const continueFromWhereStopped = () => {
    setSessionState('training');
    selectNextTask();
  };

  if (sessionState === 'setup') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Micro-Attention Training</h2>
            <p className="text-sm text-gray-600">Ultra-short focus building for quick distractibility</p>
          </div>
        </div>

        {/* User Type Selection */}
        {!userType && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Who is this training for?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType('child')}
                  className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl hover:border-pink-300 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-pink-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Child (Ages 5-12)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Fun, gamified attention training with stories and movement
                  </p>
                  <div className="text-xs text-pink-700 space-y-1">
                    <div>• 30-second micro-sprints</div>
                    <div>• Story-based adventures</div>
                    <div>• Movement integration</div>
                    <div>• Parent dashboard</div>
                  </div>
                </button>

                <button
                  onClick={() => setUserType('adult')}
                  className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adult</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Professional attention training for work and daily life
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>• 45-second progressive building</div>
                    <div>• Professional context training</div>
                    <div>• Stress-attention integration</div>
                    <div>• Real-world transfer tracking</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Child Setup */}
        {userType === 'child' && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-pink-600" />
                <span className="font-medium text-pink-900">Focus Superhero Training</span>
              </div>
              <p className="text-pink-800 text-sm">
                🦸‍♀️ Welcome to Focus Academy! You're going to become a Focus Superhero by training your attention powers. 
                Each task makes your focus stronger, and you'll unlock new abilities!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Age (helps us customize the training)
              </label>
              <div className="flex space-x-2">
                {[5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                  <button
                    key={age}
                    onClick={() => setChildAge(age)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      childAge === age
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="parentMode"
                checked={parentMode}
                onChange={(e) => setParentMode(e.target.checked)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="parentMode" className="text-sm text-gray-700">
                Parent/Guardian Mode (get coaching tips and progress insights)
              </label>
            </div>
          </div>
        )}

        {/* Adult Setup */}
        {userType === 'adult' && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Professional Attention Training</span>
              </div>
              <p className="text-blue-800 text-sm">
                🎯 Build sustained attention through progressive micro-training. Research shows that starting with 
                ultra-short intervals and gradually extending builds stronger attention networks than traditional methods.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What real-world situations need better focus?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Reading/studying', 'Work meetings', 'Conversations', 'Driving',
                  'Listening to others', 'Following instructions', 'Completing tasks', 'Meditation/mindfulness'
                ].map((skill) => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={realWorldTransfer.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRealWorldTransfer(prev => [...prev, skill]);
                        } else {
                          setRealWorldTransfer(prev => prev.filter(s => s !== skill));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Selection */}
        {userType && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useProfile"
                checked={useCustomProfile}
                onChange={(e) => setUseCustomProfile(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="useProfile" className="text-sm text-gray-700">
                Create named training profile (track progress separately)
              </label>
            </div>
            
            {useCustomProfile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder={userType === 'child' ? 
                    "e.g., Emma's Morning Training, After School Focus" : 
                    "e.g., Work Focus, Reading Concentration, Meeting Attention"
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {/* Progress History Preview */}
        {sessionHistory.filter(s => s.userType === userType).length > 0 && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Your Progress</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {sessionHistory.filter(s => s.userType === userType).length}
                </div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {sessionHistory.filter(s => s.userType === userType).length > 0 ?
                    Math.round(sessionHistory.filter(s => s.userType === userType)
                      .reduce((sum, s) => sum + s.duration, 0) / 
                      sessionHistory.filter(s => s.userType === userType).length) : 0}s
                </div>
                <div className="text-xs text-gray-600">Avg Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {sessionHistory.filter(s => s.userType === userType).length > 0 ?
                    Math.round(sessionHistory.filter(s => s.userType === userType)
                      .reduce((sum, s) => sum + s.successRate, 0) / 
                      sessionHistory.filter(s => s.userType === userType).length) : 0}%
                </div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={startTraining}
            disabled={useCustomProfile && !profileName.trim()}
            className={`px-8 py-4 rounded-xl text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userType === 'child'
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {userType === 'child' ? 'Start Focus Adventure!' : 'Begin Attention Training'}
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === 'training' && currentTask) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            userType === 'child' 
              ? 'bg-gradient-to-br from-pink-100 to-purple-100' 
              : 'bg-gradient-to-br from-blue-100 to-indigo-100'
          }`}>
            <Target className={`w-8 h-8 ${
              userType === 'child' ? 'text-pink-600' : 'text-blue-600'
            }`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {userType === 'child' ? 'Focus Adventure' : 'Attention Training'}
          </h2>
          <p className="text-gray-600">
            {userType === 'child' ? currentTask.childVersion : currentTask.adultVersion}
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold mb-2 ${
            timeRemaining <= 10 ? 'text-red-600 animate-pulse' :
            timeRemaining <= 20 ? 'text-orange-600' :
            userType === 'child' ? 'text-pink-600' : 'text-blue-600'
          }`}>
            {timeRemaining}
          </div>
          <div className="text-sm text-gray-600">
            {userType === 'child' ? 'Focus power building...' : 'Attention training active'}
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-24 h-24 mx-auto mt-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                stroke={userType === 'child' ? '#ec4899' : '#3b82f6'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (timeRemaining / currentTask.duration)}`}
                className="transition-all duration-1000"
              />
            </svg>
          </div>
        </div>

        {/* Task-Specific Interface */}
        {currentTask.type === 'visual_tracking' && (
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 transition-all duration-1000 ${
              userType === 'child' 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 animate-bounce' 
                : 'bg-gradient-to-br from-blue-400 to-indigo-400'
            }`} style={{
              transform: `translateX(${Math.sin(Date.now() / 1000) * 50}px)`
            }}>
              {userType === 'child' ? '⭐' : '🎯'}
            </div>
            <p className="text-sm text-gray-600">
              {userType === 'child' ? 'Keep your eyes on the magic star!' : 'Track the moving target with your eyes'}
            </p>
          </div>
        )}

        {currentTask.type === 'breathing_sync' && (
          <div className="text-center mb-6">
            <div 
              className={`w-20 h-20 rounded-full mx-auto mb-4 transition-all duration-2000 ${
                userType === 'child' 
                  ? 'bg-gradient-to-br from-blue-300 to-cyan-300' 
                  : 'bg-gradient-to-br from-blue-400 to-indigo-400'
              }`}
              style={{
                transform: `scale(${1 + Math.sin(Date.now() / 2000) * 0.3})`
              }}
            >
              {userType === 'child' ? '🎈' : '🫁'}
            </div>
            <p className="text-sm text-gray-600">
              {userType === 'child' ? 'Breathe with the balloon!' : 'Synchronize your breathing with the guide'}
            </p>
          </div>
        )}

        {/* Encouragement */}
        {encouragement && (
          <div className={`p-3 rounded-lg border mb-6 ${
            userType === 'child' 
              ? 'bg-pink-50 border-pink-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-center font-medium ${
              userType === 'child' ? 'text-pink-800' : 'text-blue-800'
            }`}>
              {encouragement}
            </p>
          </div>
        )}

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{completedTasks}</div>
            <div className="text-xs text-gray-600">
              {userType === 'child' ? 'Adventures' : 'Tasks'} Done
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{currentStreak}</div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{Math.round(totalSessionTime / 60)}m</div>
            <div className="text-xs text-gray-600">Total Time</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={recordAttentionBreak}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userType === 'child'
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {userType === 'child' ? '🌈 Brain Break' : '💭 Attention Wandered'}
          </button>
          
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userType === 'child'
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={completeSession}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userType === 'child'
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {userType === 'child' ? '🏆 Finish' : 'Complete'}
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === 'break') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            userType === 'child' 
              ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
              : 'bg-gradient-to-br from-orange-100 to-red-100'
          }`}>
            <Heart className={`w-8 h-8 ${
              userType === 'child' ? 'text-yellow-600' : 'text-orange-600'
            }`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {userType === 'child' ? 'Brain Break Time!' : 'Attention Reset'}
          </h2>
          <p className="text-gray-600">
            {encouragement}
          </p>
        </div>

        {/* Break Activities */}
        <div className="space-y-4 mb-6">
          {userType === 'child' ? (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h3 className="font-medium text-yellow-900 mb-3">🌈 Quick Brain Break Activities:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-yellow-800">
                <div>• 🤸 Do 5 jumping jacks</div>
                <div>• 🫁 Take 3 deep breaths</div>
                <div>• 👀 Look out the window</div>
                <div>• 💧 Drink some water</div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-3">🧘 Attention Reset Techniques:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-orange-800">
                <div>• 4-7-8 breathing technique</div>
                <div>• 5-4-3-2-1 grounding exercise</div>
                <div>• Brief mindful observation</div>
                <div>• Progressive muscle relaxation</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resumeFromBreak}
            className={`px-6 py-3 rounded-lg transition-colors ${
              userType === 'child'
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {userType === 'child' ? '🚀 Continue Adventure' : '🎯 Resume Training'}
          </button>
          
          <button
            onClick={completeSession}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {userType === 'child' ? '🏠 Finish for Now' : 'End Session'}
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === 'complete') {
    const successRate = completedTasks > 0 ? ((completedTasks - attentionBreaks) / completedTasks) * 100 : 0;
    const avgTaskDuration = completedTasks > 0 ? totalSessionTime / completedTasks : 0;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            userType === 'child' 
              ? 'bg-gradient-to-br from-emerald-100 to-teal-100' 
              : 'bg-gradient-to-br from-emerald-100 to-green-100'
          }`}>
            <Award className={`w-8 h-8 ${
              userType === 'child' ? 'text-emerald-600' : 'text-emerald-600'
            }`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {userType === 'child' ? '🎉 Focus Mission Complete!' : '✅ Training Session Complete'}
          </h2>
          <p className="text-gray-600">
            {userType === 'child' ? 
              `Amazing work! You're becoming a real Focus Superhero!` :
              `Excellent work building your attention control systems.`
            }
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`text-center p-4 rounded-lg ${
            userType === 'child' ? 'bg-pink-50' : 'bg-blue-50'
          }`}>
            <div className={`text-2xl font-bold ${
              userType === 'child' ? 'text-pink-600' : 'text-blue-600'
            }`}>
              {Math.round(totalSessionTime / 60)}m
            </div>
            <div className="text-sm text-gray-600">Total Focus Time</div>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">
              {userType === 'child' ? 'Adventures' : 'Tasks'} Done
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Math.round(successRate)}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Improvement Message */}
        {(() => {
          const improvement = calculateImprovement();
          if (improvement > 10) {
            return (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">
                    {userType === 'child' ? 
                      `🚀 Your focus powers grew by ${Math.round(improvement)}%!` :
                      `📈 Attention span improved by ${Math.round(improvement)}%!`
                    }
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Parent Insights */}
        {userType === 'child' && parentMode && (
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-indigo-900">Parent Insights</span>
            </div>
            <div className="text-sm text-indigo-800 space-y-2">
              <p>• <strong>Attention span:</strong> {Math.round(avgTaskDuration)}s average per task</p>
              <p>• <strong>Break pattern:</strong> {attentionBreaks} attention breaks (normal for building focus)</p>
              <p>• <strong>Engagement:</strong> {successRate > 70 ? 'High' : successRate > 50 ? 'Moderate' : 'Building'} sustained attention</p>
              <p>• <strong>Next steps:</strong> {
                successRate > 80 ? 'Ready for slightly longer tasks' :
                successRate > 60 ? 'Continue current level to build consistency' :
                'Focus on shorter bursts and more breaks'
              }</p>
            </div>
          </div>
        )}

        {/* Restart Options */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={restartSession}
              className={`px-4 py-3 rounded-lg transition-colors ${
                userType === 'child'
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {userType === 'child' ? '🔄 New Adventure' : '🔄 Start Fresh Session'}
            </button>
            
            <button
              onClick={continueFromWhereStopped}
              className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                userType === 'child'
                  ? 'border-pink-300 text-pink-700 hover:bg-pink-50'
                  : 'border-blue-300 text-blue-700 hover:bg-blue-50'
              }`}
            >
              {userType === 'child' ? '➡️ Continue Training' : '➡️ Continue Building'}
            </button>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {userType === 'child' ? '🏠 Back to Main Dashboard' : '🏠 Return to ADHD Center'}
          </button>
        </div>

        {/* Real-World Transfer for Adults */}
        {userType === 'adult' && realWorldTransfer.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Real-World Application</span>
            </div>
            <p className="text-sm text-green-800 mb-2">
              Practice these improved attention skills in:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {realWorldTransfer.map((skill, index) => (
                <div key={index} className="text-sm text-green-700">
                  • {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MicroAttentionTrainer;

export default MicroAttentionTrainer