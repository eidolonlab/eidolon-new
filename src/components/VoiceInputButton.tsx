import React from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onTranscriptionComplete?: (text: string, confidence: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  continuous?: boolean;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onTranscriptionComplete,
  className = '',
  size = 'md',
  variant = 'primary',
  disabled = false,
  continuous = false
}) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    confidence
  } = useSpeechToText({
    continuous,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal) {
        onTranscript(text);
        onTranscriptionComplete?.(text, confidence);
        if (!continuous) {
          stopListening();
        }
      }
    },
    onError: (errorMessage) => {
      console.error('Voice input error:', errorMessage);
    }
  });

  const handleClick = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const variantClasses = {
    primary: isListening 
      ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/50' 
      : 'bg-indigo-500 text-white hover:bg-indigo-600',
    secondary: isListening
      ? 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200'
      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200',
    ghost: isListening
      ? 'text-red-600 hover:bg-red-50'
      : 'text-gray-600 hover:bg-gray-50'
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled || !isSupported}
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          rounded-lg transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${isListening ? 'animate-pulse' : ''}
          ${className}
        `}
        title={
          !isSupported ? 'Speech recognition not supported' :
          disabled ? 'Voice input disabled' :
          isListening ? 'Stop recording' : 'Start voice input'
        }
      >
        {isListening ? (
          <MicOff className={iconSizes[size]} />
        ) : error ? (
          <AlertCircle className={iconSizes[size]} />
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </button>

      {/* Recording Indicator */}
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}

      {/* Confidence Indicator */}
      {confidence > 0 && !isListening && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;