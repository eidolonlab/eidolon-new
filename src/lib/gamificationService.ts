import { supabase } from './supabase';
import { audioService } from './audioService';

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
}

function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= totalXP) {
    xpNeeded += Math.floor(100 * Math.pow(1.5, level - 1));
    if (xpNeeded <= totalXP) {
      level++;
    }
  }

  return level;
}

export async function awardXP(userId: string, xp: number, reason: string): Promise<{ levelUp: boolean; newLevel: number }> {
  const { data: gamification } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const currentTotalXP = gamification?.total_xp || 0;
  const currentLevel = gamification?.level || 1;
  const newTotalXP = currentTotalXP + xp;
  const newLevel = calculateLevelFromXP(newTotalXP);
  const levelUp = newLevel > currentLevel;

  if (gamification) {
    await supabase
      .from('user_gamification')
      .update({
        current_xp: gamification.current_xp + xp,
        total_xp: newTotalXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    await supabase
      .from('user_gamification')
      .insert({
        user_id: userId,
        current_xp: xp,
        total_xp: xp,
        level: newLevel,
        streak_insurance_count: 0
      });
  }

  audioService.xpGain();

  if (levelUp) {
    audioService.levelUp();
  }

  return { levelUp, newLevel };
}

export async function checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
  // Placeholder for achievement checking logic
  return [];
}

export async function recordFocusSession(userId: string, durationMinutes: number, sessionType: string): Promise<void> {
  // Record focus session and award XP
  const xp = Math.floor(durationMinutes * 2); // 2 XP per minute
  await awardXP(userId, xp, `Completed ${durationMinutes}-minute ${sessionType} session`);
}
