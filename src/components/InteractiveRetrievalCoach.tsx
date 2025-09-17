import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, CheckCircle, ArrowRight, Clock, Zap, TrendingUp, Award, Eye, Ear, Heart } from 'lucide-react';

interface InteractiveRetrievalCoachProps {
  weave: any;
  userResponse: string;
  onHintRequest: () => void;
  onEncouragement: (message: string) => void;
}

const InteractiveRetrievalCoach: React.FC<InteractiveRetrievalCoachProps> = ({
  weave,
  userResponse,
  onHintRequest,
  onEncouragement
}) => {
  const [coachingState, setCoachingState] = useState<'observing' | 'encouraging' | 'hinting' | 'celebrating'>('observing');
  const [encouragementMessages, setEncouragementMessages] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [responseAnalysis, setResponseAnalysis] = useState<{
    wordCount: number;
    detailLevel: 'low' | 'medium' | 'high';
    sensoryElements: string[];
    missingElements: string[];
    coherenceScore: number;
    emotionalDepth: number;
    temporalStructure: number;
  } | null>(null);
  const [realTimeHints, setRealTimeHints] = useState<string[]>([]);
  const [progressMetrics, setProgressMetrics] = useState({
    completeness: 0,
    accuracy: 0,
    richness: 0
  });

  // Enhanced real-time analysis
  useEffect(() => {
    if (userResponse.length < 5) {
      setResponseAnalysis(null);
      setCoachingState('observing');
      setRealTimeHints([]);
      return;
    }

    const words = userResponse.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = userResponse.split('.').filter(s => s.trim().length > 0);
    const wordCount = words.length;
    
    // Enhanced sensory detection
    const sensoryKeywords = {
      visual: ['see', 'saw', 'look', 'bright', 'dark', 'color', 'light', 'shadow', 'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'white', 'black', 'shiny', 'dull', 'clear', 'blurry'],
      auditory: ['hear', 'heard', 'sound', 'noise', 'music', 'voice', 'loud', 'quiet', 'whisper', 'shout', 'ring', 'buzz', 'hum', 'click', 'bang', 'silence'],
      olfactory: ['smell', 'scent', 'aroma', 'fragrance', 'odor', 'fresh', 'sweet', 'sour', 'bitter', 'perfume', 'cologne', 'smoke', 'flowers'],
      tactile: ['feel', 'felt', 'touch', 'warm', 'cold', 'soft', 'rough', 'smooth', 'hard', 'wet', 'dry', 'sticky', 'slippery', 'sharp', 'dull'],
      emotional: ['happy', 'sad', 'excited', 'nervous', 'calm', 'angry', 'joy', 'fear', 'love', 'hate', 'surprised', 'confused', 'confident', 'worried']
    };

    const foundElements = [];
    const missingElements = [];

    Object.entries(sensoryKeywords).forEach(([sense, keywords]) => {
      const hasElement = keywords.some(keyword => words.some(word => word.includes(keyword)));
      if (hasElement) {
        foundElements.push(sense);
      } else {
        missingElements.push(sense);
      }
    });

    // Calculate advanced metrics
    const detailLevel = wordCount < 15 ? 'low' : wordCount < 40 ? 'medium' : 'high';
    
    // Coherence scoring based on narrative structure
    const coherenceScore = calculateCoherenceScore(userResponse, sentences);
    
    // Emotional depth analysis
    const emotionalDepth = calculateEmotionalDepth(words, sensoryKeywords.emotional);
    
    // Temporal structure analysis
    const temporalStructure = calculateTemporalStructure(userResponse);

    const analysis = {
      wordCount,
      detailLevel,
      sensoryElements: foundElements,
      missingElements,
      coherenceScore,
      emotionalDepth,
      temporalStructure
    };

    setResponseAnalysis(analysis);

    // Generate real-time hints
    generateRealTimeHints(analysis);

    // Update progress metrics
    setProgressMetrics({
      completeness: (foundElements.length / 5) * 100,
      accuracy: calculateAccuracy(userResponse, weave),
      richness: (wordCount / 50) * 100
    });

    // Update coaching state
    updateCoachingState(analysis);
  }, [userResponse, weave]);

  const calculateCoherenceScore = (text: string, sentences: string[]) => {
    let score = 0;
    
    // Sentence structure (up to 30 points)
    if (sentences.length >= 3) score += 30;
    else if (sentences.length >= 2) score += 20;
    else score += 10;
    
    // Temporal markers (up to 25 points)
    const temporalMarkers = ['first', 'then', 'next', 'after', 'before', 'while', 'during', 'finally'];
    const temporalCount = temporalMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    score += Math.min(temporalCount * 5, 25);
    
    // Causal connections (up to 25 points)
    const causalMarkers = ['because', 'since', 'so', 'therefore', 'as a result', 'due to'];
    const causalCount = causalMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    score += Math.min(causalCount * 8, 25);
    
    // Detail richness (up to 20 points)
    const detailMarkers = ['specifically', 'exactly', 'particularly', 'especially', 'precisely'];
    const detailCount = detailMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    score += Math.min(detailCount * 5, 20);
    
    return Math.min(score, 100);
  };

  const calculateEmotionalDepth = (words: string[], emotionalKeywords: string[]) => {
    const emotionalWords = words.filter(word => 
      emotionalKeywords.some(keyword => word.includes(keyword))
    );
    return Math.min((emotionalWords.length / words.length) * 100, 100);
  };

  const calculateTemporalStructure = (text: string) => {
    const temporalMarkers = ['first', 'then', 'next', 'after', 'before', 'while', 'during', 'finally', 'eventually', 'suddenly'];
    const markerCount = temporalMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    return Math.min((markerCount / 3) * 100, 100);
  };

  const calculateAccuracy = (response: string, originalWeave: any) => {
    if (!originalWeave?.narrative) return 0;
    
    const responseWords = response.toLowerCase().split(/\s+/);
    const originalWords = originalWeave.narrative.toLowerCase().split(/\s+/);
    
    const matchingConcepts = responseWords.filter(word => 
      word.length > 3 && originalWords.some(origWord => 
        origWord.includes(word) || word.includes(origWord)
      )
    );
    
    return Math.min((matchingConcepts.length / responseWords.length) * 100, 100);
  };

  const generateRealTimeHints = (analysis: typeof responseAnalysis) => {
    const hints = [];
    
    // Contextual hints based on what's missing
    if (analysis?.missingElements.includes('visual')) {
      hints.push("🎨 Visual: What colors, lighting, or objects do you remember seeing?");
    }
    if (analysis?.missingElements.includes('auditory')) {
      hints.push("🔊 Audio: What sounds, voices, or music filled the space?");
    }
    if (analysis?.missingElements.includes('emotional')) {
      hints.push("💝 Emotion: How did you feel in your body and heart during this moment?");
    }
    if (analysis?.missingElements.includes('tactile')) {
      hints.push("✋ Touch: What textures, temperatures, or physical sensations do you recall?");
    }
    if (analysis?.missingElements.includes('olfactory')) {
      hints.push("👃 Scent: Were there any distinctive smells or aromas present?");
    }

    // Structure hints
    if (analysis?.coherenceScore < 50) {
      hints.push("🔗 Structure: Try connecting your details with 'then', 'because', or 'while'");
    }
    
    // Depth hints
    if (analysis?.wordCount > 10 && analysis?.emotionalDepth < 20) {
      hints.push("💭 Depth: Add how this experience made you feel emotionally");
    }

    setRealTimeHints(hints.slice(0, 3));
  };

  const updateCoachingState = (analysis: typeof responseAnalysis) => {
    if (!analysis) return;
    
    if (analysis.wordCount < 10) {
      setCoachingState('encouraging');
    } else if (analysis.sensoryElements.length < 2 || analysis.coherenceScore < 60) {
      setCoachingState('hinting');
    } else {
      setCoachingState('celebrating');
    }
  };

  // Generate contextual encouragement
  useEffect(() => {
    if (!responseAnalysis) return;

    const messages = [];
    
    // Progress-based encouragement
    if (responseAnalysis.detailLevel === 'low') {
      messages.push("Great start! Your memory is beginning to take shape.");
      messages.push("You're building momentum - keep adding details as they come to you.");
      messages.push("Nice foundation! What other aspects of this moment stand out?");
    } else if (responseAnalysis.detailLevel === 'medium') {
      messages.push("Excellent progress! Your memory is becoming more vivid with each detail.");
      messages.push("Wonderful work! The sensory elements are really bringing this to life.");
      messages.push("You're creating a rich, multi-dimensional memory reconstruction.");
    } else {
      messages.push("Outstanding! This level of detail will make retrieval incredibly strong.");
      messages.push("Exceptional recall! Your multi-sensory approach is working perfectly.");
      messages.push("Incredible work! This memory will be easily accessible in the future.");
    }

    // Specific sensory encouragement
    if (responseAnalysis.sensoryElements.length > 0) {
      messages.push(`Love how you included ${responseAnalysis.sensoryElements.join(', ')} details! This creates multiple retrieval pathways.`);
    }

    // Coherence encouragement
    if (responseAnalysis.coherenceScore > 70) {
      messages.push("Your narrative structure is excellent - clear connections between events!");
    }

    setEncouragementMessages(messages);
  }, [responseAnalysis]);

  const generateContextualHints = () => {
    const hints = [];
    
    if (!responseAnalysis) return hints;

    // Progressive, intelligent hints
    if (responseAnalysis.missingElements.includes('visual')) {
      hints.push("Visual details anchor memories strongly. What did you see that was distinctive or memorable?");
    }
    if (responseAnalysis.missingElements.includes('auditory')) {
      hints.push("Sound creates powerful memory triggers. What audio elements were present?");
    }
    if (responseAnalysis.missingElements.includes('emotional')) {
      hints.push("Emotions are the strongest memory enhancers. How did your body and mind feel?");
    }

    // Advanced coaching hints
    if (responseAnalysis.coherenceScore < 50) {
      hints.push("Try organizing your memory chronologically: What happened first, then next?");
    }
    
    if (responseAnalysis.wordCount > 20 && responseAnalysis.temporalStructure < 30) {
      hints.push("Add time markers like 'first', 'then', 'after that' to create a clear sequence.");
    }

    return hints;
  };

  const getRandomEncouragement = () => {
    if (encouragementMessages.length === 0) return "Keep building your memory!";
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  };

  const handleSmartHint = () => {
    const hints = generateContextualHints();
    if (hints.length > hintLevel) {
      onEncouragement(hints[hintLevel]);
      setHintLevel(prev => prev + 1);
    } else {
      onEncouragement("You're doing wonderfully! Trust your memory and let details emerge naturally.");
    }
    onHintRequest();
  };

  const renderCoachingPanel = () => {
    switch (coachingState) {
      case 'encouraging':
        return (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Building Momentum</span>
            </div>
            <p className="text-amber-800 text-sm mb-3">
              {getRandomEncouragement()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleSmartHint}
                className="flex items-center space-x-1 px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Smart hint</span>
              </button>
              <button
                onClick={() => onEncouragement("You're on the right track! Every detail you add strengthens this memory.")}
                className="px-3 py-1.5 border border-amber-300 text-amber-700 text-sm rounded-lg hover:bg-amber-100 transition-colors"
              >
                Encourage me
              </button>
            </div>
          </div>
        );

      case 'hinting':
        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Sensory Enhancement Mode</span>
            </div>
            <p className="text-blue-800 text-sm mb-3">
              Great foundation! Let's add some {responseAnalysis?.missingElements[0]} elements to make it even more vivid.
            </p>
            
            {realTimeHints.length > 0 && (
              <div className="mb-3 space-y-1">
                {realTimeHints.map((hint, index) => (
                  <div key={index} className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
                    {hint}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={handleSmartHint}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-3 h-3" />
                <span>Specific guidance</span>
              </button>
              <button
                onClick={() => onEncouragement("Your memory is becoming richer with each detail you add!")}
                className="px-3 py-1.5 border border-blue-300 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
              >
                Keep going
              </button>
            </div>
          </div>
        );

      case 'celebrating':
        return (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">Excellent Memory Work!</span>
            </div>
            <p className="text-emerald-800 text-sm mb-3">
              {getRandomEncouragement()}
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs text-emerald-700">
              <div className="text-center">
                <div className="font-bold text-emerald-600">✓ {responseAnalysis?.sensoryElements.length}/5</div>
                <div>Senses engaged</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-emerald-600">{responseAnalysis?.coherenceScore}%</div>
                <div>Coherence</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-emerald-600">{responseAnalysis?.wordCount}</div>
                <div>Words</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">AI Coach Ready</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Start writing your memory and I'll provide real-time guidance and intelligent suggestions.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>Visual analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <Ear className="w-3 h-3" />
                <span>Audio detection</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>Emotional depth</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderCoachingPanel()}
      
      {/* Advanced Analytics Dashboard */}
      {responseAnalysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Real-Time Memory Analysis</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <TrendingUp className="w-3 h-3" />
              <span>Live feedback</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-xl font-bold text-indigo-600">{responseAnalysis.wordCount}</div>
              <div className="text-xs text-gray-600">Words</div>
              <div className="text-xs text-indigo-600 mt-1 capitalize">{responseAnalysis.detailLevel} detail</div>
            </div>
            
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-xl font-bold text-emerald-600">{responseAnalysis.sensoryElements.length}/5</div>
              <div className="text-xs text-gray-600">Senses</div>
              <div className="text-xs text-emerald-600 mt-1">
                {Math.round((responseAnalysis.sensoryElements.length / 5) * 100)}% complete
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{responseAnalysis.coherenceScore}</div>
              <div className="text-xs text-gray-600">Coherence</div>
              <div className="text-xs text-orange-600 mt-1">
                {responseAnalysis.coherenceScore > 70 ? 'Excellent' : responseAnalysis.coherenceScore > 50 ? 'Good' : 'Building'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{Math.round(responseAnalysis.emotionalDepth)}</div>
              <div className="text-xs text-gray-600">Emotional Depth</div>
              <div className="text-xs text-purple-600 mt-1">
                {responseAnalysis.emotionalDepth > 15 ? 'Rich' : responseAnalysis.emotionalDepth > 5 ? 'Moderate' : 'Light'}
              </div>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="mt-4 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Completeness</span>
                <span>{Math.round(progressMetrics.completeness)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressMetrics.completeness}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Accuracy</span>
                <span>{Math.round(progressMetrics.accuracy)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressMetrics.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Suggestions Panel */}
      {realTimeHints.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-900">Smart Suggestions</span>
          </div>
          <div className="space-y-2">
            {realTimeHints.map((hint, index) => (
              <button
                key={index}
                onClick={() => onEncouragement(hint)}
                className="w-full text-left p-2 bg-white border border-yellow-200 rounded text-sm text-gray-700 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveRetrievalCoach;