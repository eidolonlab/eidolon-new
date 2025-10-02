import React, { useState, useEffect } from 'react';
import { Heart, Brain, Clock, Play, Pause, CheckCircle, Zap, Target, Activity, Lightbulb, Mic } from 'lucide-react';
import type { CognitiveState } from '../contexts/CognitiveStateContext';
import EnhancedTextInput from './EnhancedTextInput';

interface CognitiveRegulationToolsProps {
  cognitiveState?: CognitiveState;
  onComplete: () => void;
}

const CognitiveRegulationTools: React.FC<CognitiveRegulationToolsProps> = ({ cognitiveState, onComplete }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes default
  const [currentStep, setCurrentStep] = useState(0);
  const [beforeRating, setBeforeRating] = useState(5);
  const [afterRating, setAfterRating] = useState(5);
  const [sessionPhase, setSessionPhase] = useState<'setup' | 'active' | 'complete'>('setup');
  const [intelligentRecommendation, setIntelligentRecommendation] = useState<string>('');
  const [voiceCoaching, setVoiceCoaching] = useState<string>('');

  const techniques = {
    breathing: {
      name: '4-7-8 Breathing',
      duration: 120,
      description: 'Calm your nervous system with rhythmic breathing',
      steps: [
        'Exhale completely through your mouth',
        'Close your mouth, inhale through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat this cycle'
      ],
      color: 'blue',
      effectiveness: 85,
      bestFor: 'High stress, anxiety, racing thoughts'
    },
    grounding: {
      name: '5-4-3-2-1 Grounding',
      duration: 90,
      description: 'Ground yourself in the present moment',
      steps: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      color: 'emerald',
      effectiveness: 80,
      bestFor: 'Overwhelm, dissociation, panic'
    },
    progressive: {
      name: 'Progressive Relaxation',
      duration: 180,
      description: 'Release physical tension systematically',
      steps: [
        'Tense your toes for 5 seconds, then release',
        'Tense your calves, then release',
        'Continue up through legs, abdomen, arms',
        'Tense your shoulders, then release',
        'Finish with face muscles - scrunch and release'
      ],
      color: 'purple',
      effectiveness: 90,
      bestFor: 'Physical tension, chronic stress, insomnia'
    }
  };

  // Generate intelligent recommendation based on cognitive state
  useEffect(() => {
    if (!cognitiveState) return;
    
    const { stress, attention, energy } = cognitiveState;
    
    if (stress > 70) {
      setIntelligentRecommendation("🚨 High stress detected! This significantly impairs memory formation. I recommend the 4-7-8 breathing technique to activate your parasympathetic nervous system and restore optimal encoding conditions.");
      setBeforeRating(Math.ceil(stress / 10));
    } else if (stress > 50) {
      setIntelligentRecommendation("⚠️ Moderate stress detected. This can reduce memory encoding by 30%. The 5-4-3-2-1 grounding technique will help center your attention and improve memory formation.");
      setBeforeRating(Math.ceil(stress / 10));
    } else if (attention < 40) {
      setIntelligentRecommendation("🧘 Low attention detected. Progressive muscle relaxation can help reset your focus and prepare your mind for optimal memory work.");
      setBeforeRating(3);
    } else {
      setIntelligentRecommendation("✨ Good cognitive state! A brief regulation session will optimize your memory systems for even better performance.");
      setBeforeRating(2);
    }
  }, [cognitiveState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionPhase('complete');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startTechnique = (techniqueKey: string) => {
    const technique = techniques[techniqueKey as keyof typeof techniques];
    setSelectedTechnique(techniqueKey);
    setTimeRemaining(technique.duration);
    setCurrentStep(0);
    setSessionPhase('active');
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionPhase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Memory State Optimization</h2>
          <p className="text-gray-600">Regulate stress to optimize memory formation and recall</p>
        </div>

        {/* Intelligent Recommendation */}
        {intelligentRecommendation && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-indigo-900">AI Analysis</span>
            </div>
            <p className="text-indigo-800">{intelligentRecommendation}</p>
          </div>
        )}

        {/* Stress Level Check */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Current stress level? (Stress impairs memory encoding by up to 50%)
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <button
                key={level}
                onClick={() => setBeforeRating(level)}
                className={`w-8 h-8 rounded-full transition-colors ${
                  level <= beforeRating 
                    ? level <= 3 ? 'bg-green-500' :
                      level <= 6 ? 'bg-yellow-500' :
                      level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                    : 'bg-gray-300'
                }`}
              >
                <span className="text-white text-xs font-bold">{level}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Mic className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Voice Stress Check</span>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              Describe how you're feeling right now - voice analysis can detect stress levels
            </p>
            <EnhancedTextInput
              type="input"
              value=""
              onChange={() => {}}
              placeholder="e.g., I feel overwhelmed by my workload today..."
              showVoiceButton={true}
              showAIEnhancement={true}
              aiContext="emotional"
              onVoiceComplete={(transcript, confidence) => {
                // Analyze stress from voice
                const stressWords = ['overwhelmed', 'stressed', 'anxious', 'worried', 'tired'];
                const words = transcript.toLowerCase().split(/\s+/);
                const stressLevel = stressWords.filter(word => 
                  words.some(w => w.includes(word))
                ).length;
                
                if (stressLevel > 0) {
                  setBeforeRating(Math.min(10, 5 + stressLevel * 2));
                  setVoiceCoaching(`🧠 Voice analysis detected stress indicators. Recommended level: ${Math.min(10, 5 + stressLevel * 2)}/10`);
                }
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {beforeRating <= 3 ? 'Mild stress - any technique will help' :
             beforeRating <= 6 ? 'Moderate stress - breathing or grounding recommended' :
             beforeRating <= 8 ? 'High stress - immediate regulation needed' :
             'Severe stress - start with breathing technique'}
          </div>
        </div>

        {/* Technique Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Choose Your Technique</h3>
          {Object.entries(techniques).map(([key, technique]) => (
            <button
              key={key}
              onClick={() => startTechnique(key)}
              className={`w-full p-4 bg-${technique.color}-50 border border-${technique.color}-200 rounded-xl hover:bg-${technique.color}-100 transition-all text-left`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{technique.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{Math.round(technique.duration / 60)} min</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{technique.effectiveness}% effective</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{technique.description}</p>
              <div className="text-xs text-gray-500">Best for: {technique.bestFor}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (sessionPhase === 'active' && selectedTechnique) {
    const technique = techniques[selectedTechnique as keyof typeof techniques];
    const progress = ((technique.duration - timeRemaining) / technique.duration) * 100;
    const currentInstruction = technique.steps[Math.min(currentStep, technique.steps.length - 1)];

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-${technique.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Heart className={`w-8 h-8 text-${technique.color}-600`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{technique.name}</h2>
          <div className="text-4xl font-bold text-gray-900 mb-2">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-600">Follow the guided instructions</div>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={technique.color === 'blue' ? '#3b82f6' : 
                       technique.color === 'emerald' ? '#10b981' : '#8b5cf6'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-lg font-bold text-${technique.color}-600`}>
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Instruction */}
        <div className={`p-4 bg-${technique.color}-50 rounded-xl border border-${technique.color}-200 mb-6`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className={`w-4 h-4 text-${technique.color}-600`} />
            <span className={`font-medium text-${technique.color}-900`}>Step {currentStep + 1}</span>
          </div>
          <p className={`text-${technique.color}-800`}>{currentInstruction}</p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center space-x-2 px-4 py-2 bg-${technique.color}-600 text-white rounded-lg hover:bg-${technique.color}-700 transition-colors`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>
          
          <button
            onClick={() => {
              if (currentStep < technique.steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              }
            }}
            disabled={currentStep >= technique.steps.length - 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  }

  if (sessionPhase === 'complete') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Regulation Complete</h2>
          <p className="text-gray-600">How are you feeling now?</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stress level after technique (1-10)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setAfterRating(level)}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    level <= afterRating 
                      ? level <= 3 ? 'bg-green-500' :
                        level <= 6 ? 'bg-yellow-500' :
                        level <= 8 ? 'bg-orange-500' : 'bg-red-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span className="text-white text-xs font-bold">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {beforeRating > afterRating && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-emerald-900">Improvement Detected!</span>
              </div>
              <p className="text-emerald-800">
                Stress reduced by {beforeRating - afterRating} points 
                ({Math.round(((beforeRating - afterRating) / beforeRating) * 100)}% improvement)
              </p>
              <div className="mt-2 text-sm text-emerald-700">
                🧠 Your memory systems are now optimized for better encoding and retrieval!
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Memory Science</span>
            </div>
            <p className="text-sm text-blue-800">
              Stress regulation improves memory formation by reducing cortisol interference with the hippocampus. 
              Your brain is now in an optimal state for autobiographical memory work!
            </p>
          </div>

          <button
            onClick={onComplete}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Continue with Clearer Mind
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CognitiveRegulationTools;