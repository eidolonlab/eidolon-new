import React, { useState, useEffect } from 'react';
import { Brain, Target, Clock, TrendingUp, Award, Play, ArrowLeft, Zap, CheckCircle, BarChart3 } from 'lucide-react';
import ADHDFocusTrainer from './ADHDFocusTrainer';
import WorkingMemoryTrainer from './WorkingMemoryTrainer';
import ExecutiveFunctionTrainer from './ExecutiveFunctionTrainer';

interface ADHDSession {
  id: string;
  type: 'focus' | 'working_memory' | 'executive_function';
  date: Date;
  results: any;
  improvement: number;
}

interface ADHDDashboardProps {
  onBack: () => void;
}

const ADHDDashboard: React.FC<ADHDDashboardProps> = ({ onBack }) => {
  const [activeTrainer, setActiveTrainer] = useState<'focus' | 'working_memory' | 'executive_function' | null>(null);
  const [sessions, setSessions] = useState<ADHDSession[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [showResults, setShowResults] = useState(false);
  const [lastResults, setLastResults] = useState<any>(null);

  useEffect(() => {
    // Load saved sessions
    const savedSessions = localStorage.getItem('eidolon-adhd-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessions(parsed);
    }
  }, []);

  const saveSessions = (newSessions: ADHDSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('eidolon-adhd-sessions', JSON.stringify(newSessions));
  };

  const handleTrainingComplete = (type: 'focus' | 'working_memory' | 'executive_function', results: any) => {
    // Calculate improvement based on recent sessions
    const recentSessions = sessions.filter(s => s.type === type).slice(0, 5);
    let improvement = 0;
    
    if (recentSessions.length > 0) {
      const avgPrevious = recentSessions.reduce((sum, s) => {
        switch (type) {
          case 'focus': return sum + s.results.focusScore;
          case 'working_memory': return sum + s.results.accuracy;
          case 'executive_function': return sum + s.results.executionEfficiency;
          default: return sum;
        }
      }, 0) / recentSessions.length;
      
      const currentScore = type === 'focus' ? results.focusScore : 
                          type === 'working_memory' ? results.accuracy : 
                          results.executionEfficiency;
      
      improvement = currentScore - avgPrevious;
    }

    const newSession: ADHDSession = {
      id: Date.now().toString(),
      type,
      date: new Date(),
      results,
      improvement
    };

    saveSessions([newSession, ...sessions]);
    setLastResults({ type, results, improvement });
    setShowResults(true);
    setActiveTrainer(null);
  };

  const getWeeklyProgress = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekSessions = sessions.filter(s => s.date >= weekStart);
    return thisWeekSessions.length;
  };

  const getAverageScores = () => {
    const focusSessions = sessions.filter(s => s.type === 'focus').slice(0, 10);
    const memorySessions = sessions.filter(s => s.type === 'working_memory').slice(0, 10);
    const executiveSessions = sessions.filter(s => s.type === 'executive_function').slice(0, 10);

    return {
      focus: focusSessions.length > 0 
        ? focusSessions.reduce((sum, s) => sum + s.results.focusScore, 0) / focusSessions.length 
        : 0,
      memory: memorySessions.length > 0 
        ? memorySessions.reduce((sum, s) => sum + s.results.accuracy, 0) / memorySessions.length 
        : 0,
      executive: executiveSessions.length > 0 
        ? executiveSessions.reduce((sum, s) => sum + s.results.executionEfficiency, 0) / executiveSessions.length 
        : 0
    };
  };

  const averageScores = getAverageScores();
  const weeklyProgress = getWeeklyProgress();

  if (activeTrainer === 'focus') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Focus Training</h1>
        </div>
        <ADHDFocusTrainer onComplete={(results) => handleTrainingComplete('focus', results)} />
      </div>
    );
  }

  if (activeTrainer === 'working_memory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Working Memory Training</h1>
        </div>
        <WorkingMemoryTrainer onComplete={(results) => handleTrainingComplete('working_memory', results)} />
      </div>
    );
  }

  if (activeTrainer === 'executive_function') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTrainer(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ADHD Training</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Executive Function Training</h1>
        </div>
        <ExecutiveFunctionTrainer onComplete={(results) => handleTrainingComplete('executive_function', results)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">ADHD Support Training</h1>
      </div>

      {/* Weekly Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">This Week's Progress</h2>
              <p className="text-sm text-gray-600">Consistent training builds stronger neural pathways</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{weeklyProgress}/{weeklyGoal}</div>
            <div className="text-sm text-gray-600">sessions this week</div>
          </div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Training Modules */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTrainer('focus')}
          className="group bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustained Attention</h3>
          <p className="text-gray-600 mb-4">Build focus duration and reduce distractibility</p>
          {averageScores.focus > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              Avg Score: {Math.round(averageScores.focus)}/100
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('working_memory')}
          className="group bg-white border-2 border-gray-200 hover:border-purple-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Working Memory</h3>
          <p className="text-gray-600 mb-4">Strengthen ability to hold and manipulate information</p>
          {averageScores.memory > 0 && (
            <div className="text-sm text-purple-600 font-medium">
              Avg Accuracy: {Math.round(averageScores.memory)}%
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveTrainer('executive_function')}
          className="group bg-white border-2 border-gray-200 hover:border-emerald-300 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <Play className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Function</h3>
          <p className="text-gray-600 mb-4">Improve planning, prioritization, and task execution</p>
          {averageScores.executive > 0 && (
            <div className="text-sm text-emerald-600 font-medium">
              Avg Efficiency: {Math.round(averageScores.executive)}%
            </div>
          )}
        </button>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Training Sessions</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{sessions.length} total sessions</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => {
              const colors = {
                focus: 'blue',
                working_memory: 'purple',
                executive_function: 'emerald'
              };
              const color = colors[session.type];
              
              return (
                <div key={session.id} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {session.type.replace('_', ' ')} Training
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.date.toLocaleDateString()} • 
                        {session.type === 'focus' && ` ${session.results.focusScore}/100 focus score`}
                        {session.type === 'working_memory' && ` Level ${session.results.maxSpan} span`}
                        {session.type === 'executive_function' && ` ${session.results.tasksCompleted}/${session.results.tasksPlanned} tasks`}
                      </div>
                    </div>
                    {session.improvement > 0 && (
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+{session.improvement.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Context */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Evidence-Based ADHD Support</h3>
        </div>
        <div className="text-sm text-indigo-800 space-y-2">
          <p><strong>Sustained Attention Training:</strong> Builds the same neural networks that ADHD medication targets - improving focus duration and reducing distractibility.</p>
          <p><strong>Working Memory Enhancement:</strong> Strengthens the brain's ability to hold and manipulate information, reducing forgetfulness and improving task completion.</p>
          <p><strong>Executive Function Development:</strong> Trains planning, prioritization, and task management skills that are often impaired in ADHD.</p>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && lastResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Complete!</h3>
              <p className="text-gray-600">
                {lastResults.type.replace('_', ' ')} session finished
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {lastResults.type === 'focus' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{lastResults.results.focusScore}</div>
                    <div className="text-sm text-gray-600">Focus Score</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{lastResults.results.distractions}</div>
                    <div className="text-sm text-gray-600">Distractions</div>
                  </div>
                </div>
              )}

              {lastResults.type === 'working_memory' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{lastResults.results.maxSpan}</div>
                    <div className="text-sm text-gray-600">Max Span</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{lastResults.results.accuracy.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
              )}

              {lastResults.type === 'executive_function' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">
                      {lastResults.results.tasksCompleted}/{lastResults.results.tasksPlanned}
                    </div>
                    <div className="text-sm text-gray-600">Tasks Done</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {lastResults.results.executionEfficiency.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                </div>
              )}

              {lastResults.improvement > 0 && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 font-medium">
                      +{lastResults.improvement.toFixed(1)} improvement from last session!
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowResults(false)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ADHDDashboard;