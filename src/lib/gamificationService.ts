import { supabase } from './supabase';

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

  return { levelUp, newLevel };
}

export async function checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
  const { data: userStats } = await supabase
    .from('adhd_user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const { data: completions } = await supabase
    .from('focus_session_completions')
    .select('id')
    .eq('user_id', userId);

  const { data: wins } = await supabase
    .from('meaningful_wins')
    .select('date, completed')
    .eq('user_id', userId)
    .eq('completed', true);

  const { data: earnedAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const earnedIds = new Set((earnedAchievements || []).map(a => a.achievement_id));

  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*');

  const newAchievements: Achievement[] = [];
  const totalSessions = completions?.length || 0;
  const totalFinishes = userStats?.total_finishes || 0;
  const totalMinutes = userStats?.total_focus_minutes || 0;
  const currentStreak = userStats?.current_streak_days || 0;

  const perfectDays = wins?.reduce((acc, win) => {
    const date = win.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasPerfectDay = Object.values(perfectDays || {}).some(count => count >= 2);

  for (const achievement of allAchievements || []) {
    if (earnedIds.has(achievement.id)) continue;

    let shouldAward = false;

    switch (achievement.key) {
      case 'first_session':
        shouldAward = totalSessions >= 1;
        break;
      case 'sessions_10':
        shouldAward = totalSessions >= 10;
        break;
      case 'sessions_50':
        shouldAward = totalSessions >= 50;
        break;
      case 'sessions_100':
        shouldAward = totalSessions >= 100;
        break;
      case 'minutes_100':
        shouldAward = totalMinutes >= 100;
        break;
      case 'minutes_500':
        shouldAward = totalMinutes >= 500;
        break;
      case 'minutes_1000':
        shouldAward = totalMinutes >= 1000;
        break;
      case 'streak_3':
        shouldAward = currentStreak >= 3;
        break;
      case 'streak_7':
        shouldAward = currentStreak >= 7;
        break;
      case 'streak_30':
        shouldAward = currentStreak >= 30;
        break;
      case 'perfect_day':
        shouldAward = hasPerfectDay;
        break;
    }

    if (shouldAward) {
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          earned_at: new Date().toISOString(),
          seen: false
        });

      await awardXP(userId, achievement.xp_reward, `Achievement: ${achievement.name}`);
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

export async function recordFocusSession(
  userId: string,
  durationMinutes: number,
  completed: boolean
): Promise<{ xpEarned: number; newAchievements: Achievement[] }> {
  const baseXP = durationMinutes * 2;
  const bonusXP = completed ? Math.floor(durationMinutes * 0.5) : 0;
  const totalXP = baseXP + bonusXP;

  await supabase
    .from('focus_session_completions')
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      completed,
      xp_earned: totalXP,
      completed_at: new Date().toISOString()
    });

  await awardXP(userId, totalXP, `Focus session: ${durationMinutes}m`);

  const newAchievements = await checkAndAwardAchievements(userId);

  return { xpEarned: totalXP, newAchievements };
}

export async function awardStreakInsurance(userId: string): Promise<void> {
  const { data: gamification } = await supabase
    .from('user_gamification')
    .select('streak_insurance_count')
    .eq('user_id', userId)
    .maybeSingle();

  const currentCount = gamification?.streak_insurance_count || 0;

  await supabase
    .from('user_gamification')
    .update({
      streak_insurance_count: currentCount + 1,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}

export async function useStreakInsurance(userId: string): Promise<boolean> {
  const { data: gamification } = await supabase
    .from('user_gamification')
    .select('streak_insurance_count')
    .eq('user_id', userId)
    .maybeSingle();

  const currentCount = gamification?.streak_insurance_count || 0;

  if (currentCount > 0) {
    await supabase
      .from('user_gamification')
      .update({
        streak_insurance_count: currentCount - 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    return true;
  }

  return false;
}
