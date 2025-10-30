import React, { useState, useEffect } from 'react';
import { X, CheckCircle, TrendingUp, Zap, Eye, Brain, ListOrdered, Target, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { audioService } from '../../lib/audioService';

interface TrainingExerciseProps {
  moduleId: string;
  onClose: () => void;
}

const TrainingExercise: React.FC<TrainingExerciseProps> = ({ moduleId, onClose }) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<'intro' | 'input' | 'active' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [sequenceToRemember, setSequenceToRemember] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [targetShape, setTargetShape] = useState<string>('');
  const [currentShape, setCurrentShape] = useState<string>('');
  const [shapes] = useState(['circle', 'square', 'triangle', 'star']);
  const [tasks, setTasks] = useState<Array<{id: number; text: string; priority: number; completed: boolean}>>([]);
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [shapeInterval, setShapeInterval] = useState<NodeJS.Timeout | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [userTasks, setUserTasks] = useState<Array<{text: string; priority: number}>>([]);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error'; message: string} | null>(null);

  const moduleDetails: Record<string, { title: string; instruction: string }> = {
    'working-memory': {
      title: 'Working Memory Training',
      instruction: 'Watch the sequence, then tap the numbers in the same order',
    },
    'sustained-attention': {
      title: 'Sustained Attention',
      instruction: 'Focus on the target and tap only when you see it',
    },
    'executive-function': {
      title: 'Executive Function',
      instruction: 'Add your tasks, assign priorities (P1=urgent to P4=low), then complete them in priority order',
    },
    'micro-attention': {
      title: 'Micro-Attention Drill',
      instruction: 'Measure your reaction time - tap the moment the button turns green',
    },
  };

  const currentModule = moduleDetails[moduleId] || moduleDetails['working-memory'];

  useEffect(() => {
    if (phase === 'active') {
      startRound();
    }
    return () => {
      if (shapeInterval) {
        clearInterval(shapeInterval);
      }
    };
  }, [phase, currentRound]);

  const startRound = () => {
    if (moduleId === 'working-memory') {
      const length = Math.min(3 + currentRound - 1, 7);
      const sequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
      setSequenceToRemember(sequence);
      setUserInput([]);
      setShowSequence(true);
      setTimeout(() => setShowSequence(false), length * 800);
    } else if (moduleId === 'sustained-attention') {
      const target = shapes[Math.floor(Math.random() * shapes.length)];
      setTargetShape(target);
      showRandomShapes();
    } else if (moduleId === 'micro-attention') {
      setReactionStartTime(Date.now() + Math.random() * 2000 + 1000);
    }
  };

  const showRandomShapes = () => {
    if (shapeInterval) {
      clearInterval(shapeInterval);
    }
    setHits(0);
    setMisses(0);

    const interval = setInterval(() => {
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
    }, 1200);
    setShapeInterval(interval);
  };

  const stopShapes = () => {
    if (shapeInterval) {
      clearInterval(shapeInterval);
      setShapeInterval(null);
    }
    setCurrentShape('');
  };

  const handleNumberClick = async (num: number) => {
    if (showSequence) return;

    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const newInput = [...userInput, num];
    setUserInput(newInput);

    if (newInput.length === sequenceToRemember.length) {
      const isCorrect = newInput.every((n, i) => n === sequenceToRemember[i]);

      if (isCorrect) {
        audioService.success();
        setScore(score + 10);
        setFeedback({ type: 'success', message: 'Perfect! +10 points' });

        if (currentRound < totalRounds) {
          setTimeout(() => {
            setFeedback(null);
            setCurrentRound(currentRound + 1);
          }, 1000);
        } else {
          setTimeout(() => {
            completeTraining();
          }, 1000);
        }
      } else {
        audioService.error();
        setFeedback({ type: 'error', message: 'Not quite! Try again' });
        setScore(Math.max(0, score - 2));
        setTimeout(() => {
          setFeedback(null);
          setUserInput([]);
        }, 500);
      }
    }
  };

  const completeTraining = async () => {
    setPhase('complete');

    if (user) {
      try {
        await supabase.from('training_completions').insert({
          user_id: user.id,
          module_id: moduleId,
          score: score,
          completed_at: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Could not save training completion:', error);
      }
    }
  };

  const handleShapeClick = async (shape: string) => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const isCorrect = shape === targetShape && shape === currentShape;
    const newHits = isCorrect ? hits + 1 : hits;
    const newMisses = isCorrect ? misses : misses + 1;

    if (isCorrect) {
      audioService.success();
      setHits(newHits);
      setScore(score + 10);
    } else {
      audioService.error();
      setMisses(newMisses);
      setScore(Math.max(0, score - 2));
    }

    if (newHits + newMisses >= 10) {
      stopShapes();
      if (currentRound < totalRounds) {
        setTimeout(() => setCurrentRound(currentRound + 1), 1000);
      } else {
        setTimeout(() => completeTraining(), 1000);
      }
    }
  };

  const handleTaskClick = async (taskId: number) => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
    const expectedNextTask = sortedTasks.find(t => !t.completed);

    if (expectedNextTask?.id === taskId) {
      audioService.success();
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
      setTasks(updatedTasks);
      setScore(score + 10);
      setFeedback({ type: 'success', message: 'Correct priority! +10 points' });

      if (updatedTasks.every(t => t.completed)) {
        setTimeout(() => {
          setFeedback(null);
          completeTraining();
        }, 1000);
      } else {
        setTimeout(() => setFeedback(null), 1500);
      }
    } else {
      audioService.error();
      setScore(Math.max(0, score - 2));
      setFeedback({ type: 'error', message: 'Wrong priority! Choose highest priority first' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleReactionClick = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const now = Date.now();
    if (now >= reactionStartTime && reactionStartTime > 0) {
      const reactionTime = now - reactionStartTime;
      setLastReactionTime(reactionTime);
      audioService.success();
      const points = Math.max(10 - Math.floor(reactionTime / 100), 1);
      setScore(score + points);

      setReactionStartTime(0);

      if (currentRound < totalRounds) {
        setTimeout(() => {
          setLastReactionTime(null);
          setCurrentRound(currentRound + 1);
        }, 1500);
      } else {
        setTimeout(() => completeTraining(), 1000);
      }
    } else if (reactionStartTime > 0) {
      audioService.error();
      setScore(Math.max(0, score - 2));
    }
  };

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{currentModule.title}</h2>
              <p className="text-sm text-slate-600 mt-1">5-minute cognitive workout</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
            <h3 className="font-medium text-violet-900 mb-2">How It Works</h3>
            <p className="text-sm text-violet-800">{currentModule.instruction}</p>
            {moduleId === 'executive-function' && (
              <p className="text-xs text-violet-700 mt-2">
                Practice organizing your real tasks to improve executive function and reduce overwhelm
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Zap className="w-4 h-4 text-violet-600" />
              <span>{totalRounds} rounds</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <span>Difficulty increases gradually</span>
            </div>
          </div>

          <button
            onClick={() => setPhase(moduleId === 'executive-function' ? 'input' : 'active')}
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            {moduleId === 'executive-function' ? 'Add My Tasks' : 'Start Training'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'input') {
    const addTask = () => {
      if (newTaskText.trim() && userTasks.length < 8) {
        setUserTasks([...userTasks, { text: newTaskText.trim(), priority: 1 }]);
        setNewTaskText('');
      }
    };

    const removeTask = (index: number) => {
      setUserTasks(userTasks.filter((_, i) => i !== index));
    };

    const updatePriority = (index: number, priority: number) => {
      setUserTasks(userTasks.map((task, i) => i === index ? { ...task, priority } : task));
    };

    const startWithTasks = () => {
      if (userTasks.length >= 3) {
        const tasksForRound = userTasks.map((task, i) => ({
          id: i,
          text: task.text,
          priority: task.priority,
          completed: false
        }));
        setTasks(tasksForRound);
        setPhase('active');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Add Your Tasks</h2>
              <p className="text-sm text-slate-600 mt-1">Add 3-8 tasks you need to complete today</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-900 font-medium mb-2">Priority Guide</p>
            <div className="space-y-1 text-xs text-blue-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-bold">P1</span>
                <span>Urgent - must do now</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold">P2</span>
                <span>High - important today</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">P3</span>
                <span>Medium - should do</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-400 text-white font-bold">P4</span>
                <span>Low - nice to have</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="e.g., Reply to client email"
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-400"
              maxLength={50}
            />
            <button
              onClick={addTask}
              disabled={!newTaskText.trim() || userTasks.length >= 8}
              className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {userTasks.map((task, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm flex-1 text-slate-900">{task.text}</span>
                  <button
                    onClick={() => removeTask(index)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => updatePriority(index, priority)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        task.priority === priority
                          ? priority === 1 ? 'bg-red-500 text-white'
                          : priority === 2 ? 'bg-orange-500 text-white'
                          : priority === 3 ? 'bg-blue-500 text-white'
                          : 'bg-slate-400 text-white'
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      P{priority}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {userTasks.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              Add at least 3 tasks to continue
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setPhase('intro')}
              className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={startWithTasks}
              disabled={userTasks.length < 3}
              className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Training ({userTasks.length}/3 min)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-6 text-center max-h-[90vh] overflow-y-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Training Complete!</h2>
            <p className="text-slate-600">Great work on your cognitive fitness</p>
          </div>

          <div className="bg-violet-50 rounded-xl p-6 border border-violet-100">
            <div className="text-4xl font-bold text-violet-600 mb-1">{score}</div>
            <div className="text-sm text-violet-700">points earned</div>
          </div>

          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
            >
              Done
            </button>
            <button
              onClick={() => {
                setPhase('intro');
                setScore(0);
                setCurrentRound(1);
                setUserTasks([]);
                setTasks([]);
              }}
              className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Train Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderExercise = () => {
    if (moduleId === 'working-memory') {
      return (
        <div className="max-w-md w-full space-y-6">
          {showSequence && (
            <div className="text-center mb-8">
              <div className="text-lg text-violet-600 font-medium mb-4">Watch carefully...</div>
              <div className="flex justify-center gap-3">
                {sequenceToRemember.map((num, idx) => (
                  <div key={idx} className="w-16 h-16 bg-violet-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold animate-in fade-in zoom-in duration-300">{num}</div>
                ))}
              </div>
            </div>
          )}
          {!showSequence && (
            <>
              {feedback && (
                <div className={`text-center py-3 px-4 rounded-xl ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {feedback.message}
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-sm text-violet-600 font-medium">Tap the numbers in order</div>
                <div className="flex justify-center gap-2 mt-3">
                  {userInput.map((num, idx) => (
                    <div key={idx} className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm font-medium">{num}</div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button key={num} onClick={() => handleNumberClick(num)} className="aspect-square bg-white border-2 border-slate-200 rounded-xl text-2xl font-bold text-slate-900 hover:border-violet-400 hover:bg-violet-50 active:scale-95 transition-all">{num}</button>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    if (moduleId === 'sustained-attention') {
      const renderShape = (shape: string, size: string = 'w-16 h-16') => {
        if (shape === 'circle') {
          return <div className={`${size} rounded-full bg-violet-600`}></div>;
        } else if (shape === 'square') {
          return <div className={`${size} rounded-lg bg-violet-600`}></div>;
        } else if (shape === 'triangle') {
          return (
            <div className={`${size} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[56px] border-l-transparent border-r-transparent border-b-violet-600"></div>
              </div>
            </div>
          );
        } else if (shape === 'star') {
          return (
            <div className={`${size} relative`}>
              <div className="absolute inset-0 flex items-center justify-center text-violet-600 text-5xl">★</div>
            </div>
          );
        }
        return null;
      };

      return (
        <div className="max-w-md w-full space-y-3 sm:space-y-6">
          <div className="bg-violet-50 rounded-xl p-3 sm:p-4 border border-violet-200">
            <div className="text-xs sm:text-sm text-violet-900 font-medium mb-2 sm:mb-3 text-center">Target Shape</div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white rounded-xl flex items-center justify-center border-2 border-violet-300 shadow-sm">
              {renderShape(targetShape, 'w-14 h-14 sm:w-16 sm:h-16')}
            </div>
            <div className="text-xs text-violet-700 mt-2 sm:mt-3 text-center font-medium">
              Tap ONLY when you see this shape appear
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-slate-200 min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
            {currentShape ? (
              <div className="animate-in fade-in zoom-in duration-200">
                {renderShape(currentShape, 'w-24 h-24')}
              </div>
            ) : (
              <div className="text-slate-400 text-sm">Watch carefully...</div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleShapeClick(shape)}
                disabled={!currentShape}
                className={`w-full h-20 sm:h-32 bg-white border-2 rounded-xl flex items-center justify-center transition-all ${
                  !currentShape
                    ? 'opacity-50 cursor-not-allowed'
                    : currentShape === shape
                    ? 'border-violet-600 bg-violet-50 hover:bg-violet-100 active:scale-95'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }`}
              >
                {renderShape(shape, 'w-12 h-12')}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs sm:text-sm bg-slate-50 rounded-lg p-2 sm:p-3 mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-700">Correct: <strong>{hits}</strong></span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-700">Wrong: <strong>{misses}</strong></span>
            </div>
            <div className="text-slate-600">
              Progress: <strong>{hits + misses}/10</strong>
            </div>
          </div>
        </div>
      );
    }

    if (moduleId === 'executive-function') {
      const priorityColors = {
        1: 'bg-red-500 text-white',
        2: 'bg-orange-500 text-white',
        3: 'bg-blue-500 text-white',
        4: 'bg-slate-400 text-white'
      };

      return (
        <div className="max-w-md w-full space-y-4">
          {feedback && (
            <div className={`text-center py-3 px-4 rounded-xl ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {feedback.message}
            </div>
          )}
          <div className="text-center mb-4">
            <div className="text-sm text-violet-600 font-medium mb-2">Tap tasks in priority order</div>
            <div className="text-xs text-slate-600">P1 (urgent) → P2 (high) → P3 (medium) → P4 (low)</div>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                disabled={task.completed}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  task.completed
                    ? 'bg-green-50 border-green-200 opacity-50'
                    : 'bg-white border-slate-200 hover:border-violet-400 hover:bg-violet-50 active:scale-98'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                    P{task.priority}
                  </span>
                  <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-900 font-medium'}>{task.text}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-xs text-center text-slate-500 mt-4">
            Tap tasks from highest priority (P1) to lowest (P4)
          </div>
        </div>
      );
    }

    if (moduleId === 'micro-attention') {
      const isReady = reactionStartTime > 0 && Date.now() >= reactionStartTime;
      const isWaiting = reactionStartTime > 0 && !isReady;

      return (
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-8">
            {lastReactionTime !== null ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {lastReactionTime}ms
                </div>
                <div className="text-sm text-slate-600">
                  {lastReactionTime < 300 ? 'Lightning fast!' : lastReactionTime < 500 ? 'Great reaction!' : 'Good effort!'}
                </div>
              </div>
            ) : (
              <div className="text-lg text-violet-600 font-medium">
                {isReady ? 'TAP NOW!' : isWaiting ? 'Wait for it...' : 'Get ready...'}
              </div>
            )}
          </div>
          <button
            onClick={handleReactionClick}
            disabled={lastReactionTime !== null}
            className={`w-full h-64 rounded-2xl border-4 transition-all flex items-center justify-center ${
              lastReactionTime !== null
                ? 'bg-green-100 border-green-300 cursor-not-allowed'
                : isReady
                ? 'bg-green-500 border-green-600 animate-pulse shadow-lg shadow-green-500/50'
                : 'bg-slate-200 border-slate-300 hover:bg-slate-300'
            }`}
          >
            <Target className={`w-20 h-20 ${
              lastReactionTime !== null
                ? 'text-green-600'
                : isReady
                ? 'text-white animate-pulse'
                : 'text-slate-400'
            }`} />
          </button>
          <div className="text-center text-xs text-slate-500">
            Tap as fast as you can when the button turns green
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-50 to-blue-50 flex flex-col z-50">
      <div className="p-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h3 className="font-medium text-slate-900">{currentModule.title}</h3>
              <div className="text-xs text-slate-600">Round {currentRound}/{totalRounds} • Score: {score}</div>
            </div>
          </div>
          <div className="w-24 bg-slate-200 rounded-full h-2">
            <div className="bg-violet-600 h-2 rounded-full transition-all" style={{ width: `${(currentRound / totalRounds) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="min-h-full flex items-start sm:items-center justify-center">
          {renderExercise()}
        </div>
      </div>
    </div>
  );
};

export default TrainingExercise;
