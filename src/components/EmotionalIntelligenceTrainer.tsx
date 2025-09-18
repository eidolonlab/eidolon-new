import React, { useState, useEffect } from 'react';
import { Heart, Brain, Target, TrendingUp, Eye, Users, Zap, Award, CheckCircle, Clock, Smile, Frown, Meh } from 'lucide-react';

interface EmotionalState {
  valence: number; // -5 to +5 (negative to positive)
  arousal: number; // 0 to 5 (calm to excited)
  dominance: number; // 0 to 5 (powerless to in control)
  clarity: number; // 0 to 5 (confused to clear)
}

interface EmotionalIntelligenceTrainerProps {
  onComplete: (results: {
    emotionalAccuracy: number;
    regulationSkill: number;
    empathyScore: number;
    socialAwareness: number;
  }) => void;
}

const EmotionalIntelligenceTrainer: React.FC<EmotionalIntelligenceTrainerProps> = ({ onComplete }) => {
  const [currentExercise, setCurrentExercise] = useState<'recognition' | 'regulation' | 'empathy' | 'social'>('recognition');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    valence: 0,
    arousal: 2,
    dominance: 3,
    clarity: 3
  });
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [sessionResults, setSessionResults] = useState({
    emotionalAccuracy: 0,
    regulationSkill: 0,
    empathyScore: 0,
    socialAwareness: 0
  });
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  const exercises = {
    recognition: {
      title: 'Emotional Recognition',
      description: 'Identify and label your current emotional state with precision',
      color: 'pink',
      icon: Heart
    },
    regulation: {
      title: 'Emotional Regulation',
      description: 'Practice techniques to manage and optimize your emotional state',
      color: 'blue',
      icon: Brain
    },
    empathy: {
      title: 'Empathy Training',
      description: 'Understand and connect with others\' emotional experiences',
      color: 'purple',
      icon: Users
    },
    social: {
      title: 'Social Awareness',
      description: 'Read social cues and navigate interpersonal dynamics',
      color: 'emerald',
      icon: Eye
    }
  };

  const emotionalScenarios = [
    {
      id: 'workplace-stress',
      title: 'Workplace Pressure',
      description: 'Your manager just assigned you an urgent project with an impossible deadline.',
      targetEmotion: 'stress management',
      optimalResponse: 'Take a deep breath, break the project into smaller tasks, and communicate realistic timelines.'
    },
    {
      id: 'social-rejection',
      title: 'Social Rejection',
      description: 'You weren\'t invited to a social gathering that most of your friends are attending.',
      targetEmotion: 'disappointment processing',
      optimalResponse: 'Acknowledge the hurt feelings, practice self-compassion, and plan alternative meaningful activities.'
    },
    {
      id: 'achievement-celebration',
      title: 'Personal Achievement',
      description: 'You just received recognition for a project you worked hard on.',
      targetEmotion: 'positive emotion savoring',
      optimalResponse: 'Fully experience the pride, share with supportive people, and reflect on the effort that led to success.'
    }
  ];

  const startExercise = (type: keyof typeof exercises) => {
    setCurrentExercise(type);
    setExerciseProgress(0);
    
    if (type === 'empathy' || type === 'social') {
      const randomScenario = emotionalScenarios[Math.floor(Math.random() * emotionalScenarios.length)];
      setCurrentScenario(randomScenario);
    }
  };

  const renderExerciseContent = () => {
    const exercise = exercises[currentExercise];
    const IconComponent = exercise.icon;

    switch (currentExercise) {
      case 'recognition':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 bg-${exercise.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 text-${exercise.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600">{exercise.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How positive or negative do you feel right now?
                </label>
                <div className="flex items-center space-x-2">
                  <Frown className="w-5 h-5 text-red-500" />
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    value={emotionalState.valence}
                    onChange={(e) => setEmotionalState(prev => ({ ...prev, valence: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <Smile className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium w-8">{emotionalState.valence}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How energized or calm do you feel?
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Calm</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={emotionalState.arousal}
                    onChange={(e) => setEmotionalState(prev => ({ ...prev, arousal: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">Energized</span>
                  <span className="text-sm font-medium w-8">{emotionalState.arousal}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How in control do you feel?
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Powerless</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={emotionalState.dominance}
                    onChange={(e) => setEmotionalState(prev => ({ ...prev, dominance: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">In Control</span>
                  <span className="text-sm font-medium w-8">{emotionalState.dominance}</span>
                </div>
              </div>

              <div className={`p-4 bg-${exercise.color}-50 rounded-lg border border-${exercise.color}-200`}>
                <h4 className={`font-medium text-${exercise.color}-900 mb-2`}>Your Emotional Profile</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Mood:</span> {
                      emotionalState.valence > 2 ? 'Very Positive' :
                      emotionalState.valence > 0 ? 'Positive' :
                      emotionalState.valence === 0 ? 'Neutral' :
                      emotionalState.valence > -3 ? 'Negative' : 'Very Negative'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Energy:</span> {
                      emotionalState.arousal > 3 ? 'High Energy' :
                      emotionalState.arousal > 1 ? 'Moderate' : 'Low Energy'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'regulation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 bg-${exercise.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 text-${exercise.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600">{exercise.description}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Regulation Techniques</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">4-7-8 Breathing</div>
                  <div className="text-sm text-gray-600">Inhale 4, hold 7, exhale 8 - activates parasympathetic nervous system</div>
                </button>
                <button className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">Progressive Muscle Relaxation</div>
                  <div className="text-sm text-gray-600">Tense and release muscle groups to reduce physical stress</div>
                </button>
                <button className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">Cognitive Reframing</div>
                  <div className="text-sm text-gray-600">Challenge negative thoughts and find alternative perspectives</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'empathy':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 bg-${exercise.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 text-${exercise.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600">{exercise.description}</p>
            </div>

            {currentScenario && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">{currentScenario.title}</h4>
                <p className="text-purple-800 mb-4">{currentScenario.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How do you think the other person feels?
                    </label>
                    <textarea
                      placeholder="Describe their emotional state and perspective..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What would be the most empathetic response?
                    </label>
                    <textarea
                      placeholder="How would you respond with empathy and understanding..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 bg-${exercise.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 text-${exercise.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
              <p className="text-gray-600">{exercise.description}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-900 mb-3">Social Cue Reading</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Body Language Awareness</div>
                  <div className="text-sm text-gray-600">Notice posture, gestures, and facial expressions</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Vocal Tone Recognition</div>
                  <div className="text-sm text-gray-600">Listen for pitch, pace, and emotional undertones</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Context Sensitivity</div>
                  <div className="text-sm text-gray-600">Consider environment, relationships, and timing</div>
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Emotional Intelligence Training</h2>
          <p className="text-sm text-gray-600">Build emotional awareness, regulation, and social skills</p>
        </div>
      </div>

      {/* Exercise Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(exercises).map(([key, exercise]) => {
          const IconComponent = exercise.icon;
          return (
            <button
              key={key}
              onClick={() => startExercise(key as keyof typeof exercises)}
              className={`p-4 rounded-lg border transition-all ${
                currentExercise === key
                  ? `border-${exercise.color}-500 bg-${exercise.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 bg-${exercise.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <IconComponent className={`w-4 h-4 text-${exercise.color}-600`} />
              </div>
              <div className="text-sm font-medium text-gray-900">{exercise.title}</div>
            </button>
          );
        })}
      </div>

      {/* Exercise Content */}
      {renderExerciseContent()}

      {/* Complete Session */}
      <div className="mt-6 text-center">
        <button
          onClick={() => onComplete(sessionResults)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
        >
          Complete EQ Training
        </button>
      </div>
    </div>
  );
};

export default EmotionalIntelligenceTrainer;