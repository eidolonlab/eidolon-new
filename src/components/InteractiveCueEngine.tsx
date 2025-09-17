import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Ear, Heart, Hand, DoorClosed as Nose, Lightbulb, Wand2, Play, Pause, Zap, Brain, Target } from 'lucide-react';

interface InteractiveCueEngineProps {
  currentText: string;
  onSuggestion: (suggestion: string, type: 'visual' | 'auditory' | 'olfactory' | 'tactile' | 'emotional') => void;
  isActive: boolean;
  fieldType?: string;
  memoryType?: 'past' | 'future';
}

const InteractiveCueEngine: React.FC<InteractiveCueEngineProps> = ({ 
  currentText, 
  onSuggestion, 
  isActive,
  fieldType = 'general',
  memoryType = 'past'
}) => {
  const [suggestions, setSuggestions] = useState<Array<{
    text: string;
    type: 'visual' | 'auditory' | 'olfactory' | 'tactile' | 'emotional';
    confidence: number;
    scenario: string;
    category: string;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // Enhanced contextual cue generation with multiple scenarios
  const generateContextualCues = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const newSuggestions = [];

    // Detect multiple contexts and generate rich scenarios
    const contexts = detectContexts(words);
    
    contexts.forEach(context => {
      const scenarioSuggestions = generateScenarioSuggestions(context, text, memoryType);
      newSuggestions.push(...scenarioSuggestions);
    });

    // Add progressive enhancement suggestions
    const enhancementSuggestions = generateEnhancementSuggestions(text, fieldType);
    newSuggestions.push(...enhancementSuggestions);

    // Add emotional depth suggestions
    const emotionalSuggestions = generateEmotionalSuggestions(text, words);
    newSuggestions.push(...emotionalSuggestions);

    // Sort by confidence and relevance
    return newSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8); // Show top 8 suggestions
  };

  const detectContexts = (words: string[]) => {
    const contexts = [];
    
    // Location contexts
    const locationKeywords = {
      kitchen: ['kitchen', 'cooking', 'stove', 'recipe', 'meal', 'food'],
      office: ['office', 'work', 'desk', 'computer', 'meeting', 'colleague'],
      park: ['park', 'outdoor', 'trees', 'grass', 'nature', 'walking'],
      restaurant: ['restaurant', 'dining', 'waiter', 'menu', 'table'],
      home: ['home', 'house', 'living', 'bedroom', 'family'],
      car: ['car', 'driving', 'traffic', 'road', 'highway'],
      beach: ['beach', 'ocean', 'sand', 'waves', 'shore'],
      hospital: ['hospital', 'doctor', 'medical', 'clinic', 'appointment']
    };

    // Activity contexts
    const activityKeywords = {
      celebration: ['birthday', 'party', 'celebration', 'wedding', 'anniversary'],
      learning: ['school', 'class', 'study', 'book', 'lesson', 'teacher'],
      exercise: ['gym', 'running', 'workout', 'sports', 'fitness'],
      travel: ['vacation', 'trip', 'airport', 'hotel', 'suitcase'],
      shopping: ['store', 'shopping', 'mall', 'buying', 'purchase'],
      social: ['friends', 'conversation', 'laughing', 'talking', 'gathering']
    };

    // Time contexts
    const timeKeywords = {
      morning: ['morning', 'breakfast', 'sunrise', 'dawn', 'early'],
      afternoon: ['afternoon', 'lunch', 'midday', 'noon'],
      evening: ['evening', 'dinner', 'sunset', 'dusk'],
      night: ['night', 'dark', 'late', 'midnight', 'sleep']
    };

    // Check for matches
    Object.entries({...locationKeywords, ...activityKeywords, ...timeKeywords}).forEach(([context, keywords]) => {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        contexts.push(context);
      }
    });

    return contexts.length > 0 ? contexts : ['general'];
  };

  const generateScenarioSuggestions = (context: string, text: string, type: 'past' | 'future') => {
    const suggestions = [];
    const baseConfidence = 0.8;

    const scenarioData = {
      kitchen: {
        visual: [
          'warm golden light streaming through the window onto the countertop',
          'steam rising from pots and pans on the stove',
          'colorful ingredients scattered across the cutting board',
          'the gentle glow of under-cabinet lighting illuminating the workspace'
        ],
        auditory: [
          'the rhythmic chopping of vegetables on the cutting board',
          'oil sizzling and popping in the hot pan',
          'the gentle hum of the refrigerator in the background',
          'water boiling and bubbling energetically'
        ],
        olfactory: [
          'the rich aroma of garlic and onions sautéing',
          'fresh herbs releasing their fragrance as they\'re chopped',
          'the warm, yeasty smell of bread baking in the oven',
          'spices blooming in hot oil, filling the air with warmth'
        ],
        tactile: [
          'the smooth, cool surface of the marble countertop',
          'warm steam gently touching your face as you lift pot lids',
          'the satisfying weight of a sharp knife in your hand',
          'flour dusting your fingertips as you knead dough'
        ],
        emotional: [
          'a sense of nurturing care as you prepare food for loved ones',
          'peaceful contentment in the rhythm of cooking',
          'anticipation building for the meal to come',
          'pride in creating something delicious from simple ingredients'
        ]
      },
      office: {
        visual: [
          'fluorescent lights casting a cool, even glow across the workspace',
          'the blue glow of multiple computer monitors',
          'papers and documents neatly organized in stacks',
          'colleagues moving purposefully through the open floor plan'
        ],
        auditory: [
          'the steady clicking of keyboards throughout the office',
          'muffled phone conversations and video calls',
          'the gentle hum of air conditioning and office equipment',
          'footsteps on carpet and the occasional chair rolling'
        ],
        olfactory: [
          'the faint scent of coffee brewing in the break room',
          'clean, recycled air with a hint of cleaning products',
          'the subtle smell of paper and printer toner',
          'someone\'s lunch heating up in the microwave'
        ],
        tactile: [
          'the smooth, cool surface of your desk',
          'the familiar feel of your keyboard under your fingertips',
          'the supportive cushion of your office chair',
          'cool air conditioning gently circulating around you'
        ],
        emotional: [
          'focused concentration as you tackle challenging tasks',
          'satisfaction from completing important projects',
          'collaborative energy when working with teammates',
          'determination to meet deadlines and exceed expectations'
        ]
      },
      park: {
        visual: [
          'dappled sunlight filtering through green leaves overhead',
          'children playing on colorful playground equipment',
          'people walking dogs along winding pathways',
          'flowers blooming in carefully tended garden beds'
        ],
        auditory: [
          'birds chirping and singing in the trees above',
          'children\'s laughter echoing across the playground',
          'the gentle rustle of leaves in the breeze',
          'distant sounds of traffic beyond the park boundaries'
        ],
        olfactory: [
          'fresh, clean air with hints of blooming flowers',
          'the earthy scent of grass and soil after morning dew',
          'the sweet fragrance of cherry blossoms in spring',
          'the crisp smell of autumn leaves crunching underfoot'
        ],
        tactile: [
          'soft grass beneath your feet as you walk',
          'a gentle breeze cooling your skin',
          'the rough texture of tree bark under your palm',
          'warm sunshine on your face and shoulders'
        ],
        emotional: [
          'peaceful tranquility away from urban stress',
          'joy in connecting with nature and fresh air',
          'nostalgia watching children play freely',
          'gratitude for this green space in the city'
        ]
      },
      celebration: {
        visual: [
          'colorful balloons and streamers decorating the space',
          'warm, golden light from candles flickering on the cake',
          'people\'s faces lit up with genuine smiles and laughter',
          'the sparkle of camera flashes capturing special moments'
        ],
        auditory: [
          'the joyful sound of "Happy Birthday" being sung together',
          'laughter and animated conversations filling the room',
          'the pop of champagne corks and clinking glasses',
          'upbeat music playing softly in the background'
        ],
        olfactory: [
          'the sweet aroma of birthday cake and frosting',
          'the festive scent of flowers in centerpieces',
          'the warm smell of food being served to guests',
          'perfume and cologne mingling in the celebratory air'
        ],
        tactile: [
          'warm hugs and congratulatory handshakes',
          'the smooth texture of gift wrapping paper',
          'cool champagne glasses in your hand',
          'the soft fabric of your special occasion outfit'
        ],
        emotional: [
          'overwhelming joy and gratitude for this special moment',
          'love and connection with family and friends gathered',
          'excitement and anticipation for what comes next',
          'a deep sense of being celebrated and appreciated'
        ]
      }
    };

    const contextSuggestions = scenarioData[context as keyof typeof scenarioData];
    if (contextSuggestions) {
      Object.entries(contextSuggestions).forEach(([senseType, senseOptions]) => {
        senseOptions.forEach((option, index) => {
          suggestions.push({
            text: option,
            type: senseType as any,
            confidence: baseConfidence - (index * 0.1),
            scenario: context,
            category: 'contextual'
          });
        });
      });
    }

    return suggestions;
  };

  const generateEnhancementSuggestions = (text: string, fieldType: string) => {
    const suggestions = [];
    const textLength = text.length;

    // Progressive enhancement based on text length and field type
    if (textLength > 20 && textLength < 50) {
      suggestions.push({
        text: 'the specific temperature you felt on your skin',
        type: 'tactile' as const,
        confidence: 0.7,
        scenario: 'enhancement',
        category: 'detail_expansion'
      });
    }

    if (textLength > 50 && !text.includes('color')) {
      suggestions.push({
        text: 'the dominant colors that caught your attention',
        type: 'visual' as const,
        confidence: 0.8,
        scenario: 'enhancement',
        category: 'sensory_completion'
      });
    }

    if (fieldType === 'visual' && !text.includes('light')) {
      suggestions.push({
        text: 'the quality of light - harsh, soft, warm, or cool',
        type: 'visual' as const,
        confidence: 0.9,
        scenario: 'enhancement',
        category: 'lighting_detail'
      });
    }

    return suggestions;
  };

  const generateEmotionalSuggestions = (text: string, words: string[]) => {
    const suggestions = [];
    
    // Emotional depth based on existing content
    const emotionalKeywords = {
      positive: ['happy', 'joy', 'excited', 'love', 'proud', 'grateful'],
      negative: ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'disappointed'],
      neutral: ['calm', 'peaceful', 'focused', 'thoughtful', 'curious', 'observant']
    };

    let emotionalTone = 'neutral';
    Object.entries(emotionalKeywords).forEach(([tone, keywords]) => {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        emotionalTone = tone;
      }
    });

    // Generate complementary emotional suggestions
    const emotionalSuggestions = {
      positive: [
        'a warm, expanding feeling in your chest',
        'energy and lightness throughout your body',
        'a smile that felt impossible to contain',
        'gratitude washing over you like a gentle wave'
      ],
      negative: [
        'tension building in your shoulders and jaw',
        'a heavy feeling settling in your stomach',
        'your breathing becoming shallow and quick',
        'a tightness in your throat as emotions rose'
      ],
      neutral: [
        'a sense of presence and awareness in the moment',
        'steady, rhythmic breathing as you took it all in',
        'alert curiosity about what would happen next',
        'balanced energy, neither rushed nor sluggish'
      ]
    };

    emotionalSuggestions[emotionalTone as keyof typeof emotionalSuggestions].forEach((suggestion, index) => {
      suggestions.push({
        text: suggestion,
        type: 'emotional' as const,
        confidence: 0.8 - (index * 0.1),
        scenario: emotionalTone,
        category: 'emotional_depth'
      });
    });

    return suggestions;
  };

  useEffect(() => {
    if (!isActive || currentText.length < 5) {
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate intelligent processing with realistic delay
    const processingTime = Math.min(1200, currentText.length * 20);
    const timer = setTimeout(() => {
      const newSuggestions = generateContextualCues(currentText);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
      setInteractionCount(prev => prev + 1);
      
      // Detect dominant scenario for UI feedback
      if (newSuggestions.length > 0) {
        const dominantScenario = newSuggestions[0].scenario;
        setCurrentScenario(dominantScenario);
      }
    }, processingTime);

    return () => clearTimeout(timer);
  }, [currentText, isActive, fieldType, memoryType]);

  const getSenseIcon = (type: string) => {
    switch (type) {
      case 'visual': return Eye;
      case 'auditory': return Ear;
      case 'olfactory': return Nose;
      case 'tactile': return Hand;
      case 'emotional': return Heart;
      default: return Lightbulb;
    }
  };

  const getSenseColor = (type: string) => {
    switch (type) {
      case 'visual': return 'indigo';
      case 'auditory': return 'emerald';
      case 'olfactory': return 'orange';
      case 'tactile': return 'purple';
      case 'emotional': return 'pink';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'contextual': return Target;
      case 'detail_expansion': return Zap;
      case 'sensory_completion': return Sparkles;
      case 'emotional_depth': return Heart;
      default: return Lightbulb;
    }
  };

  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-indigo-900">AI Memory Assistant</h3>
          {currentScenario && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full capitalize">
              {currentScenario} context
            </span>
          )}
        </div>
        {isAnalyzing && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-indigo-600">Analyzing context...</span>
          </div>
        )}
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-indigo-700">
              💡 <strong>{suggestions.length} suggestions</strong> based on your text:
            </p>
            <div className="text-xs text-indigo-600">
              Interaction #{interactionCount}
            </div>
          </div>
          
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => {
              const Icon = getSenseIcon(suggestion.type);
              const CategoryIcon = getCategoryIcon(suggestion.category);
              const color = getSenseColor(suggestion.type);
              
              return (
                <button
                  key={index}
                  onClick={() => onSuggestion(suggestion.text, suggestion.type)}
                  className={`flex items-start space-x-3 p-4 bg-white rounded-lg border border-${color}-200 hover:border-${color}-300 hover:bg-${color}-50 transition-all text-left group hover:shadow-md`}
                >
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-${color}-200 transition-colors`}>
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium text-${color}-700 capitalize`}>
                          {suggestion.type}
                        </span>
                        <CategoryIcon className={`w-3 h-3 text-${color}-500`} />
                        <span className="text-xs text-gray-500 capitalize">
                          {suggestion.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(suggestion.confidence * 5) }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 bg-${color}-400 rounded-full`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                      {suggestion.text}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {suggestion.scenario} scenario
                      </span>
                      <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to add →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">AI Analysis</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-indigo-600">{currentText.split(' ').length}</div>
                <div className="text-xs text-indigo-700">Words</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600">{suggestions.length}</div>
                <div className="text-xs text-indigo-700">Suggestions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600">
                  {Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length * 100)}%
                </div>
                <div className="text-xs text-indigo-700">Confidence</div>
              </div>
            </div>
          </div>
        </div>
      ) : !isAnalyzing && currentText.length >= 5 ? (
        <div className="text-center py-6">
          <Lightbulb className="w-10 h-10 mx-auto mb-3 text-indigo-400" />
          <p className="text-sm text-indigo-600 mb-2">
            Keep writing to unlock more personalized suggestions...
          </p>
          <div className="text-xs text-indigo-500">
            AI learns from your writing style and context
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="relative">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
          </div>
          <p className="text-sm text-indigo-600 mb-2">
            Start typing to activate intelligent memory enhancement
          </p>
          <div className="text-xs text-indigo-500">
            {memoryType === 'past' ? 'Reconstructing memories' : 'Planning scenarios'} • {fieldType} field
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCueEngine;