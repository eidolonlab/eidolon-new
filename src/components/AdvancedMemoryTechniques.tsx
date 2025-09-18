import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, Award, Eye, MapPin, Link, Sparkles, Clock, TrendingUp } from 'lucide-react';

interface MemoryTechnique {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  effectiveness: number;
  timeToMaster: number;
  category: 'spatial' | 'verbal' | 'visual' | 'kinesthetic' | 'hybrid';
}

interface AdvancedMemoryTechniquesProps {
  onTechniqueSelect: (technique: MemoryTechnique) => void;
  userLevel: number;
}

const AdvancedMemoryTechniques: React.FC<AdvancedMemoryTechniquesProps> = ({ onTechniqueSelect, userLevel }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<MemoryTechnique | null>(null);
  const [masteredTechniques, setMasteredTechniques] = useState<string[]>([]);
  const [practiceSession, setPracticeSession] = useState<any>(null);

  const techniques: MemoryTechnique[] = [
    {
      id: 'memory-palace',
      name: 'Memory Palace (Method of Loci)',
      description: 'Use familiar spatial locations to store and retrieve information in sequence',
      difficulty: 'intermediate',
      effectiveness: 95,
      timeToMaster: 14,
      category: 'spatial'
    },
    {
      id: 'peg-system',
      name: 'Peg System',
      description: 'Associate numbers with memorable images to create a reusable memory framework',
      difficulty: 'advanced',
      effectiveness: 90,
      timeToMaster: 21,
      category: 'visual'
    },
    {
      id: 'story-method',
      name: 'Story Method',
      description: 'Link unrelated items together in a vivid, memorable narrative',
      difficulty: 'beginner',
      effectiveness: 85,
      timeToMaster: 7,
      category: 'verbal'
    },
    {
      id: 'major-system',
      name: 'Major System',
      description: 'Convert numbers into consonant sounds, then into memorable words',
      difficulty: 'advanced',
      effectiveness: 92,
      timeToMaster: 28,
      category: 'hybrid'
    },
    {
      id: 'mind-mapping',
      name: 'Advanced Mind Mapping',
      description: 'Create visual knowledge networks with color, imagery, and spatial relationships',
      difficulty: 'intermediate',
      effectiveness: 88,
      timeToMaster: 10,
      category: 'visual'
    },
    {
      id: 'chunking-plus',
      name: 'Intelligent Chunking',
      description: 'Group information into meaningful patterns and hierarchical structures',
      difficulty: 'beginner',
      effectiveness: 80,
      timeToMaster: 5,
      category: 'verbal'
    }
  ];

  const unlockedTechniques = techniques.filter(t => {
    const levelRequirements = {
      beginner: 1,
      intermediate: 3,
      advanced: 6
    };
    return userLevel >= levelRequirements[t.difficulty];
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spatial': return MapPin;
      case 'visual': return Eye;
      case 'verbal': return Brain;
      case 'kinesthetic': return Target;
      case 'hybrid': return Link;
      default: return Sparkles;
    }
  };

  const startPracticeSession = (technique: MemoryTechnique) => {
    setSelectedTechnique(technique);
    
    // Generate practice content based on technique
    const practiceContent = generatePracticeContent(technique);
    setPracticeSession(practiceContent);
  };

  const generatePracticeContent = (technique: MemoryTechnique) => {
    switch (technique.id) {
      case 'memory-palace':
        return {
          title: 'Memory Palace Practice',
          instructions: 'Choose a familiar location (your home, office, or school) and mentally walk through it.',
          items: ['Apple', 'Bicycle', 'Camera', 'Diamond', 'Elephant', 'Fountain', 'Guitar', 'Hammer'],
          steps: [
            'Visualize your chosen location clearly',
            'Place each item in a specific spot along your route',
            'Create vivid, exaggerated interactions between items and locations',
            'Walk through your palace mentally to recall all items'
          ]
        };
      case 'story-method':
        return {
          title: 'Story Method Practice',
          instructions: 'Create a memorable story that connects all these unrelated items.',
          items: ['Telescope', 'Pizza', 'Robot', 'Butterfly', 'Volcano', 'Library', 'Surfboard', 'Crown'],
          steps: [
            'Start with the first item and create a vivid scene',
            'Connect each subsequent item through action or interaction',
            'Make the story bizarre, funny, or emotionally engaging',
            'Practice telling the story to recall all items'
          ]
        };
      default:
        return {
          title: 'Practice Session',
          instructions: 'Follow the guided practice for this technique.',
          items: [],
          steps: []
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Advanced Memory Techniques</h2>
          <p className="text-sm text-gray-600">Master professional-level memory methods</p>
        </div>
      </div>

      {!practiceSession ? (
        <div className="space-y-6">
          {/* Technique Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {unlockedTechniques.map((technique) => {
              const CategoryIcon = getCategoryIcon(technique.category);
              const difficultyColor = getDifficultyColor(technique.difficulty);
              const isMastered = masteredTechniques.includes(technique.id);
              
              return (
                <div
                  key={technique.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isMastered 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${difficultyColor}-100 rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`w-5 h-5 text-${difficultyColor}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{technique.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 bg-${difficultyColor}-100 text-${difficultyColor}-800 rounded-full capitalize`}>
                            {technique.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{technique.category}</span>
                        </div>
                      </div>
                    </div>
                    {isMastered && <Award className="w-5 h-5 text-emerald-600" />}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{technique.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500">
                      Effectiveness: {technique.effectiveness}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Master in: {technique.timeToMaster} days
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startPracticeSession(technique)}
                    className={`w-full py-2 rounded-lg transition-colors ${
                      isMastered
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : `bg-${difficultyColor}-600 text-white hover:bg-${difficultyColor}-700`
                    }`}
                  >
                    {isMastered ? 'Practice Again' : 'Start Learning'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Locked Techniques */}
          {techniques.filter(t => !unlockedTechniques.includes(t)).length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Unlock at Higher Levels</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {techniques.filter(t => !unlockedTechniques.includes(t)).map((technique) => {
                  const CategoryIcon = getCategoryIcon(technique.category);
                  const difficultyColor = getDifficultyColor(technique.difficulty);
                  const levelRequirements = {
                    beginner: 1,
                    intermediate: 3,
                    advanced: 6
                  };
                  
                  return (
                    <div
                      key={technique.id}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-75"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">{technique.name}</h3>
                          <span className="text-xs text-gray-500">
                            Unlock at Level {levelRequirements[technique.difficulty]}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{technique.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Practice Session
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPracticeSession(null)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Techniques
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{practiceSession.title}</h3>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-indigo-800">{practiceSession.instructions}</p>
          </div>

          {practiceSession.items.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Items to Remember:</h4>
              <div className="grid grid-cols-4 gap-3">
                {practiceSession.items.map((item: string, index: number) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg text-center">
                    <div className="font-medium text-gray-900">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {practiceSession.steps.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Practice Steps:</h4>
              <div className="space-y-2">
                {practiceSession.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                // Mark technique as practiced
                if (selectedTechnique && !masteredTechniques.includes(selectedTechnique.id)) {
                  setMasteredTechniques(prev => [...prev, selectedTechnique.id]);
                }
                setPracticeSession(null);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Complete Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMemoryTechniques;