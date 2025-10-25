import React, { useState, useEffect } from 'react';
import { Focus, Sparkles } from 'lucide-react';

interface ObjectFocusPlayerProps {
  duration: number;
  onComplete: () => void;
}

const focusPrompts = [
  "Notice its color and texture",
  "Observe its shape and edges",
  "See the light reflecting off it",
  "Notice any patterns or details",
  "Focus on one small part of it",
  "Let everything else fade away"
];

const ObjectFocusPlayer: React.FC<ObjectFocusPlayerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const promptInterval = setInterval(() => {
      setCurrentPrompt(prev => (prev + 1) % focusPrompts.length);
    }, 5000);

    return () => clearInterval(promptInterval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(prev => (prev === 1 ? 1.1 : 1));
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Focus className="w-6 h-6 text-teal-600" />
            <h3 className="text-2xl font-bold text-slate-900">Object Focus</h3>
          </div>
          <p className="text-sm text-slate-600">Choose an object and focus on it</p>
        </div>

        <div className="mb-8 relative">
          <div className="relative w-64 h-64 mx-auto">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 transition-transform duration-2000"
              style={{
                transform: `scale(${pulseScale})`,
                opacity: 0.3
              }}
            />

            <div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 transition-transform duration-2000"
              style={{
                transform: `scale(${pulseScale})`,
                opacity: 0.5
              }}
            />

            <div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-teal-300 to-cyan-300 border-4 border-teal-400 transition-transform duration-2000"
              style={{
                transform: `scale(${pulseScale})`,
                opacity: 0.8
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-8 h-8 text-teal-400" />
                </div>
                <Sparkles className="w-8 h-8 text-teal-600 relative z-10" />
              </div>
            </div>

            <div className="absolute -inset-4 rounded-full border-2 border-dashed border-teal-300 animate-spin-slow" style={{ animationDuration: '20s' }} />
          </div>

          <div className="text-center mt-6">
            <div className="inline-block bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-teal-200 animate-in fade-in zoom-in duration-500" key={currentPrompt}>
              <p className="text-lg font-medium text-teal-900">
                {focusPrompts[currentPrompt]}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-teal-900">Focus Time</span>
              <span className="text-2xl font-bold text-teal-600">{timeLeft}s</span>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(1 - timeLeft / duration) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200">
            <p className="text-sm font-semibold text-teal-900 mb-3">How to focus:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-teal-800">
                <span className="text-teal-500 font-bold">1.</span>
                <span>Pick any object in front of you (pen, cup, phone)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-teal-800">
                <span className="text-teal-500 font-bold">2.</span>
                <span>Gaze at it softly - don't strain your eyes</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-teal-800">
                <span className="text-teal-500 font-bold">3.</span>
                <span>When your mind wanders, gently return focus</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-teal-800">
                <span className="text-teal-500 font-bold">4.</span>
                <span>Notice new details each time you look</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full text-xs text-cyan-800 font-medium">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              Staying present in this moment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectFocusPlayer;
