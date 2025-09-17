import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, ArrowRight, Lightbulb, Eye, Ear, Heart, Hand, DoorClosed as Nose } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface ErrorlessModeProps {
  weaveId: string;
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

const ErrorlessMode: React.FC<ErrorlessModeProps> = ({ weaveId, onComplete, onClose }) => {
  const { getWeaveById } = useWeave();
  const weave = getWeaveById(weaveId);
  const [currentStep, setCurrentStep] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [confidence, setConfidence] = useState<number>(3);

  if (!weave) return null;

  // Generate progressive hints from the narrative
  const generateHints = () => {
    const narrative = weave.narrative;
    const sentences = narrative.split('.').filter(s => s.trim().length > 0);
    const sensoryDetails = weave.sensoryDetails;
    
    // Create progressive hints
    const progressiveHints = [
      `This memory involves: ${weave.seed}`,
      sensoryDetails.visual ? `What you could see: ${sensoryDetails.visual.substring(0, 60)}${sensoryDetails.visual.length > 60 ? '...' : ''}` : null,
      sensoryDetails.auditory ? `What you could hear: ${sensoryDetails.auditory.substring(0, 60)}${sensoryDetails.auditory.length > 60 ? '...' : ''}` : null,
      sensoryDetails.emotional ? `How it felt: ${sensoryDetails.emotional.substring(0, 60)}${sensoryDetails.emotional.length > 60 ? '...' : ''}` : null,
      sensoryDetails.tactile ? `Physical sensations: ${sensoryDetails.tactile.substring(0, 60)}${sensoryDetails.tactile.length > 60 ? '...' : ''}` : null,
      sensoryDetails.olfactory ? `Scents present: ${sensoryDetails.olfactory.substring(0, 60)}${sensoryDetails.olfactory.length > 60 ? '...' : ''}` : null,
      sentences[0] ? `Here's how it began: "${sentences[0].trim()}..."` : null,
      sentences.length > 1 ? `And then: "${sentences[1].trim()}..."` : null,
    ];

    // Filter out null hints and ensure we have at least 3
    const filteredHints = progressiveHints.filter(hint => hint !== null) as string[];
    if (filteredHints.length < 3) {
      filteredHints.push(`The complete memory: ${narrative.substring(0, 100)}...`);
    }
    
    setHints(filteredHints);
  };

  useEffect(() => {
    generateHints();
  }, [weave]);

  const handleNextHint = () => {
    if (currentStep < hints.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(true);
    } else {
      // All hints shown, complete the session
      setIsComplete(true);
      onComplete(true);
    }
  };

  const handleSkipToAnswer = () => {
    setIsComplete(true);
    onComplete(false);
  };

  const getSensoryIcon = (hintText: string) => {
    if (hintText.includes('see') || hintText.includes('visual')) return Eye;
    if (hintText.includes('hear') || hintText.includes('sound')) return Ear;
    if (hintText.includes('felt') || hintText.includes('emotion')) return Heart;
    if (hintText.includes('touch') || hintText.includes('sensation')) return Hand;
    if (hintText.includes('scent') || hintText.includes('smell')) return Nose;
    return HelpCircle;
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Errorless Recall Complete</h2>
            <p className="text-gray-600 mb-6">
              You've successfully worked through the memory with guided support. This gentle approach helps strengthen recall without the stress of guessing.
            </p>
            
            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Your Memory:</h3>
              <p className="text-blue-800 text-sm">{weave.narrative}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg mb-6">
              <h3 className="font-medium text-green-900 mb-2">Your Confidence Level:</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-4 h-4 rounded-full ${
                      level <= confidence ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-green-700 ml-2">
                  {confidence === 5 ? 'Very Confident' : confidence >= 3 ? 'Confident' : 'Building Confidence'}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Errorless Recall Mode</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Step {currentStep + 1} of {hints.length}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Gentle Guidance</span>
            </div>
            <p className="text-amber-800 text-sm">
              This mode provides supportive hints to help you recall without guessing. Take your time and let the cues guide you naturally.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Memory: {weave.title}</h3>
              <p className="text-gray-600 text-sm">Seed: "{weave.seed}"</p>
            </div>

            {showHint && hints[currentStep] && (
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  {(() => {
                    const IconComponent = getSensoryIcon(hints[currentStep]);
                    return <IconComponent className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />;
                  })()}
                  <div>
                    <p className="text-indigo-900 font-medium mb-1">Hint {currentStep + 1}:</p>
                    <p className="text-indigo-800">{hints[currentStep]}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What comes to mind? (Optional - you can also just use the hints)
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Share any details that come to mind, or simply read the hints and continue..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
            
            {showHint && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How confident do you feel about this memory right now?
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfidence(level)}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        level <= confidence 
                          ? 'bg-indigo-500 hover:bg-indigo-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {confidence === 5 ? 'Very confident' : confidence >= 3 ? 'Confident' : 'Still building'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkipToAnswer}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Show Full Memory
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {hints.length} • Gentle guidance mode
            </div>
            
            <div className="flex space-x-3">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Show Hint</span>
                </button>
              ) : (
                <button
                  onClick={handleNextHint}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <span>{currentStep < hints.length - 1 ? 'Next Hint' : 'Complete'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorlessMode;