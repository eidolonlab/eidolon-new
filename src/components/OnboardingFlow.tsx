import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, CheckCircle, Star, Target, Calendar, Sparkles, X, Play, Zap, Eye, TrendingUp, Activity, Dumbbell } from 'lucide-react';
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
      subtitle: 'Your cognitive training companion',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transform Your Mind</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Strengthen your memory, sharpen your focus, and boost your attention with
              evidence-based cognitive training designed for real-world results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-900">Memory</div>
              <div className="text-sm text-indigo-700">Strengthen recall</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-900">Focus</div>
              <div className="text-sm text-purple-700">Build attention</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Train Your Brain',
      subtitle: 'Working memory & cognitive skills',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cognitive Training</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Exercise your working memory, attention span, and executive function with
              scientifically-backed training modules.
            </p>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900">Working Memory</div>
                <div className="text-sm text-blue-700">Hold and manipulate information in your mind</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg">
              <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-indigo-900">Sustained Attention</div>
                <div className="text-sm text-indigo-700">Build laser-like focus for longer periods</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-purple-900">Executive Function</div>
                <div className="text-sm text-purple-700">Plan, organize, and execute tasks effectively</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Focus Center',
      subtitle: 'ADHD-friendly attention tools',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ADHD Focus Tools</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Specialized tools to help manage attention challenges, build focus stamina,
              and work with your unique cognitive style.
            </p>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg">
              <Zap className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-900">Quick Focus Start</div>
                <div className="text-sm text-emerald-700">One-tap sessions that adapt to your attention patterns</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-teal-50 rounded-lg">
              <Activity className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-teal-900">Distraction Tracking</div>
                <div className="text-sm text-teal-700">Build awareness and gradually increase focus duration</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-cyan-50 rounded-lg">
              <Target className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-cyan-900">Micro-Training</div>
                <div className="text-sm text-cyan-700">Start with ultra-short bursts, build up gradually</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Quick Boosts',
      subtitle: 'Physical activities for mental clarity',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instant Cognitive Boosts</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Physical exercises that instantly sharpen focus, reset attention, and improve
              mental clarity through body-brain connection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="font-semibold text-orange-900 text-sm">Balance</div>
              <div className="text-xs text-orange-700">Centering focus</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🏃</div>
              <div className="font-semibold text-red-900 text-sm">Sprint</div>
              <div className="text-xs text-red-700">Energy boost</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🫁</div>
              <div className="font-semibold text-yellow-900 text-sm">Breathwork</div>
              <div className="text-xs text-yellow-700">Calm alertness</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-amber-900 text-sm">Targeting</div>
              <div className="text-xs text-amber-700">Precision focus</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 max-w-lg mx-auto">
            <div className="text-sm text-orange-900">
              <strong>Pro tip:</strong> Use Boosts before important tasks or when you feel your attention drifting.
              Just 2-5 minutes can transform your mental state.
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Memory Weaving',
      subtitle: 'Multi-sensory memory strengthening',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rich Memory Building</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              Transform important moments and future scenarios into vivid, multi-sensory
              memories that stick. Perfect for remembering what matters and preparing for success.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {[
              { icon: '👁️', label: 'Visual', desc: 'Colors, scenes' },
              { icon: '👂', label: 'Auditory', desc: 'Sounds, voices' },
              { icon: '❤️', label: 'Emotional', desc: 'Feelings, mood' },
              { icon: '✋', label: 'Tactile', desc: 'Touch, texture' },
              { icon: '👃', label: 'Olfactory', desc: 'Scents, aromas' },
              { icon: '🎯', label: 'Spatial', desc: 'Location, layout' }
            ].map((sense, index) => (
              <div key={index} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-center border border-purple-200">
                <div className="text-2xl mb-1">{sense.icon}</div>
                <div className="font-medium text-purple-900 text-sm">{sense.label}</div>
                <div className="text-xs text-purple-700">{sense.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Your Data Stays Private',
      subtitle: 'Local-first security',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy by Design</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Your personal memories and training data are stored locally on your device.
              We never upload your content to our servers.
            </p>
          </div>
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-900 font-medium">Local storage only</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-900 font-medium">GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-900 font-medium">Export anytime</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Begin?',
      subtitle: 'Start your cognitive journey',
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
            <Star className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Everything you need to strengthen your memory, sharpen your focus, and
              boost your cognitive performance is ready to go.
            </p>
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="font-semibold text-indigo-900 mb-2">🎯 Recommended First Steps:</div>
              <div className="text-sm text-indigo-800 text-left space-y-1">
                <div>1. Try a Quick Boost to experience instant results</div>
                <div>2. Start a Micro-Attention training session</div>
                <div>3. Create your first Memory Weave</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              You can access all features from the navigation bar at the bottom
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('eidolon-onboarding-complete');
    if (hasCompletedOnboarding) {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      localStorage.setItem('eidolon-onboarding-complete', 'true');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('eidolon-onboarding-complete', 'true');
    onSkip();
  };

  const handleDemoComplete = () => {
    if (demoMemory.seed && demoMemory.details) {
      addWeave({
        seed: demoMemory.seed,
        content: demoMemory.details,
        timestamp: new Date(),
        category: 'past',
        emotion: 'neutral'
      });
      setShowDemo(false);
      handleNext();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
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
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-32">
            {currentStepData.content}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation - ALWAYS VISIBLE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 sm:p-6 overflow-y-auto">
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

            <button
              onClick={handleDemoComplete}
              disabled={!demoMemory.seed || !demoMemory.details}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Create My First Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
