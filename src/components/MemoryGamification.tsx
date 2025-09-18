import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Award, Crown, Flame, Gift, TrendingUp, Users, Brain, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
}

interface MemoryGamificationProps {
  userStats: {
    totalWeaves: number;
    avgCoherence: number;
    trainingStreak: number;
    totalXP: number;
  };
  onAchievementUnlock: (achievement: Achievement) => void;
}

const MemoryGamification: React.FC<MemoryGamificationProps> = ({ userStats, onAchievementUnlock }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState(1);
  const [showCelebration, setShowCelebration] = useState<Achievement | null>(null);

  useEffect(() => {
    generateAchievements();
    generateDailyQuests();
    generateWeeklyChallenge();
    generateLeaderboard();
  }, [userStats]);

  const generateAchievements = () => {
    const achievementList: Achievement[] = [
      {
        id: 'first-weave',
        title: 'Memory Pioneer',
        description: 'Create your first memory weave',
        icon: '🌟',
        rarity: 'common',
        xpReward: 50,
        unlocked: userStats.totalWeaves >= 1,
        progress: Math.min(userStats.totalWeaves, 1),
        maxProgress: 1,
        category: 'Milestones'
      },
      {
        id: 'coherence-master',
        title: 'Coherence Master',
        description: 'Achieve 90+ coherence score on 5 memories',
        icon: '💎',
        rarity: 'epic',
        xpReward: 200,
        unlocked: false, // Would check actual coherence scores
        progress: 0,
        maxProgress: 5,
        category: 'Quality'
      },
      {
        id: 'streak-legend',
        title: 'Streak Legend',
        description: 'Maintain a 30-day training streak',
        icon: '🔥',
        rarity: 'legendary',
        xpReward: 500,
        unlocked: userStats.trainingStreak >= 30,
        progress: Math.min(userStats.trainingStreak, 30),
        maxProgress: 30,
        category: 'Consistency'
      },
      {
        id: 'sensory-savant',
        title: 'Sensory Savant',
        description: 'Create memories using all 5 senses in detail',
        icon: '🎨',
        rarity: 'rare',
        xpReward: 150,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        category: 'Technique'
      },
      {
        id: 'future-architect',
        title: 'Future Architect',
        description: 'Successfully complete 10 planned scenarios',
        icon: '🏗️',
        rarity: 'epic',
        xpReward: 300,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        category: 'Planning'
      }
    ];

    setAchievements(achievementList);
  };

  const generateDailyQuests = () => {
    const today = new Date().toDateString();
    const savedQuests = localStorage.getItem(`eidolon-daily-quests-${today}`);
    
    if (savedQuests) {
      setDailyQuests(JSON.parse(savedQuests));
    } else {
      const quests = [
        {
          id: 'daily-weave',
          title: 'Create a Memory',
          description: 'Create one new memory weave today',
          xpReward: 25,
          progress: 0,
          maxProgress: 1,
          completed: false
        },
        {
          id: 'daily-training',
          title: 'Practice Recall',
          description: 'Complete one retrieval training session',
          xpReward: 30,
          progress: 0,
          maxProgress: 1,
          completed: false
        },
        {
          id: 'daily-quality',
          title: 'Quality Focus',
          description: 'Achieve 80+ coherence score on any memory',
          xpReward: 40,
          progress: 0,
          maxProgress: 1,
          completed: false
        }
      ];
      
      setDailyQuests(quests);
      localStorage.setItem(`eidolon-daily-quests-${today}`, JSON.stringify(quests));
    }
  };

  const generateWeeklyChallenge = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const challenges = [
      {
        title: 'Sensory Master Week',
        description: 'Create 7 memories, each focusing on a different sensory combination',
        xpReward: 200,
        progress: 0,
        maxProgress: 7,
        endDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Future Planner Week',
        description: 'Create and complete 3 future scenarios',
        xpReward: 250,
        progress: 0,
        maxProgress: 3,
        endDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setWeeklyChallenge(challenges[0]);
  };

  const generateLeaderboard = () => {
    // Simulated leaderboard data
    const board = [
      { name: 'Memory Master', level: 12, xp: 2450, streak: 45 },
      { name: 'Cognitive Champion', level: 10, xp: 1890, streak: 23 },
      { name: 'Neural Navigator', level: 9, xp: 1650, streak: 31 },
      { name: 'You', level: Math.floor(userStats.totalXP / 100) + 1, xp: userStats.totalXP, streak: userStats.trainingStreak },
      { name: 'Synapse Surfer', level: 8, xp: 1420, streak: 18 }
    ];
    
    const sortedBoard = board.sort((a, b) => b.xp - a.xp);
    const userPosition = sortedBoard.findIndex(entry => entry.name === 'You') + 1;
    
    setLeaderboard(sortedBoard);
    setUserRank(userPosition);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'yellow';
      default: return 'gray';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-yellow-500/50';
      case 'epic': return 'shadow-lg shadow-purple-500/50';
      case 'rare': return 'shadow-md shadow-blue-500/50';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Memory Mastery</h2>
          <p className="text-sm text-gray-600">Achievements, quests, and cognitive competitions</p>
        </div>
      </div>

      {/* User Level & XP */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-indigo-600">Level {Math.floor(userStats.totalXP / 100) + 1}</div>
            <div className="text-sm text-gray-600">Memory Master</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">{userStats.totalXP} XP</div>
            <div className="text-xs text-gray-500">#{userRank} on leaderboard</div>
          </div>
        </div>
        
        <div className="w-full bg-indigo-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((userStats.totalXP % 100) / 100) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {userStats.totalXP % 100}/100 XP to next level
        </div>
      </div>

      {/* Daily Quests */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-orange-600" />
          <span>Daily Quests</span>
        </h3>
        <div className="space-y-3">
          {dailyQuests.map((quest, index) => (
            <div key={index} className={`p-3 rounded-lg border transition-all ${
              quest.completed 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{quest.title}</div>
                  <div className="text-sm text-gray-600">{quest.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-orange-600">+{quest.xpReward} XP</span>
                  {quest.completed && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </div>
              </div>
              {!quest.completed && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-red-600" />
            <span>Weekly Challenge</span>
          </h3>
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{weeklyChallenge.title}</h4>
                <p className="text-sm text-gray-600">{weeklyChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">+{weeklyChallenge.xpReward} XP</div>
                <div className="text-xs text-gray-500">
                  Ends {weeklyChallenge.endDate.toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="w-full bg-red-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.maxProgress) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Progress: {weeklyChallenge.progress}/{weeklyChallenge.maxProgress}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Gallery */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-600" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const rarityColor = getRarityColor(achievement.rarity);
            const glowClass = getRarityGlow(achievement.rarity);
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${glowClass} ${
                  achievement.unlocked
                    ? `border-${rarityColor}-500 bg-${rarityColor}-50`
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <div className={`text-xs text-${rarityColor}-600 font-medium mt-2 capitalize`}>
                      {achievement.rarity} • +{achievement.xpReward} XP
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={`bg-${rarityColor}-500 h-1 rounded-full transition-all duration-300`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Leaderboard */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          <span>Leaderboard</span>
        </h3>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.name === 'You' 
                  ? 'bg-indigo-50 border border-indigo-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className={`font-medium ${entry.name === 'You' ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {entry.name}
                  </div>
                  <div className="text-xs text-gray-500">Level {entry.level} • {entry.streak} day streak</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{entry.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <div className="text-6xl mb-4">{showCelebration.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h3>
            <h4 className="text-lg font-semibold text-purple-600 mb-2">{showCelebration.title}</h4>
            <p className="text-gray-600 mb-4">{showCelebration.description}</p>
            
            <div className={`p-3 bg-${getRarityColor(showCelebration.rarity)}-50 rounded-lg border border-${getRarityColor(showCelebration.rarity)}-200 mb-4`}>
              <div className="font-bold text-lg">+{showCelebration.xpReward} XP</div>
              <div className={`text-sm text-${getRarityColor(showCelebration.rarity)}-700 capitalize`}>
                {showCelebration.rarity} Achievement
              </div>
            </div>
            
            <button
              onClick={() => setShowCelebration(null)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGamification;