import React, { useState } from 'react';
import { Eye, Ear, Heart, Save, Wand2, Clock, Target } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import EnhancedTextInput from './EnhancedTextInput';
import AudioCueLibrary from './AudioCueLibrary';
import RecallLatencyTimer from './RecallLatencyTimer';

interface SimplifiedWeaveFlowProps {
  onComplete: (weave: any) => void;
  onCancel: () => void;
}

const SimplifiedWeaveFlow: React.FC<SimplifiedWeaveFlowProps> = ({ onComplete, onCancel }) => {
  const { addWeave } = useWeave();
  const [step, setStep] = useState(1);
  const [weaveData, setWeaveData] = useState({
    seed: '',
    title: '',
    visual: '',
    auditory: '',
    emotional: '',
    audioUrl: '',
    audioTitle: '',
    errorlessMode: false
  });
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [creationLatency, setCreationLatency] = useState<number | null>(null);

  const prompts = [
    {
      key: 'visual',
      icon: Eye,
      title: 'What did you see?',
      placeholder: 'Describe colors, lighting, objects, people, or scenes...',
      color: 'indigo',
      examples: [
        'Warm golden sunlight streaming through the kitchen window',
        'Her bright smile and the way her eyes crinkled at the corners',
        'The deep blue of the ocean stretching to the horizon'
      ]
    },
    {
      key: 'auditory',
      icon: Ear,
      title: 'What did you hear?',
      placeholder: 'Describe sounds, voices, music, or ambient noise...',
      color: 'emerald',
      examples: [
        'The gentle sizzling of onions in the pan',
        'His deep laugh echoing through the room',
        'Waves rhythmically crashing against the shore'
      ]
    },
    {
      key: 'emotional',
      icon: Heart,
      title: 'How did you feel?',
      placeholder: 'Describe emotions, physical sensations, or overall mood...',
      color: 'pink',
      examples: [
        'A warm sense of contentment spreading through my chest',
        'Nervous excitement, like butterflies dancing in my stomach',
        'Peaceful and grounded, completely present in the moment'
      ]
    }
  ];

  const currentPrompt = prompts[step - 2]; // Adjust for seed step

  const handleSeedSubmit = () => {
    if (weaveData.seed.trim()) {
      setStep(2);
    }
  };

  const handlePromptSubmit = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete the weave
      completeWeave();
    }
  };

  const completeWeave = () => {
    const narrative = generateNarrative();
    
    const newWeave = {
      type: 'past' as const,
      seed: weaveData.seed,
      title: weaveData.title || `Memory: ${weaveData.seed}`,
      narrative,
      sensoryDetails: {
        visual: weaveData.visual,
        auditory: weaveData.auditory,
        olfactory: '',
        tactile: '',
        emotional: weaveData.emotional,
      },
      tags: [],
      errorlessMode: weaveData.errorlessMode,
      difficultyLevel: 'medium' as const,
      cues: weaveData.audioUrl ? {
        music: weaveData.audioTitle,
        audioUrl: weaveData.audioUrl
      } : undefined
    };

    addWeave(newWeave);
    
    // Show success message
    alert(`Memory weave "${newWeave.title}" has been saved successfully!`);
    onComplete(newWeave);
  };

  const generateNarrative = () => {
    const { seed, visual, auditory, emotional } = weaveData;
    
    let narrative = `I remember ${seed}. `;
    
    if (visual) {
      narrative += `${visual}. `;
    }
    
    if (auditory) {
      narrative += `${auditory}. `;
    }
    
    if (emotional) {
      narrative += `${emotional}. `;
    }
    
    narrative += 'This memory stays with me because of how all these elements came together in that moment.';
    
    return narrative;
  };

  const handleLatencyComplete = (latencyMs: number) => {
    setCreationLatency(latencyMs);
  };

  if (showAudioLibrary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add Audio Cue (Optional)</h2>
          <button
            onClick={() => setShowAudioLibrary(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip Audio Cue
          </button>
        </div>
        
        <AudioCueLibrary
          onAudioSelect={(audioUrl, title) => {
            setWeaveData(prev => ({ ...prev, audioUrl, audioTitle: title }));
            setShowAudioLibrary(false);
          }}
          selectedAudio={weaveData.audioUrl}
        />
        
        <div className="flex justify-center">
          <button
            onClick={() => setShowAudioLibrary(false)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue to Complete Weave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4].map((stepNum) => (
          <div
            key={stepNum}
            className={`w-3 h-3 rounded-full transition-all ${
              stepNum <= step
                ? 'bg-indigo-600'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Seed */}
      {step === 1 && (
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What memory would you like to strengthen?</h2>
            <p className="text-gray-600">Start with a simple word or phrase that captures the essence of your memory</p>
          </div>
          
          <div className="space-y-4">
            <EnhancedTextInput
              type="input"
              value={weaveData.seed}
              onChange={(e) => setWeaveData(prev => ({ ...prev, seed: e.target.value }))}
              placeholder="e.g., grandmother's kitchen, first day at work, sunset walk"
              className="text-lg"
              showVoiceButton={true}
              showAIEnhancement={true}
              aiContext="memory"
            />
            
            <EnhancedTextInput
              type="input"
              value={weaveData.title}
              onChange={(e) => setWeaveData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your memory a title (optional)"
              showVoiceButton={true}
            />
          </div>

          <div className="flex items-center justify-center space-x-3">
            <input
              type="checkbox"
              id="errorless"
              checked={weaveData.errorlessMode}
              onChange={(e) => setWeaveData(prev => ({ ...prev, errorlessMode: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="errorless" className="text-sm text-gray-700">
              Enable gentle guidance mode (errorless learning)
            </label>
          </div>

          <button
            onClick={handleSeedSubmit}
            disabled={!weaveData.seed.trim()}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            Start Building Memory
          </button>
        </div>
      )}

      {/* Steps 2-4: Sensory Prompts */}
      {step >= 2 && step <= 4 && currentPrompt && (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`w-16 h-16 bg-${currentPrompt.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <currentPrompt.icon className={`w-8 h-8 text-${currentPrompt.color}-600`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentPrompt.title}</h2>
            <p className="text-gray-600">Thinking about: "{weaveData.seed}"</p>
          </div>

          {/* Recall Latency Timer */}
          <RecallLatencyTimer
            onComplete={handleLatencyComplete}
            isActive={true}
            onStart={() => console.log('Started recall timer')}
          />

          <div className="space-y-4">
            <EnhancedTextInput
              value={weaveData[currentPrompt.key as keyof typeof weaveData] as string}
              onChange={(e) => setWeaveData(prev => ({ ...prev, [currentPrompt.key]: e.target.value }))}
              placeholder={currentPrompt.placeholder}
              rows={4}
              className="text-lg"
              showVoiceButton={true}
              showWordCount={true}
              showAIEnhancement={true}
              aiContext="sensory"
              onVoiceComplete={(transcript, confidence) => {
                console.log(`Voice ${currentPrompt.key} completed:`, { transcript, confidence });
              }}
            />

            {/* Examples */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
              <div className="space-y-1">
                {currentPrompt.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setWeaveData(prev => ({ ...prev, [currentPrompt.key]: example }))}
                    className="block w-full text-left text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              Step {step - 1} of 3 • {currentPrompt.title}
            </div>
            
            <button
              onClick={handlePromptSubmit}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {step === 4 ? 'Add Audio Cue' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Audio Cue Selection */}
      {step === 5 && (
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add an Audio Cue (Optional)</h2>
            <p className="text-gray-600">Research shows audio cues significantly enhance memory recall</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowAudioLibrary(true)}
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Choose Audio Cue</h3>
              <p className="text-sm text-gray-600">Select from curated library or upload your own</p>
            </button>

            <button
              onClick={completeWeave}
              className="p-6 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Complete Without Audio</h3>
              <p className="text-sm text-gray-600">Save your memory weave as-is</p>
            </button>
          </div>

          {creationLatency && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Memory creation completed in {(creationLatency / 1000).toFixed(1)} seconds
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clinical Context */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Clinical Approach</span>
        </div>
        <p className="text-sm text-blue-800">
          This simplified 3-prompt flow is based on Memory Specificity Training principles. 
          Visual, auditory, and emotional details create the strongest autobiographical memory networks 
          while reducing cognitive load compared to traditional 5-sense approaches.
        </p>
      </div>
    </div>
  );
};

export default SimplifiedWeaveFlow;