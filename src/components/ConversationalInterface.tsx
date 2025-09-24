import React, { useState, useEffect } from 'react';
import { MessageSquare, Brain, Calendar, Target, Heart, Zap, ArrowRight, X, Sparkles, Clock, Star, Users, Shield, Search } from 'lucide-react';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface ConversationalInterfaceProps {
  cognitiveState: CognitiveState;
  upcomingEvents?: any[];
  onActionSelect: (action: string) => void;
  onDismiss: () => void;
}

const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  cognitiveState,
  upcomingEvents = [],
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

    // Advanced contextual greeting based on circadian rhythms
    let greeting = '';
    const hour = new Date().getHours();
    
    if (hour < 12) {
      greeting = energy > 70 && attention > 70 ? 
        "🌅 Morning Flow Active! Peak cognitive state detected - ideal for guided memory retrieval and multi-sensory encoding." :
        energy > 50 ?
        "🌅 Morning Flow Active! Building clarity - perfect for autobiographical memory recovery with intelligent cues." :
        "🌅 Morning Flow Active! Gentle start recommended - let's ease into memory work with supportive guidance.";
    } else if (hour < 17) {
      greeting = attention > 70 ?
        "☀️ Afternoon Flow Active! Focus peak detected - optimal for spaced retrieval training and memory strengthening." :
        attention > 50 ?
        "☀️ Afternoon Flow Active! Steady state - excellent for guided memory recovery and scenario rehearsal." :
        "☀️ Afternoon Flow Active! Natural dip - gentle memory capture and reflection work well now.";
    } else if (hour < 21) {
      greeting = stress < 40 ?
        "🌆 Evening Flow Active! Peaceful state - perfect for reflection and capturing today's meaningful moments." :
        stress < 60 ?
        "🌆 Evening Flow Active! Winding down - gentle memory work supports overnight consolidation." :
        "🌆 Evening Flow Active! Busy day detected - stress regulation recommended before memory work.";
    } else {
      greeting = stress < 40 ?
        "🌙 Night Flow Active! Calm evening - gentle memory capture before sleep consolidation." :
        "🌙 Night Flow Active! Late night energy - quick moment preservation recommended.";
    }

    setCurrentMessage(greeting);

    // Intelligent recommendations based on time and state
    if (hour >= 21) {
      // Night Flow - Only gentle activities
      suggestions.push({
        text: "Gentle memory capture - preserve today's moments before sleep",
        action: "capture",
        reasoning: "Night time is optimal for gentle reflection. Sleep consolidates memories formed in the evening.",
        priority: 10
      });
      
      if (stress > 50) {
        suggestions.push({
          text: "Memory state optimization - calm your mind for better consolidation",
          action: "regulate",
          reasoning: "High evening stress impairs sleep quality and memory consolidation. Regulation enhances overnight memory processing.",
          priority: 9
        });
      }
    } else if (stress > 60) {
      // High stress - prioritize regulation
      suggestions.push({
        text: "Memory state optimization - reduce stress for better encoding",
        action: "regulate",
        reasoning: "High stress impairs memory formation by 50%. Regulation restores optimal encoding conditions.",
        priority: 10
      });
      suggestions.push({
        text: "ADHD support tools - stress often worsens attention challenges",
        action: "adhd",
        reasoning: "Stress compounds attention difficulties. Our focus training includes integrated stress regulation.",
        priority: 9
      });
    } else if (hour < 12 && energy > 70 && attention > 70) {
      // Morning Flow - Peak cognitive state
      suggestions.push({
        text: "Guided memory retrieval - recover forgotten experiences with AI cues",
        action: "retrieve",
        reasoning: "Morning cortisol + high attention creates optimal conditions for memory reconstruction. 65% stronger retrieval success.",
        priority: 10
      });
      suggestions.push({
        text: "Multi-sensory memory weaving - your brain is primed for rich encoding",
        action: "weave",
        reasoning: "Peak cognitive state enables complex multi-sensory memory formation with 40% better consolidation.",
        priority: 9
      });
    } else if (hour >= 12 && hour < 17 && attention > 60) {
      // Afternoon Flow - Sustained attention optimal
      suggestions.push({
        text: "Spaced retrieval training - strengthen neural pathways while focused",
        action: "train",
        reasoning: "Afternoon attention stability optimal for retrieval practice. Spaced training creates 50% stronger consolidation.",
        priority: 9
      });
      suggestions.push({
        text: "Smart scenario planning - prepare for upcoming events with AI guidance",
        action: "plan",
        reasoning: "Afternoon planning cognition optimal for implementation intentions and detailed mental rehearsal.",
        priority: 8
      });
    } else if (hour >= 17 && hour < 21) {
      // Evening Flow - Reflection and preparation
      suggestions.push({
        text: "Daily memory capture - reflect on today's meaningful moments",
        action: "capture",
        reasoning: "Evening reflection enhances memory consolidation. Capturing daily moments improves autobiographical coherence.",
        priority: 9
      });
      suggestions.push({
        text: "Tomorrow's scenario planning - prepare for upcoming events",
        action: "plan",
        reasoning: "Evening planning for next-day events improves implementation success by 60%.",
        priority: 8
      });
    }

    // Always available but time-adapted
    if (hour < 21) {
      suggestions.push({
        text: "ADHD support - build focus, working memory & executive function",
        action: "adhd",
        reasoning: "Attention training benefits everyone. Optimal during active hours for sustained focus building.",
        priority: 7
      });
    }

    setSuggestions(suggestions.sort((a, b) => b.priority - a.priority).slice(0, 4));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'retrieve': return Search;
      case 'capture': return Star;
      case 'weave': return Sparkles;
      case 'plan': return Calendar;
      case 'train': return Target;
      case 'regulate': return Heart;
      case 'adhd': return Shield;
      default: return Brain;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'retrieve': return 'indigo';
      case 'capture': return 'emerald';
      case 'weave': return 'purple';
      case 'plan': return 'blue';
      case 'train': return 'orange';
      case 'regulate': return 'red';
      case 'adhd': return 'blue';
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
          <button
            onClick={() => onActionSelect('plan')}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-sm leading-tight">Future scenario rehearsal</h5>
              </div>
            </div>
            <p className="text-xs text-gray-600">Mental rehearsal with implementation intentions</p>
          </button>

          <button
            onClick={() => onActionSelect('train')}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-sm leading-tight">Memory training</h5>
              </div>
            </div>
            <p className="text-xs text-gray-600">Evidence-based retrieval training</p>
          </button>

          <button
            onClick={() => onActionSelect('adhd')}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-sm leading-tight">ADHD support</h5>
              </div>
            </div>
            <p className="text-xs text-gray-600">Attention and cognitive control training</p>
          </button>

          <button
            onClick={() => onActionSelect('weave')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-sm leading-tight">Memory weaving</h5>
              </div>
            </div>
            <p className="text-xs text-gray-600">Transform moments into vivid memories</p>
          </button>
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
          <span className="text-indigo-600 font-medium capitalize">
            {cognitiveState.flowState}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationalInterface;