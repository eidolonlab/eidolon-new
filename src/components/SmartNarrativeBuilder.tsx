import React, { useState, useEffect } from 'react';
import { MessageSquare, Zap, RefreshCw, CheckCircle, ArrowRight, Wand2, Brain, Target, Lightbulb, Sparkles } from 'lucide-react';

interface SmartNarrativeBuilderProps {
  seed: string;
  sensoryDetails: {
    visual: string;
    auditory: string;
    olfactory: string;
    tactile: string;
    emotional: string;
  };
  currentNarrative: string;
  onNarrativeUpdate: (narrative: string) => void;
  memoryType: 'past' | 'future';
}

const SmartNarrativeBuilder: React.FC<SmartNarrativeBuilderProps> = ({
  seed,
  sensoryDetails,
  currentNarrative,
  onNarrativeUpdate,
  memoryType
}) => {
  const [suggestions, setSuggestions] = useState<Array<{
    text: string;
    style: string;
    confidence: number;
    wordCount: number;
    focus: string;
  }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<{
    structure: string;
    tone: string;
    completeness: number;
    suggestions: string[];
  } | null>(null);

  const narrativeStyles = {
    past: {
      chronological: 'Step-by-step timeline of events',
      emotional_journey: 'Focus on feelings and emotional progression',
      sensory_immersion: 'Rich sensory details and atmosphere',
      dialogue_driven: 'Conversations and interactions with others',
      reflection: 'Looking back with insight and meaning'
    },
    future: {
      preparation: 'Detailed preparation and planning approach',
      visualization: 'Vivid mental rehearsal of success',
      step_by_step: 'Sequential action plan with contingencies',
      confidence_building: 'Positive self-talk and empowerment',
      outcome_focused: 'Clear vision of desired results'
    }
  };

  // Real-time narrative analysis
  useEffect(() => {
    if (currentNarrative.length < 20) {
      setLiveAnalysis(null);
      return;
    }

    const sentences = currentNarrative.split('.').filter(s => s.trim().length > 0);
    const words = currentNarrative.split(' ').filter(w => w.length > 0);
    
    // Analyze structure
    let structure = 'simple';
    if (sentences.length >= 4) structure = 'complex';
    else if (sentences.length >= 2) structure = 'moderate';

    // Analyze tone
    const positiveWords = ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'beautiful'];
    const negativeWords = ['sad', 'difficult', 'challenging', 'worried', 'anxious'];
    const positiveCount = positiveWords.filter(word => currentNarrative.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => currentNarrative.toLowerCase().includes(word)).length;
    
    let tone = 'neutral';
    if (positiveCount > negativeCount) tone = 'positive';
    else if (negativeCount > positiveCount) tone = 'negative';

    // Calculate completeness
    const sensoryMentions = Object.values(sensoryDetails).filter(d => 
      d.length > 0 && currentNarrative.toLowerCase().includes(d.toLowerCase().substring(0, 10))
    ).length;
    const completeness = Math.min((sensoryMentions / 5) * 100, 100);

    // Generate live suggestions
    const liveSuggestions = [];
    if (sentences.length < 3) {
      liveSuggestions.push('Add more detail about what happened next');
    }
    if (!currentNarrative.includes('feel') && !currentNarrative.includes('felt')) {
      liveSuggestions.push('Include how you felt during this experience');
    }
    if (sensoryMentions < 2) {
      liveSuggestions.push('Weave in more sensory details from your cues');
    }

    setLiveAnalysis({
      structure,
      tone,
      completeness,
      suggestions: liveSuggestions
    });
  }, [currentNarrative, sensoryDetails]);

  const generateNarrativeVariations = (style?: string) => {
    setIsGenerating(true);
    
    // Simulate AI processing with style-specific generation
    setTimeout(() => {
      const variations = [];
      const details = Object.values(sensoryDetails).filter(d => d.length > 0);
      const selectedStyles = style ? [style] : Object.keys(narrativeStyles[memoryType]);
      
      selectedStyles.forEach(narrativeStyle => {
        if (memoryType === 'past') {
          switch (narrativeStyle) {
            case 'chronological':
              variations.push({
                text: `The memory of ${seed} unfolds in clear sequence. First, ${sensoryDetails.visual ? `I noticed ${sensoryDetails.visual.toLowerCase()}` : 'the scene came into focus'}. Then, ${sensoryDetails.auditory ? `${sensoryDetails.auditory.toLowerCase()} filled the air` : 'sounds began to register'}. ${sensoryDetails.olfactory ? `The distinctive scent of ${sensoryDetails.olfactory.toLowerCase()} added another layer to the experience.` : ''} ${sensoryDetails.emotional ? `Throughout it all, I felt ${sensoryDetails.emotional.toLowerCase()}.` : ''} This sequence of events created a memory that remains vivid and accessible.`,
                style: 'Chronological Timeline',
                confidence: 0.9,
                wordCount: 0,
                focus: 'Sequential events'
              });
              break;
            case 'emotional_journey':
              variations.push({
                text: `${seed} was an emotional journey that began with ${sensoryDetails.emotional || 'anticipation'}. ${sensoryDetails.visual ? `The visual landscape of ${sensoryDetails.visual.toLowerCase()} set the emotional tone.` : ''} ${sensoryDetails.auditory ? `When I heard ${sensoryDetails.auditory.toLowerCase()}, my feelings deepened.` : ''} ${sensoryDetails.tactile ? `The physical sensation of ${sensoryDetails.tactile.toLowerCase()} grounded me in the moment.` : ''} This emotional progression from beginning to end makes this memory particularly meaningful and retrievable.`,
                style: 'Emotional Journey',
                confidence: 0.85,
                wordCount: 0,
                focus: 'Feelings and emotions'
              });
              break;
            case 'sensory_immersion':
              variations.push({
                text: `Immersing myself in the memory of ${seed}, I'm transported by the senses. ${sensoryDetails.visual ? `Visually, ${sensoryDetails.visual.toLowerCase()} dominates the scene.` : ''} ${sensoryDetails.auditory ? `The soundscape includes ${sensoryDetails.auditory.toLowerCase()}.` : ''} ${sensoryDetails.olfactory ? `Aromatically, ${sensoryDetails.olfactory.toLowerCase()} permeates the air.` : ''} ${sensoryDetails.tactile ? `Physically, everything feels ${sensoryDetails.tactile.toLowerCase()}.` : ''} ${sensoryDetails.emotional ? `Emotionally, ${sensoryDetails.emotional.toLowerCase()} colors the entire experience.` : ''} This multi-sensory tapestry creates a memory so vivid it feels like I could step back into it.`,
                style: 'Sensory Immersion',
                confidence: 0.95,
                wordCount: 0,
                focus: 'Rich sensory details'
              });
              break;
          }
        } else {
          switch (narrativeStyle) {
            case 'preparation':
              variations.push({
                text: `I'm methodically preparing for ${seed} by building a detailed mental model. ${sensoryDetails.visual ? `I envision the visual environment will include ${sensoryDetails.visual.toLowerCase()}.` : ''} ${sensoryDetails.auditory ? `I anticipate hearing ${sensoryDetails.auditory.toLowerCase()}.` : ''} ${sensoryDetails.emotional ? `My goal is to maintain ${sensoryDetails.emotional.toLowerCase()} throughout.` : ''} By rehearsing these specific details, I'm creating neural pathways that will activate automatically when the real situation occurs.`,
                style: 'Methodical Preparation',
                confidence: 0.9,
                wordCount: 0,
                focus: 'Detailed planning'
              });
              break;
            case 'visualization':
              variations.push({
                text: `I close my eyes and vividly imagine ${seed} unfolding perfectly. ${sensoryDetails.visual ? `I see ${sensoryDetails.visual.toLowerCase()} in crystal clear detail.` : ''} ${sensoryDetails.auditory ? `I hear ${sensoryDetails.auditory.toLowerCase()} as if it's happening now.` : ''} ${sensoryDetails.tactile ? `I feel ${sensoryDetails.tactile.toLowerCase()} with complete realism.` : ''} ${sensoryDetails.emotional ? `I embody ${sensoryDetails.emotional.toLowerCase()} with full conviction.` : ''} This mental rehearsal is so vivid that my brain treats it as real experience, building confidence for the actual event.`,
                style: 'Vivid Visualization',
                confidence: 0.95,
                wordCount: 0,
                focus: 'Mental rehearsal'
              });
              break;
            case 'confidence_building':
              variations.push({
                text: `I'm building unshakeable confidence for ${seed} through positive mental rehearsal. ${sensoryDetails.emotional ? `I cultivate ${sensoryDetails.emotional.toLowerCase()} as my foundation.` : ''} ${sensoryDetails.visual ? `I see myself succeeding in an environment with ${sensoryDetails.visual.toLowerCase()}.` : ''} ${sensoryDetails.auditory ? `I hear ${sensoryDetails.auditory.toLowerCase()} and respond with calm assurance.` : ''} Every detail I rehearse strengthens my belief in my ability to handle this situation with grace and competence.`,
                style: 'Confidence Building',
                confidence: 0.88,
                wordCount: 0,
                focus: 'Self-empowerment'
              });
              break;
          }
        }
      });

      // Calculate word counts
      variations.forEach(variation => {
        variation.wordCount = variation.text.split(' ').length;
      });
      
      setSuggestions(variations.filter(v => v.text.length > 50));
      setIsGenerating(false);
    }, 1500);
  };

  const enhanceCurrentNarrative = () => {
    if (!currentNarrative || currentNarrative.length < 20) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const sentences = currentNarrative.split('.').filter(s => s.trim().length > 0);
      
      // Intelligent enhancement based on existing content
      const enhanced = sentences.map((sentence, index) => {
        const trimmed = sentence.trim();
        
        if (trimmed.length > 10) {
          // Add contextual sensory details
          const availableDetails = Object.entries(sensoryDetails).filter(([_, detail]) => 
            detail.length > 0 && !currentNarrative.toLowerCase().includes(detail.toLowerCase().substring(0, 15))
          );
          
          if (availableDetails.length > 0 && index < 2) {
            const [senseType, detail] = availableDetails[index % availableDetails.length];
            const connectors = {
              visual: 'where I could see',
              auditory: 'accompanied by',
              olfactory: 'with the scent of',
              tactile: 'feeling',
              emotional: 'while experiencing'
            };
            
            return `${trimmed}, ${connectors[senseType as keyof typeof connectors]} ${detail.toLowerCase()}`;
          }
        }
        return trimmed;
      }).join('. ') + '.';
      
      setSuggestions([{
        text: enhanced,
        style: 'Enhanced Version',
        confidence: 0.85,
        wordCount: enhanced.split(' ').length,
        focus: 'Sensory integration'
      }]);
      setIsGenerating(false);
    }, 1000);
  };

  const generateStyleSpecific = (style: string) => {
    setSelectedStyle(style);
    generateNarrativeVariations(style);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Smart Narrative Builder</h3>
          {selectedStyle && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
              {selectedStyle} style
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => generateNarrativeVariations()}
            disabled={isGenerating || Object.values(sensoryDetails).every(d => d.length === 0)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            <span>Generate</span>
          </button>
          {currentNarrative.length > 20 && (
            <button
              onClick={enhanceCurrentNarrative}
              disabled={isGenerating}
              className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Enhance</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Analysis Panel */}
      {liveAnalysis && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Live Analysis</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 capitalize">{liveAnalysis.structure}</div>
              <div className="text-xs text-blue-700">Structure</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 capitalize">{liveAnalysis.tone}</div>
              <div className="text-xs text-blue-700">Tone</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{Math.round(liveAnalysis.completeness)}%</div>
              <div className="text-xs text-blue-700">Sensory Integration</div>
            </div>
          </div>
          {liveAnalysis.suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-blue-800">Quick Improvements:</div>
              {liveAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs text-blue-700">• {suggestion}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Narrative Style Selector */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Choose Narrative Style</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(narrativeStyles[memoryType]).map(([style, description]) => (
            <button
              key={style}
              onClick={() => generateStyleSpecific(style)}
              disabled={isGenerating}
              className={`p-3 text-left border rounded-lg transition-all ${
                selectedStyle === style
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm capitalize">{style.replace('_', ' ')}</div>
              <div className="text-xs text-gray-600 mt-1">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-indigo-600">
              <div className="font-medium">Crafting your narrative...</div>
              <div className="text-sm">Analyzing {Object.values(sensoryDetails).filter(d => d.length > 0).length} sensory elements</div>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && !isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              ✨ <strong>{suggestions.length} narrative variation{suggestions.length !== 1 ? 's' : ''}</strong> generated:
            </p>
            <button
              onClick={() => setSuggestions([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear suggestions
            </button>
          </div>
          
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group"
              onClick={() => onNarrativeUpdate(suggestion.text)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-900">{suggestion.style}</span>
                  <span className="text-xs text-gray-500">• {suggestion.focus}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.ceil(suggestion.confidence * 5) }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <p className="text-sm text-gray-700 group-hover:text-indigo-800 transition-colors leading-relaxed mb-3">
                {suggestion.text}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{suggestion.wordCount || suggestion.text.split(' ').length} words</span>
                  <span>•</span>
                  <span>{suggestion.text.split('.').filter(s => s.trim().length > 0).length} sentences</span>
                  <span>•</span>
                  <span className="capitalize">{suggestion.style.toLowerCase()}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !isGenerating && Object.values(sensoryDetails).some(d => d.length > 0) && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-4">
            Ready to generate narrative variations from your sensory details
          </p>
          <div className="space-y-3">
            <button
              onClick={() => generateNarrativeVariations()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate Multiple Styles
            </button>
            <div className="text-xs text-gray-500">
              Or choose a specific style above for targeted generation
            </div>
          </div>
        </div>
      )}

      {Object.values(sensoryDetails).every(d => d.length === 0) && !isGenerating && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm text-gray-500 mb-2">
            Add sensory details to unlock AI narrative generation
          </p>
          <div className="text-xs text-gray-400">
            The more sensory details you provide, the richer the generated narratives will be
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNarrativeBuilder;