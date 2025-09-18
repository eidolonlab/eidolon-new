import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, Wand2, Play, Pause, RotateCcw } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<any>(null);
  const [voiceCoaching, setVoiceCoaching] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate voice recording and analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        setAudioLevel(Math.random() * 100); // Simulate audio level
        
        // Simulate real-time transcription
        if (recordingDuration > 3 && recordingDuration % 2 === 0) {
          simulateTranscription();
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRecording, recordingDuration]);

  const simulateTranscription = () => {
    const samplePhrases = [
      "I remember walking into grandmother's kitchen",
      "The warm sunlight was streaming through the window",
      "I could hear the gentle sizzling of bacon",
      "The whole room smelled like cinnamon and coffee",
      "I felt completely safe and loved in that moment"
    ];
    
    const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    const newTranscription = transcription + (transcription ? ' ' : '') + randomPhrase;
    const confidenceScore = 85 + Math.random() * 15; // High confidence simulation
    
    setTranscription(newTranscription);
    setConfidence(confidenceScore);
    onTranscription(newTranscription, confidenceScore);
    
    // Simulate emotional analysis
    const emotions = {
      valence: Math.random() * 10 - 5, // -5 to +5
      arousal: Math.random() * 5, // 0 to 5
      confidence: 80 + Math.random() * 20,
      dominantEmotion: ['joy', 'contentment', 'nostalgia', 'love', 'peace'][Math.floor(Math.random() * 5)]
    };
    
    setEmotionalAnalysis(emotions);
    onEmotionalAnalysis(emotions);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setTranscription('');
    setVoiceCoaching("🎤 Speak naturally about your memory. Include sensory details and emotions.");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setVoiceCoaching("✨ Processing your voice... Analyzing emotional tone and content.");
    
    // Simulate processing delay
    setTimeout(() => {
      setVoiceCoaching("🧠 Voice analysis complete! Your memory has been enhanced with vocal emotional data.");
    }, 2000);
  };

  const playback = () => {
    setIsPlaying(true);
    setVoiceCoaching("🔊 Playing back your memory narration...");
    
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false);
      setVoiceCoaching(null);
    }, 3000);
  };

  const reset = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setTranscription('');
    setConfidence(0);
    setEmotionalAnalysis(null);
    setRecordingDuration(0);
    setVoiceCoaching(null);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Voice Memory Interface</h2>
          <p className="text-sm text-gray-600">Speak your memories with emotional analysis</p>
        </div>
      </div>

      {/* Voice Coaching */}
      {voiceCoaching && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">Voice Coach</span>
          </div>
          <p className="text-sm text-indigo-800 mt-1">{voiceCoaching}</p>
        </div>
      )}

      {/* Recording Interface */}
      <div className="text-center mb-6">
        <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          {isRecording ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-gray-600" />
          )}
        </div>
        
        {isRecording && (
          <div className="mb-4">
            <div className="text-lg font-bold text-red-600">
              {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Recording...</div>
            
            {/* Audio Level Visualization */}
            <div className="flex items-center justify-center space-x-1 mt-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-8 rounded-full transition-all duration-100 ${
                    i < (audioLevel / 10) ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
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

      {/* Transcription Results */}
      {transcription && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Transcription</h3>
              <span className="text-sm text-green-600 font-medium">{confidence.toFixed(0)}% confidence</span>
            </div>
            <p className="text-gray-700">{transcription}</p>
          </div>

          {/* Emotional Analysis */}
          {emotionalAnalysis && (
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="font-medium text-pink-900 mb-3">Emotional Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Emotional Tone</div>
                  <div className="font-semibold text-pink-700 capitalize">{emotionalAnalysis.dominantEmotion}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Intensity</div>
                  <div className="font-semibold text-pink-700">{emotionalAnalysis.arousal.toFixed(1)}/5</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-1">Positivity</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      emotionalAnalysis.valence > 0 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.abs(emotionalAnalysis.valence) * 10}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice Memory Tips */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-900">Voice Memory Tips</span>
        </div>
        <div className="text-sm text-amber-800 space-y-1">
          <p>• <strong>Speak slowly:</strong> Clear articulation improves transcription accuracy</p>
          <p>• <strong>Include emotions:</strong> Vocal tone adds emotional memory layers</p>
          <p>• <strong>Use pauses:</strong> Natural breaks help with memory segmentation</p>
          <p>• <strong>Vary your voice:</strong> Different tones for different memory elements</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceMemoryInterface;