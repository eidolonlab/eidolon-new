import React, { useState, useEffect } from 'react';
import { Star, Brain, Heart, Eye, Ear, Save, Sparkles, Clock, Target, CheckCircle } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface AdaptiveMemoryCaptureProps {
  cognitiveState?: CognitiveState;
  onComplete: () => void;
}

const AdaptiveMemoryCapture: React.FC<AdaptiveMemoryCaptureProps> = ({ cognitiveState, onComplete }) => {
  const { addWeave } = useWeave();
  const [step, setStep] = useState(1);
  const [memoryData, setMemoryData] = useState({
    seed: '',
    title: '',
    quickDetails: '',
    expandedDetails: {
      visual: '',
      auditory: '',
      emotional: ''
    },
    captureTime: 0
  });
  const [startTime] = useState(new Date());
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [encouragement, setEncouragement] = useState('');

  // Adaptive flow based on cognitive state
  const getAdaptiveFlow = () => {
    if (!cognitiveState) return 'standard';
    
    const { attention, energy, stress } = cognitiveState;
    
    if (stress > 60 || attention < 40) return 'gentle';
    if (energy > 70 && attention > 70) return 'rich';
    return 'standard';
  };

  const adaptiveFlow = getAdaptiveFlow();

  useEffect(() => {
    generateContextualSuggestions();
    generateEncouragement();
  }, [memoryData.seed, adaptiveFlow]);

  const generateContextualSuggestions = () => {
    if (!memoryData.seed || memoryData.seed.length < 3) return;

    const seed = memoryData.seed.toLowerCase();
    const suggestions = [];

    // Context-aware suggestions
    if (seed.includes('conversation') || seed.includes('talk')) {
      suggestions.push("What was their tone of voice like?");
      suggestions.push("How did their words make you feel?");
      suggestions.push("What did you notice about their body language?");
    } else if (seed.includes('food') || seed.includes('meal')) {
      suggestions.push("What aromas filled the air?");
      suggestions.push("How did everything look on the plate?");
      suggestions.push("What was the atmosphere like?");
    } else if (seed.includes('nature') || seed.includes('outside')) {
      suggestions.push("What colors dominated the scene?");
      suggestions.push("What sounds of nature were present?");
      suggestions.push("How did the air feel on your skin?");
    } else {
      // Generic but helpful suggestions
      suggestions.push("What caught your eye first?");
      suggestions.push("What sounds were in the background?");
      suggestions.push("How did this moment make you feel?");
    }

    setAiSuggestions(suggestions.slice(0, 3));
  };

  const generateEncouragement = () => {
    const wordCount = memoryData.quickDetails.split(' ').filter(w => w.length > 0).length;
    const hour = new Date().getHours();
    
    if (wordCount === 0) {
      if (hour < 10) {
        setEncouragement("What are you noticing or feeling as your day begins?");
      } else if (hour < 12) {
        setEncouragement("What has caught your attention this morning?");
      } else {
        setEncouragement("Every detail you add makes this memory stronger and more retrievable.");
      }
    } else if (wordCount < 10) {
      setEncouragement("Great start! Your memory is beginning to take shape.");
    } else if (wordCount < 25) {
      setEncouragement("Wonderful details! You're creating multiple pathways for recall.");
    } else {
      setEncouragement("Excellent richness! This memory will be easily accessible for years.");
    }
  };

  const handleSave = () => {
    const captureTime = (Date.now() - startTime.getTime()) / 1000;
    
    // Create narrative from captured details
    let narrative = `I remember ${memoryData.seed}. `;
    if (memoryData.quickDetails) {
      narrative += `${memoryData.quickDetails}. `;
    }
    
    // Add expanded details if available
    Object.values(memoryData.expandedDetails).forEach(detail => {
      if (detail) narrative += `${detail}. `;
    });
    
    narrative += "This moment stands out in my memory for its significance.";

    const newWeave = {
      type: 'past' as const,
      seed: memoryData.seed,
      title: memoryData.title || `Memory: ${memoryData.seed}`,
      narrative,
      sensoryDetails: {
        visual: memoryData.expandedDetails.visual,
        auditory: memoryData.expandedDetails.auditory,
        olfactory: '',
        tactile: '',
        emotional: memoryData.expandedDetails.emotional,
      },
      tags: ['quick-capture', adaptiveFlow],
      errorlessMode: adaptiveFlow === 'gentle',
      difficultyLevel: adaptiveFlow === 'gentle' ? 'easy' as const : 'medium' as const
    };

    addWeave(newWeave);
    
    // Show success message with timing
    const timeMessage = captureTime < 60 ? 
      `Captured in ${Math.round(captureTime)} seconds!` :
      `Captured in ${Math.round(captureTime / 60)} minutes!`;
    
    alert(`✨ Memory saved! ${timeMessage}\n\n"${newWeave.title}" is now part of your collection.`);
    onComplete();
  };

  // Gentle flow for stressed/tired states
  if (adaptiveFlow === 'gentle') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gentle Memory Formation</h2>
          <p className="text-gray-600">Stress-optimized memory encoding - no pressure, just preservation</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 10) {
                  return "What are you noticing or feeling as your day begins?";
                } else if (hour < 12) {
                  return "What has caught your attention this morning?";
                } else if (hour < 17) {
                  return "What moment from today stands out so far?";
                } else {
                  return "What was meaningful about your day?";
                }
              })()}
            </label>
            <input
              type="text"
              value={memoryData.seed}
              onChange={(e) => setMemoryData(prev => ({ ...prev, seed: e.target.value }))}
              placeholder={(() => {
                const hour = new Date().getHours();
                if (hour < 10) {
                  return "e.g., excited about today's plans, peaceful morning routine, beautiful sunrise";
                } else if (hour < 12) {
                  return "e.g., interesting email, productive work start, moment of clarity";
                } else {
                  return "e.g., unexpected compliment, beautiful sunset, good conversation";
                }
              })()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe this memory (include what you saw, heard, or felt)
            </label>
            <textarea
              value={memoryData.quickDetails}
              onChange={(e) => setMemoryData(prev => ({ ...prev, quickDetails: e.target.value }))}
              placeholder="What made this moment special? Include sensory details and emotions..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            {encouragement && (
              <p className="text-sm text-blue-600 mt-2">{encouragement}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onComplete}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSave}
              disabled={!memoryData.seed.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Memory</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rich flow for optimal cognitive states
  if (adaptiveFlow === 'rich') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Sensory Memory Weaving</h2>
          <p className="text-gray-600">Peak cognitive state detected - perfect for rich autobiographical encoding</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory Seed (Core moment to expand)
              </label>
              <input
                type="text"
                value={memoryData.seed}
                onChange={(e) => setMemoryData(prev => ({ ...prev, seed: e.target.value }))}
                placeholder="e.g., grandmother's kitchen, first day at work, sunset walk"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory Title (How you'll remember this)
              </label>
              <input
                type="text"
                value={memoryData.title}
                onChange={(e) => setMemoryData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Sunday Morning at Grandma's, My First Day as Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!memoryData.seed.trim()}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Rich Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: 'visual', icon: Eye, title: 'What did you see?', color: 'indigo' },
                { key: 'auditory', icon: Ear, title: 'What did you hear?', color: 'emerald' },
                { key: 'emotional', icon: Heart, title: 'How did you feel?', color: 'pink' }
              ].map(({ key, icon: Icon, title, color }) => (
                <div key={key} className={`bg-${color}-50 p-6 rounded-xl border border-${color}-200`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                    <h3 className="font-medium text-gray-900">{title}</h3>
                  </div>
                  <textarea
                    value={memoryData.expandedDetails[key as keyof typeof memoryData.expandedDetails]}
                    onChange={(e) => setMemoryData(prev => ({
                      ...prev,
                      expandedDetails: { ...prev.expandedDetails, [key]: e.target.value }
                    }))}
                    placeholder={`Describe the ${key} aspects...`}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-900">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-indigo-800 bg-white rounded p-2 border border-indigo-200">
                      💡 {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!memoryData.seed.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Rich Memory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard flow for normal cognitive states
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Memory Capture</h2>
        <p className="text-gray-600">Preserve a meaningful moment from your day</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {(() => {
              const hour = new Date().getHours();
              if (hour < 10) {
                return "What are you noticing or feeling as your day begins?";
              } else if (hour < 12) {
                return "What has caught your attention this morning?";
              } else if (hour < 17) {
                return "What moment from today stands out so far?";
              } else {
                return "What was meaningful about your day?";
              }
            })()}
          </label>
          <input
            type="text"
            value={memoryData.seed}
            onChange={(e) => setMemoryData(prev => ({ ...prev, seed: e.target.value }))}
            placeholder={(() => {
              const hour = new Date().getHours();
              if (hour < 10) {
                return "e.g., excited about today's plans, peaceful morning routine, beautiful sunrise";
              } else if (hour < 12) {
                return "e.g., interesting email, productive work start, moment of clarity";
              } else {
                return "e.g., unexpected compliment, beautiful sunset, good conversation";
              }
            })()}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe this moment
          </label>
          <textarea
            value={memoryData.quickDetails}
            onChange={(e) => setMemoryData(prev => ({ ...prev, quickDetails: e.target.value }))}
            placeholder="Include what you saw, heard, felt, or experienced..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          
          {encouragement && (
            <p className="text-sm text-indigo-600 mt-2">{encouragement}</p>
          )}
        </div>

        {/* Quick AI Suggestions */}
        {aiSuggestions.length > 0 && memoryData.seed.length > 5 && (
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-indigo-900">Memory Enhancement Prompts</span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const currentDetails = memoryData.quickDetails;
                    const newDetails = currentDetails ? 
                      `${currentDetails} ${suggestion}` : 
                      suggestion;
                    setMemoryData(prev => ({ ...prev, quickDetails: newDetails }));
                  }}
                  className="w-full text-left p-3 bg-white border border-indigo-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <p className="text-sm text-gray-700">💡 {suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onComplete}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!memoryData.seed.trim()}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Memory</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveMemoryCapture;