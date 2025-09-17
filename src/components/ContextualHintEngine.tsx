import React, { useState, useEffect } from 'react';
import { Lightbulb, MapPin, Clock, Users, Activity, Zap, Target, Brain } from 'lucide-react';

interface ContextualHintEngineProps {
  currentText: string;
  memoryType: 'past' | 'future';
  onHintSelect: (hint: string, category: string) => void;
  isActive: boolean;
}

const ContextualHintEngine: React.FC<ContextualHintEngineProps> = ({
  currentText,
  memoryType,
  onHintSelect,
  isActive
}) => {
  const [contextualHints, setContextualHints] = useState<Array<{
    text: string;
    category: string;
    icon: any;
    confidence: number;
    reasoning: string;
  }>>([]);
  const [detectedContexts, setDetectedContexts] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive || currentText.length < 10) {
      setContextualHints([]);
      setDetectedContexts([]);
      return;
    }

    const hints = generateContextualHints(currentText);
    setContextualHints(hints);
  }, [currentText, isActive, memoryType]);

  const generateContextualHints = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const hints = [];
    const contexts = [];

    // Location-based contextual hints
    const locationContexts = {
      restaurant: {
        keywords: ['restaurant', 'dining', 'waiter', 'menu', 'table', 'food'],
        hints: [
          { text: "What was the lighting like - dim and intimate or bright and bustling?", category: "Atmosphere", reasoning: "Restaurant lighting affects mood and memory" },
          { text: "How did the server interact with you - friendly, professional, rushed?", category: "Social", reasoning: "Human interactions are strong memory anchors" },
          { text: "What sounds filled the restaurant - conversations, kitchen noises, music?", category: "Ambience", reasoning: "Restaurant soundscapes create vivid recall cues" }
        ]
      },
      office: {
        keywords: ['office', 'work', 'meeting', 'desk', 'computer', 'colleague'],
        hints: [
          { text: "What was the energy level in the office - busy and productive or calm and focused?", category: "Workplace Dynamics", reasoning: "Office energy affects memory formation" },
          { text: "How did your workspace feel - organized and clean or cluttered and chaotic?", category: "Environment", reasoning: "Physical workspace impacts cognitive state" },
          { text: "What technology sounds were present - keyboards clicking, phones ringing, printers?", category: "Tech Ambience", reasoning: "Office sounds create temporal anchors" }
        ]
      },
      home: {
        keywords: ['home', 'house', 'kitchen', 'living', 'bedroom', 'family'],
        hints: [
          { text: "What made this space feel like 'home' - familiar objects, scents, or arrangements?", category: "Comfort", reasoning: "Home environments have unique emotional signatures" },
          { text: "How did the natural light enter the space - through windows, skylights, or doors?", category: "Natural Elements", reasoning: "Natural light creates strong temporal and emotional cues" },
          { text: "What family dynamics were present - conversation, activity, or peaceful quiet?", category: "Family Energy", reasoning: "Family interactions are powerful memory anchors" }
        ]
      }
    };

    // Activity-based contextual hints
    const activityContexts = {
      conversation: {
        keywords: ['talking', 'conversation', 'discussion', 'chat', 'speak', 'said'],
        hints: [
          { text: "What was the tone of voice - excited, serious, whispered, or animated?", category: "Communication Style", reasoning: "Voice tone carries emotional memory" },
          { text: "How did body language contribute - gestures, posture, eye contact?", category: "Non-verbal", reasoning: "Body language enhances conversational memory" },
          { text: "What was left unsaid - pauses, implications, or underlying emotions?", category: "Subtext", reasoning: "Unspoken elements often carry the most meaning" }
        ]
      },
      learning: {
        keywords: ['learning', 'studying', 'reading', 'book', 'class', 'teacher'],
        hints: [
          { text: "What was your mental state - curious, focused, overwhelmed, or excited?", category: "Learning Mindset", reasoning: "Mental state affects information encoding" },
          { text: "How did new information connect to what you already knew?", category: "Knowledge Integration", reasoning: "Connections strengthen memory formation" },
          { text: "What physical sensations accompanied learning - tension, relaxation, alertness?", category: "Embodied Learning", reasoning: "Physical state impacts cognitive processing" }
        ]
      }
    };

    // Detect contexts
    Object.entries({...locationContexts, ...activityContexts}).forEach(([context, data]) => {
      if (data.keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        contexts.push(context);
        data.hints.forEach(hint => {
          hints.push({
            ...hint,
            icon: getContextIcon(context),
            confidence: 0.8 + Math.random() * 0.2
          });
        });
      }
    });

    // Time-based hints
    const timeKeywords = ['morning', 'afternoon', 'evening', 'night'];
    const timeContext = timeKeywords.find(time => words.some(word => word.includes(time)));
    
    if (timeContext) {
      const timeHints = {
        morning: [
          { text: "How did the morning energy feel - fresh and optimistic or groggy and slow?", category: "Morning Energy", reasoning: "Morning states create distinct memory patterns" },
          { text: "What morning rituals or routines were part of this experience?", category: "Morning Rituals", reasoning: "Routines provide memory structure" }
        ],
        evening: [
          { text: "How did the day's experiences influence this evening moment?", category: "Daily Progression", reasoning: "Evening memories often reflect daily accumulation" },
          { text: "What was the transition from day to evening like - gradual or sudden?", category: "Temporal Transition", reasoning: "Time transitions are strong memory markers" }
        ]
      };

      if (timeHints[timeContext as keyof typeof timeHints]) {
        timeHints[timeContext as keyof typeof timeHints].forEach(hint => {
          hints.push({
            ...hint,
            icon: Clock,
            confidence: 0.75
          });
        });
      }
    }

    setDetectedContexts(contexts);
    return hints.slice(0, 6);
  };

  const getContextIcon = (context: string) => {
    const iconMap = {
      restaurant: MapPin,
      office: Activity,
      home: Users,
      conversation: Users,
      learning: Brain
    };
    return iconMap[context as keyof typeof iconMap] || Target;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-purple-600" />
          <h4 className="font-medium text-gray-900">Contextual Hints</h4>
        </div>
        {detectedContexts.length > 0 && (
          <div className="flex items-center space-x-1">
            {detectedContexts.map(context => (
              <span key={context} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                {context}
              </span>
            ))}
          </div>
        )}
      </div>

      {contextualHints.length > 0 ? (
        <div className="space-y-2">
          {contextualHints.map((hint, index) => {
            const IconComponent = hint.icon;
            return (
              <button
                key={index}
                onClick={() => onHintSelect(hint.text, hint.category)}
                className="w-full text-left p-3 bg-purple-50 border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-100 transition-all group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-purple-700">{hint.category}</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(hint.confidence * 5) }).map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-purple-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {hint.text}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      💡 {hint.reasoning}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">
            Keep writing to unlock contextual hints based on your memory content
          </p>
        </div>
      )}
    </div>
  );
};

export default ContextualHintEngine;