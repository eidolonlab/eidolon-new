import React, { useState, useEffect } from 'react';
import { Shield, Heart, Zap, Target, Clock, Play, CheckCircle, ArrowRight, Brain, Star, Activity, Lightbulb } from 'lucide-react';

interface AttentionRescueSystemProps {
  userType: 'child' | 'adult';
  onRescueComplete: (technique: string, effectiveness: number) => void;
  currentAttentionLevel: number;
}

const AttentionRescueSystem: React.FC<AttentionRescueSystemProps> = ({
  userType,
  onRescueComplete,
  currentAttentionLevel
}) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [step, setStep] = useState(0);
  const [beforeRating, setBeforeRating] = useState(currentAttentionLevel);
  const [afterRating, setAfterRating] = useState(currentAttentionLevel);

  const rescueTechniques = {
    child: [
      {
        id: 'magic-breathing',
        name: '🌟 Magic Breathing',
        duration: 30,
        description: 'Breathe with the magic balloon to reset your focus powers',
        steps: [
          'Watch the magic balloon grow big as you breathe in',
          'Hold your breath while the balloon sparkles',
          'Breathe out slowly as the balloon shrinks',
          'Feel your focus powers getting stronger!'
        ],
        effectiveness: 85
      },
      {
        id: 'superhero-scan',
        name: '🦸 Superhero Scan',
        duration: 45,
        description: 'Use your superhero vision to scan the room',
        steps: [
          'Put on your invisible superhero goggles',
          'Scan the room for 3 red things',
          'Find 2 things that make sound',
          'Spot 1 thing that smells interesting',
          'Your focus powers are recharged!'
        ],
        effectiveness: 80
      },
      {
        id: 'animal-focus',
        name: '🐱 Animal Focus Game',
        duration: 60,
        description: 'Copy how animals focus and pay attention',
        steps: [
          'Sit like a cat watching a mouse - very still and alert',
          'Listen like an owl - turn your head to hear everything',
          'Look like an eagle - focus on one spot far away',
          'You now have animal focus powers!'
        ],
        effectiveness: 90
      }
    ],
    adult: [
      {
        id: 'attention-reset',
        name: '🧘 Attention Reset',
        duration: 60,
        description: 'Quick mindfulness technique to restore focus',
        steps: [
          'Notice that your attention has wandered (this is normal)',
          'Take 3 deep breaths to activate your parasympathetic system',
          'Gently redirect attention to your intended focus',
          'Set a micro-intention for the next 2 minutes'
        ],
        effectiveness: 85
      },
      {
        id: 'cognitive-anchor',
        name: '⚓ Cognitive Anchoring',
        duration: 45,
        description: 'Create a mental anchor to stabilize attention',
        steps: [
          'Identify what caused your attention to drift',
          'Choose a physical anchor (breath, feet on ground, hands)',
          'Return attention to this anchor whenever it wanders',
          'Set intention to check anchor every 30 seconds'
        ],
        effectiveness: 90
      },
      {
        id: 'attention-triage',
        name: '🎯 Attention Triage',
        duration: 90,
        description: 'Quickly assess and optimize your attention state',
        steps: [
          'Rate your current attention level (1-10)',
          'Identify the biggest distraction right now',
          'Choose: eliminate distraction or change environment',
          'Set a 2-minute focused attention goal',
          'Begin with renewed focus intention'
        ],
        effectiveness: 88
      }
    ]
  };

  const techniques = rescueTechniques[userType];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeRescue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startRescue = (techniqueId: string) => {
    const technique = techniques.find(t => t.id === techniqueId);
    if (!technique) return;
    
    setSelectedTechnique(techniqueId);
    setTimeRemaining(technique.duration);
    setStep(0);
    setIsActive(true);
  };

  const completeRescue = () => {
    const technique = techniques.find(t => t.id === selectedTechnique);
    if (!technique) return;
    
    setIsActive(false);
    
    // Calculate effectiveness based on before/after ratings
    const improvement = Math.max(0, afterRating - beforeRating);
    const effectiveness = Math.min(technique.effectiveness + (improvement * 5), 100);
    
    onRescueComplete(technique.name, effectiveness);
  };

  const getCurrentStep = () => {
    const technique = techniques.find(t => t.id === selectedTechnique);
    if (!technique) return '';
    
    return technique.steps[Math.min(step, technique.steps.length - 1)];
  };

  if (selectedTechnique && isActive) {
    const technique = techniques.find(t => t.id === selectedTechnique);
    if (!technique) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            userType === 'child' 
              ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
              : 'bg-gradient-to-br from-blue-100 to-indigo-100'
          }`}>
            <Shield className={`w-8 h-8 ${
              userType === 'child' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{technique.name}</h2>
          <p className="text-gray-600">{technique.description}</p>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${
            userType === 'child' ? 'text-pink-600' : 'text-blue-600'
          }`}>
            {timeRemaining}s
          </div>
          <div className="text-sm text-gray-600">
            {userType === 'child' ? 'Focus rescue in progress...' : 'Attention reset active'}
          </div>
        </div>

        {/* Current Step */}
        <div className={`p-4 rounded-xl border mb-6 ${
          userType === 'child' 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className={`w-4 h-4 ${
              userType === 'child' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${
              userType === 'child' ? 'text-yellow-900' : 'text-blue-900'
            }`}>
              Step {step + 1}
            </span>
          </div>
          <p className={`${
            userType === 'child' ? 'text-yellow-800' : 'text-blue-800'
          }`}>
            {getCurrentStep()}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userType === 'child'
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => {
              if (step < technique.steps.length - 1) {
                setStep(prev => prev + 1);
              }
            }}
            disabled={step >= technique.steps.length - 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next Step
          </button>
          
          <button
            onClick={completeRescue}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {userType === 'child' ? '🏆 Rescue Complete' : '✅ Reset Complete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          userType === 'child' 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
        }`}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {userType === 'child' ? 'Focus Rescue Station' : 'Attention Rescue System'}
          </h2>
          <p className="text-sm text-gray-600">
            {userType === 'child' ? 
              'Quick techniques to get your focus powers back!' :
              'Rapid attention restoration techniques'
            }
          </p>
        </div>
      </div>

      {/* Attention Level Check */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {userType === 'child' ? 
            'How strong are your focus powers right now?' :
            'Current attention level (1-10)'
          }
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <button
              key={level}
              onClick={() => setBeforeRating(level)}
              className={`w-8 h-8 rounded-full transition-colors ${
                level <= beforeRating 
                  ? userType === 'child'
                    ? level <= 3 ? 'bg-red-500' : level <= 6 ? 'bg-yellow-500' : 'bg-green-500'
                    : level <= 3 ? 'bg-red-500' : level <= 6 ? 'bg-yellow-500' : 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            >
              {userType === 'child' ? (
                level <= 3 ? '😵' : level <= 6 ? '😐' : '😊'
              ) : (
                <span className="text-white text-xs font-bold">{level}</span>
              )}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {userType === 'child' ? 
            (beforeRating <= 3 ? 'Focus powers are low - perfect time for rescue!' :
             beforeRating <= 6 ? 'Focus powers are okay - let\'s make them stronger!' :
             'Focus powers are strong - let\'s keep them that way!') :
            (beforeRating <= 3 ? 'Low attention - rescue techniques recommended' :
             beforeRating <= 6 ? 'Moderate attention - quick reset helpful' :
             'Good attention - maintenance techniques available')
          }
        </div>
      </div>

      {/* Technique Selection */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">
          {userType === 'child' ? 'Choose Your Rescue Adventure:' : 'Select Rescue Technique:'}
        </h3>
        {techniques.map((technique) => (
          <button
            key={technique.id}
            onClick={() => startRescue(technique.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
              userType === 'child'
                ? 'border-pink-200 bg-pink-50 hover:border-pink-300 hover:bg-pink-100'
                : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{technique.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{technique.duration}s</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{technique.effectiveness}% effective</span>
              </div>
            </div>
            <p className={`text-sm ${
              userType === 'child' ? 'text-pink-700' : 'text-blue-700'
            }`}>
              {technique.description}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className={`mt-6 p-4 rounded-xl border ${
        userType === 'child' 
          ? 'bg-purple-50 border-purple-200' 
          : 'bg-indigo-50 border-indigo-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className={`w-4 h-4 ${
            userType === 'child' ? 'text-purple-600' : 'text-indigo-600'
          }`} />
          <span className={`font-medium ${
            userType === 'child' ? 'text-purple-900' : 'text-indigo-900'
          }`}>
            {userType === 'child' ? 'Focus Tips for Superheroes:' : 'Attention Science:'}
          </span>
        </div>
        <div className={`text-sm space-y-1 ${
          userType === 'child' ? 'text-purple-800' : 'text-indigo-800'
        }`}>
          {userType === 'child' ? (
            <>
              <p>• 🌟 It's normal for focus to come and go - you're learning!</p>
              <p>• 🚀 Every time you rescue your focus, you get stronger</p>
              <p>• 💪 Even superheroes need to recharge their powers</p>
            </>
          ) : (
            <>
              <p>• 🧠 Attention naturally fluctuates - this is neurologically normal</p>
              <p>• ⚡ Quick resets prevent attention fatigue and improve overall focus</p>
              <p>• 🎯 Regular rescue practice builds metacognitive awareness</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttentionRescueSystem;