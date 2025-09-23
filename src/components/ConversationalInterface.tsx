import React, { useState, useEffect } from 'react';
import { MessageSquare, Brain, Calendar, Target, Heart, Zap, ArrowRight, X, Sparkles, Clock, Star } from 'lucide-react';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface ConversationalInterfaceProps {
  cognitiveState: CognitiveState;
  upcomingEvents: any[];
  onActionSelect: (action: string) => void;
  onDismiss: () => void;
}

const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  cognitiveState,
  upcomingEvents,
  onActionSelect,
  onDismiss
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{
    text: string;
    action: string;
    reasoning: string;
    priority: number;
  }>>([]);
  const [showReasoningFor, setShowReasoningFor] = useState<string | null>(null);

  useEffect(() => {
    generateIntelligentSuggestions();
  }, [cognitiveState, upcomingEvents]);

  const generateIntelligentSuggestions = () => {
    const { attention, energy, stress, timeOfDay, flowState } = cognitiveState;
    const suggestions = [];

    // Contextual greeting and analysis
    let greeting = '';
    if (timeOfDay === 'morning') {
      greeting = energy > 70 ? 
        "Good morning! You're starting strong today." :
        "Good morning! Let's ease into the day gently.";
    } else if (timeOfDay === 'afternoon') {
      greeting = attention > 70 ?
        "Afternoon focus is looking good!" :
        "Afternoon energy dip? That's totally normal.";
    } else if (timeOfDay === 'evening') {
      greeting = stress < 40 ?
        "Peaceful evening - perfect for reflection." :
        "Busy day? Let's wind down mindfully.";
    } else {
      greeting = "Late night clarity can be powerful for memory work.";
    }

    setCurrentMessage(greeting);

    // Intelligent action suggestions based on state
    if (stress > 60) {
      suggestions.push({
        text: "Regulate stress first - it improves memory formation by 40%",
        action: "regulate",
        reasoning: "Research shows stress hormones impair memory encoding. Brief regulation optimizes your brain for training.",
        priority: 10
      });
    }

    if (energy > 70 && attention > 70 && timeOfDay === 'morning') {
      suggestions.push({
        text: "Multi-sensory memory weaving - your brain is primed for rich encoding",
        action: "weave",
        reasoning: "High attention + energy creates optimal conditions for multi-sensory memory formation. Morning cortisol supports consolidation.",
        priority: 8
      });
    }

    if (flowState === 'focused' || flowState === 'peak') {
      suggestions.push({
        text: "Spaced retrieval training - strengthen neural pathways while focused",
        action: "train",
        reasoning: "Flow state optimizes learning. Spaced retrieval during peak focus creates 60% stronger memory consolidation.",
        priority: 8
      });
    }

    // Always offer gentle capture option
    suggestions.push({
      text: "Daily memory capture - build autobiographical memory strength",
      action: "capture",
      reasoning: "Regular autobiographical memory practice strengthens narrative coherence and life satisfaction.",
      priority: 6
    });

    // Focus sprint for medium energy
    if (energy > 40 && energy < 80 && attention > 50) {
      suggestions.push({
        text: "Focused attention training - build sustained concentration",
        action: "sprint",
        reasoning: "Moderate arousal is optimal for attention training. Short bursts build sustained focus capacity.",
        priority: 7
      });
    }

    setSuggestions(suggestions.sort((a, b) => b.priority - a.priority).slice(0, 4));
  };

  // Always available core actions regardless of time/state
  const coreActions = [
    {
      text: "Future scenario rehearsal - build confidence for upcoming events",
      action: "scenario",
      icon: Calendar,
      color: "emerald",
      description: "Mental rehearsal with implementation intentions"
    },
    {
      text: "Memory training - strengthen recall through spaced practice", 
      action: "training",
      icon: Target,
      color: "orange",
      description: "Evidence-based retrieval training"
    },
    {
      text: "ADHD support - focus, working memory & executive function",
      action: "adhd", 
      icon: Brain,
      color: "blue",
      description: "Attention and cognitive control training"
    },
    {
      text: "Memory weaving - create rich multi-sensory memories",
      action: "weave",
      icon: Sparkles, 
      color: "purple",
      description: "Transform moments into vivid memories"
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'capture': return Star;
      case 'weave': return Brain;
      case 'plan': return Calendar;
      case 'train': return Target;
      case 'regulate': return Heart;
      case 'sprint': return Zap;
      default: return Sparkles;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'retrieve': return 'indigo';
      case 'capture': return 'indigo';
      case 'weave': return 'emerald';
      case 'plan': return 'blue';
      case 'train': return 'orange';
      case 'regulate': return 'red';
      case 'sprint': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">AI Memory Companion</h3>
            <p className="text-sm text-gray-600">Personalized recommendations based on your state</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* AI Message */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <p className="text-blue-900 font-medium">{currentMessage}</p>
      </div>

      {/* Intelligent Suggestions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Recommended for you right now:</h4>
        {suggestions.map((suggestion, index) => {
          const ActionIcon = getActionIcon(suggestion.action);
          const color = getActionColor(suggestion.action);
          
          return (
            <div key={index} className="space-y-2">
              <button
                onClick={() => onActionSelect(suggestion.action)}
                className={`w-full flex items-center justify-between p-4 bg-${color}-50 border border-${color}-200 rounded-xl hover:bg-${color}-100 transition-all group`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center group-hover:bg-${color}-200 transition-colors`}>
                    <ActionIcon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{suggestion.text}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Priority: {suggestion.priority}/10</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReasoningFor(showReasoningFor === suggestion.action ? null : suggestion.action);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Why?
                      </button>
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 text-${color}-600 group-hover:translate-x-1 transition-transform`} />
              </button>
              
              {showReasoningFor === suggestion.action && (
                <div className={`p-3 bg-${color}-25 border border-${color}-200 rounded-lg ml-4`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className={`w-3 h-3 text-${color}-600`} />
                    <span className={`text-xs font-medium text-${color}-800`}>AI Reasoning</span>
                  </div>
                  <p className={`text-xs text-${color}-700`}>{suggestion.reasoning}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Always Available Core Features */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">All Features Available</h4>
          <span className="text-xs text-gray-500">Access anytime, optimized for your state</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {coreActions.map((action, index) => {
            const ActionIcon = action.icon;
            
            return (
              <button
                key={index}
                onClick={() => onActionSelect(action.action)}
                className={`p-4 bg-${action.color}-50 border border-${action.color}-200 rounded-lg hover:bg-${action.color}-100 transition-all text-left group`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                    <ActionIcon className={`w-4 h-4 text-${action.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">{action.text.split(' - ')[0]}</h5>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Recommendations above are optimized for your current state, but all features work anytime
        </p>
      </div>

      {/* State Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Attention: <span className="font-medium">{cognitiveState.attention}%</span></span>
            <span className="text-gray-600">Energy: <span className="font-medium">{cognitiveState.energy}%</span></span>
            <span className="text-gray-600">Stress: <span className="font-medium">{cognitiveState.stress}%</span></span>
          </div>
          <span className={`text-${getActionColor(cognitiveState.flowState)}-600 font-medium capitalize`}>
            {cognitiveState.flowState}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationalInterface;

export default ConversationalInterface