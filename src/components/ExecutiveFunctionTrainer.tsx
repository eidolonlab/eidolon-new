import React, { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle, Plus, Trash2, ArrowRight, Brain, Zap, Award } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  completed: boolean;
  startTime?: Date;
  completedTime?: Date;
}

interface ExecutiveFunctionTrainerProps {
  onComplete: (results: {
    tasksPlanned: number;
    tasksCompleted: number;
    planningTime: number;
    executionEfficiency: number;
  }) => void;
}

const ExecutiveFunctionTrainer: React.FC<ExecutiveFunctionTrainerProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'planning' | 'execution' | 'review'>('planning');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newEstimate, setNewEstimate] = useState(15);
  const [planningStartTime, setPlanningStartTime] = useState<Date | null>(null);
  const [planningTime, setPlanningTime] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (phase === 'planning' && !planningStartTime) {
      setPlanningStartTime(new Date());
    }
  }, [phase]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      priority: newPriority,
      estimatedMinutes: newEstimate,
      completed: false
    };

    setTasks(prev => [...prev, task]);
    setNewTask('');
    setNewEstimate(15);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const startExecution = () => {
    if (tasks.length === 0) return;
    
    if (planningStartTime) {
      setPlanningTime(Date.now() - planningStartTime.getTime());
    }
    
    setPhase('execution');
  };

  const startTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, startTime: new Date() }
        : task
    ));
    setCurrentTaskId(taskId);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, completedTime: new Date() }
        : task
    ));
    setCurrentTaskId(null);
  };

  const finishSession = () => {
    setPhase('review');
    
    const completedTasks = tasks.filter(t => t.completed);
    const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const totalActual = completedTasks.reduce((sum, t) => {
      if (t.startTime && t.completedTime) {
        return sum + (t.completedTime.getTime() - t.startTime.getTime()) / (1000 * 60);
      }
      return sum;
    }, 0);
    
    const efficiency = totalEstimated > 0 ? (totalEstimated / Math.max(totalActual, 1)) * 100 : 0;
    
    onComplete({
      tasksPlanned: tasks.length,
      tasksCompleted: completedTasks.length,
      planningTime: planningTime / 1000,
      executionEfficiency: Math.min(efficiency, 200) // Cap at 200% for super-efficiency
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  if (phase === 'planning') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Executive Function Training</h2>
            <p className="text-sm text-gray-600">Plan, prioritize, and execute tasks effectively</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">Planning Phase</span>
            </div>
            <p className="text-sm text-emerald-800">
              Create 3-5 tasks you want to accomplish. Estimate time and set priorities. 
              This builds planning and organizational skills.
            </p>
          </div>

          {/* Add Task Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="e.g., Respond to important emails"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  value={newEstimate}
                  onChange={(e) => setNewEstimate(parseInt(e.target.value) || 15)}
                  min="5"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Task List */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Your Task Plan ({tasks.length} tasks)</h3>
              {sortedTasks.map((task) => {
                const color = getPriorityColor(task.priority);
                return (
                  <div key={task.id} className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg border border-${color}-200`}>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{task.text}</div>
                      <div className="text-sm text-gray-600">
                        {task.estimatedMinutes} min • {task.priority} priority
                      </div>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Start Execution */}
          {tasks.length >= 2 && (
            <div className="text-center">
              <button
                onClick={startExecution}
                className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium"
              >
                Start Execution Phase
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'execution') {
    const completedTasks = tasks.filter(t => t.completed);
    const progressPercentage = (completedTasks.length / tasks.length) * 100;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Execution Phase</h2>
          <div className="text-sm text-gray-600">
            {completedTasks.length}/{tasks.length} completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Task Execution */}
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const color = getPriorityColor(task.priority);
            const isActive = currentTaskId === task.id;
            
            return (
              <div key={task.id} className={`p-4 rounded-lg border transition-all ${
                task.completed 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : isActive
                  ? `bg-${color}-100 border-${color}-300`
                  : `bg-${color}-50 border-${color}-200`
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'text-emerald-900 line-through' : 'text-gray-900'}`}>
                      {task.text}
                    </div>
                    <div className="text-sm text-gray-600">
                      {task.estimatedMinutes} min • {task.priority} priority
                      {task.startTime && !task.completed && (
                        <span className="ml-2 text-blue-600">
                          • Started {new Date().getTime() - task.startTime.getTime() < 60000 
                            ? 'just now' 
                            : `${Math.floor((new Date().getTime() - task.startTime.getTime()) / 60000)} min ago`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : isActive ? (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => startTask(task.id)}
                        className={`px-3 py-1.5 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors text-sm`}
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finish Session */}
        <div className="mt-6 text-center">
          <button
            onClick={finishSession}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Finish Session
          </button>
        </div>
      </div>
    );
  }

  // Review phase handled by parent component
  return null;
};

export default ExecutiveFunctionTrainer;