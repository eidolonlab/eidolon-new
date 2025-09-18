import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Clock, Activity, Lightbulb, Award, Eye, Heart } from 'lucide-react';

interface CognitiveState {
  attention: number;
  workingMemory: number;
  executiveFunction: number;
  emotionalRegulation: number;
  processingSpeed: number;
  cognitiveFlexibility: number;
  overallOptimization: number;
}

interface CognitiveStateOptimizerProps {
  onStateChange: (state: CognitiveState) => void;
  onOptimizationRecommendation: (recommendation: {
    type: 'break' | 'exercise' | 'environment' | 'timing';
    action: string;
    reasoning: string;
    expectedImprovement: number;
  }) => void;
}

const CognitiveStateOptimizer: React.FC<CognitiveStateOptimizerProps> = ({
  onStateChange,
  onOptimizationRecommendation
}) => {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    attention: 75,
    workingMemory: 70,
    executiveFunction: 65,
    emotionalRegulation: 80,
    processingSpeed: 72,
    cognitiveFlexibility: 68,
    overallOptimization: 72
  });

  const [realTimeOptimization, setRealTimeOptimization] = useState<string[]>([]);
  const [stateHistory, setStateHistory] = useState<CognitiveState[]>([]);
  const [optimalWindow, setOptimalWindow] = useState<boolean>(false);
  const [cognitiveLoad, setCognitiveLoad] = useState(3);
  const [flowState, setFlowState] = useState<'entering' | 'in_flow' | 'declining' | 'disrupted'>('entering');

  useEffect(() => {
    analyzeOptimalState();
    generateOptimizationRecommendations();
    trackStateHistory();
  }, [cognitiveState]);

  const analyzeOptimalState = () => {
    const { attention, workingMemory, executiveFunction, emotionalRegulation } = cognitiveState;
    
    // Calculate overall optimization
    const weights = {
      attention: 0.3,
      workingMemory: 0.25,
      executiveFunction: 0.25,
      emotionalRegulation: 0.2
    };
    
    const overall = (
      attention * weights.attention +
      workingMemory * weights.workingMemory +
      executiveFunction * weights.executiveFunction +
      emotionalRegulation * weights.emotionalRegulation
    );

    const newState = { ...cognitiveState, overallOptimization: overall };
    setCognitiveState(newState);
    onStateChange(newState);

    // Determine if in optimal window
    const isOptimal = overall > 75 && attention > 70 && emotionalRegulation > 70;
    setOptimalWindow(isOptimal);

    // Determine flow state
    if (overall > 85 && attention > 80) {
      setFlowState('in_flow');
    } else if (overall > 70) {
      setFlowState('entering');
    } else if (overall < 50) {
      setFlowState('disrupted');
    } else {
      setFlowState('declining');
    }
  };

  const generateOptimizationRecommendations = () => {
    const recommendations = [];
    const { attention, workingMemory, executiveFunction, emotionalRegulation } = cognitiveState;

    // Attention optimization
    if (attention < 60) {
      recommendations.push("🧘 Take a 2-minute mindfulness break to reset attention networks");
      onOptimizationRecommendation({
        type: 'break',
        action: 'Mindfulness breathing exercise',
        reasoning: 'Low attention detected - mindfulness activates prefrontal attention networks',
        expectedImprovement: 15
      });
    }

    // Working memory optimization
    if (workingMemory < 65) {
      recommendations.push("🧠 Try the 7±2 rule: limit active information to 5-7 items");
      onOptimizationRecommendation({
        type: 'exercise',
        action: 'Cognitive load reduction',
        reasoning: 'Working memory overload - reduce information complexity',
        expectedImprovement: 20
      });
    }

    // Executive function optimization
    if (executiveFunction < 70) {
      recommendations.push("📋 Break current task into 3 smaller, specific steps");
      onOptimizationRecommendation({
        type: 'exercise',
        action: 'Task decomposition',
        reasoning: 'Executive function strain - simplify planning demands',
        expectedImprovement: 18
      });
    }

    // Emotional regulation optimization
    if (emotionalRegulation < 60) {
      recommendations.push("💝 Use 4-7-8 breathing to activate parasympathetic nervous system");
      onOptimizationRecommendation({
        type: 'break',
        action: 'Emotional regulation breathing',
        reasoning: 'Emotional dysregulation affects all cognitive functions',
        expectedImprovement: 25
      });
    }

    // Flow state recommendations
    if (flowState === 'in_flow') {
      recommendations.push("🎯 Perfect state! Tackle your most challenging memory work now");
    } else if (flowState === 'entering') {
      recommendations.push("📈 Building momentum! Continue current approach");
    }

    setRealTimeOptimization(recommendations.slice(0, 3));
  };

  const trackStateHistory = () => {
    setStateHistory(prev => [...prev.slice(-19), cognitiveState]);
  };

  const simulateStateImprovement = (domain: keyof CognitiveState, improvement: number) => {
    setCognitiveState(prev => ({
      ...prev,
      [domain]: Math.min(100, prev[domain] + improvement)
    }));
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Cognitive State Optimizer</h3>
          <p className="text-sm text-gray-600">Real-time cognitive performance optimization</p>
        </div>
      </div>

      {/* Flow State Indicator */}
      <div className={`mb-6 p-4 rounded-lg border ${
        flowState === 'in_flow' ? 'bg-emerald-50 border-emerald-200' :
        flowState === 'entering' ? 'bg-blue-50 border-blue-200' :
        flowState === 'declining' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Zap className={`w-4 h-4 ${
              flowState === 'in_flow' ? 'text-emerald-600' :
              flowState === 'entering' ? 'text-blue-600' :
              flowState === 'declining' ? 'text-yellow-600' :
              'text-red-600'
            }`} />
            <span className={`font-medium ${
              flowState === 'in_flow' ? 'text-emerald-900' :
              flowState === 'entering' ? 'text-blue-900' :
              flowState === 'declining' ? 'text-yellow-900' :
              'text-red-900'
            }`}>
              Flow State: {flowState.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-2xl font-bold">
            <span className={
              flowState === 'in_flow' ? 'text-emerald-600' :
              flowState === 'entering' ? 'text-blue-600' :
              flowState === 'declining' ? 'text-yellow-600' :
              'text-red-600'
            }>
              {cognitiveState.overallOptimization.toFixed(0)}%
            </span>
          </div>
        </div>
        <p className={`text-sm ${
          flowState === 'in_flow' ? 'text-emerald-800' :
          flowState === 'entering' ? 'text-blue-800' :
          flowState === 'declining' ? 'text-yellow-800' :
          'text-red-800'
        }`}>
          {flowState === 'in_flow' ? 
            'Perfect cognitive state! This is ideal for complex memory work and learning.' :
            flowState === 'entering' ?
            'Building optimal state. Continue current activities to reach peak performance.' :
            flowState === 'declining' ?
            'Cognitive fatigue detected. Consider a break or lighter tasks.' :
            'Cognitive disruption. Take immediate action to restore optimal function.'
          }
        </p>
      </div>

      {/* Cognitive Domains */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { key: 'attention', label: 'Attention', icon: Eye, color: 'blue' },
          { key: 'workingMemory', label: 'Working Memory', icon: Brain, color: 'purple' },
          { key: 'executiveFunction', label: 'Executive Function', icon: Target, color: 'emerald' },
          { key: 'emotionalRegulation', label: 'Emotional Regulation', icon: Heart, color: 'pink' },
          { key: 'processingSpeed', label: 'Processing Speed', icon: Zap, color: 'yellow' },
          { key: 'cognitiveFlexibility', label: 'Cognitive Flexibility', icon: Activity, color: 'orange' }
        ].map(domain => {
          const IconComponent = domain.icon;
          const value = cognitiveState[domain.key as keyof CognitiveState];
          
          return (
            <div key={domain.key} className={`p-3 bg-${domain.color}-50 rounded-lg border border-${domain.color}-200`}>
              <div className="flex items-center space-x-2 mb-2">
                <IconComponent className={`w-4 h-4 text-${domain.color}-600`} />
                <span className="text-sm font-medium text-gray-900">{domain.label}</span>
              </div>
              <div className="text-xl font-bold mb-1">
                <span className={`text-${domain.color}-600`}>{value.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`bg-${domain.color}-500 h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Optimization Recommendations */}
      {realTimeOptimization.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">AI Optimization Recommendations</h4>
          {realTimeOptimization.map((rec, index) => (
            <div key={index} className="p-3 bg-white border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-800">{rec}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cognitive Load Management */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Cognitive Load Management</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-purple-800">Current Load:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setCognitiveLoad(level)}
                className={`w-6 h-6 rounded-full transition-colors ${
                  level <= cognitiveLoad 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-purple-700">
            {cognitiveLoad <= 2 ? 'Light' : cognitiveLoad <= 3 ? 'Moderate' : 'High'}
          </span>
        </div>
        <div className="mt-2 text-xs text-purple-600">
          Optimal memory training occurs at 60-80% cognitive load
        </div>
      </div>
    </div>
  );
};

export default CognitiveStateOptimizer;