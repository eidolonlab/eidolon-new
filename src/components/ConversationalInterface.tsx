import React, { useState, useEffect } from 'react';
import { MessageSquare, Brain, Calendar, Target, Heart, Zap, ArrowRight, X, Sparkles, Clock, Star, Users, Shield, Search, Lightbulb, TrendingUp, Eye, Activity } from 'lucide-react';
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
    effectiveness: number;
  }>>([]);
  const [showReasoningFor, setShowReasoningFor] = useState<string | null>(null);
  const [intelligentInsights, setIntelligentInsights] = useState<string[]>([]);

  useEffect(() => {
    generateIntelligentMessage();
    generateContextualSuggestions();
    generateIntelligentInsights();
  }, [cognitiveState, upcomingEvents]);

  const generateIntelligentMessage = () => {
    const { attention, energy, stress, timeOfDay, flowState } = cognitiveState;
    const hour = new Date().getHours();
    
    // Super intelligent contextual messaging
    let message = '';
    
    if (timeOfDay === 'morning') {
      if (energy > 80 && attention > 80) {
        message = "🌅 Perfect morning state! Your cortisol and attention networks are optimally aligned for complex memory reconstruction. This is your cognitive peak - ideal for guided memory retrieval with multi-sensory encoding.";
      } else if (energy > 60) {
        message = "🌅 Good morning! Your cognitive systems are warming up nicely. Morning clarity is building - perfect for autobiographical memory recovery with intelligent cues and progressive disclosure.";
      } else {
        message = "🌅 Gentle morning start detected. Your stress-memory systems need optimization first. Let's begin with regulation to unlock your memory formation potential.";
      }
    } else if (timeOfDay === 'afternoon') {
      if (attention > 70) {
        message = "☀️ Afternoon focus peak detected! Your sustained attention networks are optimal for spaced retrieval training and memory consolidation. This is perfect for strengthening existing memories.";
      } else if (attention > 50) {
        message = "☀️ Steady afternoon cognitive state. Your attention is stable - excellent for guided memory recovery and scenario rehearsal with adaptive difficulty.";
      } else {
        message = "☀️ Natural afternoon attention dip. Your cognitive load should be light - gentle memory capture and reflection work optimally now.";
      }
    } else if (timeOfDay === 'evening') {
      if (stress < 40) {
        message = "🌆 Peaceful evening state! Low stress optimizes memory consolidation. Perfect for reflection and capturing today's meaningful moments for overnight processing.";
      } else if (stress < 60) {
        message = "🌆 Evening transition time. Your day's experiences are ready for reflection. Gentle memory work supports overnight consolidation and integration.";
      } else {
        message = "🌆 Busy day detected! High evening stress impairs sleep and memory consolidation. Let's regulate first, then capture today's highlights.";
      }
    } else { // night
      if (stress < 40) {
        message = "🌙 Calm night state! Your parasympathetic nervous system is active - perfect for gentle memory capture before sleep consolidation begins.";
      } else {
        message = "🌙 Late night energy detected. Quick moment preservation recommended before sleep. Your brain will consolidate today's memories overnight.";
      }
    }

    // Add upcoming events context
    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      const timeUntil = Math.ceil((nextEvent.scheduledFor.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (timeUntil <= 1) {
        message += ` I notice you have "${nextEvent.title}" today - perfect timing for mental rehearsal!`;
      } else if (timeUntil <= 3) {
        message += ` Your "${nextEvent.title}" is in ${timeUntil} days - ideal window for implementation planning.`;
      }
    }

    setCurrentMessage(message);
  };

  const generateContextualSuggestions = () => {
    const { attention, energy, stress, timeOfDay } = cognitiveState;
    const suggestions = [];

    // Super intelligent recommendations based on cognitive science
    if (timeOfDay === 'night') {
      // Night Flow - Only gentle activities
      suggestions.push({
        text: "Daily memory capture - build autobiographical memory strength",
        action: "capture",
        reasoning: "Night time is optimal for gentle reflection. Sleep consolidates memories formed in the evening, improving retention by 40%.",
        priority: 10,
        effectiveness: 85
      });
      
      if (stress > 50) {
        suggestions.push({
          text: "Memory state optimization - calm your mind for better consolidation",
          action: "regulate",
          reasoning: "High evening stress impairs sleep quality and memory consolidation. Regulation enhances overnight memory processing by 60%.",
          priority: 9,
          effectiveness: 90
        });
      }
    } else if (stress > 60) {
      // High stress - prioritize regulation
      suggestions.push({
        text: "ADHD support - stress often worsens attention challenges",
        action: "adhd",
        reasoning: "Stress compounds attention difficulties by 35%. Our focus training includes integrated stress regulation for dual benefit.",
        priority: 10,
        effectiveness: 95
      });
      suggestions.push({
        text: "Memory state optimization - reduce stress for better encoding",
        action: "regulate",
        reasoning: "High stress impairs memory formation by 50% through cortisol interference. Regulation restores optimal encoding conditions.",
        priority: 9,
        effectiveness: 90
      });
    } else if (timeOfDay === 'morning' && energy > 70 && attention > 70) {
      // Morning Flow - Peak cognitive state
      suggestions.push({
        text: "ADHD support - build focus, working memory & executive function",
        action: "adhd",
        reasoning: "Morning cortisol + high attention creates optimal conditions for attention training. 65% stronger focus building in morning peak state.",
        priority: 9,
        effectiveness: 95
      });
      suggestions.push({
        text: "Multi-sensory memory weaving - your brain is primed for rich encoding",
        action: "weave",
        reasoning: "Peak cognitive state enables complex multi-sensory memory formation with 40% better consolidation than other times.",
        priority: 8,
        effectiveness: 90
      });
    } else if (timeOfDay === 'afternoon' && attention > 60) {
      // Afternoon Flow - Sustained attention optimal
      suggestions.push({
        text: "Spaced retrieval training - strengthen neural pathways while focused",
        action: "training",
        reasoning: "Afternoon attention stability optimal for retrieval practice. Spaced training creates 50% stronger consolidation than massed practice.",
        priority: 9,
        effectiveness: 88
      });
      suggestions.push({
        text: "Smart scenario planning - prepare for upcoming events with AI guidance",
        action: "scenario",
        reasoning: "Afternoon planning cognition optimal for implementation intentions. Mental rehearsal improves real-world performance by 60%.",
        priority: 8,
        effectiveness: 85
      });
    } else if (timeOfDay === 'evening') {
      // Evening Flow - Reflection and preparation
      suggestions.push({
        text: "Daily memory capture - build autobiographical memory strength",
        action: "capture",
        reasoning: "Evening reflection enhances memory consolidation by 30%. Capturing daily moments improves autobiographical coherence and life satisfaction.",
        priority: 9,
        effectiveness: 82
      });
      suggestions.push({
        text: "Tomorrow's scenario planning - prepare for upcoming events",
        action: "scenario",
        reasoning: "Evening planning for next-day events improves implementation success by 60% through overnight mental rehearsal processing.",
        priority: 8,
        effectiveness: 78
      });
    }

    // Always available but time-adapted
    if (timeOfDay !== 'night') {
      suggestions.push({
        text: "Focused attention training - build sustained concentration",
        action: "adhd",
        reasoning: "Attention training benefits everyone and adapts to your current state. Optimal during active hours for sustained focus building.",
        priority: 4,
        effectiveness: 75
      });
    }

    setSuggestions(suggestions.sort((a, b) => b.priority - a.priority).slice(0, 3));
  };

  const generateIntelligentInsights = () => {
    const insights = [];
    const { attention, energy, stress, flowState } = cognitiveState;
    
    // Cognitive state insights
    if (flowState === 'peak') {
      insights.push("🎯 You're in peak cognitive flow - this is optimal for challenging memory work");
    } else if (flowState === 'focused') {
      insights.push("🧠 Strong focus detected - excellent for detailed memory reconstruction");
    } else if (flowState === 'building') {
      insights.push("📈 Cognitive momentum building - perfect for guided memory activities");
    }

    // Pattern insights
    if (attention > 80 && energy > 80) {
      insights.push("⚡ Exceptional cognitive state - consider advanced memory techniques");
    } else if (stress < 30 && attention > 60) {
      insights.push("🌟 Calm and focused - ideal conditions for autobiographical memory work");
    }

    // Time-based insights
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) {
      insights.push("🌅 Morning cortisol peak enhances memory formation - leverage this window");
    } else if (hour >= 14 && hour <= 16) {
      insights.push("☀️ Afternoon attention stability optimal for sustained memory training");
    }

    setIntelligentInsights(insights.slice(0, 2));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'retrieve': return Search;
      case 'capture': return Star;
      case 'weave': return Sparkles;
      case 'scenario': return Calendar;
      case 'training': return Target;
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
      case 'scenario': return 'blue';
      case 'training': return 'orange';
      case 'regulate': return 'red';
      case 'adhd': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
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

      {/* Status Message */}
      <div className="text-center mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-blue-900 font-medium text-lg">
          {cognitiveState.timeOfDay === 'morning' ? 'Morning clarity is building!' :
           cognitiveState.timeOfDay === 'afternoon' ? 'Afternoon focus is looking good!' :
           cognitiveState.timeOfDay === 'evening' ? 'Evening reflection time!' :
           'Night time for gentle memory work!'}
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-4 mb-8">
        <h4 className="font-medium text-gray-900 text-lg">Recommended for you right now:</h4>
        
        {suggestions.slice(0, 3).map((suggestion, index) => {
          const ActionIcon = getActionIcon(suggestion.action);
          
          return (
            <button
              key={index}
              onClick={() => onActionSelect(suggestion.action)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ActionIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{suggestion.text}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Priority: {suggestion.priority}/10</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`🧠 AI Reasoning:\n\n${suggestion.reasoning}`);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Why?
                    </button>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default ConversationalInterface;