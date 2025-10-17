import { supabase } from './supabase';

export interface UserPattern {
  userId: string;
  preferredFocusTimes: number[];
  averageSessionDuration: number;
  mostProductiveHour: number;
  streakReminderTime: number;
  lastFocusDate: string | null;
}

export interface SmartSuggestion {
  type: 'focus' | 'reminder' | 'break' | 'streak';
  message: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

class SmartPatternsService {
  async getUserPatterns(userId: string): Promise<UserPattern | null> {
    try {
      const { data: sessions } = await supabase
        .from('focus_session_completions')
        .select('completed_at, duration_minutes')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (!sessions || sessions.length === 0) {
        return null;
      }

      const focusHours = sessions.map(s => {
        const date = new Date(s.completed_at);
        return date.getHours();
      });

      const hourFrequency: Record<number, number> = {};
      focusHours.forEach(hour => {
        hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
      });

      const mostProductiveHour = Number(
        Object.entries(hourFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 9
      );

      const preferredFocusTimes = Object.entries(hourFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => Number(hour));

      const totalDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
      const averageSessionDuration = Math.round(totalDuration / sessions.length);

      const lastSession = sessions[0];
      const lastFocusDate = lastSession ? new Date(lastSession.completed_at).toISOString() : null;

      return {
        userId,
        preferredFocusTimes,
        averageSessionDuration,
        mostProductiveHour,
        streakReminderTime: 20,
        lastFocusDate,
      };
    } catch (error) {
      console.warn('Failed to get user patterns:', error);
      return null;
    }
  }

  async getSmartSuggestions(userId: string): Promise<SmartSuggestion[]> {
    const patterns = await this.getUserPatterns(userId);
    const suggestions: SmartSuggestion[] = [];
    const currentHour = new Date().getHours();

    if (!patterns) {
      suggestions.push({
        type: 'focus',
        message: "Ready to start your first focus session?",
        action: 'start-focus',
        priority: 'medium',
      });
      return suggestions;
    }

    if (patterns.preferredFocusTimes.includes(currentHour)) {
      suggestions.push({
        type: 'focus',
        message: `You usually focus around this time. Start a ${patterns.averageSessionDuration}min session?`,
        action: 'start-focus',
        priority: 'high',
      });
    }

    if (currentHour === patterns.mostProductiveHour) {
      suggestions.push({
        type: 'focus',
        message: "This is your peak productivity hour! Make the most of it.",
        action: 'start-focus',
        priority: 'high',
      });
    }

    const lastFocus = patterns.lastFocusDate ? new Date(patterns.lastFocusDate) : null;
    if (lastFocus) {
      const hoursSinceLastFocus = (Date.now() - lastFocus.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastFocus > 24) {
        suggestions.push({
          type: 'streak',
          message: "Keep your streak alive! Complete a session today.",
          action: 'start-focus',
          priority: 'high',
        });
      }
    }

    return suggestions;
  }

  async shouldSendStreakReminder(userId: string): Promise<boolean> {
    const currentHour = new Date().getHours();

    const { data: todaySessions } = await supabase
      .from('focus_session_completions')
      .select('id')
      .eq('user_id', userId)
      .gte('completed_at', new Date().toISOString().split('T')[0]);

    const hasCompletedToday = (todaySessions?.length || 0) > 0;

    return !hasCompletedToday && currentHour >= 20;
  }

  getSmartDefaultDuration(patterns: UserPattern | null): number {
    if (!patterns) {
      return 25;
    }

    const avgDuration = patterns.averageSessionDuration;

    if (avgDuration <= 30) return 25;
    if (avgDuration <= 50) return 45;
    return 60;
  }
}

export const smartPatternsService = new SmartPatternsService();
