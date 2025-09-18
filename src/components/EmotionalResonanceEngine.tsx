import React, { useState, useEffect } from 'react';
import { Heart, Zap, TrendingUp, Brain, Target, Award, Activity, Sparkles, Waves, Music } from 'lucide-react';

interface EmotionalResonance {
  frequency: number;
  amplitude: number;
  harmony: number;
  dissonance: number;
  emotionalCoherence: number;
  resonanceStrength: number;
}

interface EmotionalFrequency {
  emotion: string;
  frequency: number;
  amplitude: number;
  color: string;
  description: string;
}

interface EmotionalResonanceEngineProps {
  emotionalContent: string;
  onResonanceDetected: (resonance: {
    type: 'harmony' | 'dissonance' | 'coherence';
    strength: number;
    recommendation: string;
  }) => void;
}

const EmotionalResonanceEngine: React.FC<EmotionalResonanceEngineProps> = ({
  emotionalContent,
  onResonanceDetected
}) => {
  const [resonanceState, setResonanceState] = useState<EmotionalResonance>({
    frequency: 0,
    amplitude: 0,
    harmony: 0,
    dissonance: 0,
    emotionalCoherence: 0,
    resonanceStrength: 0
  });

  const [detectedFrequencies, setDetectedFrequencies] = useState<EmotionalFrequency[]>([]);
  const [resonancePattern, setResonancePattern] = useState<'building' | 'harmonic' | 'dissonant' | 'coherent'>('building');
  const [emotionalSpectrum, setEmotionalSpectrum] = useState<number[]>([]);

  const emotionalFrequencyMap = {
    joy: { frequency: 528, color: '#FFD700', description: 'Love frequency - DNA repair' },
    love: { frequency: 528, color: '#FF69B4', description: 'Heart coherence frequency' },
    peace: { frequency: 396, color: '#87CEEB', description: 'Liberation from fear' },
    gratitude: { frequency: 741, color: '#98FB98', description: 'Awakening intuition' },
    excitement: { frequency: 852, color: '#FFA500', description: 'Returning to spiritual order' },
    calm: { frequency: 432, color: '#E6E6FA', description: 'Natural harmonic frequency' },
    confidence: { frequency: 639, color: '#20B2AA', description: 'Connecting relationships' },
    wonder: { frequency: 963, color: '#DDA0DD', description: 'Pineal gland activation' },
    nostalgia: { frequency: 285, color: '#F0E68C', description: 'Healing and regeneration' },
    contentment: { frequency: 174, color: '#F5DEB3', description: 'Natural anesthetic' }
  };

  useEffect(() => {
    analyzeEmotionalResonance();
    generateResonancePattern();
  }, [emotionalContent]);

  const analyzeEmotionalResonance = () => {
    if (!emotionalContent || emotionalContent.length < 10) {
      setResonanceState({
        frequency: 0,
        amplitude: 0,
        harmony: 0,
        dissonance: 0,
        emotionalCoherence: 0,
        resonanceStrength: 0
      });
      return;
    }

    const words = emotionalContent.toLowerCase().split(/\s+/);
    const detectedEmotions = [];
    let totalAmplitude = 0;
    let harmonicSum = 0;
    let dissonanceSum = 0;

    // Detect emotional frequencies
    Object.entries(emotionalFrequencyMap).forEach(([emotion, data]) => {
      const emotionWords = getEmotionWords(emotion);
      const matches = emotionWords.filter(word => 
        words.some(w => w.includes(word) || word.includes(w))
      ).length;

      if (matches > 0) {
        const amplitude = Math.min(matches / emotionWords.length, 1);
        detectedEmotions.push({
          emotion,
          frequency: data.frequency,
          amplitude,
          color: data.color,
          description: data.description
        });
        totalAmplitude += amplitude;
      }
    });

    // Calculate harmonic relationships
    for (let i = 0; i < detectedEmotions.length; i++) {
      for (let j = i + 1; j < detectedEmotions.length; j++) {
        const freq1 = detectedEmotions[i].frequency;
        const freq2 = detectedEmotions[j].frequency;
        const ratio = freq1 / freq2;
        
        // Check for harmonic ratios (2:1, 3:2, 4:3, etc.)
        const harmonicRatios = [2, 1.5, 1.33, 1.25, 1.2];
        const isHarmonic = harmonicRatios.some(r => 
          Math.abs(ratio - r) < 0.1 || Math.abs(1/ratio - r) < 0.1
        );
        
        if (isHarmonic) {
          harmonicSum += detectedEmotions[i].amplitude * detectedEmotions[j].amplitude;
        } else {
          dissonanceSum += Math.abs(detectedEmotions[i].amplitude - detectedEmotions[j].amplitude);
        }
      }
    }

    const avgFrequency = detectedEmotions.length > 0 ?
      detectedEmotions.reduce((sum, e) => sum + e.frequency * e.amplitude, 0) / totalAmplitude : 0;

    const harmony = detectedEmotions.length > 1 ? harmonicSum * 100 : 0;
    const dissonance = detectedEmotions.length > 1 ? dissonanceSum * 50 : 0;
    const emotionalCoherence = Math.max(0, harmony - dissonance);
    const resonanceStrength = (totalAmplitude + emotionalCoherence / 100) * 50;

    setDetectedFrequencies(detectedEmotions);
    setResonanceState({
      frequency: avgFrequency,
      amplitude: totalAmplitude,
      harmony,
      dissonance,
      emotionalCoherence,
      resonanceStrength
    });
  };

  const getEmotionWords = (emotion: string): string[] => {
    const emotionWordMap: Record<string, string[]> = {
      joy: ['joy', 'happy', 'delighted', 'cheerful', 'elated', 'blissful'],
      love: ['love', 'adore', 'cherish', 'affection', 'warmth', 'tender'],
      peace: ['peace', 'calm', 'serene', 'tranquil', 'still', 'quiet'],
      gratitude: ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate'],
      excitement: ['excited', 'thrilled', 'energized', 'enthusiastic', 'animated'],
      calm: ['calm', 'relaxed', 'peaceful', 'centered', 'balanced', 'composed'],
      confidence: ['confident', 'assured', 'certain', 'self-assured', 'bold'],
      wonder: ['wonder', 'awe', 'amazed', 'fascinated', 'curious', 'marvel'],
      nostalgia: ['nostalgic', 'wistful', 'reminiscent', 'sentimental', 'longing'],
      contentment: ['content', 'satisfied', 'fulfilled', 'pleased', 'comfortable']
    };
    
    return emotionWordMap[emotion] || [];
  };

  const generateResonancePattern = () => {
    const { harmony, dissonance, emotionalCoherence } = resonanceState;
    
    if (emotionalCoherence > 70) {
      setResonancePattern('coherent');
      onResonanceDetected({
        type: 'coherence',
        strength: emotionalCoherence,
        recommendation: 'Perfect emotional coherence! This memory will have exceptional retrieval strength.'
      });
    } else if (harmony > dissonance && harmony > 40) {
      setResonancePattern('harmonic');
      onResonanceDetected({
        type: 'harmony',
        strength: harmony,
        recommendation: 'Beautiful emotional harmony detected. Multiple emotions are working together synergistically.'
      });
    } else if (dissonance > harmony) {
      setResonancePattern('dissonant');
      onResonanceDetected({
        type: 'dissonance',
        strength: dissonance,
        recommendation: 'Emotional conflict detected. Consider resolving or integrating conflicting feelings.'
      });
    } else {
      setResonancePattern('building');
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Emotional Resonance Engine</h3>
          <p className="text-sm text-gray-600">Harmonic analysis of emotional memory content</p>
        </div>
      </div>

      {/* Resonance Pattern Display */}
      <div className={`mb-6 p-4 rounded-lg border ${
        resonancePattern === 'coherent' ? 'bg-emerald-50 border-emerald-200' :
        resonancePattern === 'harmonic' ? 'bg-blue-50 border-blue-200' :
        resonancePattern === 'dissonant' ? 'bg-red-50 border-red-200' :
        'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <Waves className={`w-4 h-4 ${
            resonancePattern === 'coherent' ? 'text-emerald-600' :
            resonancePattern === 'harmonic' ? 'text-blue-600' :
            resonancePattern === 'dissonant' ? 'text-red-600' :
            'text-yellow-600'
          }`} />
          <span className={`font-medium ${
            resonancePattern === 'coherent' ? 'text-emerald-900' :
            resonancePattern === 'harmonic' ? 'text-blue-900' :
            resonancePattern === 'dissonant' ? 'text-red-900' :
            'text-yellow-900'
          }`}>
            {resonancePattern === 'coherent' ? 'Emotional Coherence' :
             resonancePattern === 'harmonic' ? 'Harmonic Resonance' :
             resonancePattern === 'dissonant' ? 'Emotional Dissonance' :
             'Building Resonance'}
          </span>
        </div>
        <div className="text-2xl font-bold mb-2">
          <span className={
            resonancePattern === 'coherent' ? 'text-emerald-600' :
            resonancePattern === 'harmonic' ? 'text-blue-600' :
            resonancePattern === 'dissonant' ? 'text-red-600' :
            'text-yellow-600'
          }>
            {resonanceState.resonanceStrength.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Detected Emotional Frequencies */}
      {detectedFrequencies.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Detected Emotional Frequencies</h4>
          {detectedFrequencies.map(freq => (
            <div key={freq.emotion} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: freq.color }}
                />
                <div>
                  <div className="font-medium text-gray-900 capitalize">{freq.emotion}</div>
                  <div className="text-xs text-gray-500">{freq.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600">{freq.frequency} Hz</div>
                <div className="text-xs text-gray-500">{(freq.amplitude * 100).toFixed(0)}% strength</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resonance Enhancement */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2 mb-2">
          <Music className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Resonance Enhancement</span>
        </div>
        <p className="text-sm text-indigo-800">
          Emotional resonance at {resonanceState.frequency.toFixed(0)} Hz creates {resonanceState.resonanceStrength.toFixed(0)}% 
          stronger memory encoding through limbic system activation and neurochemical optimization.
        </p>
      </div>
    </div>
  );
};

export default EmotionalResonanceEngine;