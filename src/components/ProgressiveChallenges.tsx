import React, { useState, useEffect } from 'react';
import { Trophy, Target, Calendar, Star, Unlock, CheckCircle, ArrowRight, Brain, Eye, Ear, Heart, Zap } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'skill' | 'milestone';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements: string[];
  rewards: string[];
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  completed: boolean;
  icon: any;
  color: string;
}

const ProgressiveChallenges: React.FC = () => {
  const { weaves, retrievalSessions } = useWeave();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [weeklyTheme, setWeeklyTheme] = useState('');
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);

  const weeklyThemes = [
    { theme: 'Childhood Memories', prompt: 'Explore memories from your early years', icon: Star, color: 'pink' },
    { theme: 'Professional Moments', prompt: 'Capture career milestones and work experiences', icon: Target, color: 'blue' },
    { theme: 'Sensory Focus', prompt: 'Deep dive into one sense each day', icon: Eye, color: 'purple' },
    { theme: 'Emotional Landscapes', prompt: 'Focus on feelings and emotional memories', icon: Heart, color: 'red' },
    { theme: 'Future Planning', prompt: 'Rehearse upcoming events and goals', icon: Calendar, color: 'emerald' },
    { theme: 'Family Connections', prompt: 'Preserve and strengthen family memories', icon: Heart, color: 'orange' },
    { theme: 'Learning Moments', prompt: 'Capture times of growth and discovery', icon: Brain, color: 'indigo' },
    { theme: 'Gratitude & Joy', prompt: 'Focus on positive and meaningful experiences', icon: Star, color: 'yellow' }
  ];

  useEffect(() => {
    generateChallenges();
    calculateUserLevel();
    setCurrentWeeklyTheme();
  }, [weaves, retrievalSessions]);

  const setCurrentWeeklyTheme = () => {
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    const currentTheme = weeklyThemes[weekNumber % weeklyThemes.length];
    setWeeklyTheme(currentTheme.theme);
  };

  const calculateUserLevel = () => {
    let xp = 0;
    
    // XP from weaves
    xp += weaves.length * 10;
    xp += weaves.filter(w => w.coherenceScore > 80).length * 5;
    xp += weaves.filter(w => w.type === 'future' && w.completed).length * 15;
    
    // XP from sessions
    xp += retrievalSessions.length * 5;
    xp += retrievalSessions.filter(s => s.accuracy > 80).length * 3;
    
    setTotalXP(xp);
    setUserLevel(Math.floor(xp / 100) + 1);
  };

  const generateChallenges = () => {
    const newChallenges: Challenge[] = [
      // Beginner Challenges
      {
        id: 'first-weave',
        title: 'Memory Pioneer',
        description: 'Create your first memory weave',
        type: 'milestone',
        difficulty: 'beginner',
        requirements: ['Create 1 memory weave'],
        rewards: ['10 XP', 'Unlock sensory challenges'],
        progress: weaves.length,
        maxProgress: 1,
        unlocked: true,
        completed: weaves.length >= 1,
        icon: Star,
        color: 'emerald'
      },
      {
        id: 'sensory-explorer',
        title: 'Sensory Explorer',
        description: 'Fill in all 5 senses in a single memory',
        type: 'skill',
        difficulty: 'beginner',
        requirements: ['Complete all sensory details in one weave'],
        rewards: ['15 XP', 'Unlock advanced techniques'],
        progress: weaves.filter(w => 
          Object.values(w.sensoryDetails).every(detail => detail.length > 10)
        ).length,
        maxProgress: 1,
        unlocked: weaves.length >= 1,
        completed: weaves.some(w => 
          Object.values(w.sensoryDetails).every(detail => detail.length > 10)
        ),
        icon: Eye,
        color: 'purple'
      },
      {
        id: 'weekly-warrior',
        title: 'Weekly Warrior',
        description: 'Complete this week\'s themed challenge',
        type: 'weekly',
        difficulty: 'intermediate',
        requirements: [`Create 3 memories related to: ${weeklyTheme}`],
        rewards: ['25 XP', 'Weekly champion badge'],
        progress: weaves.filter(w => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return w.createdAt >= weekStart;
        }).length,
        maxProgress: 3,
        unlocked: weaves.length >= 3,
        completed: false,
        icon: Calendar,
        color: 'blue'
      },
      {
        id: 'retrieval-master',
        title: 'Retrieval Master',
        description: 'Complete 10 retrieval training sessions',
        type: 'skill',
        difficulty: 'intermediate',
        requirements: ['Complete 10 training sessions'],
        rewards: ['30 XP', 'Unlock advanced coaching'],
        progress: retrievalSessions.length,
        maxProgress: 10,
        unlocked: weaves.length >= 2,
        completed: retrievalSessions.length >= 10,
        icon: Brain,
        color: 'indigo'
      },
      {
        id: 'future-planner',
        title: 'Future Planner',
        description: 'Create and complete 3 future scenarios',
        type: 'skill',
        difficulty: 'intermediate',
        requirements: ['Create 3 future scenarios', 'Complete all 3'],
        rewards: ['35 XP', 'PMAR tracking unlocked'],
        progress: weaves.filter(w => w.type === 'future' && w.completed).length,
        maxProgress: 3,
        unlocked: weaves.length >= 5,
        completed: weaves.filter(w => w.type === 'future' && w.completed).length >= 3,
        icon: Target,
        color: 'emerald'
      },
      {
        id: 'coherence-champion',
        title: 'Coherence Champion',
        description: 'Achieve 90+ coherence score on 5 memories',
        type: 'skill',
        difficulty: 'advanced',
        requirements: ['5 memories with 90+ coherence score'],
        rewards: ['50 XP', 'Memory master status'],
        progress: weaves.filter(w => w.coherenceScore >= 90).length,
        maxProgress: 5,
        unlocked: weaves.length >= 10,
        completed: weaves.filter(w => w.coherenceScore >= 90).length >= 5,
        icon: Trophy,
        color: 'yellow'
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Achieve sub-10 second recall on 5 sessions',
        type: 'skill',
        difficulty: 'advanced',
        requirements: ['5 sessions with <10s recall time'],
        rewards: ['40 XP', 'Rapid recall badge'],
        progress: retrievalSessions.filter(s => s.latencyMs < 10000).length,
        maxProgress: 5,
        unlocked: retrievalSessions.length >= 10,
        completed: retrievalSessions.filter(s => s.latencyMs < 10000).length >= 5,
        icon: Zap,
        color: 'orange'
      }
    ];

    setChallenges(newChallenges);
  };

  const getCurrentWeeklyTheme = () => {
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    return weeklyThemes[weekNumber % weeklyThemes.length];
  };

  const getNextXPLevel = () => {
    return (userLevel * 100) - totalXP;
  };

  const claimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge?.completed) {
      alert(`🎉 Congratulations! You've earned: ${challenge.rewards.join(', ')}`);
      // Here you would typically update user rewards in the database
    }
  };

  const currentTheme = getCurrentWeeklyTheme();
  const ThemeIcon = currentTheme.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Progressive Challenges</h2>
            <p className="text-sm text-gray-600">Build skills and unlock advanced techniques</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">Level {userLevel}</div>
          <div className="text-sm text-gray-600">{totalXP} XP</div>
          <div className="text-xs text-gray-500">{getNextXPLevel()} XP to next level</div>
        </div>
      </div>

      {/* Weekly Theme */}
      <div className={`mb-6 p-4 bg-${currentTheme.color}-50 rounded-lg border border-${currentTheme.color}-200`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-8 h-8 bg-${currentTheme.color}-100 rounded-lg flex items-center justify-center`}>
            <ThemeIcon className={`w-4 h-4 text-${currentTheme.color}-600`} />
          </div>
          <div>
            <h3 className={`font-medium text-${currentTheme.color}-900`}>This Week's Theme</h3>
            <p className={`text-sm text-${currentTheme.color}-700`}>{currentTheme.theme}</p>
          </div>
        </div>
        <p className={`text-sm text-${currentTheme.color}-800`}>{currentTheme.prompt}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className={`text-xs text-${currentTheme.color}-600`}>
            {weaves.filter(w => {
              const weekStart = new Date();
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              return w.createdAt >= weekStart;
            }).length} memories created this week
          </div>
          <button
            onClick={() => setActiveChallenge('weekly-warrior')}
            className={`px-3 py-1.5 bg-${currentTheme.color}-600 text-white text-sm rounded-lg hover:bg-${currentTheme.color}-700 transition-colors`}
          >
            Join Challenge
          </button>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((challenge) => {
          const IconComponent = challenge.icon;
          const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
          
          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                challenge.unlocked
                  ? challenge.completed
                    ? `border-${challenge.color}-500 bg-${challenge.color}-50`
                    : `border-gray-300 hover:border-${challenge.color}-300 hover:bg-${challenge.color}-50`
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
              onClick={() => challenge.unlocked && setActiveChallenge(challenge.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${challenge.color}-100 rounded-lg flex items-center justify-center`}>
                    {challenge.unlocked ? (
                      <IconComponent className={`w-5 h-5 text-${challenge.color}-600`} />
                    ) : (
                      <div className="w-5 h-5 bg-gray-400 rounded" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                </div>
                
                {challenge.completed && (
                  <CheckCircle className={`w-5 h-5 text-${challenge.color}-600`} />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}/{challenge.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${challenge.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1 mb-3">
                {challenge.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${
                      challenge.progress > index ? `bg-${challenge.color}-500` : 'bg-gray-300'
                    }`} />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Rewards: {challenge.rewards.join(', ')}
                </div>
                {challenge.completed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      claimReward(challenge.id);
                    }}
                    className={`px-2 py-1 bg-${challenge.color}-600 text-white text-xs rounded hover:bg-${challenge.color}-700 transition-colors`}
                  >
                    Claim
                  </button>
                )}
              </div>

              {!challenge.unlocked && (
                <div className="mt-2 text-xs text-gray-500 italic">
                  Unlock by completing previous challenges
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Challenge Details Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {(() => {
              const challenge = challenges.find(c => c.id === activeChallenge);
              if (!challenge) return null;
              
              const IconComponent = challenge.icon;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${challenge.color}-100 rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 text-${challenge.color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{challenge.difficulty} • {challenge.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveChallenge(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{challenge.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <div className="space-y-2">
                        {challenge.requirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className={`w-4 h-4 ${
                              challenge.progress > index ? `text-${challenge.color}-600` : 'text-gray-300'
                            }`} />
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Rewards</h4>
                      <div className="space-y-1">
                        {challenge.rewards.map((reward, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Star className={`w-4 h-4 text-${challenge.color}-600`} />
                            <span className="text-sm text-gray-700">{reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-${challenge.color}-500 h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>

                    {challenge.completed ? (
                      <button
                        onClick={() => claimReward(challenge.id)}
                        className={`w-full px-4 py-3 bg-${challenge.color}-600 text-white rounded-lg hover:bg-${challenge.color}-700 transition-colors`}
                      >
                        Claim Rewards
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveChallenge(null)}
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Continue Training
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Level Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Memory Training Level {userLevel}</span>
          </div>
          <div className="text-sm text-indigo-700">{totalXP} XP</div>
        </div>
        
        <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((totalXP % 100) / 100) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-indigo-600">
          <span>Level {userLevel}</span>
          <span>{getNextXPLevel()} XP to Level {userLevel + 1}</span>
        </div>
      </div>

      {/* Research Context */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Cognitive Science</span>
        </div>
        <p className="text-sm text-blue-800">
          Progressive challenges are designed around the concept of "desirable difficulties" - 
          optimal challenge levels that promote learning without overwhelming cognitive resources. 
          Each challenge builds specific memory skills while maintaining motivation through achievement.
        </p>
      </div>
    </div>
  );
};

export default ProgressiveChallenges;