import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, CheckCircle, XCircle, RotateCcw, Target, HelpCircle } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import EnhancedTextInput from './EnhancedTextInput';
import ErrorlessMode from './ErrorlessMode';
import InteractiveRetrievalCoach from './InteractiveRetrievalCoach';
import LiveMemoryAnalyzer from './LiveMemoryAnalyzer';
import RecallLatencyTimer from './RecallLatencyTimer';
import AdaptiveRetrievalSystem from './AdaptiveRetrievalSystem';
import PredictiveMemoryAnalytics from './PredictiveMemoryAnalytics';
import EmotionalResonanceEngine from './EmotionalResonanceEngine';

interface RetrievalTrainerProps {
  onBack: () => void;
}

const RetrievalTrainer: React.FC<RetrievalTrainerProps> = ({ onBack }) => {
  const { weaves, addRetrievalSession } = useWeave();
  const [currentWeave, setCurrentWeave] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'completed'>('idle');
  const [showErrorlessMode, setShowErrorlessMode] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [encouragementMessage, setEncouragementMessage] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(true);
  const [sessionResults, setSessionResults] = useState<{
    latencyMs: number;
    detailsRecalled: number;
    accuracy: number;
  } | null>(null);
  const [recallLatency, setRecallLatency] = useState<number | null>(null);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [showPredictiveAnalytics, setShowPredictiveAnalytics] = useState(false);
  const [memoryPredictions, setMemoryPredictions] = useState<any>(null);
  const [emotionalResonance, setEmotionalResonance] = useState<any>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load session history for adaptive coaching
  useEffect(() => {
    const savedSessions = localStorage.getItem('eidolon-sessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setSessionHistory(sessions.slice(0, 20)); // Last 20 sessions for analysis
    }
  }, []);

  const availableWeaves = weaves.filter(w => w.type === 'past' && w.narrative.length > 0);
  const selectedWeave = currentWeave ? weaves.find(w => w.id === currentWeave) : null;

  const startSession = () => {
    if (!selectedWeave) return;
    
    setSessionState('active');
    setStartTime(new Date());
    setUserResponse('');
    setSessionResults(null);
  };

  const completeSession = () => {
    if (!selectedWeave || !startTime) return;

    const endTime = new Date();
    const latencyMs = endTime.getTime() - startTime.getTime();
    
    // Simple scoring based on response length and key details
    const responseWords = userResponse.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const narrativeWords = selectedWeave.narrative.toLowerCase().split(/\s+/);
    
    // Count matching words (simple accuracy measure)
    const matchingWords = responseWords.filter(word => 
      narrativeWords.some(nWord => nWord.includes(word) || word.includes(nWord))
    );
    
    const detailsRecalled = Math.min(responseWords.length / 10, 5); // Up to 5 details
    const accuracy = responseWords.length > 0 ? (matchingWords.length / responseWords.length) * 100 : 0;

    const results = {
      latencyMs,
      detailsRecalled: Math.round(detailsRecalled),
      accuracy: Math.round(accuracy),
    };

    setSessionResults(results);
    setSessionState('completed');

    // Save session
    addRetrievalSession({
      weaveId: selectedWeave.id,
      startTime,
      endTime,
      latencyMs,
      detailsRecalled: results.detailsRecalled,
      accuracy: results.accuracy,
      difficulty: latencyMs < 10000 ? 'easy' : latencyMs < 30000 ? 'medium' : 'hard',
    });
    
    console.log('Retrieval session completed:', results);
    console.log('Session saved for weave:', selectedWeave.title);
  };

  const resetSession = () => {
    setSessionState('idle');
    setStartTime(null);
    setUserResponse('');
    setSessionResults(null);
  };

  const getNextWeaveForTraining = () => {
    // Simple algorithm: prioritize weaves that haven't been retrieved recently
    const sortedWeaves = availableWeaves.sort((a, b) => {
      const aLastRetrieved = a.lastRetrieved?.getTime() || 0;
      const bLastRetrieved = b.lastRetrieved?.getTime() || 0;
      return aLastRetrieved - bLastRetrieved;
    });
    
    return sortedWeaves[0]?.id || null;
  };

  useEffect(() => {
    if (!currentWeave && availableWeaves.length > 0) {
      const nextWeave = getNextWeaveForTraining();
      if (nextWeave) {
        setCurrentWeave(nextWeave);
      }
    }
  }, [availableWeaves, currentWeave]);

  if (availableWeaves.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Retrieval Training</h1>
        </div>

        <div className="text-center py-16">
          <Target className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Memories Available for Training</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create some Memory Weaves first to start your retrieval training sessions.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Memory Weaves
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Retrieval Training</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Weave Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Memory for Training</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWeaves.map((weave) => (
              <button
                key={weave.id}
                onClick={() => {
                  setCurrentWeave(weave.id);
                  resetSession();
                }}
                className={`p-4 rounded-lg border text-left transition-all ${
                  currentWeave === weave.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-2 truncate">{weave.title}</h3>
                <p className="text-sm text-gray-600 mb-3">"{weave.seed}"</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Retrievals: {weave.retrievalCount}</span>
                  <span>Score: {weave.coherenceScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Training Session */}
        {selectedWeave && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {sessionState === 'idle' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Train</h2>
                <p className="text-gray-600 mb-2">Memory: <strong>{selectedWeave.title}</strong></p>
                <p className="text-gray-600 mb-8">Seed: "{selectedWeave.seed}"</p>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                  When you start, try to recall as many specific details as possible from this memory. 
                  Focus on sensory details, emotions, and the sequence of events.
                </p>
                
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={startSession}
                    className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Standard Retrieval</span>
                  </button>
                  
                  {selectedWeave?.errorlessMode && (
                    <button
                      onClick={() => setShowErrorlessMode(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Errorless Mode</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {sessionState === 'active' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Recall in Progress</h2>
                  <p className="text-gray-600">Memory: <strong>{selectedWeave.title}</strong></p>
                  <p className="text-sm text-gray-500 mt-2">Seed: "{selectedWeave.seed}"</p>
                </div>
                
                {/* Clinical Recall Latency Timer */}
                <div className="max-w-md mx-auto">
                  <RecallLatencyTimer
                    onComplete={(latencyMs) => {
                      setRecallLatency(latencyMs);
                      console.log('Recall latency recorded:', latencyMs);
                    }}
                    isActive={true}
                  />
                </div>

                <div className="max-w-2xl mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What do you remember? Include as many specific details as possible:
                  </label>
                  
                  {encouragementMessage && (
                    <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <p className="text-indigo-800 text-sm">{encouragementMessage}</p>
                      <button
                        onClick={() => setEncouragementMessage(null)}
                        className="text-indigo-600 hover:text-indigo-700 text-xs mt-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  
                  <EnhancedTextInput
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Describe what you remember about this memory. Include sensory details, emotions, people, places, and the sequence of events..."
                    rows={8}
                    showVoiceButton={true}
                    showWordCount={true}
                    showAIEnhancement={true}
                    aiContext="memory"
                    onVoiceComplete={(transcript, confidence) => {
                      console.log('Voice recall completed:', { transcript, confidence });
                      if (confidence > 0.8) {
                        setEncouragementMessage(`🎯 Excellent voice clarity! ${Math.round(confidence * 100)}% confidence detected.`);
                      }
                    }}
                  />
                  
                  {/* Interactive Coaching */}
                  {showCoach && selectedWeave && (
                    <div className="mt-4">
                      <AdaptiveRetrievalSystem
                        weave={selectedWeave}
                        userResponse={userResponse}
                        sessionHistory={sessionHistory}
                        onHint={(hint, hintType) => {
                          setEncouragementMessage(hint);
                        }}
                        onEncouragement={(message, motivationType) => {
                          setEncouragementMessage(message);
                        }}
                        onDifficultyAdjustment={(newDifficulty) => {
                          console.log('Difficulty adjusted to:', newDifficulty);
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Emotional Resonance Analysis */}
                  {userResponse.length > 30 && (
                    <div className="mt-4">
                      <EmotionalResonanceEngine
                        emotionalContent={userResponse}
                        onResonanceDetected={setEmotionalResonance}
                      />
                    </div>
                  )}
                  
                  {/* Live Memory Analyzer for Retrieval */}
                  {userResponse.length > 20 && (
                    <div className="mt-4">
                      <LiveMemoryAnalyzer
                        text={userResponse}
                        isActive={true}
                        onSuggestion={(suggestion, type) => {
                          setEncouragementMessage(suggestion);
                        }}
                        memoryType="past"
                      />
                    </div>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <p className="mb-2">💡 <strong>Recall tips:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>What could you see, hear, smell, or feel?</li>
                      <li>Who was there and what did they do or say?</li>
                      <li>What happened first, then next?</li>
                      <li>What emotions were you experiencing?</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={resetSession}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowCoach(!showCoach)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          showCoach 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {showCoach ? 'Hide' : 'Show'} Coach
                      </button>
                      <button
                        onClick={() => setShowPredictiveAnalytics(!showPredictiveAnalytics)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          showPredictiveAnalytics 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        🔮 Predictions
                      </button>
                      <div className="text-sm text-gray-500">
                        {userResponse.trim().split(/\s+/).filter(w => w.length > 0).length} words
                      </div>
                    </div>
                    
                    <button
                      onClick={completeSession}
                      disabled={userResponse.trim().length === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Session</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showPredictiveAnalytics && selectedWeave && (
              <div className="mt-6">
                <PredictiveMemoryAnalytics
                  memoryData={selectedWeave}
                  userHistory={sessionHistory}
                  onPrediction={setMemoryPredictions}
                  onPatternDetected={(pattern) => {
                    setEncouragementMessage(`🧠 Pattern detected: ${pattern.pattern} - ${pattern.recommendation}`);
                  }}
                />
              </div>
            )}

            {sessionState === 'completed' && sessionResults && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Session Complete!</h2>
                  <p className="text-gray-600">Great work on your retrieval practice</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {(sessionResults.latencyMs / 1000).toFixed(1)}s
                    </div>
                    <div className="text-sm text-gray-600">Recall Time</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sessionResults.latencyMs < 15000 ? 'Fast!' : sessionResults.latencyMs < 30000 ? 'Good' : 'Take your time'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {sessionResults.detailsRecalled}
                    </div>
                    <div className="text-sm text-gray-600">Details Recalled</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sessionResults.detailsRecalled >= 4 ? 'Excellent!' : sessionResults.detailsRecalled >= 2 ? 'Good' : 'Keep practicing'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {sessionResults.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {sessionResults.accuracy >= 80 ? 'Excellent!' : sessionResults.accuracy >= 60 ? 'Good' : 'Improving'}
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Your Response:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-700">{userResponse}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {userResponse.trim().split(/\s+/).filter(w => w.length > 0).length} words • 
                      {userResponse.split('.').filter(s => s.trim().length > 0).length} sentences
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">Original Memory:</h3>
                  <div className="p-4 bg-indigo-50 rounded-lg mb-6">
                    <p className="text-gray-700">{selectedWeave.narrative}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Coherence Score: {selectedWeave.coherenceScore}/100
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={resetSession}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      const nextWeave = getNextWeaveForTraining();
                      if (nextWeave) {
                        setCurrentWeave(nextWeave);
                        resetSession();
                      }
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next Memory
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Errorless Mode Modal */}
        {showErrorlessMode && selectedWeave && (
          <ErrorlessMode
            weaveId={selectedWeave.id}
            onComplete={(success) => {
              if (success) {
                // Record a successful errorless session
                addRetrievalSession({
                  weaveId: selectedWeave.id,
                  startTime: new Date(),
                  endTime: new Date(),
                  latencyMs: 0, // Errorless mode doesn't measure speed
                  detailsRecalled: 5, // Full credit for errorless completion
                  accuracy: 100,
                  difficulty: 'easy',
                });
              }
              setShowErrorlessMode(false);
            }}
            onClose={() => setShowErrorlessMode(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RetrievalTrainer;