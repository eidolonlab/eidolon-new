import React, { useState, useEffect } from 'react';
import { Calendar, Target, Brain, Zap, CheckCircle, Plus, Clock, ArrowRight, Lightbulb, Star } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import type { CognitiveState } from '../contexts/CognitiveStateContext';

interface SmartScenarioPlannerProps {
  cognitiveState: CognitiveState;
  upcomingEvents: any[];
  onComplete: () => void;
}

const SmartScenarioPlanner: React.FC<SmartScenarioPlannerProps> = ({ 
  cognitiveState, 
  upcomingEvents, 
  onComplete 
}) => {
  const { addWeave } = useWeave();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [planningData, setPlanningData] = useState({
    title: '',
    seed: '',
    scheduledFor: '',
    scheduledTime: '',
    ifThenPlans: [''],
    confidenceLevel: 3,
    preparationTime: 7
  });
  const [aiSuggestions, setAiSuggestions] = useState<Array<{
    plan: string;
    confidence: number;
    category: string;
  }>>([]);
  const [riskAssessment, setRiskAssessment] = useState<string[]>([]);

  useEffect(() => {
    if (planningData.seed.length > 5) {
      generateIntelligentSuggestions();
      assessRisks();
    }
  }, [planningData.seed]);

  const generateIntelligentSuggestions = () => {
    const seed = planningData.seed.toLowerCase();
    const suggestions = [];

    // Context-aware if-then planning
    if (seed.includes('interview')) {
      suggestions.push({
        plan: "If I feel nervous, then I will take three deep breaths and remind myself of my qualifications",
        confidence: 90,
        category: "Anxiety Management"
      });
      suggestions.push({
        plan: "If they ask a difficult question, then I will pause, think for 3 seconds, and answer honestly",
        confidence: 85,
        category: "Communication"
      });
      suggestions.push({
        plan: "If I arrive early, then I will use the time to review my notes and visualize success",
        confidence: 80,
        category: "Preparation"
      });
    } else if (seed.includes('presentation')) {
      suggestions.push({
        plan: "If I forget my next point, then I will pause confidently and refer to my notes",
        confidence: 88,
        category: "Recovery"
      });
      suggestions.push({
        plan: "If technology fails, then I will continue without slides and engage directly with the audience",
        confidence: 92,
        category: "Contingency"
      });
      suggestions.push({
        plan: "If someone asks a challenging question, then I will acknowledge it and provide my best answer",
        confidence: 85,
        category: "Interaction"
      });
    } else if (seed.includes('conversation') || seed.includes('difficult')) {
      suggestions.push({
        plan: "If they get defensive, then I will acknowledge their feelings before presenting my perspective",
        confidence: 87,
        category: "De-escalation"
      });
      suggestions.push({
        plan: "If I feel emotional, then I will take a breath and speak from a place of care",
        confidence: 83,
        category: "Emotional Regulation"
      });
    } else {
      // Generic but effective plans
      suggestions.push({
        plan: "If I feel overwhelmed, then I will take a moment to breathe and refocus on my intention",
        confidence: 80,
        category: "Self-Regulation"
      });
      suggestions.push({
        plan: "If things don't go as planned, then I will adapt flexibly and find alternative solutions",
        confidence: 75,
        category: "Adaptability"
      });
    }

    setAiSuggestions(suggestions);
  };

  const assessRisks = () => {
    const seed = planningData.seed.toLowerCase();
    const risks = [];

    if (seed.includes('interview')) {
      risks.push("Nervousness affecting performance");
      risks.push("Unexpected or difficult questions");
      risks.push("Technical issues with virtual interviews");
    } else if (seed.includes('presentation')) {
      risks.push("Technology failures");
      risks.push("Audience disengagement");
      risks.push("Memory lapses or losing train of thought");
    } else if (seed.includes('conversation')) {
      risks.push("Emotional escalation");
      risks.push("Misunderstandings");
      risks.push("Unresolved conflict");
    }

    setRiskAssessment(risks);
  };

  const addIfThenPlan = (plan: string) => {
    const emptyIndex = planningData.ifThenPlans.findIndex(p => p.trim().length === 0);
    if (emptyIndex !== -1) {
      const newPlans = [...planningData.ifThenPlans];
      newPlans[emptyIndex] = plan;
      setPlanningData(prev => ({ ...prev, ifThenPlans: newPlans }));
    } else {
      setPlanningData(prev => ({
        ...prev,
        ifThenPlans: [...prev.ifThenPlans, plan]
      }));
    }
  };

  const handleSave = () => {
    const scheduledDateTime = planningData.scheduledFor && planningData.scheduledTime
      ? new Date(`${planningData.scheduledFor}T${planningData.scheduledTime}`)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newScenario = {
      type: 'future' as const,
      seed: planningData.seed,
      title: planningData.title || `Scenario: ${planningData.seed}`,
      narrative: `I'm preparing for ${planningData.seed}. Through mental rehearsal and implementation planning, I'm building confidence and readiness for when this moment arrives.`,
      sensoryDetails: {
        visual: '',
        auditory: '',
        olfactory: '',
        tactile: '',
        emotional: 'confident and prepared',
      },
      tags: ['smart-planning', cognitiveState.flowState],
      ifThenPlans: planningData.ifThenPlans.filter(plan => plan.trim().length > 0),
      scheduledFor: scheduledDateTime,
      completed: false,
      errorlessMode: false,
      difficultyLevel: 'medium' as const
    };

    addWeave(newScenario);
    alert(`🎯 Scenario "${newScenario.title}" created successfully!\n\nYou're now mentally prepared for ${planningData.seed}.`);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Scenario Rehearsal</h2>
        <p className="text-gray-600">Implementation intentions + mental rehearsal for 2x success rates</p>
      </div>

      <div className="space-y-6">
        {/* Event Selection or Creation */}
        {upcomingEvents.length > 0 && !selectedEvent && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Events Ready for Mental Rehearsal</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setPlanningData(prev => ({
                      ...prev,
                      title: event.title,
                      seed: event.seed,
                      scheduledFor: event.scheduledFor?.toISOString().split('T')[0] || '',
                      scheduledTime: event.scheduledFor?.toTimeString().slice(0, 5) || ''
                    }));
                  }}
                  className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.scheduledFor).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Event Creation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={planningData.title}
              onChange={(e) => setPlanningData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Job Interview at TechCorp"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Moment to Rehearse
            </label>
            <input
              type="text"
              value={planningData.seed}
              onChange={(e) => setPlanningData(prev => ({ ...prev, seed: e.target.value }))}
              placeholder="e.g., walking into the interview room"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* AI-Generated If-Then Plans */}
        {aiSuggestions.length > 0 && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">AI-Generated Implementation Plans</span>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addIfThenPlan(suggestion.plan)}
                  className="w-full text-left p-3 bg-white border border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-emerald-700">{suggestion.category}</span>
                    <span className="text-xs text-emerald-600">{suggestion.confidence}% effective</span>
                  </div>
                  <p className="text-sm text-gray-700">{suggestion.plan}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current If-Then Plans */}
        {planningData.ifThenPlans.some(p => p.trim().length > 0) && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Your Implementation Plans</h3>
            <div className="space-y-2">
              {planningData.ifThenPlans.filter(p => p.trim().length > 0).map((plan, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                