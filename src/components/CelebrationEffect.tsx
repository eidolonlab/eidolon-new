import React, { useEffect, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

interface Props {
  show: boolean;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
}

export default function CelebrationEffect({ show, onComplete, intensity = 'medium' }: Props) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showEffect, setShowEffect] = useState(false);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const confettiCounts = {
    low: 15,
    medium: 30,
    high: 50
  };

  useEffect(() => {
    if (show) {
      triggerCelebration();
    }
  }, [show]);

  const triggerCelebration = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      console.log('Haptics not available');
    }

    setShowEffect(true);

    const pieces: ConfettiPiece[] = [];
    const count = confettiCounts[intensity];

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.5 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    setConfetti(pieces);

    setTimeout(() => {
      setShowEffect(false);
      setConfetti([]);
      onComplete?.();
    }, 2500);
  };

  if (!showEffect) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
        <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold">
          Nice! 🎉
        </div>
      </div>
    </div>
  );
}
