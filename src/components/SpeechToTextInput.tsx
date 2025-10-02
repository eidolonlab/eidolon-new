import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, CheckCircle, AlertCircle, Wand2, Brain } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface SpeechToTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  showConfidence?: boolean;
  showWordCount?: boolean;
  enhanceWithAI?: boolean;
  onTranscriptionComplete?: (transcript: string, confidence: number) => void;
}

const SpeechToTextInput: React.FC<SpeechToTextInputProps> = ({
  value,
  onChange,
  placeholder = 'Type or speak your text...',
  className = '',
  rows = 4,
  disabled = false,
  showConfidence = true,
  showWordCount = true,
  enhanceWithAI = false,
  onTranscriptionComplete
}) => {
  const [inputMode, setInputMode] = useState<'typing' | 'speaking'>('typing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechEnhancement, setSpeechEnhancement] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    confidence
  } = useSpeechToText({
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        const newValue = value + (value ? ' ' : '') + text;
        onChange(newValue);
        onTranscriptionComplete?.(text, confidence);
        
        if (enhanceWithAI) {
          enhanceTranscriptWithAI(text);
        }
      }
    },
    onError: (errorMessage) => {
      console.error('Speech recognition error:', errorMessage);
      setInputMode('typing');
    },
    onEnd: () => {
      setInputMode('typing');
    }
  });

  const enhanceTranscriptWithAI = async (text: string) => {
    setIsProcessing(true);
    
    // Simulate AI enhancement
    setTimeout(() => {
      const enhancements = [
        'Consider adding more sensory details to strengthen this memory',
        'What emotions were present during this experience?',
        'Can you describe the visual elements in more detail?',
        'What sounds or voices do you remember?'
      ];
      
      const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
      setSpeechEnhancement(randomEnhancement);
      setIsProcessing(false);
    }, 1500);
  };

  const handleMicClick = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.');
      return;
    }

    if (isListening) {
      stopListening();
      setInputMode('typing');
    } else {
      setInputMode('speaking');
      resetTranscript();
      startListening();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const insertSuggestion = (suggestion: string) => {
    const newValue = value + (value ? ' ' : '') + suggestion;
    onChange(newValue);
    setSpeechEnhancement('');
  };

  const wordCount = value.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="space-y-3">
      {/* Main Input Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value + (inputMode === 'speaking' ? (value ? ' ' : '') + interimTranscript : '')}
          onChange={handleTextChange}
          placeholder={inputMode === 'speaking' ? 'Listening... speak naturally' : placeholder}
          rows={rows}
          disabled={disabled || isListening}
          className={`w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all ${
            inputMode === 'speaking' ? 'bg-blue-50 border-blue-300' : ''
          } ${className}`}
        />
        
        {/* Speech Button */}
        <button
          onClick={handleMicClick}
          disabled={disabled}
          className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
            isListening 
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
              : isSupported
              ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title={
            !isSupported ? 'Speech recognition not supported' :
            isListening ? 'Stop recording' : 'Start voice input'
          }
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* Word Count */}
          {showWordCount && (
            <span className="text-gray-500">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
          )}
          
          {/* Speech Confidence */}
          {showConfidence && confidence > 0 && (
            <div className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3 text-green-600" />
              <span className="text-green-600">{Math.round(confidence * 100)}% confident</span>
            </div>
          )}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center space-x-1">
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
              <span className="text-blue-600">AI enhancing...</span>
            </div>
          )}
        </div>

        {/* Mode Indicator */}
        <div className="flex items-center space-x-2">
          {inputMode === 'speaking' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-600 font-medium">Recording</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span className="text-red-600">Speech error</span>
            </div>
          )}
          
          {!isSupported && (
            <span className="text-gray-400 text-xs">Speech not supported</span>
          )}
        </div>
      </div>

      {/* AI Enhancement Suggestions */}
      {speechEnhancement && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-900">AI Enhancement Suggestion</span>
          </div>
          <p className="text-purple-800 text-sm mb-3">{speechEnhancement}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => insertSuggestion(speechEnhancement)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Add to Text
            </button>
            <button
              onClick={() => setSpeechEnhancement('')}
              className="px-3 py-1.5 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Speech Instructions */}
      {inputMode === 'speaking' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Mic className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Voice Input Active</span>
          </div>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• Speak naturally and clearly</p>
            <p>• Pause briefly between sentences</p>
            <p>• Say "period" or "comma" for punctuation</p>
            <p>• Click the microphone again to stop</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToTextInput;