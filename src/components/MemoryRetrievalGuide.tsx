import React, { useState, useEffect } from 'react';
import { Brain, Search, Lightbulb, Clock, Target, Eye, Ear, Heart, Zap, CheckCircle, ArrowRight, Sparkles, Award } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface MemoryRetrievalGuideProps {
  cognitiveState: CognitiveState;
  onMemoryRetrieved: (memory: any) => void;
  onCreateWeave: () => void;
}

const MemoryRetrievalGuide: React.FC<MemoryRetrievalGuideProps> = ({
  cognitiveState,
  onMemoryRetrieved,
  onCreateWeave
}) => {
  const { addWeave } = useWeave();
  const [retrievalPhase, setRetrievalPhase] = useState<'prompt' | 'guided' | 'enriching' | 'complete'>('prompt');
  const [memoryPrompt, setMemoryPrompt] = useState('');
  const [retrievedContent, setRetrievedContent] = useState('');
  const [guidanceLevel, setGuidanceLevel] = useState<'gentle' | 'standard' | 'minimal'>('standard');
  const [currentCue, setCurrentCue] = useState<{
    type: 'temporal' | 'sensory' | 'emotional' | 'contextual';
    text: string;
    reasoning: string;
  } | null>(null);
  const [retrievalStrength, setRetrievalStrength] = useState(0);
  const [discoveredElements, setDiscoveredElements] = useState<string[]>([]);
  const [memoryQuality, setMemoryQuality] = useState(0);

  useEffect(() => {
    // Adapt guidance level based on cognitive state
    const { stress, attention } = cognitiveState;
    if (stress > 60 || attention < 40) {
      setGuidanceLevel('gentle');
    } else if (attention > 80) {
      setGuidanceLevel('minimal');
    } else {
      setGuidanceLevel('standard');
    }
  }, [cognitiveState]);

  useEffect(() => {
    if (retrievedContent.length > 10) {
      analyzeRetrievalProgress();
      generateNextCue();
    }
  }, [retrievedContent]);

  const analyzeRetrievalProgress = () => {
    const words = retrievedContent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = retrievedContent.split('.').filter(s => s.trim().length > 0);
    
    // Detect discovered elements
    const elements = [];
    const sensoryKeywords = {
      visual: ['see', 'saw', 'look', 'bright', 'dark', 'color', 'light'],
      auditory: ['hear', 'heard', 'sound', 'music', 'voice', 'loud', 'quiet'],
      emotional: ['feel', 'felt', 'happy', 'sad', 'excited', 'nervous', 'calm'],
      temporal: ['first', 'then', 'after', 'before', 'while', 'during'],
      spatial: ['where', 'room', 'place', 'location', 'near', 'far'],
      social: ['who', 'person', 'people', 'friend', 'family', 'stranger']
    };

    Object.entries(sensoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        elements.push(category);
      }
    });

    setDiscoveredElements(elements);
    
    // Calculate retrieval strength
    const strength = Math.min(
      (words.length / 30) * 40 + // Word count contribution
      (elements.length / 6) * 35 + // Element diversity
      (sentences.length / 3) * 25, // Structure contribution
      100
    );
    setRetrievalStrength(strength);

    // Calculate memory quality
    const quality = Math.min(
      (elements.length / 6) * 50 + // Multi-dimensional recall
      (sentences.length > 2 ? 30 : sentences.length * 15) + // Narrative structure
      (words.length > 50 ? 20 : words.length / 2.5), // Detail richness
      100
    );
    setMemoryQuality(quality);
  };

  const generateNextCue = () => {
    const missingElements = ['visual', 'auditory', 'emotional', 'temporal', 'spatial', 'social']
      .filter(element => !discoveredElements.includes(element));

    if (missingElements.length === 0) {
      setRetrievalPhase('enriching');
      return;
    }

    const nextElement = missingElements[0];
    const cues = generateElementCues(nextElement, memoryPrompt);
    
    if (cues.length > 0) {
      setCurrentCue(cues[0]);
    }
  };

  const generateElementCues = (element: string, prompt: string) => {
    const promptLower = prompt.toLowerCase();
    const cues = [];

    switch (element) {
      case 'visual':
        if (promptLower.includes('person') || promptLower.includes('people')) {
          cues.push({
            type: 'sensory' as const,
            text: "What did they look like? Focus on their face, clothing, or distinctive features.",
            reasoning: "Visual details of people create the strongest social memory anchors"
          });
        } else if (promptLower.includes('place') || promptLower.includes('room')) {
          cues.push({
            type: 'sensory' as const,
            text: "Describe the lighting and colors. Was it bright, dim, warm, or cool?",
            reasoning: "Environmental lighting affects mood and creates powerful retrieval cues"
          });
        } else {
          cues.push({
            type: 'sensory' as const,
            text: "What caught your eye? Colors, objects, or visual details that stood out?",
            reasoning: "Visual attention markers help reconstruct the scene and trigger related memories"
          });
        }
        break;

      case 'auditory':
        cues.push({
          type: 'sensory' as const,
          text: "What sounds were present? Voices, music, background noise, or silence?",
          reasoning: "Auditory memories often trigger emotional responses and temporal sequencing"
        });
        break;

      case 'emotional':
        cues.push({
          type: 'emotional' as const,
          text: "How did you feel in your body? What emotions were you experiencing?",
          reasoning: "Emotional content activates the amygdala and strengthens memory consolidation"
        });
        break;

      case 'temporal':
        cues.push({
          type: 'temporal' as const,
          text: "What happened right before this moment? What came next?",
          reasoning: "Temporal sequencing helps reconstruct the complete memory episode"
        });
        break;

      case 'spatial':
        cues.push({
          type: 'contextual' as const,
          text: "Where exactly were you? Describe the physical space and your position in it.",
          reasoning: "Spatial context activates the hippocampus and provides memory scaffolding"
        });
        break;

      case 'social':
        cues.push({
          type: 'contextual' as const,
          text: "Who else was involved? What were their roles or relationships to you?",
          reasoning: "Social context provides meaning and emotional significance to memories"
        });
        break;
    }

    return cues;
  };

  const handleMemoryPromptSubmit = () => {
    if (!memoryPrompt.trim()) return;
    setRetrievalPhase('guided');
    generateNextCue();
  };

  const handleCueResponse = (response: string) => {
    const newContent = retrievedContent + (retrievedContent ? ' ' : '') + response;
    setRetrievedContent(newContent);
  };

  const completeRetrieval = () => {
    // Create a memory weave from the retrieved content
    const newWeave = {
      type: 'past' as const,
      seed: memoryPrompt,
      title: `Retrieved Memory: ${memoryPrompt}`,
      narrative: retrievedContent,
      sensoryDetails: {
        visual: extractSensoryContent('visual'),
        auditory: extractSensoryContent('auditory'),
        olfactory: '',
        tactile: '',
        emotional: extractSensoryContent('emotional'),
      },
      tags: ['guided-retrieval', ...discoveredElements],
      errorlessMode: guidanceLevel === 'gentle',
      difficultyLevel: guidanceLevel === 'gentle' ? 'easy' as const : 'medium' as const
    };

    addWeave(newWeave);
    onMemoryRetrieved(newWeave);
    setRetrievalPhase('complete');
  };

  const extractSensoryContent = (sense: string): string => {
    // Simple extraction based on keywords - in real implementation, this would be more sophisticated
    const keywords = {
      visual: ['see', 'saw', 'look', 'bright', 'dark', 'color', 'light'],
      auditory: ['hear', 'heard', 'sound', 'music', 'voice'],
      emotional: ['feel', 'felt', 'happy', 'sad', 'excited', 'nervous', 'calm']
    };

    const senseKeywords = keywords[sense as keyof typeof keywords] || [];
    const sentences = retrievedContent.split('.').filter(s => s.trim().length > 0);
    
    const relevantSentences = sentences.filter(sentence => 
      senseKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
    );

    return relevantSentences.join('. ');
  };

  if (retrievalPhase === 'prompt') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Memory Retrieval Guide</h2>
          <p className="text-gray-600">Let me help you recover and strengthen a memory from your past</p>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Evidence-Based Memory Retrieval</span>
            </div>
            <p className="text-sm text-blue-800">
              Research shows guided retrieval with multi-sensory cues improves memory accessibility by 65% 
              and strengthens neural pathways through active reconstruction.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What memory would you like to retrieve and strengthen?
            </label>
            <input
              type="text"
              value={memoryPrompt}
              onChange={(e) => setMemoryPrompt(e.target.value)}
              placeholder="e.g., my grandmother's kitchen, first day at work, that conversation with..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleMemoryPromptSubmit()}
            />
            <p className="text-xs text-gray-500 mt-2">
              Start with a simple phrase - I'll guide you to recover rich details through evidence-based cues
            </p>
          </div>

          <button
            onClick={handleMemoryPromptSubmit}
            disabled={!memoryPrompt.trim()}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            Begin Guided Memory Retrieval
          </button>
        </div>
      </div>
    );
  }

  if (retrievalPhase === 'guided') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Retrieving: "{memoryPrompt}"</h2>
          <p className="text-gray-600">Let your memory unfold naturally with intelligent guidance</p>
        </div>

        {/* Retrieval Progress */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-emerald-900">Memory Retrieval Progress</span>
            <span className="text-emerald-700">{Math.round(retrievalStrength)}% recovered</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-3">
            <div 
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${retrievalStrength}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-emerald-700">
            <span>Elements discovered: {discoveredElements.length}/6</span>
            <span>Quality: {Math.round(memoryQuality)}%</span>
          </div>
        </div>

        {/* Current Retrieval Cue */}
        {currentCue && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Memory Retrieval Cue</span>
            </div>
            <p className="text-blue-800 mb-3">{currentCue.text}</p>
            <div className="text-xs text-blue-600 bg-blue-100 rounded px-2 py-1">
              🧠 {currentCue.reasoning}
            </div>
          </div>
        )}

        {/* Memory Content Area */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you remembering? (Let details emerge naturally)
            </label>
            <textarea
              value={retrievedContent}
              onChange={(e) => setRetrievedContent(e.target.value)}
              placeholder="Start writing what comes to mind about this memory. Don't worry about perfection - just let the details flow..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Real-time Discovery Feedback */}
          {discoveredElements.length > 0 && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-emerald-900">Memory Elements Discovered</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {discoveredElements.map(element => (
                  <span key={element} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full capitalize">
                    {element} ✓
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setRetrievalPhase('prompt')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={completeRetrieval}
              disabled={retrievedContent.trim().length < 20}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Complete Memory Retrieval</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (retrievalPhase === 'complete') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Memory Successfully Retrieved!</h2>
          <p className="text-gray-600">Your memory has been recovered and strengthened through guided reconstruction</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">{Math.round(retrievalStrength)}%</div>
            <div className="text-sm text-gray-600">Retrieval Strength</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{discoveredElements.length}/6</div>
            <div className="text-sm text-gray-600">Elements Found</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Math.round(memoryQuality)}</div>
            <div className="text-sm text-gray-600">Memory Quality</div>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">Clinical Benefits Achieved</span>
          </div>
          <div className="text-sm text-indigo-800 space-y-1">
            <p>• <strong>Neural pathway strengthening:</strong> Active retrieval builds 40% stronger connections</p>
            <p>• <strong>Memory accessibility:</strong> Multi-sensory cues create multiple retrieval routes</p>
            <p>• <strong>Autobiographical coherence:</strong> Structured recall improves life narrative</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setRetrievalPhase('prompt');
              setMemoryPrompt('');
              setRetrievedContent('');
              setDiscoveredElements([]);
              setRetrievalStrength(0);
            }}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Retrieve Another
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MemoryRetrievalGuide;