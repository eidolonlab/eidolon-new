import React, { useState, useEffect } from 'react';
import { Heart, Brain, Clock, Target, Play, Pause, CheckCircle, Zap, Shield, Lightbulb, Activity } from 'lucide-react';

interface AnxietyState {
  intensity: number; // 1-10
  type: 'general' | 'social' | 'performance' | 'health' | 'existential';
  physicalSymptoms: string[];
  cognitiveSymptoms: string[];
  triggers: string[];
}

interface RegulationTechnique {
  id: string;
  name: string;
  duration: number;
  effectiveness: number;
  type: 'acute' | 'preventive';
  instructions: string[];
  bestFor: string[];
}

interface AnxietyRegulationToolkitProps {
  onRegulationComplete: (results: {
    technique: string;
    beforeRating: number;
    afterRating: number;
    effectiveness: number;
  }) => void;
}

const AnxietyRegulationToolkit: React.FC<AnxietyRegulationToolkitProps> = ({ onRegulationComplete }) => {
  const [mode, setMode] = useState<'assess' | 'acute' | 'preventive' | 'active' | 'complete'>('assess');
  const [anxietyState, setAnxietyState] = useState<AnxietyState>({
    intensity: 5,
    type: 'general',
    physicalSymptoms: [],
    cognitiveSymptoms: [],
    triggers: []
  });
  const [selectedTechnique, setSelectedTechnique] = useState<RegulationTechnique | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [beforeRating, setBeforeRating] = useState(5);
  const [afterRating, setAfterRating] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const acuteTechniques: RegulationTechnique[] = [
    {
      id: '478-breathing',
      name: '4-7-8 Breathing',
      duration: 120,
      effectiveness: 85,
      type: 'acute',
      instructions: [
        'Exhale completely through your mouth',
        'Close your mouth, inhale through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 3-4 cycles'
      ],
      bestFor: ['panic', 'racing thoughts', 'physical tension']
    },
    {
      id: '54321-grounding',
      name: '5-4-3-2-1 Grounding',
      duration: 90,
      effectiveness: 80,
      type: 'acute',
      instructions: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      bestFor: ['dissociation', 'overwhelm', 'panic attacks']
    },
    {
      id: 'progressive-relaxation',
      name: 'Progressive Muscle Relaxation',
      duration: 180,
      effectiveness: 90,
      type: 'acute',
      instructions: [
        'Start with your toes - tense for 5 seconds, then release',
        'Move to your calves - tense and release',
        'Continue up through legs, abdomen, arms, shoulders',
        'Finish with face muscles - scrunch and release',
        'Notice the contrast between tension and relaxation'
      ],
      bestFor: ['physical tension', 'insomnia', 'chronic stress']
    }
  ];

  const preventiveTechniques: RegulationTechnique[] = [
    {
      id: 'cognitive-reframe',
      name: 'Cognitive Reframing',
      duration: 300,
      effectiveness: 88,
      type: 'preventive',
      instructions: [
        'Identify the anxious thought',
        'Ask: "Is this thought helpful or accurate?"',
        'Generate 3 alternative perspectives',
        'Choose the most balanced, realistic view',
        'Practice the new thought pattern'
      ],
      bestFor: ['catastrophizing', 'negative thinking', 'worry loops']
    },
    {
      id: 'implementation-intentions',
      name: 'If-Then Anxiety Plans',
      duration: 240,
      effectiveness: 85,
      type: 'preventive',
      instructions: [
        'Identify your anxiety trigger',
        'Create specific if-then plan: "If I feel X, then I will Y"',
        'Make the response specific and actionable',
        'Visualize executing the plan successfully',
        'Practice the response mentally'
      ],
      bestFor: ['anticipatory anxiety', 'social anxiety', 'performance anxiety']
    },
    {
      id: 'safe-script',
      name: 'Safe Script Audio',
      duration: 180,
      effectiveness: 82,
      type: 'preventive',
      instructions: [
        'Record yourself saying calming, true statements',
        'Include: "I am safe right now", "This feeling will pass"',
        'Add personal strengths: "I have handled difficult things before"',
        'Use a calm, caring tone like talking to a friend',
        'Play back when anxiety rises'
      ],
      bestFor: ['self-criticism', 'isolation', 'emotional overwhelm']
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && sessionTime < (selectedTechnique?.duration || 0)) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, sessionTime, selectedTechnique]);

  const startTechnique = (technique: RegulationTechnique) => {
    setSelectedTechnique(technique);
    setBeforeRating(anxietyState.intensity);
    setMode('active');
    setSessionTime(0);
    setCurrentStep(0);
    setIsActive(true);
  };

  const completeSession = () => {
    if (!selectedTechnique) return;

    const effectiveness = Math.max(0, beforeRating - afterRating) / beforeRating * 100;
    
    onRegulationComplete({
      technique: selectedTechnique.name,
      beforeRating,
      afterRating,
      effectiveness
    });

    setMode('complete');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'assess') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Anxiety Regulation Toolkit</h2>
            <p className="text-sm text-gray-600">Acute relief and preventive strategies</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Current anxiety level (1-10)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setAnxietyState(prev => ({ ...prev, intensity: level }))}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    level <= anxietyState.intensity 
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
            <div className="text-xs text-gray-500 mt-1">
              {anxietyState.intensity <= 3 ? 'Mild - Preventive techniques recommended' :
               anxietyState.intensity <= 6 ? 'Moderate - Both acute and preventive helpful' :
               anxietyState.intensity <= 8 ? 'High - Acute techniques recommended' :
               'Severe - Immediate acute intervention needed'}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('acute')}
              className={`p-6 rounded-lg border-2 transition-all ${
                anxietyState.intensity > 6 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-red-300 hover:border-red-400'
              }`}
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Acute Relief</h3>
              <p className="text-sm text-gray-600">60-180 second techniques for immediate relief</p>
              {anxietyState.intensity > 6 && (
                <div className="mt-2 text-xs text-red-600 font-medium">Recommended for your current level</div>
              )}
            </button>

            <button
              onClick={() => setMode('preventive')}
              className={`p-6 rounded-lg border-2 transition-all ${
                anxietyState.intensity <= 6 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-blue-300 hover:border-blue-400'
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preventive Strategies</h3>
              <p className="text-sm text-gray-600">3-5 minute techniques for long-term resilience</p>
              {anxietyState.intensity <= 6 && (
                <div className="mt-2 text-xs text-blue-600 font-medium">Ideal for building resilience</div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'acute' || mode === 'preventive') {
    const techniques = mode === 'acute' ? acuteTechniques : preventiveTechniques;
    const modeColor = mode === 'acute' ? 'red' : 'blue';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'acute' ? 'Acute Relief Techniques' : 'Preventive Strategies'}
          </h2>
          <button
            onClick={() => setMode('assess')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="space-y-4">
          {techniques.map((technique) => (
            <button
              key={technique.id}
              onClick={() => startTechnique(technique)}
              className={`w-full p-4 bg-${modeColor}-50 border border-${modeColor}-200 rounded-lg hover:bg-${modeColor}-100 transition-all text-left`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{technique.name}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{technique.duration}s duration</span>
                    <span>•</span>
                    <span>{technique.effectiveness}% effective</span>
                    <span>•</span>
                    <span className="capitalize">{technique.type}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 bg-${modeColor}-200 text-${modeColor}-800 rounded-full text-xs font-medium`}>
                  {Math.round(technique.duration / 60)} min
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                Best for: {technique.bestFor.join(', ')}
              </div>
              
              <div className="space-y-1">
                {technique.instructions.slice(0, 2).map((instruction, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    {index + 1}. {instruction}
                  </div>
                ))}
                {technique.instructions.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{technique.instructions.length - 2} more steps...
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'active' && selectedTechnique) {
    const progress = (sessionTime / selectedTechnique.duration) * 100;
    const currentInstruction = selectedTechnique.instructions[currentStep] || 'Continue with the technique...';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedTechnique.name}</h2>
          <p className="text-gray-600">Follow the guided instructions</p>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {formatTime(selectedTechnique.duration - sessionTime)}
          </div>
          <div className="text-sm text-gray-600">Time remaining</div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Step {currentStep + 1}</span>
          </div>
          <p className="text-blue-800">{currentInstruction}</p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>
          
          <button
            onClick={() => {
              if (currentStep < selectedTechnique.instructions.length - 1) {
                setCurrentStep(prev => prev + 1);
              }
            }}
            disabled={currentStep >= selectedTechnique.instructions.length - 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next Step
          </button>
          
          <button
            onClick={() => setMode('complete')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'complete') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Complete</h2>
          <p className="text-gray-600">How are you feeling now?</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anxiety level after technique (1-10)
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
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-emerald-900">Improvement Detected!</span>
              </div>
              <p className="text-emerald-800">
                Anxiety reduced by {beforeRating - afterRating} points ({Math.round(((beforeRating - afterRating) / beforeRating) * 100)}% improvement)
              </p>
            </div>
          )}

          <button
            onClick={completeSession}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Results & Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AnxietyRegulationToolkit;