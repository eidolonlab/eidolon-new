import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, Calendar, Star, CheckCircle, ArrowRight, Brain, 
  Eye, Ear, Heart, Zap, Award, Clock, X, Play, Users, TrendingUp,
  Gift, Flame, Timer, Sparkles
} from 'lucide-react';
import { useChallenge } from '../contexts/ChallengeContext';
import { useWeave } from '../contexts/WeaveContext';

const ProgressiveChallenges: React.FC = () => {
  const { 
    challenges, 
    joinChallenge, 
    leaveChallenge, 
    claimReward, 
    getUserLevel, 
    getTotalXP,
    getActiveChallenge 
  } = useChallenge();
  const { weaves } = useWeave();
  
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<string | null>(null);
  const [celebrationChallenge, setCelebrationChallenge] = useState<string | null>(null);

  const userLevel = getUserLevel();
  const totalXP = getTotalXP();
  const activeChallenge = getActiveChallenge();

  // Check for newly completed challenges
  useEffect(() => {
    challenges.forEach(challenge => {
      if (challenge.joined && 
          challenge.requirements.every(req => req.completed) && 
          !challenge.completed) {
        setCelebrationChallenge(challenge.id);
      }
    });
  }, [challenges]);

  const getIcon = (iconName: string) => {
    const icons = {
      star: Star,
      calendar: Calendar,
      eye: Eye,
      target: Target,
      award: Award,
      zap: Zap,
      brain: Brain,
      clock: Clock,
      trophy: Trophy,
      heart: Heart
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  const getNextXPLevel = () => {
    return (userLevel * 100) - totalXP;
  };

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge(challengeId);
    setShowJoinModal(null);
    
    // Show success message
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      alert(`🎯 Challenge Joined!\n\n"${challenge.title}" is now active. Check your progress anytime!`);
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.requirements.every(req => req.completed)) {
      setCelebrationChallenge(challengeId);
    }
  };

  // Auto-check for completions
  useEffect(() => {
    challenges.forEach(challenge => {
      if (challenge.joined && 
          !challenge.completed && 
          challenge.requirements.every(req => req.completed)) {
        handleCompleteChallenge(challenge.id);
      }
    });
  }, [weaves, challenges]);

  const availableChallenges = challenges.filter(c => c.unlocked);
  const joinedChallenges = challenges.filter(c => c.joined && !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Memory Challenges</h2>
            <p className="text-sm text-gray-600">Join challenges to build skills and earn rewards</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">Level {userLevel}</div>
          <div className="text-sm text-gray-600">{totalXP} XP</div>
          <div className="text-xs text-gray-500">{getNextXPLevel()} XP to next level</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-indigo-900">Level {userLevel} Progress</span>
          <span className="text-sm text-indigo-700">{totalXP % 100}/100 XP</span>
        </div>
        <div className="w-full bg-indigo-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((totalXP % 100) / 100) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Challenge Spotlight */}
      {activeChallenge && (
        <div className={`mb-6 p-4 bg-gradient-to-r from-${activeChallenge.color}-50 to-${activeChallenge.color}-100 rounded-lg border border-${activeChallenge.color}-300`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-${activeChallenge.color}-200 rounded-lg flex items-center justify-center`}>
                <Flame className={`w-4 h-4 text-${activeChallenge.color}-700`} />
              </div>
              <div>
                <h3 className={`font-semibold text-${activeChallenge.color}-900`}>Active Challenge</h3>
                <p className={`text-sm text-${activeChallenge.color}-700`}>{activeChallenge.title}</p>
              </div>
            </div>
            {activeChallenge.timeLimit && (
              <div className={`text-xs text-${activeChallenge.color}-600`}>
                Ends {activeChallenge.timeLimit.toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {activeChallenge.requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm text-${activeChallenge.color}-800`}>{req.description}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium text-${activeChallenge.color}-700`}>
                    {req.current}/{req.target}
                  </span>
                  {req.completed && <CheckCircle className={`w-4 h-4 text-${activeChallenge.color}-600`} />}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
              <div 
                className={`bg-${activeChallenge.color}-600 h-2 rounded-full transition-all duration-500`}
                style={{ 
                  width: `${(activeChallenge.requirements.reduce((sum, req) => sum + req.current, 0) / 
                           activeChallenge.requirements.reduce((sum, req) => sum + req.target, 0)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Challenge Categories */}
      <div className="space-y-6">
        {/* Available Challenges */}
        {availableChallenges.filter(c => !c.joined && !c.completed).length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Available Challenges</span>
            </h3>
            <div className="grid gap-4">
              {availableChallenges.filter(c => !c.joined && !c.completed).map((challenge) => {
                const IconComponent = getIcon(challenge.icon);
                const totalProgress = challenge.requirements.reduce((sum, req) => sum + req.current, 0);
                const totalTarget = challenge.requirements.reduce((sum, req) => sum + req.target, 0);
                const progressPercentage = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
                
                return (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-lg border border-${challenge.color}-200 bg-${challenge.color}-50 hover:bg-${challenge.color}-100 transition-all cursor-pointer`}
                    onClick={() => setShowJoinModal(challenge.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${challenge.color}-200 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 text-${challenge.color}-700`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 bg-${challenge.color}-200 text-${challenge.color}-800 rounded-full capitalize`}>
                              {challenge.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{challenge.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold text-${challenge.color}-600`}>
                          +{challenge.rewards.xp} XP
                        </div>
                        <div className="text-xs text-gray-500">{challenge.rewards.badge}</div>
                      </div>
                    </div>

                    {/* Progress Preview */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Current Progress</span>
                        <span>{totalProgress}/{totalTarget}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${challenge.color}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm text-${challenge.color}-700`}>
                        {challenge.progressMessage}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowJoinModal(challenge.id);
                        }}
                        className={`px-4 py-2 bg-${challenge.color}-600 text-white rounded-lg hover:bg-${challenge.color}-700 transition-colors text-sm font-medium`}
                      >
                        Join Challenge
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Joined Challenges */}
        {joinedChallenges.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>Your Active Challenges</span>
            </h3>
            <div className="space-y-4">
              {joinedChallenges.map((challenge) => {
                const IconComponent = getIcon(challenge.icon);
                const totalProgress = challenge.requirements.reduce((sum, req) => sum + req.current, 0);
                const totalTarget = challenge.requirements.reduce((sum, req) => sum + req.target, 0);
                const progressPercentage = totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
                const isCompleted = challenge.requirements.every(req => req.completed);
                
                return (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted 
                        ? `border-${challenge.color}-500 bg-${challenge.color}-50` 
                        : `border-${challenge.color}-300 bg-white hover:bg-${challenge.color}-25`
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${challenge.color}-200 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 text-${challenge.color}-700`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <span>{challenge.title}</span>
                            {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                          </h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                          {challenge.timeLimit && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Timer className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                Ends {challenge.timeLimit.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => leaveChallenge(challenge.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Leave challenge"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Detailed Progress */}
                    <div className="space-y-3 mb-4">
                      {challenge.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${
                              req.completed ? `bg-${challenge.color}-500` : 'bg-gray-300'
                            }`}>
                              {req.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-sm text-gray-700">{req.description}</span>
                          </div>
                          <span className={`text-sm font-medium ${
                            req.completed ? `text-${challenge.color}-600` : 'text-gray-500'
                          }`}>
                            {req.current}/{req.target}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r from-${challenge.color}-500 to-${challenge.color}-600 h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm text-${challenge.color}-700 font-medium`}>
                        {challenge.progressMessage}
                      </span>
                      {isCompleted ? (
                        <button
                          onClick={() => claimReward(challenge.id)}
                          className={`px-4 py-2 bg-gradient-to-r from-${challenge.color}-500 to-${challenge.color}-600 text-white rounded-lg hover:from-${challenge.color}-600 hover:to-${challenge.color}-700 transition-all font-medium`}
                        >
                          Claim Reward! 🎉
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedChallenge(challenge.id)}
                          className={`px-4 py-2 border border-${challenge.color}-300 text-${challenge.color}-700 rounded-lg hover:bg-${challenge.color}-100 transition-colors text-sm`}
                        >
                          View Tips
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Completed Challenges</span>
              <span className="text-sm text-gray-500">({completedChallenges.length})</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {completedChallenges.slice(0, 4).map((challenge) => {
                const IconComponent = getIcon(challenge.icon);
                
                return (
                  <div
                    key={challenge.id}
                    className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-emerald-700">{challenge.rewards.badge}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">+{challenge.rewards.xp} XP</span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Challenges State */}
        {availableChallenges.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Challenges Available</h3>
            <p className="text-gray-600">
              Create some memories to unlock exciting challenges!
            </p>
          </div>
        )}
      </div>

      {/* Join Challenge Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const challenge = challenges.find(c => c.id === showJoinModal);
              if (!challenge) return null;
              
              const IconComponent = getIcon(challenge.icon);
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-${challenge.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 text-${challenge.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <div className="space-y-2">
                        {challenge.requirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Target className={`w-4 h-4 text-${challenge.color}-600`} />
                            <span className="text-sm text-gray-700">{req.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Rewards</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Zap className={`w-4 h-4 text-${challenge.color}-600`} />
                          <span className="text-sm text-gray-700">+{challenge.rewards.xp} XP</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className={`w-4 h-4 text-${challenge.color}-600`} />
                          <span className="text-sm text-gray-700">{challenge.rewards.badge}</span>
                        </div>
                      </div>
                    </div>

                    {challenge.tips.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tips for Success</h4>
                        <div className="space-y-1">
                          {challenge.tips.map((tip, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {challenge.timeLimit && (
                      <div className={`p-3 bg-${challenge.color}-50 rounded-lg border border-${challenge.color}-200`}>
                        <div className="flex items-center space-x-2">
                          <Clock className={`w-4 h-4 text-${challenge.color}-600`} />
                          <span className={`text-sm text-${challenge.color}-800`}>
                            Challenge ends: {challenge.timeLimit.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowJoinModal(null)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className={`flex-1 px-4 py-3 bg-${challenge.color}-600 text-white rounded-lg hover:bg-${challenge.color}-700 transition-colors font-medium`}
                    >
                      Join Challenge!
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Challenge Tips Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const challenge = challenges.find(c => c.id === selectedChallenge);
              if (!challenge) return null;
              
              const IconComponent = getIcon(challenge.icon);
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${challenge.color}-100 rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 text-${challenge.color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">Tips & Strategy</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedChallenge(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Success Tips</h4>
                      <div className="space-y-2">
                        {challenge.tips.map((tip, index) => (
                          <div key={index} className={`p-3 bg-${challenge.color}-50 rounded-lg border border-${challenge.color}-200`}>
                            <div className="flex items-start space-x-2">
                              <div className={`w-5 h-5 bg-${challenge.color}-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <span className={`text-xs font-bold text-${challenge.color}-700`}>{index + 1}</span>
                              </div>
                              <span className="text-sm text-gray-700">{tip}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm text-${challenge.color}-700 font-medium`}>
                          {challenge.progressMessage}
                        </span>
                        <button
                          onClick={() => setSelectedChallenge(null)}
                          className={`px-4 py-2 bg-${challenge.color}-600 text-white rounded-lg hover:bg-${challenge.color}-700 transition-colors`}
                        >
                          Got it!
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {celebrationChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            {(() => {
              const challenge = challenges.find(c => c.id === celebrationChallenge);
              if (!challenge) return null;
              
              return (
                <>
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Challenge Complete! 🎉</h3>
                    <p className="text-gray-600">You've successfully completed "{challenge.title}"</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className={`p-4 bg-${challenge.color}-50 rounded-lg border border-${challenge.color}-200`}>
                      <h4 className="font-medium text-gray-900 mb-2">Your Rewards</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className={`w-5 h-5 text-${challenge.color}-600`} />
                          <span className="font-bold text-lg">+{challenge.rewards.xp} XP</span>
                        </div>
                        <div className="text-2xl">{challenge.rewards.badge}</div>
                        {challenge.rewards.unlocks && (
                          <div className="text-sm text-gray-600">
                            Unlocked: {challenge.rewards.unlocks.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      claimReward(challenge.id);
                      setCelebrationChallenge(null);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
                  >
                    Claim Rewards! 🎁
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveChallenges;