import React, { useState, useEffect } from 'react';
import { Play, Timer, Clock, Zap } from 'lucide-react';
import { smartPatternsService, SmartSuggestion } from '../lib/smartPatterns';
import { useAuth } from '../contexts/AuthContext';
import { audioService } from '../lib/audioService';

interface OneTapFocusStartProps {
  onStart: (duration: number) => void;
}

const OneTapFocusStart: React.FC<OneTapFocusStartProps> = ({ onStart }) => {
  const { user } = useAuth();
  const [smartDuration, setSmartDuration] = useState(25);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSmartData();
    }
  }, [user]);

  const loadSmartData = async () => {
    if (!user) return;

    try {
      const patterns = await smartPatternsService.getUserPatterns(user.id);
      const duration = smartPatternsService.getSmartDefaultDuration(patterns);
      setSmartDuration(duration);

      const smartSuggestions = await smartPatternsService.getSmartSuggestions(user.id);
      setSuggestions(smartSuggestions.slice(0, 1));
    } catch (error) {
      console.warn('Failed to load smart data:', error);
    }
  };

  const handleQuickStart = async (duration: number) => {
    setLoading(true);
    audioService.softPop();

    setTimeout(() => {
      onStart(duration);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-primary-900 mb-1">Smart Suggestion</h3>
              <p className="text-sm text-primary-700">{suggestions[0].message}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => handleQuickStart(smartDuration)}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8" fill="currentColor" />
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold">{smartDuration} min</div>
            <div className="text-primary-100 text-sm">Quick Start</div>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleQuickStart(25)}
          disabled={loading}
          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="w-5 h-5 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">25</span>
          </div>
          <div className="text-xs text-gray-600">Pomodoro</div>
        </button>

        <button
          onClick={() => handleQuickStart(45)}
          disabled={loading}
          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">45</span>
          </div>
          <div className="text-xs text-gray-600">Deep Work</div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          {smartDuration === 25
            ? "Based on your Pomodoro preference"
            : smartDuration === 45
            ? "Based on your typical session length"
            : "Based on your deep work patterns"}
        </p>
      </div>
    </div>
  );
};

export default OneTapFocusStart;
