import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Target } from 'lucide-react';

interface RecallLatencyTimerProps {
  onComplete: (latencyMs: number) => void;
  isActive: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

const RecallLatencyTimer: React.FC<RecallLatencyTimerProps> = ({
  onComplete,
  isActive,
  onStart,
  onPause,
  onReset
}) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime && !isPaused) {
      interval = setInterval(() => {
        setElapsedMs(Date.now() - startTime.getTime());
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, startTime, isPaused]);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedMs(0);
    onStart?.();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    onPause?.();
  };

  const handleComplete = () => {
    if (startTime) {
      const finalLatency = Date.now() - startTime.getTime();
      onComplete(finalLatency);
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setStartTime(null);
    setElapsedMs(0);
    setIsRunning(false);
    setIsPaused(false);
    onReset?.();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 5000) return 'text-green-600';
    if (ms < 15000) return 'text-yellow-600';
    if (ms < 30000) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLatencyLabel = (ms: number) => {
    if (ms < 5000) return 'Excellent';
    if (ms < 15000) return 'Good';
    if (ms < 30000) return 'Moderate';
    return 'Take your time';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Recall Latency Timer</h3>
        </div>
        <div className="text-xs text-gray-500">
          Clinical metric for memory retrieval speed
        </div>
      </div>

      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getLatencyColor(elapsedMs)}`}>
          {formatTime(elapsedMs)}
        </div>
        {elapsedMs > 0 && (
          <div className={`text-sm font-medium ${getLatencyColor(elapsedMs)}`}>
            {getLatencyLabel(elapsedMs)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start Recall</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Target className="w-4 h-4" />
              <span>Complete</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>

      {/* Clinical Context */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-800">
          <strong>Clinical Note:</strong> Recall latency measures the time from cue presentation to memory retrieval. 
          Faster latency indicates stronger memory consolidation and easier access to autobiographical details.
        </div>
      </div>
    </div>
  );
};

export default RecallLatencyTimer;