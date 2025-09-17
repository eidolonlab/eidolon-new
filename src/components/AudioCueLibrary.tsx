import React, { useState, useRef } from 'react';
import { Music, Upload, Play, Pause, Volume2, VolumeX, Headphones, Waves, Wind, Coffee } from 'lucide-react';

interface AudioCueLibraryProps {
  onAudioSelect: (audioUrl: string, title: string) => void;
  selectedAudio?: string;
}

const AudioCueLibrary: React.FC<AudioCueLibraryProps> = ({ onAudioSelect, selectedAudio }) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [uploadedAudios, setUploadedAudios] = useState<Array<{ url: string; title: string }>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated ambient sound library based on research
  const ambientLibrary = [
    {
      title: 'Ocean Waves',
      description: 'Gentle rhythmic waves for relaxation and focus',
      icon: Waves,
      category: 'Nature',
      url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav', // Placeholder - would use actual audio files
      researchNote: 'Natural rhythmic sounds enhance autobiographical memory recall'
    },
    {
      title: 'Rain on Window',
      description: 'Soft rainfall for peaceful concentration',
      icon: Wind,
      category: 'Weather',
      url: 'https://www.soundjay.com/misc/sounds/rain-1.wav',
      researchNote: 'White noise patterns reduce cognitive load during memory formation'
    },
    {
      title: 'Coffee Shop Ambience',
      description: 'Warm social atmosphere with gentle chatter',
      icon: Coffee,
      category: 'Social',
      url: 'https://www.soundjay.com/misc/sounds/coffee-shop.wav',
      researchNote: 'Social ambient sounds create rich contextual memory cues'
    },
    {
      title: 'Forest Birds',
      description: 'Morning birdsong in a peaceful forest',
      icon: Headphones,
      category: 'Nature',
      url: 'https://www.soundjay.com/misc/sounds/forest-birds.wav',
      researchNote: 'Natural soundscapes activate multiple sensory memory pathways'
    },
    {
      title: 'Crackling Fireplace',
      description: 'Warm, cozy fire sounds for comfort',
      icon: Volume2,
      category: 'Comfort',
      url: 'https://www.soundjay.com/misc/sounds/fireplace.wav',
      researchNote: 'Comfort-associated sounds enhance emotional memory encoding'
    },
    {
      title: 'Gentle Piano',
      description: 'Soft instrumental music for reflection',
      icon: Music,
      category: 'Music',
      url: 'https://www.soundjay.com/misc/sounds/piano.wav',
      researchNote: 'Melodic patterns strengthen narrative memory structure'
    }
  ];

  const handlePlay = (audioUrl: string, title: string) => {
    if (isPlaying === audioUrl) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(audioUrl);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setUploadedAudios(prev => [...prev, { url, title }]);
    }
  };

  const handleSelect = (audioUrl: string, title: string) => {
    onAudioSelect(audioUrl, title);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Audio Cue Library</h2>
            <p className="text-sm text-gray-600">Research-backed sounds for memory enhancement</p>
          </div>
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Audio</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={() => setIsPlaying(null)}
      />

      {/* Research Context */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Headphones className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Clinical Evidence</span>
        </div>
        <p className="text-sm text-blue-800">
          Music and naturalistic sounds are unusually effective memory cues, often producing richer 
          autobiographical recall than visual or verbal prompts alone. Audio cues activate multiple 
          neural pathways and create stronger retrieval contexts.
        </p>
      </div>

      {/* Ambient Library */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Curated Ambient Library</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ambientLibrary.map((audio, index) => {
            const IconComponent = audio.icon;
            const isCurrentlyPlaying = isPlaying === audio.url;
            const isSelected = selectedAudio === audio.url;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(audio.url, audio.title)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isSelected ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{audio.title}</h4>
                      <p className="text-sm text-gray-600">{audio.description}</p>
                      <span className="text-xs text-purple-600 font-medium">{audio.category}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(audio.url, audio.title);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isCurrentlyPlaying 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <strong>Research:</strong> {audio.researchNote}
                </div>
                
                {isSelected && (
                  <div className="mt-2 flex items-center space-x-1 text-xs text-purple-600">
                    <Volume2 className="w-3 h-3" />
                    <span>Selected as memory cue</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Audio */}
      {uploadedAudios.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-medium text-gray-900">Your Uploaded Audio</h3>
          <div className="space-y-2">
            {uploadedAudios.map((audio, index) => {
              const isCurrentlyPlaying = isPlaying === audio.url;
              const isSelected = selectedAudio === audio.url;
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(audio.url, audio.title)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <Music className={`w-4 h-4 ${
                        isSelected ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-medium text-gray-900">{audio.title}</span>
                    {isSelected && (
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(audio.url, audio.title);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isCurrentlyPlaying 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2 mb-2">
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-900">Usage Tips</span>
        </div>
        <div className="text-sm text-amber-800 space-y-1">
          <p>• <strong>5-10 second clips</strong> work best for memory cues</p>
          <p>• <strong>Personal audio</strong> (voice memos, familiar songs) create stronger associations</p>
          <p>• <strong>Ambient sounds</strong> reduce cognitive load during memory formation</p>
          <p>• <strong>Consistent cues</strong> across sessions strengthen retrieval pathways</p>
        </div>
      </div>
    </div>
  );
};

export default AudioCueLibrary;