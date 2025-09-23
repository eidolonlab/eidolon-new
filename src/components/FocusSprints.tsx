import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, CheckCircle, Target, Clock, Award, TrendingUp, Brain, Lightbulb, Star, Users, Calendar } from 'lucide-react';

interface MicroAction {
  id: string;
  text: string;
  category: 'organize' | 'communicate' | 'create' | 'learn' | 'plan';
  estimatedMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  meaningfulnessScore: number;
}

interface FocusSprintsProps {
  onMeaningfulWin: (action: MicroAction, completionTime: number) => void;
}

const FocusSprints: React.FC<FocusSprintsProps> = ({ onMeaningfulWin }) => {
  const [sprintState, setSprintState] = useState<'setup' | 'active' | 'reflect' | 'complete'>('setup');
  const [selectedAction, setSelectedAction] = useState<MicroAction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(360); // 6 minutes
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [meaningfulnessRating, setMeaningfulnessRating] = useState(3);
  const [sprintCount, setSprintCount] = useState(0);
  const [dailyWins, setDailyWins] = useState(0);

  const microActions: MicroAction[] = [
    {
      id: 'organize-desk',
      text: 'Clear and organize one small area of your workspace',
      category: 'organize',
      estimatedMinutes: 5,
      difficulty: 'easy',
      meaningfulnessScore: 7
    },
    {
      id: 'send-message',
      text: 'Send one important message you\'ve been putting off',
      category: 'communicate',
      estimatedMinutes: 3,
      difficulty: 'medium',
      meaningfulnessScore: 8
    },
    {
      id: 'plan-tomorrow',
      text: 'Write down your top 3 priorities for tomorrow',
      category: 'plan',
      estimatedMinutes: 4,
      difficulty: 'easy',
      meaningfulnessScore: 9
    },
    {
      id: 'learn-something',
      text: 'Read one article and write a 3-sentence summary',
      category: 'learn',
      estimatedMinutes: 6,
      difficulty: 'medium',
      meaningfulnessScore: 8
    },
    {
      id: 'create-outline',
      text: 'Create a simple outline for something you need to write',
      category: 'create',
      estimatedMinutes: 5,
      difficulty: 'medium',
      meaningfulnessScore: 8
    },
    {
      id: 'review-calendar',
      text: 'Review and prep for your next 3 calendar items',
      category: 'plan',
      estimatedMinutes: 4,
      difficulty: 'easy',
      meaningfulnessScore: 9
    },
    {
      id: 'gratitude-note',
      text: 'Write a specific thank you message to someone',
      category: 'communicate',
      estimatedMinutes: 3,
      difficulty: 'easy',
      meaningfulnessScore: 10
    },
    {
      id: 'skill-practice',
      text: 'Practice one specific skill for 5 focused minutes',
      category: 'learn',
      estimatedMinutes: 5,
      difficulty: 'hard',
      meaningfulnessScore: 9
    }
  ];

  useEffect(() => {
    // Load daily wins count
    const today = new Date().toDateString();
    const savedWins = localStorage.getItem(`eidolon-daily-wins-${today}`);
    if (savedWins) {
      setDailyWins(parseInt(savedWins));
    }

    // Load sprint count
    const savedSprints = localStorage.getItem('eidolon-sprint-count');
    if (savedSprints) {
      setSprintCount(parseInt(savedSprints));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sprintState === 'active' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSprintState('reflect');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [sprintState, timeRemaining]);

  const startSprint = (action: MicroAction) => {
    setSelectedAction(action);
    setSprintState('active');
    setStartTime(new Date());
    setTimeRemaining(360); // 6 minutes
  };

  const completeSprint = () => {
    if (!selectedAction || !startTime) return;

    const completionTime = (Date.now() - startTime.getTime()) / 1000;
    
    // Record meaningful win
    onMeaningfulWin(selectedAction, completionTime);
    
    // Update daily wins
    const newDailyWins = dailyWins + 1;
    setDailyWins(newDailyWins);
    const today = new Date().toDateString();
    localStorage.setItem(`eidolon-daily-wins-${today}`, newDailyWins.toString());
    
    // Update sprint count
    const newSprintCount = sprintCount + 1;
    setSprintCount(newSprintCount);
    localStorage.setItem('eidolon-sprint-count', newSprintCount.toString());
    
    setSprintState('complete');
  };

  const resetSprint = () => {
    setSprintState('setup');
    setSelectedAction(null);
    setTimeRemaining(360);
    setStartTime(null);
    setCompletionNotes('');
    setMeaningfulnessRating(3);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'organize': return 'blue';
      case 'communicate': return 'emerald';
      case 'create': return 'purple';
      case 'learn': return 'orange';
      case 'plan': return 'indigo';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organize': return Target;
      case 'communicate': return Users;
      case 'create': return Brain;
      case 'learn': return Lightbulb;
      case 'plan': return Calendar;
      default: return Zap;
    }
  };

  if (sprintState === 'setup') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Focus Sprints</h2>
              <p className="text-sm text-gray-600">6-minute focused bursts that produce meaningful wins</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600">{dailyWins}</div>
            <div className="text-sm text-gray-600">Today's Wins</div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-orange-900">Meaningful Wins Philosophy</span>
          </div>
          <p className="text-sm text-orange-800">
            Every sprint produces a usable outcome - not just points or scores, but real progress 
            on things that matter to you. Quality over quantity, impact over activity.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Choose Your 6-Minute Win</h3>
          {microActions.map((action) => {
            const CategoryIcon = getCategoryIcon(action.category);
            const color = getCategoryColor(action.category);
            
            return (
              <button
                key={action.id}
                onClick={() => startSprint(action)}
                className={`w-full p-4 bg-${color}-50 border border-${color}-200 rounded-lg hover:bg-${color}-100 transition-all text-left group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center group-hover:bg-${color}-200 transition-colors`}>
                      <CategoryIcon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{action.text}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="capitalize">{action.category}</span>
                        <span>•</span>
                        <span>{action.estimatedMinutes} min</span>
                        <span>•</span>
                        <span className="capitalize">{action.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.ceil(action.meaningfulnessScore / 2) }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 text-${color}-500 fill-current`} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Impact: {action.meaningfulnessScore}/10</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (sprintState === 'active') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Focus Sprint Active</h2>
          <p className="text-gray-600">Stay focused on your meaningful win</p>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-orange-600 mb-2">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">
            {Math.round(((360 - timeRemaining) / 360) * 100)}% complete
          </div>
        </div>

        {selectedAction && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-900">Your Meaningful Win</span>
            </div>
            <p className="text-orange-800">{selectedAction.text}</p>
          </div>
        )}

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setSprintState('reflect')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            I'm Done!
          </button>
          <button
            onClick={() => setSprintState('setup')}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Stop Sprint
          </button>
        </div>
      </div>
    );
  }

  if (sprintState === 'reflect') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sprint Complete!</h2>
          <p className="text-gray-600">Reflect on your meaningful win</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-medium text-emerald-900 mb-2">What You Accomplished</h3>
            <p className="text-emerald-800">{selectedAction?.text}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How meaningful was this win? (1-5)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMeaningfulnessRating(rating)}
                  className={`w-10 h-10 rounded-full transition-colors ${
                    rating <= meaningfulnessRating 
                      ? 'bg-emerald-500 hover:bg-emerald-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <Star className="w-5 h-5 text-white mx-auto" />
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {meaningfulnessRating <= 2 ? 'Small step forward' :
               meaningfulnessRating <= 3 ? 'Good progress' :
               meaningfulnessRating <= 4 ? 'Significant win' : 'Major breakthrough!'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick reflection (optional)
            </label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="What did you learn? How do you feel? What's next?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={completeSprint}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Record Meaningful Win
            </button>
            <button
              onClick={resetSprint}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Another Sprint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Meaningful Win Recorded!</h2>
        <p className="text-gray-600 mb-6">You've created real progress in just 6 minutes</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">{dailyWins + 1}</div>
            <div className="text-sm text-gray-600">Today's Wins</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{sprintCount + 1}</div>
            <div className="text-sm text-gray-600">Total Sprints</div>
          </div>
        </div>
        
        <button
          onClick={resetSprint}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Start Another Sprint
        </button>
      </div>
    </div>
  );
};

export default FocusSprints;