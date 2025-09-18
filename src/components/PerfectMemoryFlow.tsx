import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Target, TrendingUp, Award, CheckCircle, Zap, Eye, Heart, Clock } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface PerfectMemoryFlowProps {
  onComplete: (weave: any) => void;
  onCancel: () => void;
}

const PerfectMemoryFlow: React.FC<PerfectMemoryFlowProps> = ({ onComplete, onCancel }) => {
  const { addWeave } = useWeave();
  const [currentStep, setCurrentStep] = useState(0);
  const [memoryData, setMemoryData] = useState({
    seed: '',
    title: '',
    details: {} as Record<string, string>,
    narrative: '',
    confidence: 3
  });

  const [adaptiveFlow, setAdaptiveFlow] = useState<Array<{
    type: 'seed' | 'detail' | 'narrative' | 'enhancement';
    prompt: string;
    field?: string;
    reasoning: string;
    importance: number;
  }>>([]);

  const [userProfile, setUserProfile] = useState({
    preferredSenses: ['visual', 'emotional'],
    narrativeStyle: 'chronological',
    detailLevel: 'medium'
  });

  // Generate adaptive flow based on user input
  useEffect(() => {
    generateAdaptiveFlow();
  }, [memoryData.seed, currentStep]);

  const generateAdaptiveFlow = () => {
    const flow = [
      {
        type: 'seed' as const,
        prompt: 'What memory moment would you like to strengthen?',
        reasoning: 'Starting with a clear, specific seed creates the foundation for rich memory reconstruction',
        importance: 10
      }
    ];

    if (memoryData.seed) {
      const seed = memoryData.seed.toLowerCase();
      
      // Intelligent flow adaptation based on seed content
      if (seed.includes('conversation') || seed.includes('talk')) {
        flow.push({
          type: 'detail',
          prompt: 'What did you hear? Focus on voices, tone, and specific words',
          field: 'auditory',
          reasoning: 'Conversations are primarily auditory - this will be your strongest anchor',
          importance: 9
        });
        flow.push({
          type: 'detail',
          prompt: 'How did this conversation make you feel emotionally and physically?',
          field: 'emotional',
          reasoning: 'Emotional content from conversations creates lasting memory impressions',
          importance: 8
        });
        flow.push({
          type: 'detail',
          prompt: 'What could you see? Focus on facial expressions and body language',
          field: 'visual',
          reasoning: 'Visual cues from conversations enhance recall of meaning and context',
          importance: 7
        });
      } else if (seed.includes('food') || seed.includes('meal') || seed.includes('kitchen')) {
        flow.push({
          type: 'detail',
          prompt: 'What scents and aromas filled the air?',
          field: 'olfactory',
          reasoning: 'Food memories are powerfully anchored by smell - this will be your strongest cue',
          importance: 9
        });
        flow.push({
          type: 'detail',
          prompt: 'What could you see? Colors, textures, and visual presentation',
          field: 'visual',
          reasoning: 'Visual details of food create appetitive memory responses',
          importance: 8
        });
        flow.push({
          type: 'detail',
          prompt: 'How did everything feel? Temperature, textures, physical comfort',
          field: 'tactile',
          reasoning: 'Tactile sensations from eating create embodied memory experiences',
          importance: 7
        });
      } else if (seed.includes('nature') || seed.includes('outdoor') || seed.includes('walk')) {
        flow.push({
          type: 'detail',
          prompt: 'What did you see? Focus on natural beauty and visual elements',
          field: 'visual',
          reasoning: 'Nature memories are primarily visual - landscapes create powerful recall cues',
          importance: 9
        });
        flow.push({
          type: 'detail',
          prompt: 'What could you feel? Air temperature, breeze, textures you touched',
          field: 'tactile',
          reasoning: 'Physical sensations in nature create grounding, embodied memories',
          importance: 8
        });
        flow.push({
          type: 'detail',
          prompt: 'How did being in nature affect your emotional state?',
          field: 'emotional',
          reasoning: 'Nature experiences often create profound emotional shifts worth capturing',
          importance: 7
        });
      } else {
        // Default adaptive flow based on user profile
        if (userProfile.preferredSenses.includes('visual')) {
          flow.push({
            type: 'detail',
            prompt: 'What did you see? Your visual processing is strong - leverage it!',
            field: 'visual',
            reasoning: 'Based on your profile, visual details will significantly enhance recall',
            importance: 9
          });
        }
        if (userProfile.preferredSenses.includes('emotional')) {
          flow.push({
            type: 'detail',
            prompt: 'How did you feel? Emotions are your memory superpower',
            field: 'emotional',
            reasoning: 'Your emotional processing creates the strongest memory pathways',
            importance: 8
          });
        }
        flow.push({
          type: 'detail',
          prompt: 'What sounds were present? Audio details create powerful triggers',
          field: 'auditory',
          reasoning: 'Auditory details often trigger unexpected memory cascades',
          importance: 7
        });
      }

      flow.push({
        type: 'narrative',
        prompt: 'Weave these elements into your story',
        reasoning: 'Narrative integration consolidates sensory details into coherent memory structure',
        importance: 6
      });
    }

    setAdaptiveFlow(flow);
  };

  const handleStepComplete = () => {
    const currentFlowStep = adaptiveFlow[currentStep];
    
    if (currentFlowStep?.type === 'detail' && currentFlowStep.field) {
      // Validate detail quality
      const detail = memoryData.details[currentFlowStep.field] || '';
      if (detail.length < 20) {
        alert('Try adding more specific details - aim for at least 20 words to create strong memory anchors.');
        return;
      }
    }

    if (currentStep < adaptiveFlow.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeMemory();
    }
  };

  const completeMemory = () => {
    // Generate intelligent narrative
    const narrative = generateIntelligentNarrative();
    
    const newWeave = {
      type: 'past' as const,
      seed: memoryData.seed,
      title: memoryData.title || `Memory: ${memoryData.seed}`,
      narrative,
      sensoryDetails: {
        visual: memoryData.details.visual || '',
        auditory: memoryData.details.auditory || '',
        olfactory: memoryData.details.olfactory || '',
        tactile: memoryData.details.tactile || '',
        emotional: memoryData.details.emotional || '',
      },
      tags: ['perfect-flow'],
      errorlessMode: false,
      difficultyLevel: 'medium' as const
    };

    addWeave(newWeave);
    onComplete(newWeave);
  };

  const generateIntelligentNarrative = () => {
    const { seed, details } = memoryData;
    let narrative = `I remember ${seed}. `;

    // Intelligent narrative construction based on available details
    const availableDetails = Object.entries(details).filter(([_, detail]) => detail.length > 0);
    
    if (availableDetails.length === 0) {
      return narrative + 'This moment stands out in my memory for its significance.';
    }

    // Order details by narrative impact
    const detailOrder = ['visual', 'auditory', 'emotional', 'tactile', 'olfactory'];
    const orderedDetails = detailOrder
      .map(sense => [sense, details[sense]])
      .filter(([_, detail]) => detail && (detail as string).length > 0);

    orderedDetails.forEach(([sense, detail], index) => {
      const connectors = {
        visual: index === 0 ? 'I could see' : 'Visually,',
        auditory: index === 0 ? 'I could hear' : 'The sounds included',
        emotional: index === 0 ? 'I felt' : 'Emotionally,',
        tactile: index === 0 ? 'I could feel' : 'Physically,',
        olfactory: index === 0 ? 'I could smell' : 'The air carried'
      };
      
      const connector = connectors[sense as keyof typeof connectors];
      narrative += `${connector} ${(detail as string).toLowerCase()}. `;
    });

    narrative += 'All these elements came together to create a memory that remains vivid and meaningful.';
    return narrative;
  };

  const currentFlowStep = adaptiveFlow[currentStep];

  if (!currentFlowStep) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Generating your personalized memory flow...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Adaptive Progress */}
      <div className="flex items-center justify-center space-x-2">
        {adaptiveFlow.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            {currentFlowStep.type === 'seed' ? <Sparkles className="w-8 h-8 text-purple-600" /> :
             currentFlowStep.type === 'detail' ? <Eye className="w-8 h-8 text-purple-600" /> :
             currentFlowStep.type === 'narrative' ? <Brain className="w-8 h-8 text-purple-600" /> :
             <Award className="w-8 h-8 text-purple-600" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentFlowStep.prompt}</h2>
          <p className="text-gray-600">{currentFlowStep.reasoning}</p>
        </div>

        {currentFlowStep.type === 'seed' && (
          <div className="space-y-4">
            <input
              type="text"
              value={memoryData.seed}
              onChange={(e) => setMemoryData(prev => ({ ...prev, seed: e.target.value }))}
              placeholder="e.g., grandmother's kitchen, first day at work, sunset walk"
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
            <input
              type="text"
              value={memoryData.title}
              onChange={(e) => setMemoryData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your memory a title (optional)"
              className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {currentFlowStep.type === 'detail' && currentFlowStep.field && (
          <div className="space-y-4">
            <textarea
              value={memoryData.details[currentFlowStep.field] || ''}
              onChange={(e) => setMemoryData(prev => ({
                ...prev,
                details: { ...prev.details, [currentFlowStep.field!]: e.target.value }
              }))}
              placeholder={`Describe the ${currentFlowStep.field} aspects in rich detail...`}
              rows={4}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              autoFocus
            />
            
            {/* Real-time quality feedback */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-800">Detail Quality:</span>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.min(5, Math.floor((memoryData.details[currentFlowStep.field!] || '').length / 10))
                          ? 'bg-purple-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentFlowStep.type === 'narrative' && (
          <div className="space-y-4">
            <textarea
              value={memoryData.narrative}
              onChange={(e) => setMemoryData(prev => ({ ...prev, narrative: e.target.value }))}
              placeholder="Weave your sensory details into a coherent story..."
              rows={6}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              autoFocus
            />
            
            <button
              onClick={() => {
                const generated = generateIntelligentNarrative();
                setMemoryData(prev => ({ ...prev, narrative: generated }));
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Intelligent Narrative</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {adaptiveFlow.length}
          </div>
          
          <button
            onClick={handleStepComplete}
            disabled={
              (currentFlowStep.type === 'seed' && !memoryData.seed) ||
              (currentFlowStep.type === 'detail' && currentFlowStep.field && 
               !(memoryData.details[currentFlowStep.field] || '').trim()) ||
              (currentFlowStep.type === 'narrative' && !memoryData.narrative)
            }
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === adaptiveFlow.length - 1 ? 'Complete Memory' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Importance Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full">
          <Target className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-purple-800">
            Importance: {currentFlowStep.importance}/10 for memory strength
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerfectMemoryFlow;