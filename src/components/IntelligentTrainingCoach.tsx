import React, { useState, useEffect } from 'react';
import { Target, Brain, Clock, TrendingUp, Play, CheckCircle, Zap, Award, Eye, Heart } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import type { CognitiveState, UserPattern } from '../contexts/CognitiveStateContext';

interface IntelligentTrainingCoachProps {
  cognitiveState: CognitiveState;
  userPattern: UserPattern;
  onComplete: () => void;
}

const IntelligentTrainingCoach: React.FC<IntelligentTrainingCoachProps> = ({
  cognitiveState,
  userPattern,
  onComplete
}) => {
  const { weaves, addRetrievalSession } = useWeave();
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [trainingMode, setTrainingMode] = useState<'adaptive' | 'focused' | 'gentle'>('adaptive');
  const [sessionState, setSessionState] = useState<'selecting' | 'active' | 'complete'>('selecting');
  const [userResponse, setUserResponse] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [coachingMessages, setCoachingMessages] = useState<string[]>([]);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<{
    wordCount: number;
    sensoryElements: number;
    emotionalDepth: number;
    coherenceScore: number;
  }>({ wordCount: 0, sensoryElements: 0, emotionalDepth: 0, coherenceScore: 0 });

  // Get optimal memories for training
  const getOptimalMemories = () => {
    const availableMemories = weaves.filter(w => w.type === 'past' && w.narrative.length > 0);
    
    // Sort by spaced repetition algorithm
    return availableMemories.sort((a, b) => {
      const aLastRetrieved = a.lastRetrieved?.getTime() || 0;
      const bLastRetrieved = b.lastRetrieved?.getTime() || 0;
      const aTimeSince = Date.now() - aLastRetrieved;
      const bTimeSince = Date.now() - bLastRetrieved;
      
      // Prioritize memories that haven't been retrieved recently
      return bTimeSince - aTimeSince;
    }).slice(0, 5);
  };

  const optimalMemories = getOptimalMemories();

  // Determine training mode based on cognitive state
  useEffect(() => {
    const { attention, energy, stress } = cognitiveState;
    
    if (stress > 60 || attention < 40) {
      setTrainingMode('gentle');
    } else if (attention > 80 && energy > 70) {
      setTrainingMode('focused');
    } else {
      setTrainingMode('adaptive');
    }
  }, [cognitiveState]);

  // Real-time response analysis
  useEffect(() => {
    if (!userResponse || userResponse.length < 5) return;

    const words = userResponse.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = userResponse.split('.').filter(s => s.trim().length > 0);
    
    // Detect sensory elements
    const sensoryKeywords = {
      visual: ['see', 'saw', 'look', 'bright', 'dark', 'color', 'light'],
      auditory: ['hear', 'heard', 'sound', 'music', 'voice', 'loud', 'quiet'],
      emotional: ['feel', 'felt', 'happy', 'sad', 'excited', 'nervous', 'calm'],
      tactile: ['touch', 'warm', 'cold', 'soft', 'rough', 'smooth'],
      olfactory: ['smell', 'scent', 'aroma', 'fragrance']
    };

    let sensoryCount = 0;
    Object.values(sensoryKeywords).forEach(keywords => {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        sensoryCount++;
      }
    });

    // Calculate emotional depth
    const emotionalWords = sensoryKeywords.emotional;
    const emotionalCount = emotionalWords.filter(word => 
      words.some(w => w.includes(word))
    ).length;
    const emotionalDepth = (emotionalCount / emotionalWords.length) * 100;

    // Simple coherence scoring
    const coherenceScore = Math.min(
      (sentences.length * 20) + (sensoryCount * 15) + (words.length / 2),
      100
    );

    setRealTimeAnalysis({
      wordCount: words.length,
      sensoryElements: sensoryCount,
      emotionalDepth,
      coherenceScore
    });

    // Generate coaching messages
    generateCoachingMessages(words.length, sensoryCount, emotionalDepth);
  }, [userResponse]);

  const generateCoachingMessages = (wordCount: number, sensoryCount: number, emotionalDepth: number) => {
    const messages = [];

    if (wordCount < 10) {
      messages.push("Great start! Keep adding details as they come to you.");
    } else if (wordCount < 30) {
      messages.push("Wonderful detail! Your memory is becoming richer.");
    } else {
      messages.push("Excellent recall! This level of detail creates strong memory pathways.");
    }

    if (sensoryCount >= 3) {
      messages.push("Amazing multi-sensory recall! You're engaging multiple brain regions.");
    } else if (sensoryCount >= 1) {
      messages.push("Good sensory details! Try adding what you heard or felt.");
    }

    if (emotionalDepth > 20) {
      messages.push("Beautiful emotional depth! Emotions are the strongest memory enhancers.");
    }

    setCoachingMessages(messages.slice(0, 2));
  };

  const startTraining = (memory: any) => {
    setSelectedMemory(memory);
    setSessionState('active');
    setStartTime(new Date());
    setUserResponse('');
  };

  const completeSession = () => {
    if (!selectedMemory || !startTime) return;

    const endTime = new Date();
    const latencyMs = endTime.getTime() - startTime.getTime();
    
    // Calculate session results
    const accuracy = Math.min((realTimeAnalysis.coherenceScore / 100) * 100, 100);
    const detailsRecalled = Math.min(Math.floor(realTimeAnalysis.wordCount / 10), 5);

    // Save session
    addRetrievalSession({
      weaveId: selectedMemory.id,
      startTime,
      endTime,
      latencyMs,
      detailsRecalled,
      accuracy: Math.round(accuracy),
      difficulty: trainingMode === 'gentle' ? 'easy' : trainingMode === 'focused' ? 'hard' : 'medium',
    });

    setSessionState('complete');
  };

  if (sessionState === 'selecting') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Intelligent Training</h2>
          <p className="text-gray-600">AI-optimized memory strengthening</p>
        </div>

        {/* Training Mode Indicator */}
        <div className={`mb-6 p-4 rounded-xl border ${
          trainingMode === 'gentle' ? 'bg-blue-50 border-blue-200' :
          trainingMode === 'focused' ? 'bg-red-50 border-red-200' :
          'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className={`w-4 h-4 ${
              trainingMode === 'gentle' ? 'text-blue-600' :
              trainingMode === 'focused' ? 'text-red-600' :
              'text-green-600'
            }`} />
            <span className={`font-medium ${
              trainingMode === 'gentle' ? 'text-blue-900' :
              trainingMode === 'focused' ? 'text-red-900' :
              'text-green-900'
            }`}>
              {trainingMode === 'gentle' ? 'Gentle Mode' :
               trainingMode === 'focused' ? 'Focused Mode' :
               'Adaptive Mode'}
            </span>
          </div>
          <p className={`text-sm ${
            trainingMode === 'gentle' ? 'text-blue-800' :
            trainingMode === 'focused' ? 'text-red-800' :
            'text-green-800'
          }`}>
            {trainingMode === 'gentle' ? 
              'Supportive hints and gentle guidance based on your current stress level.' :
              trainingMode === 'focused' ?
              'Challenging recall practice - your cognitive state is optimal for intensive training.' :
              'Balanced approach adapting to your responses in real-time.'
            }
          </p>
        </div>

        {/* Optimal Memory Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Memories Ready for Training</h3>
          {optimalMemories.map((memory) => {
            const daysSinceLastRetrieval = memory.lastRetrieved ? 
              Math.floor((Date.now() - memory.lastRetrieved.getTime()) / (1000 * 60 * 60 * 24)) : 
              999;
            
            return (
              <button
                key={memory.id}
                onClick={() => startTraining(memory)}
                className="w-full p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{memory.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">"{memory.seed}"</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Quality: {memory.coherenceScore}/100</span>
                      <span>•</span>
                      <span>Retrievals: {memory.retrievalCount}</span>
                      <span>•</span>
                      <span>
                        {daysSinceLastRetrieval === 999 ? 'Never practiced' : 
                         daysSinceLastRetrieval === 0 ? 'Practiced today' :
                         `${daysSinceLastRetrieval} days ago`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {daysSinceLastRetrieval > 7 && (
                      <span className="text-xs px-2 py-1 bg-orange-200 text-orange-700 rounded-full">
                        Due for practice
                      </span>
                    )}
                    <Play className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {optimalMemories.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Memories Ready</h3>
            <p className="text-gray-600">Create some memories first to start training!</p>
          </div>
        )}
      </div>
    );
  }

  if (sessionState === 'active') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Recall Training</h2>
          <p className="text-gray-600">Memory: "{selectedMemory.title}"</p>
          <p className="text-sm text-gray-500">Seed: "{selectedMemory.seed}"</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What do you remember about this experience?
            </label>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Describe what you remember - include sensory details, emotions, and the sequence of events..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              autoFocus
            />
          </div>

          {/* Real-time Analysis */}
          {realTimeAnalysis.wordCount > 0 && (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{realTimeAnalysis.wordCount}</div>
                <div className="text-xs text-gray-600">Words</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{realTimeAnalysis.sensoryElements}/5</div>
                <div className="text-xs text-gray-600">Senses</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-xl font-bold text-pink-600">{Math.round(realTimeAnalysis.emotionalDepth)}</div>
                <div className="text-xs text-gray-600">Emotion %</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{Math.round(realTimeAnalysis.coherenceScore)}</div>
                <div className="text-xs text-gray-600">Coherence</div>
              </div>
            </div>
          )}

          {/* AI Coaching Messages */}
          {coachingMessages.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">AI Coach</span>
              </div>
              <div className="space-y-2">
                {coachingMessages.map((message, index) => (
                  <p key={index} className="text-sm text-blue-800">✨ {message}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setSessionState('selecting')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={completeSession}
              disabled={userResponse.trim().length === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Training</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState === 'complete') {
    const latencyMs = startTime ? Date.now() - startTime.getTime() : 0;
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Training Complete!</h2>
          <p className="text-gray-600">Excellent work strengthening your memory</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {(latencyMs / 1000).toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">Recall Time</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round(realTimeAnalysis.coherenceScore)}
            </div>
            <div className="text-sm text-gray-600">Quality Score</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {realTimeAnalysis.sensoryElements}
            </div>
            <div className="text-sm text-gray-600">Senses Used</div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-900">Training Impact</span>
          </div>
          <p className="text-sm text-emerald-800">
            This session strengthened your memory pathways and improved retrieval speed. 
            Your {selectedMemory.title} memory is now {Math.round((realTimeAnalysis.coherenceScore / 100) * 25)}% stronger!
          </p>
        </div>

        <button
          onClick={onComplete}
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Continue Your Journey
        </button>
      </div>
    );
  }

  return null;
};

export default IntelligentTrainingCoach;