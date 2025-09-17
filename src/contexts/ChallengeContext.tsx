import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeave } from './WeaveContext';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'skill' | 'milestone' | 'streak' | 'exploration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requirements: {
    description: string;
    target: number;
    current: number;
    completed: boolean;
  }[];
  rewards: {
    xp: number;
    badge: string;
    unlocks?: string[];
  };
  timeLimit?: Date;
  unlocked: boolean;
  joined: boolean;
  completed: boolean;
  completedAt?: Date;
  icon: string;
  color: string;
  category: string;
  tips: string[];
  progressMessage: string;
}

interface ChallengeContextType {
  challenges: Challenge[];
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string) => void;
  claimReward: (challengeId: string) => void;
  getUserLevel: () => number;
  getTotalXP: () => number;
  getActiveChallenge: () => Challenge | null;
  refreshChallenges: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { weaves, retrievalSessions } = useWeave();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  // Load saved data
  useEffect(() => {
    const savedJoined = localStorage.getItem('eidolon-joined-challenges');
    const savedCompleted = localStorage.getItem('eidolon-completed-challenges');
    const savedXP = localStorage.getItem('eidolon-user-xp');
    
    if (savedJoined) setJoinedChallenges(JSON.parse(savedJoined));
    if (savedCompleted) setCompletedChallenges(JSON.parse(savedCompleted));
    if (savedXP) setUserXP(parseInt(savedXP));
  }, []);

  // Generate dynamic challenges based on user progress
  useEffect(() => {
    generateDynamicChallenges();
  }, [weaves, retrievalSessions, joinedChallenges, completedChallenges]);

  const generateDynamicChallenges = () => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Calculate current progress
    const totalWeaves = weaves.length;
    const pastWeaves = weaves.filter(w => w.type === 'past');
    const futureWeaves = weaves.filter(w => w.type === 'future');
    const completedFutures = futureWeaves.filter(w => w.completed);
    const highQualityWeaves = weaves.filter(w => w.coherenceScore >= 80);
    const thisWeekWeaves = weaves.filter(w => w.createdAt >= weekStart);
    const totalSessions = retrievalSessions.length;
    const fastSessions = retrievalSessions.filter(s => s.latencyMs < 10000);
    const accurateSessions = retrievalSessions.filter(s => s.accuracy >= 80);
    
    // ADHD training sessions
    const adhdSessions = JSON.parse(localStorage.getItem('eidolon-adhd-sessions') || '[]');
    const thisWeekADHD = adhdSessions.filter((s: any) => 
      new Date(s.date) >= weekStart
    ).length;
    
    // Get current weekly theme
    const weekNumber = Math.floor(now.getTime() / (1000 * 60 * 60 * 24 * 7));
    const weeklyThemes = [
      { theme: 'Childhood Memories', prompt: 'childhood, family, school, growing up', color: 'pink' },
      { theme: 'Professional Moments', prompt: 'work, career, achievements, challenges', color: 'blue' },
      { theme: 'Sensory Focus', prompt: 'rich sensory details, all five senses', color: 'purple' },
      { theme: 'Emotional Landscapes', prompt: 'feelings, emotions, meaningful moments', color: 'red' },
      { theme: 'Future Planning', prompt: 'upcoming events, goals, preparations', color: 'emerald' },
      { theme: 'Learning Moments', prompt: 'discovery, growth, new experiences', color: 'indigo' }
    ];
    const currentTheme = weeklyThemes[weekNumber % weeklyThemes.length];
    
    let newChallenges: Challenge[] = [
      // Beginner Milestone
      {
        id: 'first-memory',
        title: 'Memory Pioneer',
        description: 'Create your very first memory weave to begin your journey',
        type: 'milestone',
        difficulty: 'beginner',
        requirements: [{
          description: 'Create 1 memory weave',
          target: 1,
          current: totalWeaves,
          completed: totalWeaves >= 1
        }],
        rewards: { xp: 50, badge: '🌟 Pioneer', unlocks: ['Weekly Challenges', 'Training Mode'] },
        unlocked: true,
        joined: joinedChallenges.includes('first-memory'),
        completed: completedChallenges.includes('first-memory') || totalWeaves >= 1,
        icon: 'star',
        color: 'emerald',
        category: 'Getting Started',
        tips: [
          'Start with a simple, positive memory from recent days',
          'Include what you could see, hear, and feel',
          'Don\'t worry about perfection - just capture the moment'
        ],
        progressMessage: totalWeaves === 0 ? 'Ready to create your first memory?' : 'Congratulations! You\'ve started your memory journey!'
      },

      // Weekly Theme Challenge
      {
        id: `weekly-${weekNumber}`,
        title: `${currentTheme.theme} Week`,
        description: `This week's focus: Create memories related to ${currentTheme.theme.toLowerCase()}`,
        type: 'weekly',
        difficulty: 'intermediate',
        requirements: [{
          description: `Create 3 memories about ${currentTheme.prompt}`,
          target: 3,
          current: thisWeekWeaves.length,
          completed: thisWeekWeaves.length >= 3
        }],
        rewards: { xp: 100, badge: `🏆 ${currentTheme.theme} Master` },
        timeLimit: weekEnd,
        unlocked: totalWeaves >= 1,
        joined: joinedChallenges.includes(`weekly-${weekNumber}`),
        completed: completedChallenges.includes(`weekly-${weekNumber}`) || thisWeekWeaves.length >= 3,
        icon: 'calendar',
        color: currentTheme.color,
        category: 'Weekly Theme',
        tips: [
          `Think about moments related to ${currentTheme.prompt}`,
          'Each memory should be from a different day or experience',
          'Focus on rich details and emotional connections'
        ],
        progressMessage: thisWeekWeaves.length === 0 ? 
          `Join this week's ${currentTheme.theme} challenge!` :
          `${thisWeekWeaves.length}/3 memories created this week`
      },

      // Sensory Master Challenge
      {
        id: 'sensory-master',
        title: 'Sensory Master',
        description: 'Create a memory with rich details in all 5 senses',
        type: 'skill',
        difficulty: 'intermediate',
        requirements: [{
          description: 'Complete all 5 sensory fields in one memory',
          target: 1,
          current: weaves.filter(w => 
            Object.values(w.sensoryDetails).every(detail => detail.length > 20)
          ).length,
          completed: weaves.some(w => 
            Object.values(w.sensoryDetails).every(detail => detail.length > 20)
          )
        }],
        rewards: { xp: 75, badge: '🎨 Sensory Master', unlocks: ['Advanced Analytics'] },
        unlocked: totalWeaves >= 2,
        joined: joinedChallenges.includes('sensory-master'),
        completed: completedChallenges.includes('sensory-master') || weaves.some(w => 
          Object.values(w.sensoryDetails).every(detail => detail.length > 20)
        ),
        icon: 'eye',
        color: 'purple',
        category: 'Skill Building',
        tips: [
          'Include visual details: colors, lighting, objects',
          'Add sounds: voices, music, ambient noise',
          'Describe scents and physical sensations',
          'Don\'t forget emotional feelings and reactions'
        ],
        progressMessage: 'Challenge yourself to engage all five senses in one rich memory'
      },

      // Training Streak
      {
        id: 'training-streak',
        title: 'Training Streak',
        description: 'Complete retrieval training sessions for 5 consecutive days',
        type: 'streak',
        difficulty: 'intermediate',
        requirements: [{
          description: 'Train for 5 days in a row',
          target: 5,
          current: calculateCurrentStreak(),
          completed: calculateCurrentStreak() >= 5
        }],
        rewards: { xp: 125, badge: '🔥 Streak Master' },
        unlocked: totalSessions >= 3,
        joined: joinedChallenges.includes('training-streak'),
        completed: completedChallenges.includes('training-streak') || calculateCurrentStreak() >= 5,
        icon: 'zap',
        color: 'orange',
        category: 'Consistency',
        tips: [
          'Even 5 minutes of training counts',
          'Set a daily reminder for consistent practice',
          'Focus on quality over quantity'
        ],
        progressMessage: `Current streak: ${calculateCurrentStreak()} day${calculateCurrentStreak() !== 1 ? 's' : ''}`
      },

      // Future Planner
      {
        id: 'future-planner',
        title: 'Future Planner',
        description: 'Create and successfully complete 3 future scenarios',
        type: 'skill',
        difficulty: 'advanced',
        requirements: [
          {
            description: 'Create 3 future scenarios',
            target: 3,
            current: futureWeaves.length,
            completed: futureWeaves.length >= 3
          },
          {
            description: 'Complete all 3 scenarios in real life',
            target: 3,
            current: completedFutures.length,
            completed: completedFutures.length >= 3
          }
        ],
        rewards: { xp: 200, badge: '🎯 Future Master', unlocks: ['PMAR Analytics'] },
        unlocked: totalWeaves >= 5,
        joined: joinedChallenges.includes('future-planner'),
        completed: completedChallenges.includes('future-planner') || 
          (futureWeaves.length >= 3 && completedFutures.length >= 3),
        icon: 'target',
        color: 'emerald',
        category: 'Advanced Skills',
        tips: [
          'Choose realistic upcoming events to rehearse',
          'Create detailed if-then plans for each scenario',
          'Mark scenarios as completed when they happen in real life'
        ],
        progressMessage: `${futureWeaves.length}/3 scenarios created, ${completedFutures.length}/3 completed`
      },

      // Quality Expert
      {
        id: 'quality-expert',
        title: 'Quality Expert',
        description: 'Achieve 85+ coherence score on 5 different memories',
        type: 'skill',
        difficulty: 'advanced',
        requirements: [{
          description: 'Create 5 memories with 85+ coherence score',
          target: 5,
          current: weaves.filter(w => w.coherenceScore >= 85).length,
          completed: weaves.filter(w => w.coherenceScore >= 85).length >= 5
        }],
        rewards: { xp: 150, badge: '💎 Quality Expert' },
        unlocked: totalWeaves >= 8,
        joined: joinedChallenges.includes('quality-expert'),
        completed: completedChallenges.includes('quality-expert') || 
          weaves.filter(w => w.coherenceScore >= 85).length >= 5,
        icon: 'award',
        color: 'yellow',
        category: 'Mastery',
        tips: [
          'Include specific, detailed descriptions',
          'Connect events in a logical sequence',
          'Add emotional depth and personal meaning',
          'Use the AI suggestions to enhance your narratives'
        ],
        progressMessage: `${weaves.filter(w => w.coherenceScore >= 85).length}/5 high-quality memories created`
      },

      // Speed Demon (only if user has done training)
      ...(totalSessions >= 5 ? [{
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Achieve lightning-fast recall in 3 training sessions',
        type: 'skill',
        difficulty: 'advanced',
        requirements: [{
          description: 'Complete 3 sessions with <8 second recall time',
          target: 3,
          current: fastSessions.length,
          completed: fastSessions.length >= 3
        }],
        rewards: { xp: 175, badge: '⚡ Speed Demon' },
        unlocked: totalSessions >= 5,
        joined: joinedChallenges.includes('speed-demon'),
        completed: completedChallenges.includes('speed-demon') || fastSessions.length >= 3,
        icon: 'zap',
        color: 'blue',
        category: 'Performance',
        tips: [
          'Practice the same memory multiple times',
          'Focus on the most distinctive details first',
          'Use sensory cues to trigger faster recall'
        ],
        progressMessage: `${fastSessions.length}/3 fast recall sessions completed`
      }] : [])
    ];

    // Add ADHD-specific challenges
    if (adhdSessions.length >= 1) {
      newChallenges.push({
        id: 'adhd-focus-master',
        title: 'Focus Master',
        description: 'Complete 5 sustained attention sessions with 80+ focus score',
        type: 'skill',
        difficulty: 'intermediate',
        requirements: [{
          description: 'Complete 5 focus sessions with 80+ score',
          target: 5,
          current: adhdSessions.filter((s: any) => 
            s.type === 'focus' && s.results.focusScore >= 80
          ).length,
          completed: adhdSessions.filter((s: any) => 
            s.type === 'focus' && s.results.focusScore >= 80
          ).length >= 5
        }],
        rewards: { xp: 150, badge: '🧠 Focus Master' },
        unlocked: adhdSessions.length >= 1,
        joined: joinedChallenges.includes('adhd-focus-master'),
        completed: completedChallenges.includes('adhd-focus-master') || 
          adhdSessions.filter((s: any) => s.type === 'focus' && s.results.focusScore >= 80).length >= 5,
        icon: 'brain',
        color: 'blue',
        category: 'ADHD Training',
        tips: [
          'Start with shorter sessions and gradually increase duration',
          'Use the distraction button honestly when your mind wanders',
          'Practice in a quiet environment initially'
        ],
        progressMessage: `${adhdSessions.filter((s: any) => s.type === 'focus' && s.results.focusScore >= 80).length}/5 high-score focus sessions`
      });
    }

    if (thisWeekADHD >= 2) {
      newChallenges.push({
        id: 'adhd-weekly-warrior',
        title: 'ADHD Weekly Warrior',
        description: 'Complete 7 ADHD training sessions in one week',
        type: 'weekly',
        difficulty: 'advanced',
        requirements: [{
          description: 'Complete 7 ADHD sessions this week',
          target: 7,
          current: thisWeekADHD,
          completed: thisWeekADHD >= 7
        }],
        rewards: { xp: 200, badge: '⚡ ADHD Warrior' },
        timeLimit: weekEnd,
        unlocked: adhdSessions.length >= 3,
        joined: joinedChallenges.includes('adhd-weekly-warrior'),
        completed: completedChallenges.includes('adhd-weekly-warrior') || thisWeekADHD >= 7,
        icon: 'zap',
        color: 'indigo',
        category: 'ADHD Mastery',
        tips: [
          'Mix different training types throughout the week',
          'Consistency is more important than perfect scores',
          'Track your daily improvements and patterns'
        ],
        progressMessage: `${thisWeekADHD}/7 ADHD sessions this week`
      });
    }

    newChallenges = newChallenges.filter(challenge => {
      // Remove duplicates and ensure proper filtering
      return challenge.unlocked;
    });

    setChallenges(newChallenges);
  };

  function calculateCurrentStreak(): number {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(checkDate.setHours(0, 0, 0, 0));
      const dayEnd = new Date(checkDate.setHours(23, 59, 59, 999));
      
      const sessionsOnDay = retrievalSessions.filter(s => 
        s.startTime >= dayStart && s.startTime <= dayEnd
      );
      
      if (sessionsOnDay.length > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  const joinChallenge = (challengeId: string) => {
    const newJoined = [...joinedChallenges, challengeId];
    setJoinedChallenges(newJoined);
    localStorage.setItem('eidolon-joined-challenges', JSON.stringify(newJoined));
    
    // Track event
    console.log(`Joined challenge: ${challengeId}`);
  };

  const leaveChallenge = (challengeId: string) => {
    const newJoined = joinedChallenges.filter(id => id !== challengeId);
    setJoinedChallenges(newJoined);
    localStorage.setItem('eidolon-joined-challenges', JSON.stringify(newJoined));
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const newCompleted = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompleted);
    localStorage.setItem('eidolon-completed-challenges', JSON.stringify(newCompleted));
    
    // Award XP
    const newXP = userXP + challenge.rewards.xp;
    setUserXP(newXP);
    localStorage.setItem('eidolon-user-xp', newXP.toString());
    
    console.log(`Completed challenge: ${challengeId}, earned ${challenge.rewards.xp} XP`);
  };

  const claimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge?.completed) {
      alert(`🎉 Congratulations! You've earned:\n• ${challenge.rewards.xp} XP\n• ${challenge.rewards.badge} badge${challenge.rewards.unlocks ? `\n• Unlocked: ${challenge.rewards.unlocks.join(', ')}` : ''}`);
    }
  };

  const getUserLevel = () => {
    return Math.floor(userXP / 100) + 1;
  };

  const getTotalXP = () => {
    return userXP;
  };

  const getActiveChallenge = () => {
    return challenges.find(c => c.joined && !c.completed) || null;
  };

  const refreshChallenges = () => {
    generateDynamicChallenges();
  };

  return (
    <ChallengeContext.Provider value={{
      challenges,
      joinChallenge,
      leaveChallenge,
      completeChallenge,
      claimReward,
      getUserLevel,
      getTotalXP,
      getActiveChallenge,
      refreshChallenges
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};