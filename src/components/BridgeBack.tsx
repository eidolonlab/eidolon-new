import React, { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle, Plus, Trash2, Award, AlertCircle, Zap, Brain } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface BridgeBackProps {
  weaveId: string;
  onClose: () => void;
}

const BridgeBack: React.FC<BridgeBackProps> = ({ weaveId, onClose }) => {
  const { getWeaveById, updateWeave } = useWeave();
  const weave = getWeaveById(weaveId);
  const [newFactualAnchor, setNewFactualAnchor] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    question: string;
    answer: string;
    userAnswer: string;
    isCorrect?: boolean;
  } | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [smartFactSuggestions, setSmartFactSuggestions] = useState<string[]>([]);
  const [showFactHelper, setShowFactHelper] = useState(false);

  if (!weave) return null;

  const bridgeData = weave.bridgeData || {
    factualAnchors: [],
    peopleInvolved: [],
  };

  const updateBridgeData = (newData: Partial<typeof bridgeData>) => {
    updateWeave(weaveId, {
      bridgeData: { ...bridgeData, ...newData }
    });
  };

  const addFactualAnchor = () => {
    if (!newFactualAnchor.trim()) return;
    updateBridgeData({
      factualAnchors: [...bridgeData.factualAnchors, newFactualAnchor.trim()]
    });
    setNewFactualAnchor('');
  };

  const removeFactualAnchor = (index: number) => {
    updateBridgeData({
      factualAnchors: bridgeData.factualAnchors.filter((_, i) => i !== index)
    });
  };

  const addPerson = () => {
    if (!newPerson.trim()) return;
    const people = bridgeData.peopleInvolved || [];
    updateBridgeData({
      peopleInvolved: [...people, newPerson.trim()]
    });
    setNewPerson('');
  };

  const removePerson = (index: number) => {
    const people = bridgeData.peopleInvolved || [];
    updateBridgeData({
      peopleInvolved: people.filter((_, i) => i !== index)
    });
  };

  const generateQuiz = () => {
    const quizQuestions = [];
    
    // Date-based questions
    if (weave.createdAt) {
      quizQuestions.push({
        question: `What day of the week was "${weave.title}"?`,
        answer: weave.createdAt.toLocaleDateString('en-US', { weekday: 'long' }),
      });
      quizQuestions.push({
        question: `What month did "${weave.title}" happen?`,
        answer: weave.createdAt.toLocaleDateString('en-US', { month: 'long' }),
      });
    }
    
    // People-based questions
    if (bridgeData.peopleInvolved && bridgeData.peopleInvolved.length > 0) {
      quizQuestions.push({
        question: `Who was involved in "${weave.title}"?`,
        answer: bridgeData.peopleInvolved.join(', '),
      });
      if (bridgeData.peopleInvolved.length > 1) {
        quizQuestions.push({
          question: `How many people were involved in "${weave.title}"?`,
          answer: bridgeData.peopleInvolved.length.toString(),
        });
      }
    }
    
    // Factual anchor questions
    if (bridgeData.factualAnchors && bridgeData.factualAnchors.length > 0) {
      const randomAnchor = bridgeData.factualAnchors[Math.floor(Math.random() * bridgeData.factualAnchors.length)];
      quizQuestions.push({
        question: `True or False: "${randomAnchor}" is a factual detail from this memory?`,
        answer: 'True',
      });
    }
    
    if (quizQuestions.length === 0) {
      // Fallback question
      quizQuestions.push({
        question: `What was the main event in "${weave.title}"?`,
        answer: weave.seed,
      });
    }

    const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    setCurrentQuiz({
      ...randomQuiz,
      userAnswer: '',
    });
    setQuizMode(true);
  };

  const submitQuizAnswer = () => {
    if (!currentQuiz) return;
    
    const userAnswer = currentQuiz.userAnswer.toLowerCase().trim();
    const correctAnswer = currentQuiz.answer.toLowerCase().trim();
    
    let isCorrect = false;
    
    // More sophisticated answer checking
    if (currentQuiz.question.includes('True or False')) {
      isCorrect = userAnswer.includes('true') || userAnswer.includes('yes');
    } else if (currentQuiz.question.includes('How many')) {
      const userNumber = parseInt(userAnswer);
      const correctNumber = parseInt(correctAnswer);
      isCorrect = userNumber === correctNumber;
    } else {
      // Check if user answer contains key words from correct answer
      const correctWords = correctAnswer.split(/\s+|,\s*/);
      isCorrect = correctWords.some(word => 
        word.length > 2 && userAnswer.includes(word)
      );
    }
    
    setCurrentQuiz({
      ...currentQuiz,
      isCorrect,
    });
    
    // Update quiz score
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizMode(false);
  };

  const generateSmartFactSuggestions = () => {
    const suggestions = [];
    const narrative = weave.narrative.toLowerCase();
    const seed = weave.seed.toLowerCase();
    
    // Date-related suggestions
    suggestions.push(`This happened on ${weave.createdAt.toLocaleDateString('en-US', { weekday: 'long' })}`);
    suggestions.push(`The date was ${weave.createdAt.toLocaleDateString()}`);
    
    // Time-based suggestions
    if (narrative.includes('morning')) {
      suggestions.push('It was in the morning hours');
    } else if (narrative.includes('evening')) {
      suggestions.push('This took place in the evening');
    } else if (narrative.includes('afternoon')) {
      suggestions.push('It happened during the afternoon');
    }
    
    // Location suggestions based on content
    if (narrative.includes('restaurant') || narrative.includes('eating')) {
      suggestions.push('The restaurant was located on [street name]');
      suggestions.push('We sat at a [table description] table');
    }
    if (narrative.includes('office') || narrative.includes('work')) {
      suggestions.push('This was at [company name] office');
      suggestions.push('The meeting room was on the [floor number] floor');
    }
    if (narrative.includes('home') || narrative.includes('house')) {
      suggestions.push('This was at [address or neighborhood]');
      suggestions.push('The room faced [direction]');
    }
    
    // Weather and environmental facts
    if (narrative.includes('sunny') || narrative.includes('bright')) {
      suggestions.push('It was a sunny day with clear skies');
    }
    if (narrative.includes('rain') || narrative.includes('wet')) {
      suggestions.push('It was raining that day');
    }
    
    // Duration and timing
    suggestions.push('The entire experience lasted approximately [duration]');
    suggestions.push('We arrived at [specific time]');
    
    setSmartFactSuggestions(suggestions.slice(0, 8));
    setShowFactHelper(true);
  };
  if (quizMode && currentQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Memory Bridge Quiz</h2>
            {quizScore.total > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-gray-600">{quizScore.correct}/{quizScore.total}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-900 font-medium">{currentQuiz.question}</p>
            </div>
            
            {currentQuiz.isCorrect === undefined ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={currentQuiz.userAnswer}
                  onChange={(e) => setCurrentQuiz({
                    ...currentQuiz,
                    userAnswer: e.target.value
                  })}
                  placeholder="Your answer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex space-x-3">
                  <button
                    onClick={submitQuizAnswer}
                    disabled={!currentQuiz.userAnswer.trim()}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                  currentQuiz.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {currentQuiz.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      currentQuiz.isCorrect ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {currentQuiz.isCorrect ? 'Correct!' : 'Not quite right'}
                    </p>
                    <p className={`text-sm ${
                      currentQuiz.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {currentQuiz.isCorrect ? 'Well done!' : `The answer was: ${currentQuiz.answer}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={generateQuiz}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Try Another
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bridge Back - Factual Anchors</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-96">
          {/* Memory Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{weave.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Seed: "{weave.seed}"</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{weave.createdAt.toLocaleDateString()}</span>
              </div>
              {bridgeData.factualAnchors.length > 0 && (
                <>
                  <span>•</span>
                  <span>{bridgeData.factualAnchors.length} fact{bridgeData.factualAnchors.length !== 1 ? 's' : ''}</span>
                </>
              )}
              {bridgeData.peopleInvolved && bridgeData.peopleInvolved.length > 0 && (
                <>
                  <span>•</span>
                  <span>{bridgeData.peopleInvolved.length} person{bridgeData.peopleInvolved.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>

          {/* Factual Anchors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Factual Anchors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add objective facts that can be verified - dates, locations, people, events that happened.
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                {bridgeData.factualAnchors.length} fact{bridgeData.factualAnchors.length !== 1 ? 's' : ''} added
              </div>
              <button
                onClick={generateSmartFactSuggestions}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-3 h-3" />
                <span>Smart Suggestions</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Smart Fact Suggestions */}
              {showFactHelper && smartFactSuggestions.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Suggested Facts</span>
                    </div>
                    <button
                      onClick={() => setShowFactHelper(false)}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="space-y-2">
                    {smartFactSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          updateBridgeData({
                            factualAnchors: [...bridgeData.factualAnchors, suggestion]
                          });
                        }}
                        className="w-full text-left p-2 bg-white border border-blue-200 rounded text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {bridgeData.factualAnchors.map((anchor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2 flex-1">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-900">{anchor}</span>
                  </div>
                  <button
                    onClick={() => removeFactualAnchor(index)}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFactualAnchor}
                  onChange={(e) => setNewFactualAnchor(e.target.value)}
                  placeholder="e.g., It was a Tuesday, Restaurant was on Main Street, Temperature was 75°F"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addFactualAnchor()}
                />
                <button
                  onClick={addFactualAnchor}
                  disabled={!newFactualAnchor.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {bridgeData.factualAnchors.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add factual anchors to strengthen memory accuracy</p>
                </div>
              )}
            </div>
          </div>

          {/* People Involved */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">People Involved</h3>
            
            <div className="space-y-3">
              {(bridgeData.peopleInvolved || []).map((person, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">{person}</span>
                  </div>
                  <button
                    onClick={() => removePerson(index)}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder="e.g., Sarah, Mom, Dr. Johnson"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                />
                <button
                  onClick={addPerson}
                  disabled={!newPerson.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Memory Verification Quiz</h3>
              <div className="flex items-center space-x-3">
                {quizScore.total > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{quizScore.correct}/{quizScore.total}</span>
                  </div>
                )}
                <button
                  onClick={generateQuiz}
                  disabled={bridgeData.factualAnchors.length === 0 && (!bridgeData.peopleInvolved || bridgeData.peopleInvolved.length === 0)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {quizScore.total === 0 ? 'Start Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Test your factual recall with quick questions about this memory to strengthen the bridge between narrative and objective details.
            </p>
            {bridgeData.factualAnchors.length === 0 && (!bridgeData.peopleInvolved || bridgeData.peopleInvolved.length === 0) && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">Add some factual anchors or people to enable the quiz</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeBack;