import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Eye, Ear, DoorClosed as Nose, Hand, Heart, Save, Wand2, Music, Palette, HelpCircle, Brain, Lightbulb } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import CueLibrary from './CueLibrary';
import BridgeBack from './BridgeBack';
import InteractiveCueEngine from './InteractiveCueEngine';
import SmartNarrativeBuilder from './SmartNarrativeBuilder';
import LiveMemoryAnalyzer from './LiveMemoryAnalyzer';
import ContextualHintEngine from './ContextualHintEngine';
import SimplifiedWeaveFlow from './SimplifiedWeaveFlow';
import AdaptiveMemoryCoach from './AdaptiveMemoryCoach';
import PerfectMemoryFlow from './PerfectMemoryFlow';
import NeuralNetworkVisualizer from './NeuralNetworkVisualizer';
import CognitiveStateOptimizer from './CognitiveStateOptimizer';
import QuantumMemoryEngine from './QuantumMemoryEngine';
import EmotionalResonanceEngine from './EmotionalResonanceEngine';
import PredictiveMemoryAnalytics from './PredictiveMemoryAnalytics';

interface WeaveCanvasProps {
  onBack: () => void;
}

const WeaveCanvas: React.FC<WeaveCanvasProps> = ({ onBack }) => {
  const { addWeave } = useWeave();
  const [step, setStep] = useState(1);
  const [weaveType, setWeaveType] = useState<'past' | 'future'>('past');
  const [seed, setSeed] = useState('');
  const [title, setTitle] = useState('');
  const [errorlessMode, setErrorlessMode] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sensoryDetails, setSensoryDetails] = useState({
    visual: '',
    auditory: '',
    olfactory: '',
    tactile: '',
    emotional: '',
  });
  const [narrative, setNarrative] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showCueLibrary, setShowCueLibrary] = useState(false);
  const [showBridgeBack, setShowBridgeBack] = useState(false);
  const [tempWeaveId, setTempWeaveId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [showLiveAnalyzer, setShowLiveAnalyzer] = useState(true);
  const [showContextualHints, setShowContextualHints] = useState(true);
  const [aiInteractionCount, setAiInteractionCount] = useState(0);
  const [useSimplifiedFlow, setUseSimplifiedFlow] = useState(true);
  const [tempCues, setTempCues] = useState<any>({});
  const [tempBridgeData, setTempBridgeData] = useState<any>({
    factualAnchors: [],
    peopleInvolved: [],
  });
  const [userMemoryHistory, setUserMemoryHistory] = useState<any[]>([]);
  const [usePerfectFlow, setUsePerfectFlow] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [neuralNetworkStrength, setNeuralNetworkStrength] = useState(0);
  const [cognitiveOptimization, setCognitiveOptimization] = useState<any>(null);
  const [quantumEnhancement, setQuantumEnhancement] = useState<any>(null);
  const [emotionalResonance, setEmotionalResonance] = useState<any>(null);
  const [memoryPredictions, setMemoryPredictions] = useState<any>(null);

  // Load user history for adaptive coaching
  useEffect(() => {
    const savedWeaves = localStorage.getItem('eidolon-weaves');
    if (savedWeaves) {
      const weaves = JSON.parse(savedWeaves);
      setUserMemoryHistory(weaves.slice(0, 10)); // Last 10 memories for pattern analysis
    }
  }, []);

  const sensoryPrompts = {
    visual: [
      "What colors dominated the scene?",
      "Describe the lighting - bright, dim, warm, cool?",
      "What objects or people were most prominent?",
      "How did shadows fall? What textures were visible?",
    ],
    auditory: [
      "What sounds filled the space?",
      "Was there music, conversation, or ambient noise?",
      "How did voices sound - loud, whispered, echoing?",
      "What sounds were in the background?",
    ],
    olfactory: [
      "What scents were present?",
      "Did you smell food, perfume, nature, or something else?",
      "Was the air fresh, stale, or filled with a particular aroma?",
      "How did the smell make you feel?",
    ],
    tactile: [
      "What did you touch or what touched you?",
      "Was it warm, cool, rough, smooth?",
      "How did your clothes feel against your skin?",
      "What was the temperature like?",
    ],
    emotional: [
      "What emotions were you experiencing?",
      "How did your body feel - tense, relaxed, energized?",
      "What was the overall mood or atmosphere?",
      "How did others around you seem to feel?",
    ],
  };

  const generateNarrative = () => {
    // Simple AI-like narrative generation based on inputs
    const details = Object.values(sensoryDetails).filter(d => d.length > 0);
    if (details.length === 0) return;

    const templates = weaveType === 'past' ? [
      `I remember ${seed}. ${sensoryDetails.visual ? `The scene was filled with ${sensoryDetails.visual.toLowerCase()}.` : ''} ${sensoryDetails.auditory ? `I could hear ${sensoryDetails.auditory.toLowerCase()}.` : ''} ${sensoryDetails.olfactory ? `The air carried the scent of ${sensoryDetails.olfactory.toLowerCase()}.` : ''} ${sensoryDetails.tactile ? `Everything felt ${sensoryDetails.tactile.toLowerCase()}.` : ''} ${sensoryDetails.emotional ? `The whole experience left me feeling ${sensoryDetails.emotional.toLowerCase()}.` : ''} This memory stays with me because of how all these elements came together in that moment.`,
    ] : [
      `I'm preparing for ${seed}. ${sensoryDetails.visual ? `I imagine the setting will have ${sensoryDetails.visual.toLowerCase()}.` : ''} ${sensoryDetails.auditory ? `I expect to hear ${sensoryDetails.auditory.toLowerCase()}.` : ''} ${sensoryDetails.olfactory ? `The environment might smell of ${sensoryDetails.olfactory.toLowerCase()}.` : ''} ${sensoryDetails.tactile ? `I anticipate everything will feel ${sensoryDetails.tactile.toLowerCase()}.` : ''} ${sensoryDetails.emotional ? `I want to approach this feeling ${sensoryDetails.emotional.toLowerCase()}.` : ''} By rehearsing these details, I'm building confidence for when the moment arrives.`,
    ];

    setNarrative(templates[0].replace(/\s+/g, ' ').trim());
  };

  const handleSuggestionAccept = (suggestion: string, type: keyof typeof sensoryDetails) => {
    const currentValue = sensoryDetails[type];
    const newValue = currentValue 
      ? `${currentValue} ${suggestion}` 
      : suggestion;
    handleSensoryChange(type, newValue);
  };
  const handleSensoryChange = (sense: keyof typeof sensoryDetails, value: string) => {
    setSensoryDetails(prev => ({ ...prev, [sense]: value }));
    setActiveField(sense);
  };

  const handleSave = () => {
    if (!seed || !title) return;

    const newWeave = {
      type: weaveType,
      seed,
      title,
      narrative,
      sensoryDetails,
      tags,
      errorlessMode,
      difficultyLevel,
      ifThenPlans: weaveType === 'future' ? [] : undefined,
      scheduledFor: weaveType === 'future' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined, // Default to 1 week from now
      completed: false,
      cues: tempCues,
      bridgeData: tempBridgeData,
    };

    addWeave(newWeave);
    
    // Show success message
    alert(`${weaveType === 'past' ? 'Memory weave' : 'Future scenario'} "${title}" has been saved successfully!`);
    onBack();
  };

  // If using simplified flow, render that instead
  if (useSimplifiedFlow) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setUseSimplifiedFlow(false)}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Advanced Mode
            </button>
            <button
              onClick={() => setUsePerfectFlow(true)}
              className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Perfect Flow
            </button>
            <button
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              className="px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              🧠 Quantum Mode
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create Memory Weave</h1>
          </div>
        </div>
        
        {usePerfectFlow ? (
          <PerfectMemoryFlow
            onComplete={(weave) => {
              console.log('Perfect weave completed:', weave);
              onBack();
            }}
            onCancel={onBack}
          />
        ) : showAdvancedFeatures ? (
          <div className="space-y-8">
            {/* Cognitive State Optimizer */}
            <CognitiveStateOptimizer
              onStateChange={setCognitiveOptimization}
              onOptimizationRecommendation={(rec) => {
                console.log('Optimization recommendation:', rec);
              }}
            />
            
            {/* Neural Network Visualizer */}
            <NeuralNetworkVisualizer
              memoryData={{
                visual: sensoryDetails.visual,
                auditory: sensoryDetails.auditory,
                emotional: sensoryDetails.emotional,
                narrative: narrative
              }}
              onNetworkStrength={setNeuralNetworkStrength}
            />
            
            {/* Quantum Memory Engine */}
            <QuantumMemoryEngine
              memoryData={sensoryDetails}
              onQuantumEnhancement={setQuantumEnhancement}
            />
            
            {/* Emotional Resonance Engine */}
            <EmotionalResonanceEngine
              emotionalContent={sensoryDetails.emotional}
              onResonanceDetected={setEmotionalResonance}
            />
            
            {/* Predictive Memory Analytics */}
            <PredictiveMemoryAnalytics
              memoryData={{ ...sensoryDetails, narrative, seed }}
              userHistory={userMemoryHistory}
              onPrediction={setMemoryPredictions}
              onPatternDetected={(pattern) => {
                console.log('Cognitive pattern detected:', pattern);
              }}
            />
            
            {/* Enhanced Save Button */}
            <div className="text-center">
              <button
                onClick={handleSave}
                disabled={!seed || !title}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg font-medium shadow-lg"
              >
                🧠 Save Quantum-Enhanced Memory
              </button>
              {neuralNetworkStrength > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Neural network strength: {neuralNetworkStrength.toFixed(0)}% | 
                  Predicted retrieval success: {memoryPredictions?.retrievalSuccess?.toFixed(0) || 0}%
                </p>
              )}
            </div>
          </div>
        ) : (
          <SimplifiedWeaveFlow
            onComplete={(weave) => {
              console.log('Weave completed:', weave);
              onBack();
            }}
            onCancel={onBack}
          />
        )}
      </div>
    );
  }
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Weave Type</h2>
              <p className="text-gray-600">Are you reconstructing a past memory or rehearsing a future scenario?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setWeaveType('past')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  weaveType === 'past'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Past Memory</h3>
                  <p className="text-sm text-gray-600">Reconstruct and enrich a memory from your past</p>
                </div>
              </button>
              
              <button
                onClick={() => setWeaveType('future')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  weaveType === 'future'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Future Scenario</h3>
                  <p className="text-sm text-gray-600">Rehearse and prepare for an upcoming event</p>
                </div>
              </button>
            </div>
            
            <div className="text-center mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={!weaveType}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue with {weaveType === 'past' ? 'Past Memory' : 'Future Scenario'}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plant Your Seed</h2>
              <p className="text-gray-600">
                Start with a simple word, phrase, or feeling that captures the essence of your {weaveType === 'past' ? 'memory' : 'scenario'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Memory Seed
                </label>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={weaveType === 'past' ? 'e.g., "grandmother\'s kitchen", "first day at work"' : 'e.g., "job interview", "family dinner"'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your weave a memorable title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              {/* Training Options */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Training Options</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficultyLevel(level)}
                        className={`p-2 text-sm rounded-lg transition-colors ${
                          difficultyLevel === level
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="errorless"
                    checked={errorlessMode}
                    onChange={(e) => setErrorlessMode(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="errorless" className="text-sm text-gray-700">
                    Enable errorless learning mode (gentle hints instead of guessing)
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expand Your Senses</h2>
              <p className="text-gray-600">
                Build rich, multi-sensory details around "{seed}"
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(sensoryPrompts).map(([sense, prompts]) => {
                const icons = {
                  visual: Eye,
                  auditory: Ear,
                  olfactory: Nose,
                  tactile: Hand,
                  emotional: Heart,
                };
                const Icon = icons[sense as keyof typeof icons];
                const colors = {
                  visual: 'indigo',
                  auditory: 'emerald',
                  olfactory: 'orange',
                  tactile: 'purple',
                  emotional: 'pink',
                };
                const color = colors[sense as keyof typeof colors];
                
                return (
                  <div key={sense} className={`bg-white p-6 rounded-xl border-2 transition-all ${
                    activeField === sense 
                      ? `border-${color}-300 shadow-lg` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{sense}</h3>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {prompts.map((prompt, index) => (
                        <p key={index} className="text-sm text-gray-600">• {prompt}</p>
                      ))}
                    </div>
                    
                    <textarea
                      value={sensoryDetails[sense as keyof typeof sensoryDetails]}
                      onChange={(e) => {
                        handleSensoryChange(sense as keyof typeof sensoryDetails, e.target.value);
                        setActiveField(sense);
                      }}
                      onFocus={() => setActiveField(sense)}
                      placeholder={`Describe the ${sense} aspects...`}
                      rows={4}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent resize-none transition-all`}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* AI Assistant Toggle */}
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showAIAssistant 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Cue Assistant</span>
                </button>
                
                <button
                  onClick={() => setShowLiveAnalyzer(!showLiveAnalyzer)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showLiveAnalyzer 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Live Analyzer</span>
                </button>
                
                <button
                  onClick={() => setShowContextualHints(!showContextualHints)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showContextualHints 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Context Hints</span>
                </button>
                
                {aiInteractionCount > 0 && (
                  <div className="text-xs text-gray-500">
                    {aiInteractionCount} AI interactions
                  </div>
                )}
              </div>
            </div>
            
            {/* Interactive Cue Engine */}
            {showAIAssistant && activeField && (
              <div className="mt-6">
                <AdaptiveMemoryCoach
                  currentText={sensoryDetails[activeField as keyof typeof sensoryDetails]}
                  memoryType={weaveType}
                  fieldType={activeField}
                  userHistory={userMemoryHistory}
                  onSuggestion={(suggestion, confidence, reasoning) => {
                    handleSuggestionAccept(suggestion, activeField as keyof typeof sensoryDetails);
                    setAiInteractionCount(prev => prev + 1);
                  }}
                  onPatternInsight={(insight) => {
                    console.log('Pattern insight:', insight);
                  }}
                />
              </div>
            )}
            
            {/* Live Memory Analyzer */}
            {showLiveAnalyzer && Object.values(sensoryDetails).some(d => d.length > 10) && (
              <div className="mt-6">
                <LiveMemoryAnalyzer
                  text={Object.values(sensoryDetails).join(' ')}
                  isActive={showLiveAnalyzer}
                  onSuggestion={(suggestion, type) => {
                    onEncouragement?.(suggestion);
                    setAiInteractionCount(prev => prev + 1);
                  }}
                  memoryType={weaveType}
                />
              </div>
            )}
            
            {/* Contextual Hint Engine */}
            {showContextualHints && (
              <div className="mt-6">
                <ContextualHintEngine
                  currentText={Object.values(sensoryDetails).join(' ') + ' ' + narrative}
                  memoryType={weaveType}
                  onHintSelect={(hint, category) => {
                    onEncouragement?.(hint);
                    setAiInteractionCount(prev => prev + 1);
                  }}
                  isActive={showContextualHints}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Weave Your Narrative</h2>
              <p className="text-gray-600">
                Create a coherent story from your sensory details
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Story</h3>
                <button
                  onClick={generateNarrative}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Draft</span>
                </button>
              </div>
              
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Write your narrative here, or use the Generate Draft button to create one from your sensory details..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-4">💡 <strong>Narrative Tips:</strong> Include temporal order, causal connections, and specific details that make the memory vivid and personal.</p>
              </div>
              
              {/* Smart Narrative Builder */}
              {showAIAssistant && (
                <div className="mt-6">
                  <SmartNarrativeBuilder
                    seed={seed}
                    sensoryDetails={sensoryDetails}
                    currentNarrative={narrative}
                    onNarrativeUpdate={setNarrative}
                    memoryType={weaveType}
                  />
                </div>
              )}
            </div>
            
            {/* Enhancement Tools */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setShowCueLibrary(true);
                }}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <Music className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Add Sensory Cues</span>
              </button>
              
              <button
                onClick={() => {
                  setShowBridgeBack(true);
                }}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <Palette className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Add Factual Anchors</span>
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Enhance your memory with multi-sensory cues and factual anchors for stronger recall
              </p>
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Music className="w-3 h-3" />
                  <span>Audio cues</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Palette className="w-3 h-3" />
                  <span>Color palettes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Factual anchors</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step
                    ? 'bg-indigo-600 text-white'
                    : stepNum < step
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1) ||
              (step === 2 && (!seed || !title)) ||
              (step === 3 && Object.values(sensoryDetails).every(d => d.length === 0))
            }
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!narrative}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Weave</span>
          </button>
        )}
      </div>
      
      {/* Modals */}
      {showCueLibrary && (
        <TempCueLibrary
          cues={tempCues}
          onCuesUpdate={setTempCues}
          onClose={() => setShowCueLibrary(false)}
        />
      )}
      
      {showBridgeBack && (
        <TempBridgeBack
          bridgeData={tempBridgeData}
          onBridgeDataUpdate={setTempBridgeData}
          weaveTitle={title}
          weaveSeed={seed}
          weaveNarrative={narrative}
          onClose={() => setShowBridgeBack(false)}
        />
      )}
    </div>
  );
};

// Temporary Cue Library component for weave creation
const TempCueLibrary: React.FC<{
  cues: any;
  onCuesUpdate: (cues: any) => void;
  onClose: () => void;
}> = ({ cues, onCuesUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'music' | 'colors' | 'scents' | 'location'>('music');

  const updateCues = (newCues: Partial<typeof cues>) => {
    onCuesUpdate({ ...cues, ...newCues });
  };

  const colorPalettes = [
    { name: 'Warm Sunset', colors: ['#FF6B6B', '#FFE66D', '#FF8E53', '#C7CEEA'] },
    { name: 'Ocean Breeze', colors: ['#4ECDC4', '#44A08D', '#096DD9', '#B8E6B8'] },
    { name: 'Forest Walk', colors: ['#52C41A', '#73D13D', '#95DE64', '#D9F7BE'] },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'music':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music or Ambient Sound
              </label>
              <input
                type="text"
                value={cues.music || ''}
                onChange={(e) => updateCues({ music: e.target.value })}
                placeholder="Enter song name or ambient sound"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      case 'colors':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palettes</h4>
            <div className="space-y-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => updateCues({ colors: palette.colors })}
                  className="w-full p-3 border rounded-lg transition-colors border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{palette.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={cues.location?.name || ''}
                onChange={(e) => updateCues({ 
                  location: { ...cues.location, name: e.target.value } 
                })}
                placeholder="e.g., Central Park, Mom's Kitchen"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Sensory Cues</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'music', label: 'Music & Sound' },
            { id: 'colors', label: 'Colors' },
            { id: 'location', label: 'Location' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {renderTabContent()}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Cues
          </button>
        </div>
      </div>
    </div>
  );
};

// Temporary Bridge Back component for weave creation
const TempBridgeBack: React.FC<{
  bridgeData: any;
  onBridgeDataUpdate: (data: any) => void;
  weaveTitle: string;
  weaveSeed: string;
  weaveNarrative: string;
  onClose: () => void;
}> = ({ bridgeData, onBridgeDataUpdate, weaveTitle, weaveSeed, weaveNarrative, onClose }) => {
  const [newFactualAnchor, setNewFactualAnchor] = useState('');

  const updateBridgeData = (newData: Partial<typeof bridgeData>) => {
    onBridgeDataUpdate({ ...bridgeData, ...newData });
  };

  const addFactualAnchor = () => {
    if (!newFactualAnchor.trim()) return;
    updateBridgeData({
      factualAnchors: [...(bridgeData.factualAnchors || []), newFactualAnchor.trim()]
    });
    setNewFactualAnchor('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Factual Anchors</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{weaveTitle}</h3>
            <p className="text-sm text-gray-600">Seed: "{weaveSeed}"</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Factual Anchors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add objective facts that can be verified - dates, locations, people, events.
            </p>
            
            <div className="space-y-3">
              {(bridgeData.factualAnchors || []).map((anchor: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-900">{anchor}</span>
                  <button
                    onClick={() => updateBridgeData({
                      factualAnchors: bridgeData.factualAnchors.filter((_: any, i: number) => i !== index)
                    })}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFactualAnchor}
                  onChange={(e) => setNewFactualAnchor(e.target.value)}
                  placeholder="e.g., It was a Tuesday, Restaurant was on Main Street"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addFactualAnchor()}
                />
                <button
                  onClick={addFactualAnchor}
                  disabled={!newFactualAnchor.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Anchors
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeaveCanvas;