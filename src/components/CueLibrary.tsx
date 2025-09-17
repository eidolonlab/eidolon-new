import React, { useState, useEffect } from 'react';
import { Music, Camera, Palette, MapPin, Flower2, Plus, X, Play, Pause, Volume2, VolumeX, Wand2, Sparkles } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface CueLibraryProps {
  weaveId: string;
  onClose: () => void;
}

const CueLibrary: React.FC<CueLibraryProps> = ({ weaveId, onClose }) => {
  const { getWeaveById, updateWeave } = useWeave();
  const weave = getWeaveById(weaveId);
  const [activeTab, setActiveTab] = useState<'music' | 'photos' | 'colors' | 'location' | 'scents'>('music');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<{
    music: string[];
    colors: string[][];
    scents: string[];
    locations: string[];
  }>({ music: [], colors: [], scents: [], locations: [] });

  if (!weave) return null;

  const cues = weave.cues || {};

  const updateCues = (newCues: Partial<typeof cues>) => {
    updateWeave(weaveId, {
      cues: { ...cues, ...newCues }
    });
  };

  // Generate smart suggestions based on weave content
  const generateSmartSuggestions = () => {
    const narrative = weave.narrative.toLowerCase();
    const seed = weave.seed.toLowerCase();
    const allText = `${narrative} ${seed}`;
    
    const suggestions = {
      music: [],
      colors: [],
      scents: [],
      locations: []
    };
    
    // Music suggestions based on context
    if (allText.includes('calm') || allText.includes('peaceful')) {
      suggestions.music.push('Peaceful Piano', 'Ocean Waves', 'Rain on Window');
    }
    if (allText.includes('energy') || allText.includes('excited')) {
      suggestions.music.push('Upbeat Instrumental', 'Nature Sounds', 'Coffee Shop Ambience');
    }
    if (allText.includes('focus') || allText.includes('work')) {
      suggestions.music.push('Focus Flow', 'White Noise', 'Crackling Fireplace');
    }
    
    // Color suggestions based on emotions and context
    if (allText.includes('warm') || allText.includes('cozy')) {
      suggestions.colors.push(['#FF6B6B', '#FFE66D', '#FF8E53', '#C7CEEA']);
    }
    if (allText.includes('calm') || allText.includes('peaceful')) {
      suggestions.colors.push(['#4ECDC4', '#44A08D', '#096DD9', '#B8E6B8']);
    }
    if (allText.includes('nature') || allText.includes('outdoor')) {
      suggestions.colors.push(['#52C41A', '#73D13D', '#95DE64', '#D9F7BE']);
    }
    
    // Scent suggestions
    if (allText.includes('kitchen') || allText.includes('cooking')) {
      suggestions.scents.push('Vanilla', 'Cinnamon', 'Baking Bread');
    }
    if (allText.includes('outdoor') || allText.includes('nature')) {
      suggestions.scents.push('Pine Forest', 'Fresh Linen', 'Ocean Breeze');
    }
    if (allText.includes('flower') || allText.includes('garden')) {
      suggestions.scents.push('Rose', 'Lavender', 'Jasmine');
    }
    
    setSmartSuggestions(suggestions);
  };

  // Generate suggestions when component mounts
  useEffect(() => {
    generateSmartSuggestions();
  }, [weave]);
  const colorPalettes = [
    { name: 'Warm Sunset', colors: ['#FF6B6B', '#FFE66D', '#FF8E53', '#C7CEEA'] },
    { name: 'Ocean Breeze', colors: ['#4ECDC4', '#44A08D', '#096DD9', '#B8E6B8'] },
    { name: 'Forest Walk', colors: ['#52C41A', '#73D13D', '#95DE64', '#D9F7BE'] },
    { name: 'Cozy Evening', colors: ['#8B4513', '#D2691E', '#F4A460', '#DEB887'] },
    { name: 'Spring Garden', colors: ['#FF69B4', '#FFB6C1', '#98FB98', '#F0E68C'] },
  ];

  const musicSuggestions = [
    { name: 'Peaceful Piano', description: 'Gentle instrumental melodies' },
    { name: 'Nature Sounds', description: 'Birds, wind, and natural ambience' },
    { name: 'Coffee Shop Ambience', description: 'Warm, social background noise' },
    { name: 'Rain on Window', description: 'Soothing precipitation sounds' },
    { name: 'Ocean Waves', description: 'Rhythmic coastal sounds' },
    { name: 'Forest Birds', description: 'Chirping and woodland sounds' },
    { name: 'Crackling Fireplace', description: 'Warm, cozy fire sounds' },
    { name: 'City Street Sounds', description: 'Urban life and traffic' },
  ];

  const scentCategories = [
    { category: 'Floral', scents: ['Rose', 'Lavender', 'Jasmine', 'Lily'] },
    { category: 'Fresh', scents: ['Ocean Breeze', 'Pine Forest', 'Fresh Linen', 'Mint'] },
    { category: 'Warm', scents: ['Vanilla', 'Cinnamon', 'Coffee', 'Baking Bread'] },
    { category: 'Citrus', scents: ['Lemon', 'Orange', 'Grapefruit', 'Lime'] },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'music':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Current Music Cue
                </label>
                {smartSuggestions.music.length > 0 && (
                  <button
                    onClick={() => {}}
                    className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Smart picks</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={cues.music || ''}
                  onChange={(e) => updateCues({ music: e.target.value })}
                  placeholder="Enter song name or ambient sound"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Smart Music Suggestions */}
            {smartSuggestions.music.length > 0 && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">Suggested for this memory</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {smartSuggestions.music.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => updateCues({ music: suggestion })}
                      className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Ambient Sounds</h4>
              <div className="grid grid-cols-2 gap-2">
                {musicSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.name}
                    onClick={() => updateCues({ music: suggestion.name })}
                    className={`p-3 text-sm rounded-lg transition-colors text-left border ${
                      cues.music === suggestion.name
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
                  </button>
                ))}
              </div>
              
              {cues.music && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-900">Current: {cues.music}</span>
                    </div>
                    <button
                      onClick={() => updateCues({ music: '' })}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'colors':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palettes</h4>
              <div className="space-y-3">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      updateCues({ colors: palette.colors });
                      setSelectedPalette(palette.name);
                    }}
                    className={`w-full p-3 border rounded-lg transition-colors ${
                      selectedPalette === palette.name || (cues.colors && JSON.stringify(cues.colors) === JSON.stringify(palette.colors))
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{palette.name}</span>
                      {(selectedPalette === palette.name || (cues.colors && JSON.stringify(cues.colors) === JSON.stringify(palette.colors))) && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              
              {cues.colors && cues.colors.length > 0 && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-900">Selected Palette</span>
                    <button
                      onClick={() => {
                        updateCues({ colors: [] });
                        setSelectedPalette(null);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex space-x-1">
                    {cues.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border border-white shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'scents':
        return (
          <div className="space-y-4">
            {scentCategories.map((category) => (
              <div key={category.category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {category.scents.map((scent) => (
                    <button
                      key={scent}
                      onClick={() => {
                        const currentScents = cues.scents || [];
                        const newScents = currentScents.includes(scent)
                          ? currentScents.filter(s => s !== scent)
                          : [...currentScents, scent];
                        updateCues({ scents: newScents });
                      }}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        cues.scents?.includes(scent)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {scent}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {cues.scents && cues.scents.length > 0 && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-900">Selected Scents</span>
                  <button
                    onClick={() => updateCues({ scents: [] })}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cues.scents.map((scent) => (
                    <span
                      key={scent}
                      className="px-2 py-1 bg-white rounded-full text-xs text-indigo-700 border border-indigo-200"
                    >
                      {scent}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={cues.location?.name || ''}
                onChange={(e) => updateCues({ 
                  location: { ...cues.location, name: e.target.value } 
                })}
                placeholder="e.g., Central Park, Mom's Kitchen, Office Conference Room"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Location Anchoring</span>
              </div>
              <p className="text-sm text-blue-700">
                Adding specific locations helps create stronger memory anchors and can trigger location-based reminders for future scenarios.
              </p>
              
              {cues.location?.name && (
                <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900 font-medium">{cues.location.name}</span>
                    <button
                      onClick={() => updateCues({ location: { name: '' } })}
                      className="text-blue-600 hover:text-blue-700 transition-colors text-xs"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cue Library</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'music', icon: Music, label: 'Music & Sound' },
            { id: 'colors', icon: Palette, label: 'Colors' },
            { id: 'scents', icon: Flower2, label: 'Scents' },
            { id: 'location', icon: MapPin, label: 'Location' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {renderTabContent()}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Cues help trigger stronger memory recall during training sessions
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CueLibrary;