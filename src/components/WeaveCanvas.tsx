import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Eye, Ear, DoorClosed as Nose, Hand, Heart, Save, Wand2, Music, Palette, HelpCircle, Brain, Lightbulb } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ConfirmDialog from './ConfirmDialog';
import AccessibleButton from './AccessibleButton';
import EnhancedTextInput from './EnhancedTextInput';
import { useWeave } from '../contexts/WeaveContext';
import CueLibrary from './CueLibrary';
import BridgeBack from './BridgeBack';
import VisualMemoryCapture from './VisualMemoryCapture';
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentImageType, setCurrentImageType] = useState<'photo' | 'video'>('photo');
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
  const [profileName, setProfileName] = useState('');
  const [useCustomProfile, setUseCustomProfile] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<Array<{
    name: string;
    weaves: number;
    avgCoherence: number;
    lastUsed: Date;
    category: string;
  }>>([]);

  // Load user history for adaptive coaching
  useEffect(() => {
    const savedWeaves = localStorage.getItem('eidolon-weaves');
    if (savedWeaves) {
      const weaves = JSON.parse(savedWeaves);
      setUserMemoryHistory(weaves.slice(0, 10)); // Last 10 memories for pattern analysis
    }
    
    // Load saved profiles
    const savedProfiles = localStorage.getItem('eidolon-memory-profiles');
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles).map((p: any) => ({
        ...p,
        lastUsed: new Date(p.lastUsed)
      }));
      setSavedProfiles(profiles);
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

    setIsSaving(true);

    // Update profile data if using custom profile
    if (useCustomProfile && profileName.trim()) {
      updateProfileData();
    }

    const newWeave = {
      type: weaveType,
      seed,
      title,
      narrative,
      sensoryDetails,
      tags,
      cues: currentImage ? {
        photos: [currentImage],
        visualType: currentImageType
      } : undefined,
      errorlessMode,
      difficultyLevel,
      ifThenPlans: weaveType === 'future' ? [] : undefined,
      scheduledFor: weaveType === 'future' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined, // Default to 1 week from now
      completed: false,
      bridgeData: tempBridgeData,
      profileName: useCustomProfile ? profileName : undefined,
    };

    addWeave(newWeave);
    
    // Show success message
    setIsSaving(false);
    const profileText = useCustomProfile && profileName ? ` to "${profileName}" profile` : '';
    alert(`${weaveType === 'past' ? 'Memory weave' : 'Future scenario'} "${title}" has been saved successfully${profileText}!`);
    onBack();
  };

  const handleBack = () => {
    const hasUnsavedChanges = seed.trim() || title.trim() || Object.values(sensoryDetails).some(d => d.trim());
    
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onBack();
    }
  };
  const updateProfileData = () => {
    const profiles = [...savedProfiles];
    const existingIndex = profiles.findIndex(p => p.name === profileName.trim());
    const coherenceScore = calculateCoherenceScore(narrative, sensoryDetails);
    
    if (existingIndex >= 0) {
      const existing = profiles[existingIndex];
      profiles[existingIndex] = {
        ...existing,
        weaves: existing.weaves + 1,
        avgCoherence: (existing.avgCoherence * existing.weaves + coherenceScore) / (existing.weaves + 1),
        lastUsed: new Date()
      };
    } else {
      profiles.push({
        name: profileName.trim(),
        weaves: 1,
        avgCoherence: coherenceScore,
        lastUsed: new Date(),
        category: weaveType
      });
    }
    
    setSavedProfiles(profiles);
    localStorage.setItem('eidolon-memory-profiles', JSON.stringify(profiles));
  };

  const calculateCoherenceScore = (narrative: string, sensoryDetails: any): number => {
    // Simple coherence scoring based on narrative length, detail richness, and structure
    const narrativeScore = Math.min(narrative.length / 200, 1) * 40; // Up to 40 points for length
    const detailScore = Object.values(sensoryDetails).filter((d: any) => d.length > 10).length * 10; // 10 points per detailed sense
    const structureScore = (narrative.match(/\./g) || []).length > 2 ? 20 : 10; // Basic structure check
    
    return Math.round(Math.min(narrativeScore + detailScore + structureScore, 100));
  };

  // If using simplified flow, render that instead
  if (useSimplifiedFlow) {
    return (
      <ErrorBoundary>
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <AccessibleButton
            onClick={handleBack}
            variant="ghost"
            icon={ArrowLeft}
            ariaLabel="Go back to dashboard"
          >
            Back to Dashboard
          </AccessibleButton>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Create Memory Weave</h1>
            <div className="flex flex-wrap gap-2">
              <AccessibleButton
                onClick={() => {
                  setUseSimplifiedFlow(true);
                  setUsePerfectFlow(false);
                  setShowAdvancedFeatures(false);
                }}
                variant={useSimplifiedFlow && !usePerfectFlow && !showAdvancedFeatures ? "primary" : "outline"}
                size="sm"
              >
                Simple Mode
              </AccessibleButton>
              <AccessibleButton
                onClick={() => {
                  setUsePerfectFlow(true);
                  setShowAdvancedFeatures(false);
                  setUseSimplifiedFlow(false);
                }}
                variant={usePerfectFlow ? "primary" : "outline"}
                size="sm"
              >
                Perfect Flow
              </AccessibleButton>
              <AccessibleButton
                onClick={() => {
                  setShowAdvancedFeatures(!showAdvancedFeatures);
                  setUsePerfectFlow(false);
                  setUseSimplifiedFlow(false);
                }}
                variant={showAdvancedFeatures ? "primary" : "outline"}
                size="sm"
              >
                🧠 Quantum Mode
              </AccessibleButton>
            </div>
          </div>
        </div>
        
        {usePerfectFlow ? (
          <ErrorBoundary fallback={<LoadingSpinner message="Loading Perfect Flow..." />}>
          <PerfectMemoryFlow
            onComplete={(weave) => {
              console.log('Perfect weave completed:', weave);
              onBack();
            }}
            onCancel={onBack}
          />
          </ErrorBoundary>
        ) : showAdvancedFeatures ? (
          <ErrorBoundary fallback={<LoadingSpinner message="Loading advanced features..." />}>
          <div className="space-y-6 pb-32">

            {/* QUANTUM MODE: Memory Input Section - ALWAYS VISIBLE AT TOP */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">🧠 Quantum Memory Mode</h2>
                  <p className="text-purple-100 text-sm">Advanced quantum-inspired memory enhancement</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong className="text-white">How it works:</strong> Enter your memory details below.
                  As you type, our quantum engine analyzes coherence, entanglement, and superposition
                  to optimize your memory encoding in real-time.
                </p>
              </div>
            </div>

            {/* Memory Input Fields - PROMINENT SECTION */}
            <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-lg p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b-2 border-purple-200">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Enter Your Memory Details</h3>
              </div>

              {/* Memory Seed */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  ⭐ Memory Seed (What happened?)
                </label>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="e.g., Coffee with Sarah at the park"
                  className="w-full px-4 py-3 text-lg border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                />
              </div>

              {/* Title */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  📝 Memory Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning Coffee Chat"
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              {/* Sensory Details */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span>Sensory Details (The more you add, the stronger the memory!)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-blue-900 mb-2">
                      <Eye className="w-4 h-4" />
                      <span>👁️ Visual Details</span>
                    </label>
                    <textarea
                      value={sensoryDetails.visual}
                      onChange={(e) => setSensoryDetails({...sensoryDetails, visual: e.target.value})}
                      placeholder="What did you see? Colors, lighting, people..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                    />
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-green-900 mb-2">
                      <Ear className="w-4 h-4" />
                      <span>👂 Auditory Details</span>
                    </label>
                    <textarea
                      value={sensoryDetails.auditory}
                      onChange={(e) => setSensoryDetails({...sensoryDetails, auditory: e.target.value})}
                      placeholder="What did you hear? Sounds, voices, music..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white"
                    />
                  </div>

                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-pink-900 mb-2">
                      <Heart className="w-4 h-4" />
                      <span>❤️ Emotional Details</span>
                    </label>
                    <textarea
                      value={sensoryDetails.emotional}
                      onChange={(e) => setSensoryDetails({...sensoryDetails, emotional: e.target.value})}
                      placeholder="How did you feel? Happy, excited, peaceful..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none bg-white"
                    />
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-amber-900 mb-2">
                      <Hand className="w-4 h-4" />
                      <span>✋ Tactile Details</span>
                    </label>
                    <textarea
                      value={sensoryDetails.tactile}
                      onChange={(e) => setSensoryDetails({...sensoryDetails, tactile: e.target.value})}
                      placeholder="What did you touch/feel? Textures, temperatures..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Narrative */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  📖 Full Narrative (Optional - Add more context)
                </label>
                <textarea
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Tell the complete story with all the details you can remember..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none bg-white"
                />
              </div>
            </div>

            {/* VISUAL DIVIDER - Analysis Section Begins */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-purple-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-6 py-2 text-sm font-semibold text-purple-700 rounded-full border-2 border-purple-300 shadow-sm">
                  ⚡ Real-Time Quantum Analysis Below
                </span>
              </div>
            </div>

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
              <AccessibleButton
                onClick={handleSave}
                disabled={!seed || !title || isSaving}
                loading={isSaving}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-lg font-medium shadow-lg"
                ariaLabel="Save quantum-enhanced memory weave"
              >
                🧠 Save Quantum-Enhanced Memory
              </AccessibleButton>
              {neuralNetworkStrength > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Neural network strength: {neuralNetworkStrength.toFixed(0)}% | 
                  Predicted retrieval success: {memoryPredictions?.retrievalSuccess?.toFixed(0) || 0}%
                </p>
              )}
            </div>
          </div>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary fallback={<LoadingSpinner message="Loading simplified flow..." />}>
          <SimplifiedWeaveFlow
            onComplete={(weave) => {
              console.log('Weave completed:', weave);
              onBack();
            }}
            onCancel={onBack}
          />
          </ErrorBoundary>
        )}
        
        {/* Exit Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          onConfirm={() => {
            setShowExitConfirm(false);
            onBack();
          }}
          title="Unsaved Changes"
          message="You have unsaved changes to your memory weave. Are you sure you want to leave without saving?"
          confirmText="Leave Without Saving"
          cancelText="Continue Editing"
          variant="warning"
        />
      </div>
      </ErrorBoundary>
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
                <EnhancedTextInput
                  type="input"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={weaveType === 'past' ? 'e.g., "grandmother\'s kitchen", "first day at work"' : 'e.g., "job interview", "family dinner"'}
                  className="text-lg"
                  showVoiceButton={true}
                  showAIEnhancement={true}
                  aiContext="memory"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <EnhancedTextInput
                  type="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your weave a memorable title"
                  showVoiceButton={true}
                />
              </div>

              {/* Visual Memory Capture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visual Memory (Optional)
                </label>
                <VisualMemoryCapture
                  onImageCapture={(imageData, type) => {
                    setCurrentImage(imageData);
                    setCurrentImageType(type);
                  }}
                  onImageRemove={() => setCurrentImage('')}
                  currentImage={currentImage}
                  currentImageType={currentImageType}
                />
              </div>
              
              {/* Memory Profile Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useMemoryProfile"
                    checked={useCustomProfile}
                    onChange={(e) => setUseCustomProfile(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="useMemoryProfile" className="text-sm text-gray-700">
                    Create named memory profile (track different memory types separately)
                  </label>
                </div>
                
                {useCustomProfile && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Memory Profile Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g., Childhood Memories, Work Experiences, Family Moments"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Organize memories by theme, time period, or purpose
                      </p>
                    </div>
                    
                    {/* Existing Profiles */}
                    {savedProfiles.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or select existing profile:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {savedProfiles.map((profile, index) => (
                            <button
                              key={index}
                              onClick={() => setProfileName(profile.name)}
                              className={`p-2 text-left border rounded-lg transition-colors ${
                                profileName === profile.name
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium text-sm">{profile.name}</div>
                              <div className="text-xs text-gray-500">
                                {profile.weaves} memories • Avg: {Math.round(profile.avgCoherence)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    <div className="mt-2">
                      <VoiceInputButton
                        onTranscript={(text) => {
                          const currentValue = sensoryDetails[sense as keyof typeof sensoryDetails];
                          const newValue = currentValue ? `${currentValue} ${text}` : text;
                          handleSensoryChange(sense as keyof typeof sensoryDetails, newValue);
                        }}
                        size="sm"
                        variant="secondary"
                        className="mr-2"
                      />
                      <span className="text-xs text-gray-500">Click to add voice details</span>
                    </div>
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
              
              <EnhancedTextInput
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Write your narrative here, or use the Generate Draft button to create one from your sensory details..."
                rows={8}
                showVoiceButton={true}
                showAIEnhancement={true}
                aiContext="narrative"
                onVoiceComplete={(transcript, confidence) => {
                  console.log('Voice narrative completed:', { transcript, confidence });
                }}
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
    <ErrorBoundary>
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <AccessibleButton
          onClick={handleBack}
          variant="ghost"
          icon={ArrowLeft}
          ariaLabel="Go back to dashboard"
        >
          Back to Dashboard
        </AccessibleButton>
        
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2" role="progressbar" aria-valuenow={step} aria-valuemax={4}>
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
                aria-label={`Step ${stepNum} ${stepNum < step ? 'completed' : stepNum === step ? 'current' : 'upcoming'}`}
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
        <AccessibleButton
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          variant="outline"
          size="lg"
        >
          Previous
        </AccessibleButton>
        
        {step < 4 ? (
          <AccessibleButton
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1) ||
              (step === 2 && (!seed || !title)) ||
              (step === 3 && Object.values(sensoryDetails).every(d => d.length === 0))
            }
            variant="primary"
            size="lg"
          >
            Next
          </AccessibleButton>
        ) : (
          <AccessibleButton
            onClick={handleSave}
            disabled={!narrative || isSaving}
            loading={isSaving}
            icon={Save}
            variant="primary"
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Save Weave
          </AccessibleButton>
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
      
      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          onBack();
        }}
        title="Unsaved Changes"
        message="You have unsaved changes to your memory weave. Are you sure you want to leave without saving?"
        confirmText="Leave Without Saving"
        cancelText="Continue Editing"
        variant="warning"
      />
    </div>
    </ErrorBoundary>
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
                <VoiceInputButton
                  onTranscript={(text) => setNewFactualAnchor(text)}
                  size="sm"
                  variant="secondary"
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