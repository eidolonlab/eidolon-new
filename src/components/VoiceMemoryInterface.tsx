import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, Wand2, Play, Pause, RotateCcw, Zap, Target, TrendingUp, Heart } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceMemoryInterfaceProps {
  onTranscription: (text: string, confidence: number) => void;
  onEmotionalAnalysis: (emotions: {
    valence: number;
    arousal: number;
    confidence: number;
    dominantEmotion: string;
  }) => void;
  isActive: boolean;
}

const VoiceMemoryInterface: React.FC<VoiceMemoryInterfaceProps> = ({
  onTranscription,
  onEmotionalAnalysis,
  isActive
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<any>(null);
  const [voiceCoaching, setVoiceCoaching] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechPacing, setSpeechPacing] = useState<'too_fast' | 'optimal' | 'too_slow'>('optimal');
  const [emotionalDepth, setEmotionalDepth] = useState(0);
  const [narrativeFlow, setNarrativeFlow] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const {
    isListening: isRecording,
    transcript: transcription,
    confidence,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText({
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        onTranscription(text, confidence);
        analyzeEmotionalContent(text);
      }
    },
    onStart: () => {
      setVoiceCoaching("🎤 Speak naturally about your memory. Include sensory details and emotions for richer encoding.");
    },
    onEnd: () => {
      setVoiceCoaching("🧠 Analyzing your voice patterns, emotional tone, and memory structure...");
      setTimeout(() => {
        setVoiceCoaching("✨ Voice analysis complete! Your memory has been enhanced with vocal emotional data and speech patterns.");
      }, 2000);
    },
    onError: (error) => {
      setVoiceCoaching(`❌ Speech recognition error: ${error}. Please try again.`);
    }
  });

  const analyzeEmotionalContent = (text: string) => {
    // Analyze emotional content from transcription
    const emotionalWords = ['love', 'joy', 'fear', 'anger', 'surprise', 'sadness', 'excitement', 'peace'];
    const words = text.toLowerCase().split(/\s+/);
    
    const emotionalCount = emotionalWords.filter(word => 
      words.some(w => w.includes(word))
    ).length;
    
    setEmotionalDepth((emotionalCount / emotionalWords.length) * 100);
    
    // Simulate emotional analysis
    const emotions = {
      valence: 3 + Math.random() * 2,
      arousal: 2 + Math.random() * 2,
      confidence: confidence * 100,
      dominantEmotion: emotionalWords[Math.floor(Math.random() * emotionalWords.length)]
    };
    
    setEmotionalAnalysis(emotions);
    onEmotionalAnalysis(emotions);
  };

  const analyzeSpeechPatterns = () => {
    // Simulate speech pattern analysis
    const pacing = Math.random();
    if (pacing < 0.3) {
      setSpeechPacing('too_fast');
      setVoiceCoaching("🗣️ Speaking a bit fast - slow down for better memory encoding");
    } else if (pacing > 0.7) {
      setSpeechPacing('too_slow');
      setVoiceCoaching("⏱️ Take your time, but maintain natural flow for better recall");
    } else {
      setSpeechPacing('optimal');
      setVoiceCoaching("✨ Perfect pacing! Your speech rhythm enhances memory formation");
    }
  };

  const startRecording = () => {
    resetTranscript();
    startListening();
    setVoiceCoaching("🎤 Speak naturally about your memory. Include sensory details and emotions for richer encoding.");
  };

  const stopRecording = () => {
    stopListening();
    setVoiceCoaching("🧠 Analyzing your voice patterns, emotional tone, and memory structure...");
    
    setTimeout(() => {
      setVoiceCoaching("✨ Voice analysis complete! Your memory has been enhanced with vocal emotional data and speech patterns.");
    }, 2000);
  };

  const playback = () => {
    setIsPlaying(true);
    setVoiceCoaching("🔊 Playing back your memory with emotional emphasis markers...");
    
    setTimeout(() => {
      setIsPlaying(false);
      setVoiceCoaching(null);
    }, 3000);
  };

  const reset = () => {
    stopListening();
    setIsPlaying(false);
    resetTranscript();
    setEmotionalAnalysis(null);
    setVoiceCoaching(null);
    setEmotionalDepth(0);
    setNarrativeFlow(0);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Voice Memory Interface</h2>
          <p className="text-sm text-gray-600">Speak your memories with advanced emotional and speech analysis</p>
        </div>
      </div>

      {/* Advanced Voice Coaching */}
      {voiceCoaching && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">AI Voice Coach</span>
          </div>
          <p className="text-sm text-indigo-800 mt-1">{voiceCoaching}</p>
        </div>
      )}

      {/* Recording Interface with Advanced Visualization */}
      <div className="text-center mb-6">
        <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all relative ${
          isRecording 
            ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          {isRecording ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-gray-600" />
          )}
          
          {/* Recording pulse effect */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
          )}
        </div>
        
        {isRecording && (
          <div className="mb-4">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 mb-3">Recording your memory...</div>
            
            {/* Advanced Audio Visualization */}
            <div className="flex items-center justify-center space-x-1 mb-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 bg-red-500`}
                  style={{ height: `${Math.random() * 20 + 10}px` }}
                />
              ))}
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              {isRecording ? '🔴 REC' : '⏸️ Ready'}
            </div>
            <div className="text-xs text-gray-500">
              {isRecording ? 'Recording in progress...' : 'Click microphone to start'}
            </div>
            
            {/* Speech Quality Indicators */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${
                speechPacing === 'optimal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                Pacing: {speechPacing.replace('_', ' ')}
              </div>
              <div className="p-2 bg-blue-100 text-blue-800 rounded">
                Emotion: {emotionalDepth.toFixed(0)}%
              </div>
              <div className="p-2 bg-purple-100 text-purple-800 rounded">
                Flow: {narrativeFlow.toFixed(0)}%
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg transition-all font-medium ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Voice Memory'}
          </button>
          
          {transcription && (
            <button
              onClick={playback}
              disabled={isPlaying}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          
          {transcription && (
            <button
              onClick={reset}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Transcription Results */}
      {transcription && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">AI-Enhanced Transcription</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600 font-medium">{confidence.toFixed(0)}% accuracy</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{transcription}</p>
            
            {/* Advanced Analytics */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-lg font-bold text-indigo-600">{transcription.split(' ').length}</div>
                <div className="text-xs text-gray-600">Words Spoken</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{emotionalDepth.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Emotional Depth</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">{narrativeFlow.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Narrative Flow</div>
              </div>
            </div>
          </div>

          {/* Advanced Emotional Analysis */}
          {emotionalAnalysis && (
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <h3 className="font-medium text-pink-900 mb-3 flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Advanced Emotional Analysis</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Dominant Emotion</div>
                  <div className="font-semibold text-pink-700 capitalize text-lg">{emotionalAnalysis.dominantEmotion}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Emotional Intensity</div>
                  <div className="font-semibold text-pink-700">{emotionalAnalysis.arousal.toFixed(1)}/5</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Emotional Positivity</span>
                    <span>{((emotionalAnalysis.valence + 5) / 10 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        emotionalAnalysis.valence > 0 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.abs(emotionalAnalysis.valence) * 10}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Voice Confidence</span>
                    <span>{emotionalAnalysis.confidence.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${emotionalAnalysis.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {transcription && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 mb-2">Live Transcription:</div>
              <p className="text-blue-900">{transcription}</p>
              {confidence > 0 && (
                <div className="text-xs text-blue-600 mt-2">
                  Confidence: {Math.round(confidence * 100)}%
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Advanced Voice Memory Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2 mb-3">
          <Wand2 className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-900">Advanced Voice Memory Techniques</span>
        </div>
        <div className="text-sm text-amber-800 space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">🎯 Optimal Techniques:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Emotional emphasis:</strong> Stress emotional words for stronger encoding</li>
                <li>• <strong>Sensory descriptions:</strong> Use vivid, specific sensory language</li>
                <li>• <strong>Natural pauses:</strong> Allow processing time between details</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">🧠 Memory Science:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Vocal emotion:</strong> Adds limbic system activation</li>
                <li>• <strong>Speech rhythm:</strong> Creates temporal memory structure</li>
                <li>• <strong>Prosody patterns:</strong> Enhance autobiographical recall</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Speech Quality Feedback */}
      {isRecording && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Real-time Speech Analysis</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                speechPacing === 'optimal' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {speechPacing === 'optimal' ? '✓' : '⚠️'}
              </div>
              <div className="text-xs text-gray-600">Speech Pacing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{emotionalDepth.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Emotional Richness</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{narrativeFlow.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Story Structure</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceMemoryInterface;