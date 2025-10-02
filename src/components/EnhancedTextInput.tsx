import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Type, Wand2, Volume2, Brain, Sparkles } from 'lucide-react';
import SpeechToTextInput from './SpeechToTextInput';
import VoiceInputButton from './VoiceInputButton';

interface EnhancedTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  showVoiceButton?: boolean;
  showWordCount?: boolean;
  showAIEnhancement?: boolean;
  aiContext?: string;
  type?: 'input' | 'textarea';
  onVoiceComplete?: (transcript: string, confidence: number) => void;
}

const EnhancedTextInput: React.FC<EnhancedTextInputProps> = ({
  value,
  onChange,
  placeholder = 'Type or speak your text...',
  label,
  rows = 4,
  className = '',
  disabled = false,
  showVoiceButton = true,
  showWordCount = true,
  showAIEnhancement = false,
  aiContext = '',
  type = 'textarea',
  onVoiceComplete
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Generate AI suggestions based on context and current text
  useEffect(() => {
    if (showAIEnhancement && value.length > 10) {
      generateAISuggestions();
    }
  }, [value, aiContext, showAIEnhancement]);

  const generateAISuggestions = () => {
    const suggestions = [];
    const text = value.toLowerCase();
    
    // Context-aware suggestions
    if (aiContext === 'memory' || aiContext === 'sensory') {
      if (!text.includes('color') && !text.includes('light')) {
        suggestions.push('the specific colors and lighting you remember');
      }
      if (!text.includes('sound') && !text.includes('hear')) {
        suggestions.push('what sounds were present in this moment');
      }
      if (!text.includes('feel') && !text.includes('emotion')) {
        suggestions.push('how this experience made you feel emotionally');
      }
      if (!text.includes('smell') && !text.includes('scent')) {
        suggestions.push('any distinctive scents or aromas');
      }
    } else if (aiContext === 'scenario' || aiContext === 'planning') {
      if (!text.includes('if') && !text.includes('then')) {
        suggestions.push('specific if-then plans for potential challenges');
      }
      if (!text.includes('confident') && !text.includes('prepared')) {
        suggestions.push('how you want to feel during this event');
      }
    }
    
    setAiSuggestions(suggestions.slice(0, 3));
    setShowSuggestions(suggestions.length > 0);
  };

  const handleVoiceTranscript = (transcript: string) => {
    const newValue = value + (value ? ' ' : '') + transcript;
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newValue = value + (value ? '. ' : '') + suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    onChange(newValue);
    setShowSuggestions(false);
  };

  const wordCount = value.split(/\s+/).filter(w => w.length > 0).length;
  const wordCount = (value || '').split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Mode Toggle */}
      {showVoiceButton && (
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              inputMode === 'text'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Type</span>
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              inputMode === 'voice'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Speak</span>
          </button>
        </div>
      )}

      {/* Input Component */}
      {inputMode === 'voice' ? (
        <SpeechToTextInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          rows={rows}
          disabled={disabled}
          showConfidence={true}
          showWordCount={showWordCount}
          enhanceWithAI={showAIEnhancement}
          onTranscriptionComplete={onVoiceComplete}
        />
      ) : type === 'input' ? (
        <div className="relative">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
          />
          {showVoiceButton && (
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              onTranscriptionComplete={onVoiceComplete}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              size="sm"
              variant="ghost"
              disabled={disabled}
            />
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${className}`}
          />
          {showVoiceButton && (
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              onTranscriptionComplete={onVoiceComplete}
              className="absolute right-3 top-3"
              size="sm"
              variant="ghost"
              disabled={disabled}
            />
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {showWordCount && (
            <span className="text-gray-500">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showVoiceButton && (
            <span className="text-xs text-gray-400">
              💡 Click mic or switch to voice mode
            </span>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-indigo-900">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-2 bg-white border border-indigo-200 rounded text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                Add: {suggestion}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSuggestions(false)}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-700"
          >
            Hide suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedTextInput;