import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Calendar, CheckCircle, Star, Target, Heart, Brain, Zap, Clock, Plus, Lightbulb } from 'lucide-react';

interface MeaningfulWin {
  id: string;
  title: string;
  description: string;
  category: 'memory' | 'focus' | 'social' | 'professional' | 'personal' | 'learning';
  meaningfulness: number; // 1-10
  effort: number; // 1-10
  date: Date;
  linkedMemory?: string;
  linkedScenario?: string;
  transferEvidence: string;
  mood: number; // 1-10
}

interface MeaningfulWinsTrackerProps {
  onWinAdded: (win: MeaningfulWin) => void;
}

const MeaningfulWinsTracker: React.FC<MeaningfulWinsTrackerProps> = ({ onWinAdded }) => {
  const [wins, setWins] = useState<MeaningfulWin[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWin, setNewWin] = useState({
    title: '',
    description: '',
    category: 'personal' as MeaningfulWin['category'],
    meaningfulness: 5,
    effort: 3,
    transferEvidence: '',
    mood: 7
  });
  const [weeklyStats, setWeeklyStats] = useState({
    totalWins: 0,
    avgMeaningfulness: 0,
    avgMood: 0,
    topCategory: 'personal'
  });

  useEffect(() => {
    loadWins();
    calculateWeeklyStats();
  }, []);

  const loadWins = () => {
    const saved = localStorage.getItem('eidolon-meaningful-wins');
    if (saved) {
      const parsed = JSON.parse(saved).map((win: any) => ({
        ...win,
        date: new Date(win.date)
      }));
      setWins(parsed);
    }
  };

  const saveWins = (newWins: MeaningfulWin[]) => {
    setWins(newWins);
    localStorage.setItem('eidolon-meaningful-wins', JSON.stringify(newWins));
  };

  const addWin = () => {
    if (!newWin.title.trim()) return;

    const win: MeaningfulWin = {
      id: Date.now().toString(),
      title: newWin.title.trim(),
      description: newWin.description.trim(),
      category: newWin.category,
      meaningfulness: newWin.meaningfulness,
      effort: newWin.effort,
      date: new Date(),
      transferEvidence: newWin.transferEvidence.trim(),
      mood: newWin.mood
    };

    const newWins = [win, ...wins];
    saveWins(newWins);
    onWinAdded(win);
    
    // Reset form
    setNewWin({
      title: '',
      description: '',
      category: 'personal',
      meaningfulness: 5,
      effort: 3,
      transferEvidence: '',
      mood: 7
    });
    setShowAddForm(false);
    calculateWeeklyStats();
  };

  const calculateWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyWins = wins.filter(w => w.date >= weekAgo);
    
    if (weeklyWins.length === 0) {
      setWeeklyStats({ totalWins: 0, avgMeaningfulness: 0, avgMood: 0, topCategory: 'personal' });
      return;
    }

    const avgMeaningfulness = weeklyWins.reduce((sum, w) => sum + w.meaningfulness, 0) / weeklyWins.length;
    const avgMood = weeklyWins.reduce((sum, w) => sum + w.mood, 0) / weeklyWins.length;
    
    // Find top category
    const categoryCount = weeklyWins.reduce((acc, w) => {
      acc[w.category] = (acc[w.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'personal';

    setWeeklyStats({
      totalWins: weeklyWins.length,
      avgMeaningfulness,
      avgMood,
      topCategory
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'memory': return 'indigo';
      case 'focus': return 'blue';
      case 'social': return 'emerald';
      case 'professional': return 'purple';
      case 'personal': return 'pink';
      case 'learning': return 'orange';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return Brain;
      case 'focus': return Target;
      case 'social': return Heart;
      case 'professional': return Award;
      case 'personal': return Star;
      case 'learning': return Lightbulb;
      default: return CheckCircle;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Meaningful Wins</h2>
            <p className="text-sm text-gray-600">Track real progress, not just points</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Win</span>
        </button>
      </div>

      {/* Weekly Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalWins}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{weeklyStats.avgMeaningfulness.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Impact</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">{weeklyStats.avgMood.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Mood</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-lg font-bold text-purple-600 capitalize">{weeklyStats.topCategory}</div>
          <div className="text-sm text-gray-600">Top Category</div>
        </div>
      </div>

      {/* Recent Wins */}
      {wins.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Meaningful Wins</h3>
          {wins.slice(0, 5).map((win) => {
            const CategoryIcon = getCategoryIcon(win.category);
            const color = getCategoryColor(win.category);
            
            return (
              <div key={win.id} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{win.title}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(win.meaningfulness / 2) }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 text-${color}-500 fill-current`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{win.description}</p>
                    {win.transferEvidence && (
                      <div className="text-xs text-gray-500 bg-white rounded px-2 py-1 border border-gray-200">
                        Transfer: {win.transferEvidence}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{win.date.toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{win.category}</span>
                      <span>•</span>
                      <span>Mood: {win.mood}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Win Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Meaningful Win</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Win Title</label>
                <input
                  type="text"
                  value={newWin.title}
                  onChange={(e) => setNewWin(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Remembered all names at networking event"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newWin.description}
                  onChange={(e) => setNewWin(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What specifically did you accomplish?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newWin.category}
                  onChange={(e) => setNewWin(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="memory">Memory & Recall</option>
                  <option value="focus">Focus & Attention</option>
                  <option value="social">Social & Relationships</option>
                  <option value="professional">Professional & Career</option>
                  <option value="personal">Personal Growth</option>
                  <option value="learning">Learning & Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How meaningful was this? (1-10)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewWin(prev => ({ ...prev, meaningfulness: rating }))}
                      className={`w-6 h-6 rounded-full transition-colors ${
                        rating <= newWin.meaningfulness 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      <span className="text-white text-xs">{rating}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Evidence (How did your training help?)
                </label>
                <textarea
                  value={newWin.transferEvidence}
                  onChange={(e) => setNewWin(prev => ({ ...prev, transferEvidence: e.target.value }))}
                  placeholder="e.g., Used memory palace technique to remember all client names"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addWin}
                  disabled={!newWin.title.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Record Win
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {wins.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Recording Your Wins</h3>
          <p className="text-gray-600 mb-4">
            Track meaningful progress - kept promises, remembered names, completed goals
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Record First Win
          </button>
        </div>
      )}
    </div>
  );
};

export default MeaningfulWinsTracker;