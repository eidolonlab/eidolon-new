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
  const [adaptiveCoaching, setAdaptiveCoaching] = useState<string>('');
  const [emotionalInsights, setEmotionalInsights] = useState<string[]>([]);

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
      optimalResponse: 'Take a deep breath, break the project into smaller tasks, and communicate realistic timelines.',
      emotionalChallenge: 'Managing overwhelm while maintaining professionalism'
    },
    {
      id: 'social-rejection',
      title: 'Social Rejection',
      description: 'You weren\'t invited to a social gathering that most of your friends are attending.',
      targetEmotion: 'disappointment processing',
      optimalResponse: 'Acknowledge the hurt feelings, practice self-compassion, and plan alternative meaningful activities.',
      emotionalChallenge: 'Processing rejection without self-blame'
    },
    {
      id: 'achievement-celebration',
      title: 'Personal Achievement',
      description: 'You just received recognition for a project you worked hard on.',
      targetEmotion: 'positive emotion savoring',
      optimalResponse: 'Fully experience the pride, share with supportive people, and reflect on the effort that led to success.',
      emotionalChallenge: 'Allowing yourself to feel proud without minimizing'
    },
    {
      id: 'conflict-resolution',
      title: 'Interpersonal Conflict',
      description: 'A close friend criticized something important to you in front of others.',
      targetEmotion: 'hurt and anger management',
      optimalResponse: 'Acknowledge your feelings, seek to understand their perspective, and address the issue privately.',
      emotionalChallenge: 'Managing hurt feelings while preserving the relationship'
    }
  ];

  const regulationTechniques = [
    {
      name: '4-7-8 Breathing',
      description: 'Inhale 4, hold 7, exhale 8 - activates parasympathetic nervous system',
      effectiveness: 85,
      timeToEffect: 2,
      bestFor: ['anxiety', 'stress', 'overwhelm']
    },
    {
      name: 'Progressive Muscle Relaxation',
      description: 'Tense and release muscle groups to reduce physical stress',
      effectiveness: 80,
      timeToEffect: 5,
      bestFor: ['tension', 'anger', 'physical stress']
    },
    {
      name: 'Cognitive Reframing',
      description: 'Challenge negative thoughts and find alternative perspectives',
      effectiveness: 90,
      timeToEffect: 3,
      bestFor: ['negative thinking', 'catastrophizing', 'self-criticism']
    },
    {
      name: '5-4-3-2-1 Grounding',
      description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste',
      effectiveness: 75,
      timeToEffect: 1,
      bestFor: ['panic', 'dissociation', 'overwhelm']
    }
  ];

  useEffect(() => {
    generateAdaptiveCoaching();
    analyzeEmotionalPatterns();
  }, [emotionalState, currentExercise]);

  const generateAdaptiveCoaching = () => {
    const { valence, arousal, dominance, clarity } = emotionalState;
    
    if (valence < -2 && arousal > 3) {
      setAdaptiveCoaching("High negative energy detected. Consider the 4-7-8 breathing technique to calm your nervous system.");
    } else if (valence > 2 && arousal < 2) {
      setAdaptiveCoaching("Positive but low energy. This is perfect for reflection and gratitude exercises.");
    } else if (dominance < 2) {
      setAdaptiveCoaching("Feeling powerless? Try the cognitive reframing exercise to regain perspective and control.");
    } else if (clarity < 2) {
      setAdaptiveCoaching("Emotional confusion detected. The 5-4-3-2-1 grounding technique can help clarify your state.");
    } else {
      setAdaptiveCoaching("Balanced emotional state - excellent for empathy and social awareness training.");
    }
  };

  const analyzeEmotionalPatterns = () => {
    const insights = [];
    
    if (emotionalState.valence > 2) {
      insights.push("You're in a positive emotional state - great for building empathy and social connections");
    }
    if (emotionalState.arousal > 3 && emotionalState.dominance > 3) {
      insights.push("High energy + high control = optimal state for challenging emotional work");
    }
    if (emotionalState.clarity > 3) {
      insights.push("Clear emotional awareness - you're developing strong emotional intelligence");
    }
    
    setEmotionalInsights(insights);
  };

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
                
                {adaptiveCoaching && (
                  <div className="mt-3 p-3 bg-white rounded border border-pink-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Brain className="w-3 h-3 text-pink-600" />
                      <span className="text-xs font-medium text-pink-800">AI Coach</span>
                    </div>
                    <p className="text-xs text-pink-700">{adaptiveCoaching}</p>
                  </div>
                )}
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
              <h4 className="font-medium text-blue-900 mb-3">Personalized Regulation Techniques</h4>
              <div className="space-y-3">
                {regulationTechniques.map((technique, index) => (
                  <button 
                    key={index}
                    className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{technique.name}</div>
                      <div className="text-xs text-blue-600">{technique.effectiveness}% effective</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{technique.description}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Effect in {technique.timeToEffect} min</span>
                      <span>•</span>
                      <span>Best for: {technique.bestFor.join(', ')}</span>
                    </div>
                  </button>
                ))}
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
                <p className="text-purple-800 mb-3">{currentScenario.description}</p>
                <div className="text-xs text-purple-600 mb-4">
                  <strong>Challenge:</strong> {currentScenario.emotionalChallenge}
                </div>
                
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
                
                <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                  <div className="text-xs font-medium text-purple-800 mb-1">Optimal Response:</div>
                  <div className="text-xs text-purple-700">{currentScenario.optimalResponse}</div>
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
              <h4 className="font-medium text-emerald-900 mb-3">Social Intelligence Skills</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Body Language Mastery</div>
                  <div className="text-sm text-gray-600">Read posture, gestures, and micro-expressions</div>
                  <div className="text-xs text-emerald-600 mt-1">85% of communication is non-verbal</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Vocal Tone Analysis</div>
                  <div className="text-sm text-gray-600">Detect emotions through pitch, pace, and volume</div>
                  <div className="text-xs text-emerald-600 mt-1">Voice reveals true emotional state</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="font-medium text-gray-900 mb-1">Context Intelligence</div>
                  <div className="text-sm text-gray-600">Understand environment, relationships, and timing</div>
                  <div className="text-xs text-emerald-600 mt-1">Context shapes all social interactions</div>
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

      {/* Emotional Insights */}
      {emotionalInsights.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">Your Emotional Intelligence</span>
          </div>
          <div className="space-y-1">
            {emotionalInsights.map((insight, index) => (
              <div key={index} className="text-sm text-indigo-800">• {insight}</div>
            ))}
          </div>
        </div>
      )}

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