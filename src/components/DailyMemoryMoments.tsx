import React, { useState, useEffect } from 'react';
import { Sunrise, Coffee, Heart, Star, Moon, Plus, CheckCircle, Calendar, Zap, Target, Award } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

const DailyMemoryMoments: React.FC = () => {
  const { addWeave, weaves } = useWeave();
  const [todaysMoments, setTodaysMoments] = useState<string[]>([]);
  const [currentMoment, setCurrentMoment] = useState('');
  const [streak, setStreak] = useState(0);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState('');

  const dailyPrompts = [
    "What made you smile today?",
    "Describe the first thing you noticed this morning",
    "What was the most interesting conversation you had?",
    "What scent caught your attention today?",
    "Describe a moment of unexpected beauty",
    "What sound made you pause and listen?",
    "When did you feel most present today?",
    "What texture or feeling surprised you?",
    "Describe a moment of genuine connection",
    "What color dominated your day?",
    "When did you feel most accomplished?",
    "What taste brought back a memory?",
    "Describe a moment of quiet peace",
    "What made you curious today?",
    "When did you feel most grateful?"
  ];

  useEffect(() => {
    // Set daily prompt based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setDailyPrompt(dailyPrompts[dayOfYear % dailyPrompts.length]);

    // Load today's moments
    const savedMoments = localStorage.getItem(`eidolon-daily-moments-${today.toDateString()}`);
    if (savedMoments) {
      setTodaysMoments(JSON.parse(savedMoments));
    }

    // Calculate streak
    calculateStreak();
  }, []);

  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const moments = localStorage.getItem(`eidolon-daily-moments-${checkDate.toDateString()}`);
      
      if (moments && JSON.parse(moments).length > 0) {
        currentStreak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }
    
    setStreak(currentStreak);
  };

  const captureQuickMoment = () => {
    if (!currentMoment.trim()) return;

    const newMoments = [...todaysMoments, currentMoment.trim()];
    setTodaysMoments(newMoments);
    
    // Save to localStorage
    const today = new Date();
    localStorage.setItem(`eidolon-daily-moments-${today.toDateString()}`, JSON.stringify(newMoments));
    
    // Create a quick memory weave
    addWeave({
      type: 'past',
      seed: currentMoment.trim(),
      title: `Daily Moment - ${today.toLocaleDateString()}`,
      narrative: `Today, ${currentMoment.trim()}. This moment stood out because it captured something meaningful about my day.`,
      sensoryDetails: {
        visual: '',
        auditory: '',
        olfactory: '',
        tactile: '',
        emotional: 'present and aware'
      },
      tags: ['daily-moment', today.toISOString().split('T')[0]],
      errorlessMode: false,
      difficultyLevel: 'easy'
    });

    setCurrentMoment('');
    setShowQuickCapture(false);
    calculateStreak();
  };

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return Sunrise;
    if (hour < 17) return Coffee;
    if (hour < 21) return Heart;
    return Moon;
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "Good morning";
    if (hour < 12) return "Late morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const getTimeAwarePrompt = () => {
    const hour = new Date().getHours();
    if (hour < 10) {
      return "What are you looking forward to today?";
    } else if (hour < 12) {
      return "What has caught your attention this morning?";
    } else if (hour < 17) {
      return "What moment from today stands out so far?";
    } else if (hour < 21) {
      return "What was meaningful about your day?";
    } else {
      return "What moment from today deserves to be remembered?";
    }
  };

  const getTimeAwarePlaceholder = () => {
    const hour = new Date().getHours();
    if (hour < 10) {
      return "e.g., excited about meeting, peaceful morning coffee, beautiful sunrise";
    } else if (hour < 12) {
      return "e.g., interesting conversation, productive work session, moment of clarity";
    } else {
      return "e.g., unexpected compliment, beautiful sunset, good conversation";
    }
  };

  const TimeIcon = getTimeOfDayIcon();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <TimeIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daily Memory Moments</h2>
            <p className="text-sm text-gray-600">{getTimeOfDayGreeting()}! Capture today's meaningful moments</p>
          </div>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-amber-100 rounded-lg">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">{streak} day streak!</span>
          </div>
        )}
      </div>

      {/* Daily Prompt */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-900">
            {new Date().getHours() < 10 ? "Morning Intention" : "Today's Prompt"}
          </span>
        </div>
        <p className="text-amber-800 italic">"{getTimeAwarePrompt()}"</p>
      </div>

      {/* Quick Capture */}
      {!showQuickCapture ? (
        <button
          onClick={() => setShowQuickCapture(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all"
        >
          <Plus className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-medium">Capture a moment from today</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTimeAwarePrompt()}
            </label>
            <input
              type="text"
              value={currentMoment}
              onChange={(e) => setCurrentMoment(e.target.value)}
              placeholder={getTimeAwarePlaceholder()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && captureQuickMoment()}
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={captureQuickMoment}
              disabled={!currentMoment.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Capture</span>
            </button>
            <button
              onClick={() => setShowQuickCapture(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Today's Captured Moments */}
      {todaysMoments.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Today's Captured Moments</h3>
          <div className="space-y-2">
            {todaysMoments.map((moment, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-amber-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">{moment}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Motivation */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">Memory Habit Streak</span>
            </div>
            <p className="text-sm text-emerald-700">
              {streak === 0 ? 'Start your daily memory practice today!' :
               streak === 1 ? 'Great start! Keep the momentum going.' :
               streak < 7 ? `${streak} days strong! Building a powerful habit.` :
               `Amazing ${streak}-day streak! You're a memory master.`}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {getTimeOfDayGreeting()}! {new Date().getHours() < 10 ? 'What are you excited about today?' : 'What made today special?'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyMemoryMoments;