import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Lightbulb, Target, TrendingDown, Zap } from 'lucide-react';

interface CognitiveTask {
  id: string;
  name: string;
  cognitiveLoad: number; // 1-10 scale
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  requiredFocus: number; // 1-5 scale
}

interface CognitiveLoadManagerProps {
  currentFocusLevel: number;
  currentEnergyLevel: number;
  onTaskRecommendation: (task: CognitiveTask) => void;
  onBreakRecommendation: (breakType: string, duration: number) => void;
}

const CognitiveLoadManager: React.FC<CognitiveLoadManagerProps> = ({
  currentFocusLevel,
  currentEnergyLevel,
  onTaskRecommendation,
  onBreakRecommendation
}) => {
  const [currentLoad, setCurrentLoad] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [taskQueue, setTaskQueue] = useState<CognitiveTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CognitiveTask[]>([]);
  const [loadHistory, setLoadHistory] = useState<number[]>([]);
  const [burnoutRisk, setBurnoutRisk] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample cognitive tasks with different load levels
  const availableTasks: CognitiveTask[] = [
    {
      id: 'email-check',
      name: 'Check and respond to emails',
      cognitiveLoad: 3,
      estimatedTime: 15,
      priority: 'medium',
      complexity: 'simple',
      requiredFocus: 2
    },
    {
      id: 'deep-work',
      name: 'Deep work on important project',
      cognitiveLoad: 8,
      estimatedTime: 60,
      priority: 'high',
      complexity: 'complex',
      requiredFocus: 5
    },
    {
      id: 'planning',
      name: 'Plan tomorrow\'s schedule',
      cognitiveLoad: 4,
      estimatedTime: 20,
      priority: 'medium',
      complexity: 'moderate',
      requiredFocus: 3
    },
    {
      id: 'creative-work',
      name: 'Creative brainstorming session',
      cognitiveLoad: 6,
      estimatedTime: 45,
      priority: 'medium',
      complexity: 'moderate',
      requiredFocus: 4
    },
    {
      id: 'admin-tasks',
      name: 'Administrative tasks and filing',
      cognitiveLoad: 2,
      estimatedTime: 30,
      priority: 'low',
      complexity: 'simple',
      requiredFocus: 2
    }
  ];

  useEffect(() => {
    calculateCurrentCapacity();
    assessBurnoutRisk();
    recommendOptimalTasks();
  }, [currentFocusLevel, currentEnergyLevel, currentLoad]);

  const calculateCurrentCapacity = () => {
    // Calculate capacity based on focus and energy
    const baseCapacity = 10;
    const focusMultiplier = currentFocusLevel / 5;
    const energyMultiplier = currentEnergyLevel / 5;
    
    const capacity = Math.round(baseCapacity * focusMultiplier * energyMultiplier);
    setMaxCapacity(capacity);
  };

  const assessBurnoutRisk = () => {
    const loadPercentage = (currentLoad / maxCapacity) * 100;
    const recentHighLoad = loadHistory.slice(-10).filter(load => load > 7).length;
    
    let risk = 0;
    if (loadPercentage > 90) risk += 40;
    if (loadPercentage > 70) risk += 20;
    if (recentHighLoad > 5) risk += 30;
    if (currentFocusLevel <= 2) risk += 20;
    
    setBurnoutRisk(Math.min(risk, 100));
  };

  const recommendOptimalTasks = () => {
    const availableCapacity = maxCapacity - currentLoad;
    
    // Filter tasks that fit current capacity and focus level
    const suitableTasks = availableTasks.filter(task => 
      task.cognitiveLoad <= availableCapacity && 
      task.requiredFocus <= currentFocusLevel
    );
    
    // Sort by priority and cognitive fit
    const recommendedTasks = suitableTasks.sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityScore[a.priority];
      const bPriority = priorityScore[b.priority];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // If same priority, prefer tasks that better match current capacity
      const aFit = Math.abs(a.cognitiveLoad - (availableCapacity * 0.7));
      const bFit = Math.abs(b.cognitiveLoad - (availableCapacity * 0.7));
      return aFit - bFit;
    });

    if (recommendedTasks.length > 0) {
      onTaskRecommendation(recommendedTasks[0]);
    }

    // Recommend breaks if needed
    if (burnoutRisk > 60) {
      onBreakRecommendation('active', 10); // 10-minute active break
    } else if (burnoutRisk > 40) {
      onBreakRecommendation('mindful', 5); // 5-minute mindfulness break
    }
  };

  const addTaskToQueue = (task: CognitiveTask) => {
    if (currentLoad + task.cognitiveLoad <= maxCapacity) {
      setTaskQueue(prev => [...prev, task]);
      setCurrentLoad(prev => prev + task.cognitiveLoad);
      setLoadHistory(prev => [...prev.slice(-19), currentLoad + task.cognitiveLoad]);
    }
  };

  const completeTask = (taskId: string) => {
    const task = taskQueue.find(t => t.id === taskId);
    if (task) {
      setCompletedTasks(prev => [...prev, task]);
      setTaskQueue(prev => prev.filter(t => t.id !== taskId));
      setCurrentLoad(prev => Math.max(0, prev - task.cognitiveLoad));
    }
  };

  const getLoadColor = () => {
    const percentage = (currentLoad / maxCapacity) * 100;
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'yellow';
    if (percentage >= 50) return 'blue';
    return 'emerald';
  };

  const loadColor = getLoadColor();
  const loadPercentage = (currentLoad / maxCapacity) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cognitive Load Manager</h2>
          <p className="text-sm text-gray-600">Optimize your mental capacity and prevent burnout</p>
        </div>
      </div>

      {/* Current Load Display */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Current Cognitive Load</span>
          <span>{currentLoad}/{maxCapacity} ({Math.round(loadPercentage)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`bg-${loadColor}-500 h-4 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Optimal Zone: 50-70%</span>
          <span className={`font-medium ${
            loadPercentage > 90 ? 'text-red-600' :
            loadPercentage > 70 ? 'text-yellow-600' :
            loadPercentage < 30 ? 'text-blue-600' : 'text-emerald-600'
          }`}>
            {loadPercentage > 90 ? 'Overloaded' :
             loadPercentage > 70 ? 'High Load' :
             loadPercentage < 30 ? 'Underutilized' : 'Optimal'}
          </span>
        </div>
      </div>

      {/* Burnout Risk Assessment */}
      {burnoutRisk > 30 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          burnoutRisk > 70 ? 'bg-red-50 border-red-200' :
          burnoutRisk > 50 ? 'bg-yellow-50 border-yellow-200' :
          'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className={`w-4 h-4 ${
              burnoutRisk > 70 ? 'text-red-600' :
              burnoutRisk > 50 ? 'text-yellow-600' :
              'text-orange-600'
            }`} />
            <span className={`font-medium ${
              burnoutRisk > 70 ? 'text-red-900' :
              burnoutRisk > 50 ? 'text-yellow-900' :
              'text-orange-900'
            }`}>
              {burnoutRisk > 70 ? 'High Burnout Risk' :
               burnoutRisk > 50 ? 'Moderate Burnout Risk' :
               'Elevated Stress Level'}
            </span>
          </div>
          <p className={`text-sm ${
            burnoutRisk > 70 ? 'text-red-800' :
            burnoutRisk > 50 ? 'text-yellow-800' :
            'text-orange-800'
          }`}>
            {burnoutRisk > 70 ? 
              'Take a 15-minute break immediately. Your cognitive capacity is severely depleted.' :
              burnoutRisk > 50 ?
              'Consider taking a 10-minute mindfulness break to restore capacity.' :
              'Monitor your load carefully. Consider lighter tasks for the next hour.'
            }
          </p>
        </div>
      )}

      {/* Task Recommendations */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Recommended Tasks</h3>
        {availableTasks
          .filter(task => 
            task.cognitiveLoad <= (maxCapacity - currentLoad) && 
            task.requiredFocus <= currentFocusLevel
          )
          .slice(0, 3)
          .map((task) => {
            const complexityColor = {
              simple: 'emerald',
              moderate: 'blue',
              complex: 'purple'
            };
            const color = complexityColor[task.complexity];
            
            return (
              <button
                key={task.id}
                onClick={() => addTaskToQueue(task)}
                className={`w-full p-4 bg-${color}-50 border border-${color}-200 rounded-lg hover:bg-${color}-100 transition-all text-left`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 bg-${color}-200 text-${color}-800 rounded-full capitalize`}>
                      {task.complexity}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      Load: {task.cognitiveLoad}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{task.estimatedTime} min</span>
                  <span>•</span>
                  <span className="capitalize">{task.priority} priority</span>
                  <span>•</span>
                  <span>Focus: {task.requiredFocus}/5</span>
                </div>
              </button>
            );
          })}
      </div>

      {/* Active Tasks */}
      {taskQueue.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-900">Active Tasks</h3>
          {taskQueue.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <div className="font-medium text-gray-900">{task.name}</div>
                <div className="text-sm text-gray-600">
                  Load: {task.cognitiveLoad} • {task.estimatedTime} min
                </div>
              </div>
              <button
                onClick={() => completeTask(task.id)}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Load Management Tips */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Smart Load Management</span>
        </div>
        <div className="text-sm text-indigo-800 space-y-1">
          {loadPercentage > 90 && (
            <p>• Take a 10-15 minute break to restore cognitive capacity</p>
          )}
          {loadPercentage < 30 && currentFocusLevel >= 4 && (
            <p>• You have high capacity - perfect time for challenging tasks</p>
          )}
          {currentFocusLevel <= 2 && (
            <p>• Focus is low - stick to simple, routine tasks for now</p>
          )}
          {burnoutRisk > 50 && (
            <p>• Consider switching to lighter tasks or taking a longer break</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CognitiveLoadManager;