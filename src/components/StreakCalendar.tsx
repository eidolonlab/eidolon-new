import React, { useEffect, useState } from 'react';
import { Flame, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  streakDays: number;
  insuranceCount: number;
  compact?: boolean;
}

interface DayData {
  date: string;
  hasFocus: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export default function StreakCalendar({ streakDays, insuranceCount, compact = false }: Props) {
  const { user } = useAuth();
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCalendarData();
    }
  }, [user]);

  async function loadCalendarData() {
    const daysToShow = compact ? 30 : 90;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToShow);

    let focusDates = new Set<string>();

    try {
      const { data } = await supabase
        .from('focus_session_completions')
        .select('completed_at')
        .eq('user_id', user?.id)
        .gte('completed_at', startDate.toISOString());

      focusDates = new Set(
        (data || []).map(session =>
          new Date(session.completed_at).toISOString().split('T')[0]
        )
      );
    } catch (error) {
      console.warn('Could not load calendar data:', error);
    }

    const calendarDays: DayData[] = [];
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      calendarDays.push({
        date: dateStr,
        hasFocus: focusDates.has(dateStr),
        isToday: dateStr === todayStr,
        isFuture: date > today
      });
    }

    setDays(calendarDays);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
        <div className="h-32 bg-slate-100 rounded"></div>
      </div>
    );
  }

  const columns = compact ? 10 : 13;
  const rows = Math.ceil(days.length / columns);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {streakDays} Day Streak
            </div>
            <div className="text-xs text-slate-500">Keep it going!</div>
          </div>
        </div>
        {insuranceCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-full">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">{insuranceCount}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {days.slice(rowIndex * columns, (rowIndex + 1) * columns).map((day) => {
              let bgColor = 'bg-slate-100';
              let borderColor = 'border-transparent';

              if (day.isFuture) {
                bgColor = 'bg-white';
              } else if (day.hasFocus) {
                bgColor = 'bg-primary-500';
              } else if (day.isToday) {
                bgColor = 'bg-slate-200';
                borderColor = 'border-primary-500';
              }

              return (
                <div
                  key={day.date}
                  className={`w-6 h-6 rounded ${bgColor} border-2 ${borderColor} transition-all duration-200 hover:scale-110`}
                  title={day.date}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary-500"></div>
          <span>Focused</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100"></div>
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-200 border-2 border-primary-500"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
