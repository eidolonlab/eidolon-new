import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, Target, Zap, Eye, Ear, Heart, Sparkles, Award, Clock } from 'lucide-react';

interface MemoryProfile {
  dominantSenses: string[];
  narrativeStyle: 'chronological' | 'emotional' | 'sensory' | 'thematic';
  optimalDetailLevel: number;
  coherencePatterns: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  personalityType: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  emotionalDepthPreference: number;
  temporalStructureSkill: number;
}

interface AdaptiveMemoryCoachProps {
  currentText: string;
  memoryType: 'past' | 'future';
  fieldType: string;
  userHistory: any[];
  onSuggestion: (suggestion: string, confidence: number, reasoning: string) => void;
  onPatternInsight: (insight: string) => void;
}

const AdaptiveMemoryCoach: React.FC<AdaptiveMemoryCoachProps> = ({
  currentText,
  memoryType,
  fieldType,
  userHistory,
  onSuggestion,
  onPatternInsight
}) => {
  const [memoryProfile, setMemoryProfile] = useState<MemoryProfile>({
    dominantSenses: ['visual'],
    narrativeStyle: 'chronological',
    optimalDetailLevel: 50,
    coherencePatterns: [],
    strengthAreas: [],
    improvementAreas: [],
    personalityType: 'mixed',
    emotionalDepthPreference: 3,
    temporalStructureSkill: 3
  });

  const [adaptiveSuggestions, setAdaptiveSuggestions] = useState<Array<{
    text: string;
    confidence: number;
    reasoning: string;
    category: string;
    priority: number;
  }>>([]);

  const [learningInsights, setLearningInsights] = useState<string[]>([]);
  const [personalizedPrompts, setPersonalizedPrompts] = useState<string[]>([]);

  // Analyze user patterns and build profile
  useEffect(() => {
    if (userHistory.length >= 3) {
      analyzeUserPatterns();
    }
    generateAdaptiveSuggestions();
  }, [currentText, userHistory]);

  const analyzeUserPatterns = () => {
    const insights = [];
    const profile = { ...memoryProfile };

    // Analyze sensory preferences
    const senseUsage = {
      visual: 0,
      auditory: 0,
      olfactory: 0,
      tactile: 0,
      emotional: 0
    };

    userHistory.forEach(memory => {
      Object.entries(memory.sensoryDetails || {}).forEach(([sense, detail]) => {
        if (detail && detail.length > 20) {
          senseUsage[sense as keyof typeof senseUsage]++;
        }
      });
    });

    // Identify dominant senses
    const sortedSenses = Object.entries(senseUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([sense]) => sense);

    profile.dominantSenses = sortedSenses;

    if (senseUsage.visual > senseUsage.auditory * 2) {
      insights.push("You're a strong visual processor - leverage imagery and spatial details");
      profile.personalityType = 'visual';
    } else if (senseUsage.auditory > senseUsage.visual * 1.5) {
      insights.push("You excel with auditory details - focus on sounds, voices, and music");
      profile.personalityType = 'auditory';
    } else if (senseUsage.emotional > 3) {
      insights.push("Emotional depth is your strength - use feelings to anchor memories");
    }

    // Analyze narrative patterns
    const avgCoherence = userHistory.reduce((sum, m) => sum + (m.coherenceScore || 0), 0) / userHistory.length;
    const avgLength = userHistory.reduce((sum, m) => sum + (m.narrative?.length || 0), 0) / userHistory.length;

    if (avgCoherence > 85) {
      insights.push("Your narrative structure is excellent - you naturally create coherent stories");
      profile.strengthAreas.push('narrative_coherence');
    } else if (avgCoherence < 60) {
      insights.push("Focus on connecting events with 'then', 'because', 'while' for better flow");
      profile.improvementAreas.push('temporal_structure');
    }

    if (avgLength > 200) {
      insights.push("You create rich, detailed narratives - this is a major strength");
      profile.optimalDetailLevel = 80;
    } else if (avgLength < 100) {
      insights.push("Try expanding your narratives with more specific details and connections");
      profile.optimalDetailLevel = 30;
    }

    setMemoryProfile(profile);
    setLearningInsights(insights);
  };

  const generateAdaptiveSuggestions = () => {
    if (currentText.length < 10) return;

    const suggestions = [];
    const words = currentText.toLowerCase().split(/\s+/);
    const sentences = currentText.split('.').filter(s => s.trim().length > 0);

    // Personalized suggestions based on user profile
    if (memoryProfile.personalityType === 'visual' && !currentText.includes('color') && !currentText.includes('light')) {
      suggestions.push({
        text: `the specific lighting - was it warm golden sunlight, cool fluorescent, or soft lamplight?`,
        confidence: 0.9,
        reasoning: "Your profile shows strong visual processing - lighting details will significantly enhance recall",
        category: 'visual_enhancement',
        priority: 1
      });
    }

    if (memoryProfile.personalityType === 'auditory' && fieldType === 'auditory') {
      suggestions.push({
        text: `the rhythm and tone - was it steady and calming, or varied and energetic?`,
        confidence: 0.95,
        reasoning: "You excel with auditory details - rhythm and tone create powerful memory anchors",
        category: 'auditory_depth',
        priority: 1
      });
    }

    // Emotional depth based on user preference
    if (memoryProfile.emotionalDepthPreference >= 4 && !words.some(w => ['felt', 'feeling', 'emotion'].includes(w))) {
      suggestions.push({
        text: `how this moment affected you physically - did you feel tension, warmth, energy, or calm in your body?`,
        confidence: 0.85,
        reasoning: "Your profile indicates high emotional processing - body sensations create strong memory pathways",
        category: 'emotional_embodiment',
        priority: 2
      });
    }

    // Narrative structure optimization
    if (sentences.length === 1 && words.length > 15) {
      suggestions.push({
        text: `Break this into a sequence: "First... then... finally..." to create better memory structure`,
        confidence: 0.8,
        reasoning: "Your writing style benefits from clear temporal structure - this will improve coherence scores",
        category: 'structure_improvement',
        priority: 2
      });
    }

    // Context-aware enhancement
    if (currentText.includes('conversation') && !currentText.includes('"')) {
      suggestions.push({
        text: `the exact words spoken - even approximate quotes make conversations incredibly vivid`,
        confidence: 0.9,
        reasoning: "Dialogue creates powerful memory anchors and improves narrative engagement",
        category: 'dialogue_enhancement',
        priority: 1
      });
    }

    // Advanced pattern recognition
    if (memoryProfile.strengthAreas.includes('narrative_coherence') && currentText.length > 100) {
      suggestions.push({
        text: `the underlying meaning or significance - what made this moment important to you?`,
        confidence: 0.85,
        reasoning: "Your coherence skills are strong - adding meaning will create deeper memory consolidation",
        category: 'meaning_enhancement',
        priority: 3
      });
    }

    setAdaptiveSuggestions(suggestions.slice(0, 3));
  };

  const generatePersonalizedPrompts = () => {
    const prompts = [];

    // Based on dominant senses
    if (memoryProfile.dominantSenses.includes('visual')) {
      prompts.push("What was the most striking visual element that caught your attention?");
      prompts.push("Describe the interplay of light and shadow in this moment");
    }

    if (memoryProfile.dominantSenses.includes('emotional')) {
      prompts.push("How did this moment change your emotional state?");
      prompts.push("What physical sensations accompanied your emotions?");
    }

    // Based on improvement areas
    if (memoryProfile.improvementAreas.includes('temporal_structure')) {
      prompts.push("What happened immediately before this moment?");
      prompts.push("How did this moment transition into what came next?");
    }

    setPersonalizedPrompts(prompts.slice(0, 2));
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Adaptive Memory Coach</h3>
          <p className="text-sm text-gray-600">AI learns your patterns and optimizes suggestions</p>
        </div>
      </div>

      {/* User Profile Insights */}
      {learningInsights.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">Your Memory Profile</span>
          </div>
          <div className="space-y-2">
            {learningInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-indigo-800">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Suggestions */}
      {adaptiveSuggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-purple-900">Personalized Suggestions</h4>
          {adaptiveSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestion(suggestion.text, suggestion.confidence, suggestion.reasoning)}
              className="w-full text-left p-4 bg-white border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-purple-700 capitalize">
                      {suggestion.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.ceil(suggestion.confidence * 5) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors mb-2">
                    Add: {suggestion.text}
                  </p>
                  <div className="text-xs text-purple-600 bg-purple-100 rounded px-2 py-1">
                    💡 {suggestion.reasoning}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Personalized Prompts */}
      {personalizedPrompts.length > 0 && (
        <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-pink-600" />
            <span className="font-medium text-pink-900">Questions Just for You</span>
          </div>
          <div className="space-y-2">
            {personalizedPrompts.map((prompt, index) => (
              <div key={index} className="text-sm text-pink-800 bg-white rounded p-2 border border-pink-200">
                {prompt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveMemoryCoach;