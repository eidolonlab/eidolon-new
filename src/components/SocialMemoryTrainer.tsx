import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageSquare, Eye, Smile, Target, Award, TrendingUp, Clock } from 'lucide-react';

interface SocialMemoryTrainerProps {
  onComplete: (results: {
    nameRecall: number;
    conversationRetention: number;
    socialCueRecognition: number;
    relationshipBuilding: number;
  }) => void;
}

const SocialMemoryTrainer: React.FC<SocialMemoryTrainerProps> = ({ onComplete }) => {
  const [currentExercise, setCurrentExercise] = useState<'names' | 'conversations' | 'cues' | 'relationships'>('names');
  const [exerciseData, setExerciseData] = useState<any>({});
  const [sessionResults, setSessionResults] = useState({
    nameRecall: 0,
    conversationRetention: 0,
    socialCueRecognition: 0,
    relationshipBuilding: 0
  });

  const exercises = {
    names: {
      title: 'Name & Face Association',
      description: 'Master the art of remembering names and connecting them to faces',
      color: 'blue',
      icon: Users,
      practice: {
        instruction: 'Study these name-face pairs, then test your recall',
        pairs: [
          { name: 'Sarah Chen', profession: 'Software Engineer', detail: 'Loves hiking' },
          { name: 'Marcus Johnson', profession: 'Teacher', detail: 'Plays guitar' },
          { name: 'Elena Rodriguez', profession: 'Doctor', detail: 'Speaks 4 languages' },
          { name: 'David Kim', profession: 'Artist', detail: 'Vegetarian chef' }
        ]
      }
    },
    conversations: {
      title: 'Conversation Memory',
      description: 'Remember key details from social interactions and follow up meaningfully',
      color: 'emerald',
      icon: MessageSquare,
      practice: {
        instruction: 'Read this conversation, then answer questions about important details',
        scenario: 'Coffee shop conversation about weekend plans and work projects'
      }
    },
    cues: {
      title: 'Social Cue Reading',
      description: 'Recognize and remember non-verbal communication and emotional states',
      color: 'purple',
      icon: Eye,
      practice: {
        instruction: 'Observe and interpret social situations',
        scenarios: ['Body language analysis', 'Tone recognition', 'Group dynamics']
      }
    },
    relationships: {
      title: 'Relationship Building',
      description: 'Use memory techniques to deepen connections and show genuine interest',
      color: 'pink',
      icon: Heart,
      practice: {
        instruction: 'Practice remembering personal details that matter to others',
        categories: ['Personal interests', 'Important dates', 'Family details', 'Goals and dreams']
      }
    }
  };

  const renderExerciseContent = () => {
    const exercise = exercises[currentExercise];
    const IconComponent = exercise.icon;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className={`w-16 h-16 bg-${exercise.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className={`w-8 h-8 text-${exercise.color}-600`} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
          <p className="text-gray-600">{exercise.description}</p>
        </div>

        {currentExercise === 'names' && (
          <div className="space-y-4">
            <div className={`p-4 bg-${exercise.color}-50 rounded-lg border border-${exercise.color}-200`}>
              <p className={`text-${exercise.color}-800 mb-4`}>{exercise.practice.instruction}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {exercise.practice.pairs.map((pair: any, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-900">{pair.name}</div>
                    <div className="text-sm text-gray-600">{pair.profession}</div>
                    <div className="text-xs text-gray-500 mt-1">{pair.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  // Start name recall test
                  alert('Name recall test would start here - testing memory of the name-face pairs');
                }}
                className={`px-6 py-3 bg-${exercise.color}-600 text-white rounded-lg hover:bg-${exercise.color}-700 transition-colors`}
              >
                Test Your Recall
              </button>
            </div>
          </div>
        )}

        {currentExercise === 'conversations' && (
          <div className="space-y-4">
            <div className={`p-4 bg-${exercise.color}-50 rounded-lg border border-${exercise.color}-200`}>
              <h4 className={`font-medium text-${exercise.color}-900 mb-3`}>Conversation Scenario</h4>
              <div className="p-3 bg-white rounded-lg border border-gray-200 mb-4">
                <p className="text-gray-700 italic">
                  "Hey! How was your weekend? I ended up going hiking at Bear Mountain - the weather was perfect. 
                  Oh, and I finally finished that big presentation for the Johnson account. My manager loved it! 
                  What about you? Didn't you mention you were working on that photography project?"
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What personal details should you remember for future conversations?
                  </label>
                  <textarea
                    placeholder="List the important details you'd want to follow up on..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentExercise === 'cues' && (
          <div className="space-y-4">
            <div className={`p-4 bg-${exercise.color}-50 rounded-lg border border-${exercise.color}-200`}>
              <h4 className={`font-medium text-${exercise.color}-900 mb-3`}>Social Cue Recognition</h4>
              <div className="space-y-3">
                {exercise.practice.scenarios.map((scenario: string, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-900 mb-2">{scenario}</div>
                    <div className="text-sm text-gray-600">
                      Practice identifying and remembering {scenario.toLowerCase()} patterns
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentExercise === 'relationships' && (
          <div className="space-y-4">
            <div className={`p-4 bg-${exercise.color}-50 rounded-lg border border-${exercise.color}-200`}>
              <h4 className={`font-medium text-${exercise.color}-900 mb-3`}>Relationship Memory Categories</h4>
              <div className="grid grid-cols-2 gap-3">
                {exercise.practice.categories.map((category: string, index: number) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="font-medium text-gray-900">{category}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice: Think of someone important to you and list details from each category
                </label>
                <textarea
                  placeholder="Name: [Person's name]&#10;Personal interests: [What they love]&#10;Important dates: [Birthdays, anniversaries]&#10;Family details: [Family members, pets]&#10;Goals and dreams: [What they're working toward]"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      ) : (
        // Practice session content would go here
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Practice session interface would be implemented here</p>
        </div>
      )}

      {/* Exercise Navigation */}
      <div className="mt-6 flex justify-center space-x-2">
        {Object.entries(exercises).map(([key, exercise]) => (
          <button
            key={key}
            onClick={() => setCurrentExercise(key as keyof typeof exercises)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentExercise === key
                ? `bg-${exercise.color}-100 text-${exercise.color}-700`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {exercise.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialMemoryTrainer;