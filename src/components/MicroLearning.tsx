import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, Play, CheckCircle, ArrowRight, Brain, Target, Clock, Award } from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  content: string;
  type: 'fact' | 'technique' | 'research' | 'tip';
  duration: number; // seconds
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  unlocked: boolean;
}

const MicroLearning: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showModule, setShowModule] = useState(false);

  useEffect(() => {
    generateLearningModules();
    calculateStreak();
    loadTodayProgress();
  }, []);

  const generateLearningModules = () => {
    const learningContent: LearningModule[] = [
      // Memory Science Facts
      {
        id: 'fact-1',
        title: 'The Multi-Sensory Advantage',
        content: 'Memories encoded with multiple senses are 65% more likely to be recalled accurately. This is why Eidolon emphasizes visual, auditory, tactile, olfactory, and emotional details in every memory weave.',
        type: 'fact',
        duration: 30,
        category: 'Memory Science',
        difficulty: 'beginner',
        completed: false,
        unlocked: true
      },
      {
        id: 'fact-2',
        title: 'The Spacing Effect',
        content: 'Hermann Ebbinghaus discovered that memories are strengthened when practice is distributed over time rather than massed. Spaced retrieval training can improve retention by up to 200%.',
        type: 'fact',
        duration: 35,
        category: 'Memory Science',
        difficulty: 'beginner',
        completed: false,
        unlocked: true
      },
      {
        id: 'technique-1',
        title: 'The Emotional Anchor Technique',
        content: 'Start each memory with how you felt in your body. Emotions are processed by the amygdala, which has direct connections to memory formation areas. Ask yourself: "How did this make me feel physically?"',
        type: 'technique',
        duration: 45,
        category: 'Memory Techniques',
        difficulty: 'beginner',
        completed: false,
        unlocked: true
      },
      {
        id: 'research-1',
        title: 'Implementation Intentions Research',
        content: 'Peter Gollwitzer\'s research shows that "if-then" planning doubles goal achievement rates. When you plan "If situation X occurs, then I will do Y," your brain automatically executes the plan without conscious effort.',
        type: 'research',
        duration: 50,
        category: 'Cognitive Science',
        difficulty: 'intermediate',
        completed: false,
        unlocked: true
      },
      {
        id: 'tip-1',
        title: 'The 5-4-3-2-1 Memory Technique',
        content: 'When creating memories, identify: 5 things you can see, 4 things you can hear, 3 things you can touch, 2 things you can smell, and 1 thing you can taste. This systematic approach ensures multi-sensory encoding.',
        type: 'tip',
        duration: 40,
        category: 'Practical Tips',
        difficulty: 'beginner',
        completed: false,
        unlocked: true
      },
      {
        id: 'technique-2',
        title: 'Narrative Coherence Building',
        content: 'Strong memories have clear temporal structure. Use transition words: "First...", "Then...", "After that...", "Finally...". This creates a coherent narrative that\'s easier to retrieve and more resistant to forgetting.',
        type: 'technique',
        duration: 45,
        category: 'Memory Techniques',
        difficulty: 'intermediate',
        completed: false,
        unlocked: true
      },
      {
        id: 'research-2',
        title: 'Autobiographical Memory Networks',
        content: 'Brain imaging shows that autobiographical memories activate the default mode network, involving the medial prefrontal cortex, posterior cingulate, and hippocampus. Rich, detailed memories create stronger neural networks.',
        type: 'research',
        duration: 60,
        category: 'Neuroscience',
        difficulty: 'advanced',
        completed: false,
        unlocked: true
      },
      {
        id: 'tip-2',
        title: 'Context-Dependent Memory',
        content: 'Memories are stronger when retrieved in similar contexts to where they were formed. If you studied in a quiet room, take the test in quiet conditions. Use this principle in your memory training.',
        type: 'tip',
        duration: 35,
        category: 'Practical Tips',
        difficulty: 'intermediate',
        completed: false,
        unlocked: true
      },
      {
        id: 'technique-3',
        title: 'Future Memory Pre-Loading',
        content: 'For upcoming events, create detailed mental rehearsals 3-7 days in advance. This "pre-loads" the memory network, making the actual experience feel familiar and reducing anxiety while improving performance.',
        type: 'technique',
        duration: 50,
        category: 'Future Planning',
        difficulty: 'advanced',
        completed: false,
        unlocked: true
      },
      {
        id: 'fact-3',
        title: 'Errorless Learning Benefits',
        content: 'Errorless learning prevents the formation of incorrect memory traces. When you avoid guessing and use guided hints instead, you build stronger, more accurate memories without the interference of wrong answers.',
        type: 'fact',
        duration: 40,
        category: 'Learning Theory',
        difficulty: 'intermediate',
        completed: false,
        unlocked: true
      }
    ];

    // Load completion status
    const completed = JSON.parse(localStorage.getItem('eidolon-learning-completed') || '[]');
    const updatedModules = learningContent.map(module => ({
      ...module,
      completed: completed.includes(module.id)
    }));

    setModules(updatedModules);
  };

  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = checkDate.toDateString();
      const dayProgress = localStorage.getItem(`eidolon-learning-${dateKey}`);
      
      if (dayProgress && parseInt(dayProgress) > 0) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const loadTodayProgress = () => {
    const today = new Date().toDateString();
    const todayProgress = localStorage.getItem(`eidolon-learning-${today}`);
    setCompletedToday(todayProgress ? parseInt(todayProgress) : 0);
  };

  const completeModule = (moduleId: string) => {
    // Mark as completed
    const completed = JSON.parse(localStorage.getItem('eidolon-learning-completed') || '[]');
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      localStorage.setItem('eidolon-learning-completed', JSON.stringify(completed));
    }

    // Update today's progress
    const today = new Date().toDateString();
    const newTodayCount = completedToday + 1;
    localStorage.setItem(`eidolon-learning-${today}`, newTodayCount.toString());
    setCompletedToday(newTodayCount);

    // Update modules
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, completed: true } : m
    ));

    setShowModule(false);
    setCurrentModule(null);
    calculateStreak();
  };

  const getModuleIcon = (type: LearningModule['type']) => {
    switch (type) {
      case 'fact': return Brain;
      case 'technique': return Target;
      case 'research': return BookOpen;
      case 'tip': return Lightbulb;
      default: return BookOpen;
    }
  };

  const getModuleColor = (type: LearningModule['type']) => {
    switch (type) {
      case 'fact': return 'blue';
      case 'technique': return 'emerald';
      case 'research': return 'purple';
      case 'tip': return 'orange';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const getRandomUncompletedModule = () => {
    const uncompleted = modules.filter(m => !m.completed && m.unlocked);
    if (uncompleted.length === 0) return null;
    return uncompleted[Math.floor(Math.random() * uncompleted.length)];
  };

  const startRandomModule = () => {
    const randomModule = getRandomUncompletedModule();
    if (randomModule) {
      setCurrentModule(randomModule);
      setShowModule(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daily Learning</h2>
            <p className="text-sm text-gray-600">Bite-sized memory science and techniques</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {streak > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 rounded-lg">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">{streak} day streak!</span>
            </div>
          )}
          <button
            onClick={startRandomModule}
            disabled={modules.filter(m => !m.completed).length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Quick Learn</span>
          </button>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-blue-900">Today's Learning Progress</h3>
          <div className="text-blue-600 font-bold">{completedToday}/3</div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((completedToday / 3) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm text-blue-700">
          {completedToday === 0 ? 'Start your daily learning journey!' :
           completedToday < 3 ? `${3 - completedToday} more to complete today's goal` :
           'Daily learning goal achieved! 🎉'}
        </p>
      </div>

      {/* Learning Modules Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {modules.slice(0, 6).map((module) => {
          const IconComponent = getModuleIcon(module.type);
          const color = getModuleColor(module.type);
          const difficultyColor = getDifficultyColor(module.difficulty);
          
          return (
            <button
              key={module.id}
              onClick={() => {
                setCurrentModule(module);
                setShowModule(true);
              }}
              disabled={!module.unlocked}
              className={`p-4 rounded-lg border text-left transition-all ${
                module.completed
                  ? `border-${color}-500 bg-${color}-50`
                  : module.unlocked
                  ? `border-gray-300 hover:border-${color}-300 hover:bg-${color}-50`
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    {module.completed ? (
                      <CheckCircle className={`w-4 h-4 text-${color}-600`} />
                    ) : (
                      <IconComponent className={`w-4 h-4 text-${color}-600`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{module.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full capitalize`}>
                        {module.type}
                      </span>
                      <span className={`text-xs px-2 py-1 bg-${difficultyColor}-100 text-${difficultyColor}-700 rounded-full capitalize`}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{module.duration}s</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {module.content.substring(0, 100)}...
              </p>
            </button>
          );
        })}
      </div>

      {/* Learning Module Modal */}
      {showModule && currentModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${getModuleColor(currentModule.type)}-100 rounded-lg flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = getModuleIcon(currentModule.type);
                    return <IconComponent className={`w-5 h-5 text-${getModuleColor(currentModule.type)}-600`} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentModule.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 bg-${getModuleColor(currentModule.type)}-100 text-${getModuleColor(currentModule.type)}-700 rounded-full capitalize`}>
                      {currentModule.type}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{currentModule.duration} seconds</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModule(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className={`p-4 bg-${getModuleColor(currentModule.type)}-50 rounded-lg border border-${getModuleColor(currentModule.type)}-200`}>
                <p className="text-gray-800 leading-relaxed">{currentModule.content}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Category: {currentModule.category}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModule(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {!currentModule.completed && (
                  <button
                    onClick={() => completeModule(currentModule.id)}
                    className={`flex items-center space-x-2 px-4 py-2 bg-${getModuleColor(currentModule.type)}-600 text-white rounded-lg hover:bg-${getModuleColor(currentModule.type)}-700 transition-colors`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-600">{modules.filter(m => m.completed).length}</div>
          <div className="text-xs text-gray-600">Modules Completed</div>
        </div>
        
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-600">{completedToday}</div>
          <div className="text-xs text-gray-600">Learned Today</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-600">{streak}</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-600">
            {Math.round(modules.filter(m => m.completed).reduce((sum, m) => sum + m.duration, 0) / 60)}
          </div>
          <div className="text-xs text-gray-600">Minutes Learned</div>
        </div>
      </div>

      {/* Research Context */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Microlearning Science</span>
        </div>
        <p className="text-sm text-indigo-800">
          Microlearning leverages the spacing effect and reduces cognitive load. Short, focused 
          learning sessions (30-60 seconds) improve retention by 17% compared to longer sessions, 
          while fitting easily into daily routines for better adherence.
        </p>
      </div>
    </div>
  );
};

export default MicroLearning;