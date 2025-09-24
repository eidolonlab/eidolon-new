import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle, Star, Target, Calendar, Sparkles, X, Play } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { weaves, addWeave } = useWeave();
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [demoMemory, setDemoMemory] = useState({
    seed: '',
    details: ''
  });

  const steps = [
    {
      title: 'Welcome to Eidolon',
      subtitle: 'Evidence-based memory training',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transform Your Memory</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Eidolon uses clinical techniques to strengthen your autobiographical memories and 
              prepare you for future success through evidence-based mental rehearsal.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-900">40% stronger</div>
              <div className="text-sm text-indigo-700">memory recall</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-900">2x success</div>
              <div className="text-sm text-purple-700">rate for goals</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Data Stays Private',
      subtitle: 'Local-first design',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy by Design</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Your personal memories are stored locally on your device. We never upload your 
              memory content to our servers. You have complete control over your data.
            </p>
          </div>
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-900 font-medium">Local storage only</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-900 font-medium">GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-900 font-medium">Export anytime</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'How Memory Weaving Works',
      subtitle: 'Multi-sensory encoding',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Multi-Sensory Memory Weaving</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Transform simple memory seeds into rich, detailed experiences using all five senses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {[
              { icon: '👁️', label: 'Visual', desc: 'Colors, lighting' },
              { icon: '👂', label: 'Auditory', desc: 'Sounds, voices' },
              { icon: '❤️', label: 'Emotional', desc: 'Feelings, mood' },
              { icon: '✋', label: 'Tactile', desc: 'Touch, texture' },
              { icon: '👃', label: 'Olfactory', desc: 'Scents, aromas' }
            ].map((sense, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl mb-1">{sense.icon}</div>
                <div className="font-medium text-purple-900 text-sm">{sense.label}</div>
                <div className="text-xs text-purple-700">{sense.desc}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Try Quick Demo</span>
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Begin',
      subtitle: 'Start your memory journey',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto">
            <Star className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Your memory training journey begins now. Start with any feature that interests you, 
              or follow the AI companion's personalized recommendations.
            </p>
          </div>
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-semibold text-yellow-900">💡 Pro Tip</div>
              <div className="text-sm text-yellow-800">Start with a simple, positive memory from recent days</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('eidolon-onboarding-complete', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('eidolon-onboarding-complete', 'true');
    onSkip();
  };

  const handleDemoSubmit = () => {
    if (!demoMemory.seed.trim()) return;

    // Create a demo memory
    addWeave({
      type: 'past',
      seed: demoMemory.seed,
      title: `Demo Memory: ${demoMemory.seed}`,
      narrative: demoMemory.details || `I remember ${demoMemory.seed}. This was a meaningful moment that I wanted to preserve and strengthen through memory training.`,
      sensoryDetails: {
        visual: '',
        auditory: '',
        olfactory: '',
        tactile: '',
        emotional: 'curious and engaged'
      },
      tags: ['demo', 'onboarding'],
      errorlessMode: false,
      difficultyLevel: 'easy'
    });

    setShowDemo(false);
    alert('🎉 Demo memory created! You can find it in your dashboard and practice retrieving it anytime.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h1>
            <p className="text-sm text-gray-600">{currentStepData.subtitle}</p>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                } ${index === currentStep ? 'flex-1' : 'w-8'}`}
                role="progressbar"
                aria-valuenow={currentStep + 1}
                aria-valuemax={steps.length}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Modal */}
        {showDemo && (
          <div className="absolute inset-0 bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Memory Demo</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's a simple, positive moment from today or yesterday?
                </label>
                <input
                  type="text"
                  value={demoMemory.seed}
                  onChange={(e) => setDemoMemory(prev => ({ ...prev, seed: e.target.value }))}
                  placeholder="e.g., morning coffee, good conversation, beautiful sunset"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add one detail (what you saw, heard, or felt)
                </label>
                <textarea
                  value={demoMemory.details}
                  onChange={(e) => setDemoMemory(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="e.g., warm sunlight through the window, the sound of birds chirping, feeling peaceful and grateful"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDemo(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDemoSubmit}
                  disabled={!demoMemory.seed.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Demo Memory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;