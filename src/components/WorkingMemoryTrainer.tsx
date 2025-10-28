import React, { useState, useEffect } from 'react';
import { Brain, Play, CheckCircle, XCircle, RotateCcw, TrendingUp, Target, Zap } from 'lucide-react';

interface WorkingMemoryTrainerProps {
  onComplete: (results: {
    profileName?: string;
    level: number;
    accuracy: number;
    reactionTime: number;
    maxSpan: number;
  }) => void;
}

const WorkingMemoryTrainer: React.FC<WorkingMemoryTrainerProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'setup' | 'showing' | 'testing' | 'feedback' | 'complete'>('setup');
  const [profileName, setProfileName] = useState('');
  const [useCustomProfile, setUseCustomProfile] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxLevel, setMaxLevel] = useState(3);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const [personalBest, setPersonalBest] = useState(3);
  const [streakCount, setStreakCount] = useState(0);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [sessionHistory, setSessionHistory] = useState<Array<{
    date: Date;
    maxLevel: number;
    accuracy: number;
    avgReactionTime: number;
    profileName?: string;
  }>>([]);
  const [showProgressHistory, setShowProgressHistory] = useState(false);
  const [defaultProgress, setDefaultProgress] = useState({
    level: 3,
    sessions: 0,
    bestLevel: 3,
    avgAccuracy: 0
  });
  const [savedProfiles, setSavedProfiles] = useState<Array<{
    name: string;
    sessions: number;
    bestLevel: number;
    avgAccuracy: number;
    lastUsed: Date;
  }>>([]);

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load personal best from localStorage
  useEffect(() => {
    // Load session history
    const savedHistory = localStorage.getItem('eidolon-working-memory-history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessionHistory(history);
    }
    
    // Load default progress (your main progress)
    const defaultSaved = localStorage.getItem('eidolon-working-memory-default');
    if (defaultSaved) {
      const defaultData = JSON.parse(defaultSaved);
      setDefaultProgress(defaultData);
      setPersonalBest(defaultData.bestLevel);
      setCurrentLevel(defaultData.level);
    }
    
    // Load named profiles
    const saved = localStorage.getItem('eidolon-working-memory-profiles');
    if (saved) {
      const profiles = JSON.parse(saved);
      setSavedProfiles(profiles);
    }
  }, []);

  const startRound = () => {
    const newSequence = generateSequence(currentLevel);
    setSequence(newSequence);
    setUserInput([]);
    setCurrentIndex(0);
    setGameState('showing');
    setShowSequence(true);
    
    // Show sequence with timing
    let index = 0;
    const showInterval = setInterval(() => {
      setCurrentIndex(index);
      index++;
      
      if (index >= newSequence.length) {
        clearInterval(showInterval);
        setTimeout(() => {
          setShowSequence(false);
          setGameState('testing');
          setStartTime(new Date());
        }, 500);
      }
    }, 800);
  };

  const handleNumberClick = (number: number) => {
    if (gameState !== 'testing') return;
    
    const newInput = [...userInput, number];
    setUserInput(newInput);
    
    if (newInput.length === sequence.length) {
      // Calculate reaction time
      if (startTime) {
        const reactionTime = Date.now() - startTime.getTime();
        setReactionTimes(prev => [...prev, reactionTime]);
      }
      
      // Check if correct
      const isCorrect = newInput.every((num, index) => num === sequence[index]);
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        setStreakCount(prev => prev + 1);
        setMaxLevel(prev => Math.max(prev, currentLevel));
        
        // Update personal best
        if (currentLevel > personalBest) {
          setPersonalBest(currentLevel);
          updateProfileData(currentLevel, isCorrect ? 100 : 0);
          setEncouragementMessage(`🎉 New personal best! Level ${currentLevel}`);
        } else if (streakCount >= 3) {
          setEncouragementMessage(`🔥 ${streakCount} correct in a row! You're in the zone!`);
        }
        
        setGameState('feedback');
        
        setTimeout(() => {
          if (adaptiveDifficulty) {
            // Adaptive difficulty: increase by 1 if doing well, or adjust based on performance
            const shouldIncrease = streakCount >= 2 || (score / attempts) > 0.8;
            if (shouldIncrease && currentLevel < 9) {
              setCurrentLevel(prev => prev + 1);
            } else if (!shouldIncrease && currentLevel > 3) {
              // Stay at current level for consolidation
            }
          } else {
            // Standard progression
            if (currentLevel < 8) {
              setCurrentLevel(prev => prev + 1);
            }
          }
          
          setAttempts(prev => prev + 1);
          if (attempts >= 9) {
            completeGame();
          } else {
            startRound();
          }
        }, 1500);
      } else {
        setStreakCount(0);
        setEncouragementMessage('');
        setGameState('feedback');
      }
    }
  };

  const completeGame = () => {
    setGameState('complete');
    const avgReactionTime = reactionTimes.length > 0 
      ? reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length 
      : 0;
    
    const finalAccuracy = attempts > 0 ? (score / attempts) * 100 : 0;
    
    // Save to session history
    const newHistoryEntry = {
      date: new Date(),
      maxLevel,
      accuracy: finalAccuracy,
      avgReactionTime,
      profileName: useCustomProfile ? profileName : undefined
    };
    
    const newHistory = [newHistoryEntry, ...sessionHistory].slice(0, 50); // Keep last 50 sessions
    setSessionHistory(newHistory);
    localStorage.setItem('eidolon-working-memory-history', JSON.stringify(newHistory));
    
    updateProfileData(maxLevel, finalAccuracy);
    
    onComplete({
      profileName: useCustomProfile ? profileName : undefined,
      level: currentLevel,
      accuracy: finalAccuracy,
      reactionTime: avgReactionTime,
      maxSpan: maxLevel
    });
  };

  const updateProfileData = (level: number, accuracy: number) => {
    if (!useCustomProfile || !profileName.trim()) {
      // Update default progress
      const newDefaultProgress = {
        level: currentLevel,
        sessions: defaultProgress.sessions + 1,
        bestLevel: Math.max(defaultProgress.bestLevel, level),
        avgAccuracy: (defaultProgress.avgAccuracy * defaultProgress.sessions + accuracy) / (defaultProgress.sessions + 1)
      };
      setDefaultProgress(newDefaultProgress);
      localStorage.setItem('eidolon-working-memory-default', JSON.stringify(newDefaultProgress));
      return;
    }
    
    const profiles = [...savedProfiles];
    const existingIndex = profiles.findIndex(p => p.name === profileName.trim());
    
    if (existingIndex >= 0) {
      // Update existing profile
      profiles[existingIndex] = {
        ...profiles[existingIndex],
        sessions: profiles[existingIndex].sessions + 1,
        bestLevel: Math.max(profiles[existingIndex].bestLevel, level),
        avgAccuracy: (profiles[existingIndex].avgAccuracy + accuracy) / 2,
        lastUsed: new Date()
      };
    } else {
      // Create new profile
      profiles.push({
        name: profileName.trim(),
        sessions: 1,
        bestLevel: level,
        avgAccuracy: accuracy,
        lastUsed: new Date()
      });
    }
    
    setSavedProfiles(profiles);
    localStorage.setItem('eidolon-working-memory-profiles', JSON.stringify(profiles));
  };

  const isCorrectSoFar = () => {
    return userInput.every((num, index) => num === sequence[index]);
  };

  if (gameState === 'setup') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-h-[85vh] overflow-y-auto pb-safe">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Working Memory Training</h2>
            <p className="text-sm text-gray-600">Strengthen your ability to hold and manipulate information</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">How It Works</span>
            </div>
            <div className="text-sm text-purple-800 space-y-1">
              <p>• Watch a sequence of numbers appear one by one</p>
              <p>• Remember the exact order they appeared</p>
              <p>• Click the numbers back in the same sequence</p>
              <p>• Sequences get longer as you succeed</p>
            </div>
          </div>

          {/* Default Progress Display */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-indigo-900">Your Main Progress</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{defaultProgress.bestLevel}</div>
                <div className="text-xs text-gray-600">Best Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{defaultProgress.sessions}</div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{Math.round(defaultProgress.avgAccuracy)}%</div>
                <div className="text-xs text-gray-600">Avg Accuracy</div>
              </div>
            </div>
            <p className="text-xs text-indigo-700 mt-2">
              This is your main progress that continues automatically when you train without a named profile
            </p>
          </div>
          {/* Training Profile Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useProfile"
                checked={useCustomProfile}
                onChange={(e) => setUseCustomProfile(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="useProfile" className="text-sm text-gray-700">
                Create named training profile (track progress separately from main progress)
              </label>
            </div>
            
            {useCustomProfile && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Morning Training, Post-Coffee, Experimental Session"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your main progress continues separately - this creates additional tracking for specific conditions
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
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{profile.name}</div>
                          <div className="text-xs text-gray-500">
                            {profile.sessions} sessions • Level {profile.bestLevel}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress History Modal */}
          {showProgressHistory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Training Progress History</h3>
                  <button
                    onClick={() => setShowProgressHistory(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                {sessionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {/* Progress Chart */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-3">Level Progress Over Time</h4>
                      <div className="flex items-end space-x-1 h-32">
                        {sessionHistory.slice(0, 20).reverse().map((session, index) => {
                          const maxLevel = Math.max(...sessionHistory.map(s => s.maxLevel));
                          const height = (session.maxLevel / maxLevel) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100px' }}>
                                <div
                                  className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500"
                                  style={{ height: `${height}%`, position: 'absolute', bottom: 0, width: '100%' }}
                                  title={`Level ${session.maxLevel} - ${session.accuracy.toFixed(0)}% accuracy`}
                                />
                              </div>
                              <div className="mt-1 text-xs text-center text-gray-500">
                                {session.maxLevel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-2">
                        Last 20 sessions • Hover for details
                      </div>
                    </div>
                    
                    {/* Recent Sessions */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recent Sessions</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {sessionHistory.slice(0, 10).map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">
                                Level {session.maxLevel} • {session.accuracy.toFixed(0)}% accuracy
                              </div>
                              <div className="text-sm text-gray-600">
                                {session.date.toLocaleDateString()} • {(session.avgReactionTime / 1000).toFixed(1)}s avg
                                {session.profileName && ` • ${session.profileName}`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${
                                session.maxLevel >= personalBest ? 'text-emerald-600' : 'text-gray-600'
                              }`}>
                                {session.maxLevel >= personalBest ? '🏆' : session.maxLevel}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {sessionHistory.length}
                        </div>
                        <div className="text-xs text-gray-600">Total Sessions</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-lg font-bold text-emerald-600">
                          {sessionHistory.length > 0 ? 
                            (sessionHistory.reduce((sum, s) => sum + s.accuracy, 0) / sessionHistory.length).toFixed(0) : 0}%
                        </div>
                        <div className="text-xs text-gray-600">Avg Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {Math.max(...sessionHistory.map(s => s.maxLevel), 0)}
                        </div>
                        <div className="text-xs text-gray-600">Best Level</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No training history yet. Complete a session to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">Starting Level: {currentLevel}</div>
            <div className="text-sm text-gray-600 mb-6">
              You'll see {currentLevel} numbers to remember
              {personalBest > 3 && (
                <span className="block text-emerald-600 font-medium mt-1">
                  Personal Best: Level {personalBest}
                </span>
              )}
            </div>
            
            <div className="mb-6 flex items-center justify-center space-x-4">
              <button
                onClick={() => setShowProgressHistory(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Progress History</span>
              </button>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={adaptiveDifficulty}
                  onChange={(e) => setAdaptiveDifficulty(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Adaptive difficulty</span>
              </label>
            </div>
            
            <button
              onClick={startRound}
              disabled={useCustomProfile && !profileName.trim()}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              {useCustomProfile && profileName.trim() ? `Start "${profileName}" Training` : 'Start Training'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const avgReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length
      : 0;
    const accuracy = attempts > 0 ? (score / attempts) * 100 : 0;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-h-[85vh] overflow-y-auto pb-safe">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Training Complete!</h2>
          <p className="text-gray-600">Great work on your working memory training</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">{maxLevel}</div>
            <div className="text-sm text-gray-600">Max Span</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{accuracy.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {(avgReactionTime / 1000).toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">Avg Speed</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
        </div>
        
        {useCustomProfile && profileName && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="font-medium text-purple-900">Training Profile: "{profileName}"</div>
              <div className="text-sm text-purple-700 mt-1">
                This session will be tracked separately for trend analysis
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => {
              // Restart from current level
              setGameState('setup');
              setScore(0);
              setAttempts(0);
              setReactionTimes([]);
              // Keep current level and personal best
            }}
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try This Level Again
          </button>
          <button
            onClick={() => {
              // Start fresh from beginning
              setGameState('setup');
              setCurrentLevel(3);
              setScore(0);
              setAttempts(0);
              setMaxLevel(3);
              setReactionTimes([]);
              setProfileName('');
              setUseCustomProfile(false);
            }}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Fresh (Level 3)
          </button>
        </div>
        
        <button
          onClick={() => setShowProgressHistory(true)}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4"
        >
          View Detailed Progress
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            {useCustomProfile && profileName.trim() ? `Start "${profileName}" Training` : `Continue Main Training (Level ${defaultProgress.level})`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-h-[85vh] overflow-y-auto pb-safe">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          Level {currentLevel} - Remember {currentLevel} Numbers
        </div>
        <div className="text-sm text-gray-600">
          {gameState === 'showing' ? 'Watch the sequence...' : 'Click the numbers in order'}
        </div>
      </div>

      {/* Sequence Display */}
      {showSequence && (
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {sequence.map((number, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-purple-600 text-white scale-110'
                    : index < currentIndex
                    ? 'bg-purple-200 text-purple-800'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index <= currentIndex ? number : '?'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      {encouragementMessage && (
        <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-800 font-medium">{encouragementMessage}</p>
        </div>
      )}

      {/* Input Grid */}
      {gameState === 'testing' && (
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-bold text-gray-900 transition-colors"
              >
                {number}
              </button>
            ))}
          </div>
          
          {/* User Input Display */}
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Your sequence:</div>
            <div className="flex items-center justify-center space-x-2">
              {userInput.map((number, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    number === sequence[index]
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {number}
                </div>
              ))}
              {userInput.length < sequence.length && (
                <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">?</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {gameState === 'feedback' && (
        <div className="text-center mb-6">
          {isCorrectSoFar() && userInput.length === sequence.length ? (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="font-semibold text-emerald-900">Excellent!</div>
              <div className="text-sm text-emerald-700">Moving to level {currentLevel + 1}</div>
            </div>
          ) : (
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <div className="font-semibold text-red-900 text-lg mb-2">Not quite right</div>
              <div className="text-sm text-red-700 mb-1">
                Your sequence: {userInput.join(' → ')}
              </div>
              <div className="text-sm text-emerald-700 font-medium mb-6">
                Correct sequence: {sequence.join(' → ')}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUserInput([]);
                    setCurrentIndex(0);
                    setGameState('showing');
                    setShowSequence(true);

                    let index = 0;
                    const showInterval = setInterval(() => {
                      setCurrentIndex(index);
                      index++;

                      if (index >= sequence.length) {
                        clearInterval(showInterval);
                        setTimeout(() => {
                          setShowSequence(false);
                          setGameState('testing');
                          setStartTime(new Date());
                        }, 500);
                      }
                    }, 800);
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try This Sequence Again
                </button>

                <button
                  onClick={() => {
                    setAttempts(prev => prev + 1);
                    if (attempts >= 9) {
                      completeGame();
                    } else {
                      startRound();
                    }
                  }}
                  className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Continue with Next Sequence
                </button>

                {currentLevel > 3 && (
                  <button
                    onClick={() => {
                      const newLevel = currentLevel - 1;
                      setCurrentLevel(newLevel);
                      setGameState('setup');
                      setScore(0);
                      setAttempts(0);
                      setReactionTimes([]);
                    }}
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Restart at Easier Level {currentLevel - 1}
                  </button>
                )}

                <button
                  onClick={() => {
                    setGameState('setup');
                    setScore(0);
                    setAttempts(0);
                    setReactionTimes([]);
                  }}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Setup
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkingMemoryTrainer;
                    