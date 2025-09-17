import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Eye, Ear, DoorClosed as Nose, Hand, Heart, Save, Wand2, Music, Palette, HelpCircle, Brain, Lightbulb } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import CueLibrary from './CueLibrary';
import BridgeBack from './BridgeBack';
import InteractiveCueEngine from './InteractiveCueEngine';
import SmartNarrativeBuilder from './SmartNarrativeBuilder';
import LiveMemoryAnalyzer from './LiveMemoryAnalyzer';
import ContextualHintEngine from './ContextualHintEngine';

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
      scheduledFor: weaveType === 'future' ? undefined : undefined,
      completed: false,
    };

    addWeave(newWeave);
    onBack();
  };

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
                <InteractiveCueEngine
                  currentText={sensoryDetails[activeField as keyof typeof sensoryDetails]}
                  onSuggestion={(suggestion, type) => handleSuggestionAccept(suggestion, type)}
                  isActive={showAIAssistant}
                  fieldType={activeField}
                  memoryType={weaveType}
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
                  // Create a temporary weave to work with cues
                  const tempWeave = {
                    type: weaveType,
                    seed,
                    title,
                    narrative,
                    sensoryDetails,
                    tags,
                    errorlessMode,
                    difficultyLevel,
                  };
                  const tempId = 'temp-' + Date.now();
                  setTempWeaveId(tempId);
                  // Store temp weave in context for cue library
                  setShowCueLibrary(true);
                }}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <Music className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Add Sensory Cues</span>
              </button>
              
              <button
                onClick={() => {
                  // Create a temporary weave to work with bridge data
                  const tempWeave = {
                    type: weaveType,
                    seed,
                    title,
                    narrative,
                    sensoryDetails,
                    tags,
                    errorlessMode,
                    difficultyLevel,
                  };
                  const tempId = 'temp-' + Date.now();
                  setTempWeaveId(tempId);
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
        <CueLibrary
          weaveId="temp-weave"
          onClose={() => setShowCueLibrary(false)}
        />
      )}
      
      {showBridgeBack && (
        <BridgeBack
          weaveId="temp-weave"
          onClose={() => setShowBridgeBack(false)}
        />
      )}
    </div>
  );
};

export default WeaveCanvas;