import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, Award, CheckCircle, Clock, Zap, Brain, Star } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  category: 'memory' | 'retrieval' | 'planning' | 'reflection';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

interface HabitEntry {
  date: string;
  habitId: string;
  completed: boolean;
  notes?: string;
}

const HabitFormation: React.FC = () => {
  const { weaves, retrievalSessions } = useWeave();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [weeklyView, setWeeklyView] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    initializeHabits();
    loadHabitEntries();
    calculateStreaks();
  }, [weaves, retrievalSessions]);

  const initializeHabits = () => {
    const defaultHabits: Habit[] = [
      {
        id: 'daily-moment',
        name: 'Daily Memory Moment',
        description: 'Capture one meaningful moment from today',
        frequency: 'daily',
        targetCount: 1,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        category: 'memory',
        difficulty: 'easy',
        xpReward: 5
      },
      {
        id: 'retrieval-practice',
        name: 'Memory Retrieval Practice',
        description: 'Practice recalling a past memory',
        frequency: 'daily',
        targetCount: 1,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        category: 'retrieval',
        difficulty: 'medium',
        xpReward: 10
      },
      {
        id: 'future-planning',
        name: 'Future Scenario Planning',
        description: 'Plan or rehearse an upcoming event',
        frequency: 'weekly',
        targetCount: 2,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        category: 'planning',
        difficulty: 'medium',
        xpReward: 15
      },
      {
        id: 'memory-reflection',
        name: 'Memory Reflection',
        description: 'Reflect on how memory training helped you today',
        frequency: 'weekly',
        targetCount: 1,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        category: 'reflection',
        difficulty: 'easy',
        xpReward: 8
      },
      {
        id: 'sensory-focus',
        name: 'Sensory Focus Training',
        description: 'Create a memory focusing on one specific sense',
        frequency: 'weekly',
        targetCount: 3,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        category: 'memory',
        difficulty: 'hard',
        xpReward: 20
      }
    ];

    setHabits(defaultHabits);
  };

  const loadHabitEntries = () => {
    const saved = localStorage.getItem('eidolon-habit-entries');
    if (saved) {
      setHabitEntries(JSON.parse(saved));
    }
  };

  const calculateStreaks = () => {
    const today = new Date().toDateString();
    
    setHabits(prev => prev.map(habit => {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let completedToday = false;

      // Check if completed today
      const todayEntry = habitEntries.find(e => e.date === today && e.habitId === habit.id);
      completedToday = todayEntry?.completed || false;

      // Calculate current streak (working backwards from today)
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString();
        const entry = habitEntries.find(e => e.date === checkDate && e.habitId === habit.id);
        
        if (entry?.completed) {
          if (i === 0 || currentStreak > 0) {
            currentStreak++;
          }
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 0;
          if (i === 0) {
            currentStreak = 0;
          }
        }
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      return {
        ...habit,
        currentStreak,
        longestStreak,
        completedToday
      };
    }));

    // Calculate total XP
    const totalEarnedXP = habitEntries.reduce((sum, entry) => {
      if (entry.completed) {
        const habit = habits.find(h => h.id === entry.habitId);
        return sum + (habit?.xpReward || 0);
      }
      return sum;
    }, 0);
    setTotalXP(totalEarnedXP);
  };

  const completeHabit = (habitId: string, notes?: string) => {
    const today = new Date().toDateString();
    const existingEntry = habitEntries.find(e => e.date === today && e.habitId === habitId);
    
    if (existingEntry) {
      // Update existing entry
      const updatedEntries = habitEntries.map(e => 
        e.date === today && e.habitId === habitId 
          ? { ...e, completed: true, notes }
          : e
      );
      setHabitEntries(updatedEntries);
      localStorage.setItem('eidolon-habit-entries', JSON.stringify(updatedEntries));
    } else {
      // Create new entry
      const newEntry: HabitEntry = {
        date: today,
        habitId,
        completed: true,
        notes
      };
      const updatedEntries = [...habitEntries, newEntry];
      setHabitEntries(updatedEntries);
      localStorage.setItem('eidolon-habit-entries', JSON.stringify(updatedEntries));
    }

    calculateStreaks();
  };

  const getHabitIcon = (category: Habit['category']) => {
    switch (category) {
      case 'memory': return Brain;
      case 'retrieval': return Target;
      case 'planning': return Calendar;
      case 'reflection': return Star;
      default: return CheckCircle;
    }
  };

  const getHabitColor = (category: Habit['category']) => {
    switch (category) {
      case 'memory': return 'indigo';
      case 'retrieval': return 'emerald';
      case 'planning': return 'blue';
      case 'reflection': return 'purple';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (difficulty: Habit['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'yellow';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      week.push(date);
    }
    
    return week;
  };

  const isHabitCompletedOnDate = (habitId: string, date: Date) => {
    const dateStr = date.toDateString();
    return habitEntries.some(e => e.date === dateStr && e.habitId === habitId && e.completed);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Habit Formation</h2>
            <p className="text-sm text-gray-600">Build consistent memory training routines</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{totalXP} XP</div>
            <div className="text-xs text-gray-600">Total Earned</div>
          </div>
          <button
            onClick={() => setWeeklyView(!weeklyView)}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            {weeklyView ? 'List View' : 'Week View'}
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4 mb-6">
        {habits.map((habit) => {
          const IconComponent = getHabitIcon(habit.category);
          const color = getHabitColor(habit.category);
          const difficultyColor = getDifficultyColor(habit.difficulty);
          
          return (
            <div key={habit.id} className={`p-4 rounded-lg border transition-all ${
              habit.completedToday 
                ? `border-${color}-500 bg-${color}-50` 
                : `border-gray-300 hover:border-${color}-300`
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    {habit.completedToday ? (
                      <CheckCircle className={`w-5 h-5 text-${color}-600`} />
                    ) : (
                      <IconComponent className={`w-5 h-5 text-${color}-600`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full capitalize`}>
                        {habit.category}
                      </span>
                      <span className={`text-xs px-2 py-1 bg-${difficultyColor}-100 text-${difficultyColor}-700 rounded-full capitalize`}>
                        {habit.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">+{habit.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className={`w-4 h-4 text-${color}-600`} />
                    <span className="font-bold text-gray-900">{habit.currentStreak}</span>
                  </div>
                  <div className="text-xs text-gray-500">Current streak</div>
                  {habit.longestStreak > habit.currentStreak && (
                    <div className="text-xs text-gray-400">Best: {habit.longestStreak}</div>
                  )}
                </div>
              </div>

              {/* Weekly Progress View */}
              {weeklyView && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 w-16">This week:</span>
                  {getWeekDates().map((date, index) => {
                    const isCompleted = isHabitCompletedOnDate(habit.id, date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isCompleted 
                            ? `bg-${color}-500 text-white` 
                            : isToday 
                            ? 'bg-gray-300 text-gray-700 ring-2 ring-gray-400' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                        title={date.toLocaleDateString()}
                      >
                        {isCompleted ? '✓' : date.getDate()}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Button */}
              {!habit.completedToday && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className={`px-3 py-1.5 bg-${color}-600 text-white text-sm rounded-lg hover:bg-${color}-700 transition-colors`}
                  >
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Habit Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-600">
            {habits.filter(h => h.completedToday).length}/{habits.length}
          </div>
          <div className="text-xs text-gray-600">Completed Today</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-600">
            {Math.max(...habits.map(h => h.currentStreak), 0)}
          </div>
          <div className="text-xs text-gray-600">Longest Current Streak</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-600">
            {Math.max(...habits.map(h => h.longestStreak), 0)}
          </div>
          <div className="text-xs text-gray-600">Personal Best</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-600">{totalXP}</div>
          <div className="text-xs text-gray-600">Total XP Earned</div>
        </div>
      </div>

      {/* Habit Formation Tips */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">Habit Formation Science</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="mb-2"><strong>21-Day Myth:</strong> Research shows habits actually take 18-254 days to form, with an average of 66 days.</p>
            <p><strong>Consistency > Perfection:</strong> Missing one day doesn't break habit formation if you get back on track quickly.</p>
          </div>
          <div>
            <p className="mb-2"><strong>Cue-Routine-Reward:</strong> Habits form through consistent cue-behavior-reward loops.</p>
            <p><strong>Start Small:</strong> Begin with the minimum viable habit, then gradually increase difficulty.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitFormation;