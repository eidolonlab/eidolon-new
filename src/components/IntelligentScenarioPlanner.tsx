import React, { useState, useEffect } from 'react';
import { Target, Brain, Zap, Calendar, CheckCircle, Lightbulb, TrendingUp, Award, Clock, Users } from 'lucide-react';

interface ScenarioIntelligence {
  scenarioType: string;
  successProbability: number;
  riskFactors: string[];
  contingencyPlans: string[];
  confidenceBuilders: string[];
  optimalPreparationTime: number;
  keySuccessFactors: string[];
}

interface IntelligentScenarioplannerProps {
  scenarioSeed: string;
  scheduledDate?: Date;
  onIfThenSuggestion: (plan: string, confidence: number, reasoning: string) => void;
  onConfidenceStrategy: (strategy: string) => void;
  onRiskMitigation: (risk: string, mitigation: string) => void;
}

const IntelligentScenarioPlanner: React.FC<IntelligentScenarioplannerProps> = ({
  scenarioSeed,
  scheduledDate,
  onIfThenSuggestion,
  onConfidenceStrategy,
  onRiskMitigation
}) => {
  const [intelligence, setIntelligence] = useState<ScenarioIntelligence>({
    scenarioType: 'general',
    successProbability: 70,
    riskFactors: [],
    contingencyPlans: [],
    confidenceBuilders: [],
    optimalPreparationTime: 7,
    keySuccessFactors: []
  });

  const [adaptiveStrategies, setAdaptiveStrategies] = useState<Array<{
    strategy: string;
    effectiveness: number;
    timeToImplement: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>>([]);

  const [timelineRecommendations, setTimelineRecommendations] = useState<Array<{
    timeframe: string;
    actions: string[];
    rationale: string;
  }>>([]);

  useEffect(() => {
    analyzeScenario();
    generateAdaptiveStrategies();
    createPreparationTimeline();
  }, [scenarioSeed, scheduledDate]);

  const analyzeScenario = () => {
    const seed = scenarioSeed.toLowerCase();
    let scenarioType = 'general';
    let successFactors: string[] = [];
    let risks: string[] = [];
    let confidenceBuilders: string[] = [];

    // Intelligent scenario classification
    if (seed.includes('interview')) {
      scenarioType = 'interview';
      successFactors = [
        'Clear articulation of qualifications',
        'Confident body language and eye contact',
        'Thoughtful questions about the role',
        'Authentic enthusiasm for the opportunity'
      ];
      risks = [
        'Nervousness affecting performance',
        'Unexpected or difficult questions',
        'Technical issues with virtual interviews',
        'Running late or logistics problems'
      ];
      confidenceBuilders = [
        'Research the company and interviewer thoroughly',
        'Practice STAR method responses to common questions',
        'Visualize successful interactions and positive outcomes',
        'Prepare 3-5 thoughtful questions about the role'
      ];
    } else if (seed.includes('presentation') || seed.includes('speech')) {
      scenarioType = 'presentation';
      successFactors = [
        'Clear, well-structured content delivery',
        'Engaging audience interaction',
        'Confident handling of questions',
        'Effective use of visual aids'
      ];
      risks = [
        'Technology failures or technical issues',
        'Audience disengagement or difficult questions',
        'Memory lapses or losing train of thought',
        'Time management challenges'
      ];
      confidenceBuilders = [
        'Rehearse opening and closing statements until automatic',
        'Practice with the actual technology you\'ll use',
        'Prepare backup plans for every technical element',
        'Visualize positive audience reactions and engagement'
      ];
    } else if (seed.includes('conversation') || seed.includes('difficult')) {
      scenarioType = 'conversation';
      successFactors = [
        'Active listening and empathy',
        'Clear communication of your perspective',
        'Maintaining emotional regulation',
        'Finding mutually beneficial solutions'
      ];
      risks = [
        'Emotional escalation or defensiveness',
        'Misunderstandings or poor communication',
        'Unresolved conflict or hurt feelings',
        'Saying something you\'ll regret'
      ];
      confidenceBuilders = [
        'Practice key phrases and responses',
        'Visualize staying calm and centered',
        'Prepare to acknowledge their perspective first',
        'Plan specific de-escalation techniques'
      ];
    } else if (seed.includes('exam') || seed.includes('test')) {
      scenarioType = 'exam';
      successFactors = [
        'Thorough preparation and knowledge mastery',
        'Effective time management during test',
        'Calm, focused mental state',
        'Strategic approach to difficult questions'
      ];
      risks = [
        'Test anxiety affecting performance',
        'Time pressure and rushing',
        'Blanking on studied material',
        'Misreading questions or instructions'
      ];
      confidenceBuilders = [
        'Practice with timed mock exams',
        'Develop relaxation techniques for test day',
        'Create memory aids and mnemonics',
        'Visualize successful completion and good results'
      ];
    }

    setIntelligence({
      scenarioType,
      successProbability: calculateSuccessProbability(successFactors.length, risks.length),
      riskFactors: risks,
      contingencyPlans: [],
      confidenceBuilders,
      optimalPreparationTime: getOptimalPrepTime(scenarioType),
      keySuccessFactors: successFactors
    });
  };

  const calculateSuccessProbability = (successFactors: number, riskFactors: number) => {
    const base = 60;
    const factorBonus = successFactors * 5;
    const riskPenalty = riskFactors * 3;
    return Math.max(30, Math.min(95, base + factorBonus - riskPenalty));
  };

  const getOptimalPrepTime = (type: string) => {
    const prepTimes = {
      interview: 14,
      presentation: 21,
      conversation: 3,
      exam: 30,
      general: 7
    };
    return prepTimes[type as keyof typeof prepTimes] || 7;
  };

  const generateAdaptiveStrategies = () => {
    const strategies = [];

    // Generate if-then plans based on scenario intelligence
    intelligence.riskFactors.forEach(risk => {
      if (risk.includes('nervous') || risk.includes('anxiety')) {
        strategies.push({
          strategy: "If I feel nervous, then I will take three deep breaths and remind myself of my preparation",
          effectiveness: 85,
          timeToImplement: 1,
          difficulty: 'easy' as const,
          category: 'anxiety_management'
        });
        strategies.push({
          strategy: "If anxiety peaks, then I will use the 5-4-3-2-1 grounding technique",
          effectiveness: 80,
          timeToImplement: 2,
          difficulty: 'medium' as const,
          category: 'anxiety_management'
        });
      }

      if (risk.includes('question') || risk.includes('unexpected')) {
        strategies.push({
          strategy: "If I get an unexpected question, then I will pause, think for 3 seconds, and answer honestly",
          effectiveness: 90,
          timeToImplement: 1,
          difficulty: 'easy' as const,
          category: 'adaptability'
        });
      }

      if (risk.includes('technology') || risk.includes('technical')) {
        strategies.push({
          strategy: "If technology fails, then I will continue confidently without it and engage directly",
          effectiveness: 95,
          timeToImplement: 1,
          difficulty: 'medium' as const,
          category: 'contingency'
        });
      }
    });

    setAdaptiveStrategies(strategies.slice(0, 4));
  };

  const createPreparationTimeline = () => {
    if (!scheduledDate) return;

    const daysUntil = Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const timeline = [];

    if (daysUntil > 7) {
      timeline.push({
        timeframe: '1-2 weeks before',
        actions: [
          'Begin mental rehearsal with basic visualization',
          'Research and gather necessary information',
          'Start building confidence through positive self-talk'
        ],
        rationale: 'Early preparation reduces anxiety and builds foundational confidence'
      });
    }

    if (daysUntil > 3) {
      timeline.push({
        timeframe: '3-7 days before',
        actions: [
          'Intensify mental rehearsal with detailed scenarios',
          'Practice key phrases and responses out loud',
          'Prepare contingency plans for potential challenges'
        ],
        rationale: 'Detailed rehearsal creates neural pathways for automatic responses'
      });
    }

    timeline.push({
      timeframe: 'Day before',
      actions: [
        'Final mental rehearsal focusing on positive outcomes',
        'Prepare everything you need (materials, clothes, etc.)',
        'Get good sleep and avoid over-preparation'
      ],
      rationale: 'Final preparation should focus on confidence and readiness, not cramming'
    });

    timeline.push({
      timeframe: 'Day of event',
      actions: [
        'Morning visualization of successful completion',
        'Arrive early to familiarize yourself with the environment',
        'Use breathing techniques to maintain optimal state'
      ],
      rationale: 'Day-of preparation focuses on state management and environmental familiarity'
    });

    setTimelineRecommendations(timeline);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Intelligence Overview */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-emerald-900">Scenario Analysis</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{intelligence.successProbability}%</div>
            <div className="text-xs text-emerald-700">Success Probability</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-emerald-900 mb-1">Key Success Factors:</div>
            {intelligence.keySuccessFactors.slice(0, 2).map((factor, index) => (
              <div key={index} className="text-emerald-800">• {factor}</div>
            ))}
          </div>
          <div>
            <div className="font-medium text-emerald-900 mb-1">Risk Mitigation:</div>
            {intelligence.riskFactors.slice(0, 2).map((risk, index) => (
              <div key={index} className="text-emerald-800">• {risk}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Adaptive If-Then Strategies */}
      {adaptiveStrategies.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">AI-Generated If-Then Plans</h4>
          {adaptiveStrategies.map((strategy, index) => (
            <button
              key={index}
              onClick={() => onIfThenSuggestion(strategy.strategy, strategy.effectiveness, `${strategy.effectiveness}% effective based on research`)}
              className="w-full text-left p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-700 capitalize">
                      {strategy.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">{strategy.effectiveness}% effective</span>
                      <div className={`w-2 h-2 rounded-full ${
                        strategy.difficulty === 'easy' ? 'bg-green-500' :
                        strategy.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {strategy.strategy}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Preparation Timeline */}
      {timelineRecommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Optimal Preparation Timeline</h4>
          {timelineRecommendations.map((timeline, index) => (
            <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">{timeline.timeframe}</span>
              </div>
              <div className="space-y-1 mb-3">
                {timeline.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="text-sm text-indigo-800">• {action}</div>
                ))}
              </div>
              <div className="text-xs text-indigo-600 bg-indigo-100 rounded px-2 py-1">
                💡 {timeline.rationale}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntelligentScenarioPlanner;