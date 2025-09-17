import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, Target, Lightbulb, Award, AlertCircle, CheckCircle } from 'lucide-react';

interface LiveMemoryAnalyzerProps {
  text: string;
  isActive: boolean;
  onSuggestion: (suggestion: string, type: 'improvement' | 'enhancement' | 'structure') => void;
  memoryType?: 'past' | 'future';
}

const LiveMemoryAnalyzer: React.FC<LiveMemoryAnalyzerProps> = ({
  text,
  isActive,
  onSuggestion,
  memoryType = 'past'
}) => {
  const [analysis, setAnalysis] = useState<{
    readabilityScore: number;
    emotionalIntensity: number;
    sensoryRichness: number;
    narrativeFlow: number;
    memoryStrength: number;
    suggestions: Array<{
      text: string;
      type: 'improvement' | 'enhancement' | 'structure';
      priority: 'high' | 'medium' | 'low';
      category: string;
    }>;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isActive || text.length < 10) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    const timer = setTimeout(() => {
      const newAnalysis = performDeepAnalysis(text);
      setAnalysis(newAnalysis);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [text, isActive]);

  const performDeepAnalysis = (text: string) => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    
    // Readability analysis
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
    
    // Emotional intensity analysis
    const emotionalWords = [
      'love', 'hate', 'excited', 'terrified', 'overjoyed', 'devastated', 'thrilled', 'anxious',
      'peaceful', 'angry', 'grateful', 'frustrated', 'amazed', 'disappointed', 'proud', 'ashamed'
    ];
    const emotionalCount = emotionalWords.filter(word => text.toLowerCase().includes(word)).length;
    const emotionalIntensity = Math.min((emotionalCount / words.length) * 1000, 100);
    
    // Sensory richness analysis
    const sensoryWords = {
      visual: ['see', 'look', 'bright', 'dark', 'color', 'light', 'shadow', 'sparkle', 'glow'],
      auditory: ['hear', 'sound', 'loud', 'quiet', 'music', 'voice', 'whisper', 'echo'],
      tactile: ['feel', 'touch', 'warm', 'cold', 'soft', 'rough', 'smooth', 'texture'],
      olfactory: ['smell', 'scent', 'aroma', 'fragrance', 'fresh', 'sweet'],
      gustatory: ['taste', 'flavor', 'sweet', 'sour', 'bitter', 'salty', 'delicious']
    };
    
    let sensoryCount = 0;
    Object.values(sensoryWords).forEach(wordList => {
      sensoryCount += wordList.filter(word => text.toLowerCase().includes(word)).length;
    });
    const sensoryRichness = Math.min((sensoryCount / words.length) * 500, 100);
    
    // Narrative flow analysis
    const flowMarkers = ['first', 'then', 'next', 'after', 'before', 'while', 'during', 'finally', 'meanwhile'];
    const flowCount = flowMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    const narrativeFlow = Math.min((flowCount / sentences.length) * 100, 100);
    
    // Overall memory strength calculation
    const memoryStrength = (readabilityScore + emotionalIntensity + sensoryRichness + narrativeFlow) / 4;
    
    // Generate intelligent suggestions
    const suggestions = generateIntelligentSuggestions(text, {
      readabilityScore,
      emotionalIntensity,
      sensoryRichness,
      narrativeFlow,
      wordCount: words.length,
      sentenceCount: sentences.length
    });
    
    return {
      readabilityScore,
      emotionalIntensity,
      sensoryRichness,
      narrativeFlow,
      memoryStrength,
      suggestions
    };
  };

  const generateIntelligentSuggestions = (text: string, metrics: any) => {
    const suggestions = [];
    
    // Structure improvements
    if (metrics.narrativeFlow < 40) {
      suggestions.push({
        text: "Add temporal markers like 'first', 'then', 'after that' to create clearer sequence",
        type: 'structure' as const,
        priority: 'high' as const,
        category: 'Flow Enhancement'
      });
    }
    
    if (metrics.sentenceCount < 3 && metrics.wordCount > 30) {
      suggestions.push({
        text: "Break this into shorter sentences for better readability and recall",
        type: 'structure' as const,
        priority: 'medium' as const,
        category: 'Sentence Structure'
      });
    }
    
    // Sensory enhancements
    if (metrics.sensoryRichness < 30) {
      suggestions.push({
        text: "Add specific sensory details - what did you see, hear, or feel?",
        type: 'enhancement' as const,
        priority: 'high' as const,
        category: 'Sensory Richness'
      });
    }
    
    // Emotional depth
    if (metrics.emotionalIntensity < 20) {
      suggestions.push({
        text: "Include emotional reactions - how did this make you feel in your body?",
        type: 'enhancement' as const,
        priority: 'medium' as const,
        category: 'Emotional Depth'
      });
    }
    
    // Context-specific suggestions
    if (text.includes('conversation') && !text.includes('"')) {
      suggestions.push({
        text: "Add specific dialogue or quotes to make conversations more vivid",
        type: 'enhancement' as const,
        priority: 'medium' as const,
        category: 'Dialogue Enhancement'
      });
    }
    
    if (memoryType === 'future' && !text.includes('will') && !text.includes('plan')) {
      suggestions.push({
        text: "Use future-focused language: 'I will...', 'When this happens...'",
        type: 'improvement' as const,
        priority: 'high' as const,
        category: 'Future Framing'
      });
    }
    
    return suggestions.slice(0, 4); // Limit to top 4 suggestions
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Target;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  if (!isActive || !analysis) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-medium text-purple-900">Live Memory Analysis</h3>
        {isAnalyzing && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-600">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Memory Strength Meter */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>Memory Strength Score</span>
          <span className="font-bold">{Math.round(analysis.memoryStrength)}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              analysis.memoryStrength > 80 ? 'bg-emerald-500' :
              analysis.memoryStrength > 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${analysis.memoryStrength}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {analysis.memoryStrength > 80 ? 'Excellent memory strength!' :
           analysis.memoryStrength > 60 ? 'Good foundation, room for enhancement' :
           'Building strength - keep adding details'}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Sensory Richness</span>
              <span>{Math.round(analysis.sensoryRichness)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${analysis.sensoryRichness}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Emotional Intensity</span>
              <span>{Math.round(analysis.emotionalIntensity)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-pink-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${analysis.emotionalIntensity}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Narrative Flow</span>
              <span>{Math.round(analysis.narrativeFlow)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${analysis.narrativeFlow}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Readability</span>
              <span>{Math.round(analysis.readabilityScore)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${analysis.readabilityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intelligent Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-purple-900">AI Recommendations</h4>
          {analysis.suggestions.map((suggestion, index) => {
            const PriorityIcon = getPriorityIcon(suggestion.priority);
            const priorityColor = getPriorityColor(suggestion.priority);
            
            return (
              <button
                key={index}
                onClick={() => onSuggestion(suggestion.text, suggestion.type)}
                className={`w-full text-left p-3 bg-white border border-${priorityColor}-200 rounded-lg hover:border-${priorityColor}-300 hover:bg-${priorityColor}-50 transition-all group`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 bg-${priorityColor}-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-${priorityColor}-200 transition-colors`}>
                    <PriorityIcon className={`w-4 h-4 text-${priorityColor}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium text-${priorityColor}-700 capitalize`}>
                        {suggestion.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 bg-${priorityColor}-100 text-${priorityColor}-700 rounded-full capitalize`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {suggestion.text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveMemoryAnalyzer;