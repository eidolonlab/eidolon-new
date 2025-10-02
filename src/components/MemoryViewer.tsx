import React, { useState } from 'react';
import { Eye, Play, Pause, Download, Maximize2, X, Image, Film, Volume2 } from 'lucide-react';

interface MemoryViewerProps {
  weave: any;
  onClose?: () => void;
}

const MemoryViewer: React.FC<MemoryViewerProps> = ({ weave, onClose }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVisualMemory = weave.cues?.photos && weave.cues.photos.length > 0;
  const visualType = weave.cues?.visualType || 'photo';
  const visualData = hasVisualMemory ? weave.cues.photos[0] : null;

  const downloadVisual = () => {
    if (!visualData) return;

    const link = document.createElement('a');
    link.href = visualData;
    link.download = `${weave.title}-visual-memory.${visualType === 'video' ? 'webm' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  if (showFullscreen && hasVisualMemory) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
        <div className="relative max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-4">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          {visualType === 'video' ? (
            <video
              src={visualData}
              controls
              className="max-w-full max-h-full rounded-lg"
              autoPlay
            />
          ) : (
            <img
              src={visualData}
              alt={weave.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{weave.title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Visual Memory Display */}
      {hasVisualMemory && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {visualType === 'video' ? (
                <Film className="w-4 h-4 text-purple-600" />
              ) : (
                <Image className="w-4 h-4 text-blue-600" />
              )}
              <span className="font-medium text-gray-900">Visual Memory</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadVisual}
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                title="Download visual memory"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            {visualType === 'video' ? (
              <video
                src={visualData}
                controls
                className="w-full max-h-64 rounded-lg border border-gray-200"
                poster={visualData} // Use first frame as poster
              />
            ) : (
              <img
                src={visualData}
                alt={weave.title}
                className="w-full max-h-64 object-cover rounded-lg border border-gray-200 cursor-pointer"
                onClick={toggleFullscreen}
              />
            )}
          </div>
        </div>
      )}

      {/* Memory Content */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Memory Seed</h3>
          <p className="text-gray-700 italic">"{weave.seed}"</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Narrative</h3>
          <p className="text-gray-700 leading-relaxed">{weave.narrative}</p>
        </div>

        {/* Sensory Details */}
        {Object.entries(weave.sensoryDetails || {}).some(([_, detail]) => detail) && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Sensory Details</h3>
            <div className="space-y-3">
              {Object.entries(weave.sensoryDetails || {}).map(([sense, detail]) => {
                if (!detail) return null;
                
                const icons = {
                  visual: Eye,
                  auditory: Volume2,
                  emotional: Heart,
                  tactile: Hand,
                  olfactory: Nose
                };
                
                const Icon = icons[sense as keyof typeof icons];
                
                return (
                  <div key={sense} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{sense}</div>
                      <p className="text-gray-700 text-sm">{detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Memory Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{weave.coherenceScore}</div>
            <div className="text-xs text-gray-600">Coherence Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{weave.retrievalCount}</div>
            <div className="text-xs text-gray-600">Retrievals</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{weave.tags.length}</div>
            <div className="text-xs text-gray-600">Tags</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {hasVisualMemory ? '✓' : '—'}
            </div>
            <div className="text-xs text-gray-600">Visual</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryViewer;