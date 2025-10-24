import React, { useState, useEffect } from 'react';
import { X, CheckCircle, TrendingUp, Zap, Eye, Brain, ListOrdered, Target } from 'lucide-react';
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
  const [phase, setPhase] = useState<'intro' | 'active' | 'complete'>('intro');
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
      instruction: 'Sort the tasks by priority and complete them in order',
    },
    'micro-attention': {
      title: 'Micro-Attention Drill',
      instruction: 'Quick focus challenge - stay locked in for 30 seconds',
    },
  };

  const currentModule = moduleDetails[moduleId] || moduleDetails['working-memory'];

  useEffect(() => {
    if (phase === 'active') {
      startRound();
    }
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
    } else if (moduleId === 'executive-function') {
      const newTasks = Array.from({ length: 4 }, (_, i) => ({
        id: i,
        text: ['Reply to emails', 'Prepare presentation', 'Review documents', 'Team meeting'][i],
        priority: Math.floor(Math.random() * 4) + 1,
        completed: false
      }));
      setTasks(newTasks);
    } else if (moduleId === 'micro-attention') {
      setReactionStartTime(Date.now() + Math.random() * 2000 + 1000);
    }
  };

  const showRandomShapes = () => {
    const interval = setInterval(() => {
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
    }, 1500);
    setTimeout(() => clearInterval(interval), 15000);
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

        if (currentRound < totalRounds) {
          setTimeout(() => {
            setCurrentRound(currentRound + 1);
          }, 1000);
        } else {
          setTimeout(() => {
            completeTraining();
          }, 1000);
        }
      } else {
        audioService.error();
        setTimeout(() => {
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

    if (shape === targetShape) {
      audioService.success();
      setHits(hits + 1);
      setScore(score + 10);
    } else {
      audioService.error();
      setMisses(misses + 1);
    }

    if (hits + misses >= 10) {
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

    const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);
    const expectedNextTask = sortedTasks.find(t => !t.completed);

    if (expectedNextTask?.id === taskId) {
      audioService.success();
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
      setScore(score + 10);

      if (tasks.filter(t => !t.completed).length === 1) {
        if (currentRound < totalRounds) {
          setTimeout(() => setCurrentRound(currentRound + 1), 1000);
        } else {
          setTimeout(() => completeTraining(), 1000);
        }
      }
    } else {
      audioService.error();
    }
  };

  const handleReactionClick = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {}

    const now = Date.now();
    if (now >= reactionStartTime) {
      const reactionTime = now - reactionStartTime;
      audioService.success();
      const points = Math.max(10 - Math.floor(reactionTime / 100), 1);
      setScore(score + points);

      if (currentRound < totalRounds) {
        setTimeout(() => setCurrentRound(currentRound + 1), 1000);
      } else {
        setTimeout(() => completeTraining(), 1000);
      }
    } else {
      audioService.error();
    }
  };

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
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
            onClick={() => setPhase('active')}
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Start Training
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 text-center">
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
              <div className="text-sm text-violet-600 font-medium mb-4">Watch carefully...</div>
              <div className="flex justify-center gap-3">
                {sequenceToRemember.map((num, idx) => (
                  <div key={idx} className="w-16 h-16 bg-violet-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold animate-pulse">{num}</div>
                ))}
              </div>
            </div>
          )}
          {!showSequence && (
            <>
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
      return (
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-6">
            <div className="text-sm text-violet-600 font-medium mb-2">Target Shape</div>
            <div className="w-20 h-20 mx-auto bg-violet-600 rounded-xl flex items-center justify-center">
              <div className={`w-12 h-12 ${targetShape === 'circle' ? 'rounded-full' : targetShape === 'square' ? 'rounded-lg' : ''} bg-white`}></div>
            </div>
            <div className="text-xs text-slate-600 mt-2">Tap only when you see this shape</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleShapeClick(shape)}
                className={`aspect-square bg-white border-2 rounded-xl flex items-center justify-center hover:border-violet-400 hover:bg-violet-50 active:scale-95 transition-all ${
                  currentShape === shape ? 'border-violet-600 bg-violet-50' : 'border-slate-200'
                }`}
              >
                <div className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : ''} bg-slate-300`}></div>
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-slate-600">
            Hits: {hits} • Misses: {misses}
          </div>
        </div>
      );
    }

    if (moduleId === 'executive-function') {
      return (
        <div className="max-w-md w-full space-y-4">
          <div className="text-center mb-6">
            <div className="text-sm text-violet-600 font-medium">Complete tasks by priority (highest first)</div>
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
                <div className="flex items-center justify-between">
                  <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-900'}>{task.text}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-100 text-violet-700">
                    P{task.priority}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (moduleId === 'micro-attention') {
      const isReady = Date.now() >= reactionStartTime;
      return (
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-8">
            <div className="text-sm text-violet-600 font-medium mb-4">
              {isReady ? 'TAP NOW!' : 'Wait for the signal...'}
            </div>
          </div>
          <button
            onClick={handleReactionClick}
            className={`w-full h-64 rounded-2xl border-4 transition-all ${
              isReady
                ? 'bg-green-500 border-green-600 animate-pulse'
                : 'bg-slate-200 border-slate-300'
            }`}
          >
            <Target className={`w-20 h-20 mx-auto ${isReady ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-50 to-blue-50 flex flex-col z-50">
      <div className="p-4 bg-white border-b border-slate-200">
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
      <div className="flex-1 flex items-center justify-center p-4">
        {renderExercise()}
      </div>
    </div>
  );
};

export default TrainingExercise;
