import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Trash2, Save, Zap, Target, Lightbulb } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';
import InteractiveCueEngine from './InteractiveCueEngine';
import ContextualHintEngine from './ContextualHintEngine';
import IntelligentScenarioPlanner from './IntelligentScenarioPlanner';

interface ScenarioStudioProps {
  onBack: () => void;
}

const ScenarioStudio: React.FC<ScenarioStudioProps> = ({ onBack }) => {
  const { weaves, addWeave, updateWeave } = useWeave();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state for creating new scenarios
  const [formData, setFormData] = useState({
    title: '',
    seed: '',
    scheduledFor: '',
    scheduledTime: '',
    location: '',
    ifThenPlans: [''],
    narrative: '',
  });
  const [showIfThenHelper, setShowIfThenHelper] = useState(false);
  const [ifThenSuggestions, setIfThenSuggestions] = useState<string[]>([]);
  const [showAIAssistance, setShowAIAssistance] = useState(true);

  const futureWeaves = weaves.filter(w => w.type === 'future');
  const selectedWeave = selectedScenario ? weaves.find(w => w.id === selectedScenario) : null;

  const handleAddIfThenPlan = () => {
    setFormData(prev => ({
      ...prev,
      ifThenPlans: [...prev.ifThenPlans, ''],
    }));
  };

  const handleRemoveIfThenPlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ifThenPlans: prev.ifThenPlans.filter((_, i) => i !== index),
    }));
  };

  const handleIfThenPlanChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ifThenPlans: prev.ifThenPlans.map((plan, i) => i === index ? value : plan),
    }));
  };

  const handleCreateScenario = () => {
    if (!formData.title || !formData.seed) return;

    const scheduledDateTime = formData.scheduledFor && formData.scheduledTime
      ? new Date(`${formData.scheduledFor}T${formData.scheduledTime}`)
      : undefined;

    addWeave({
      type: 'future',
      title: formData.title,
      seed: formData.seed,
      narrative: formData.narrative || `I'm preparing for ${formData.seed}. This scenario will help me feel confident and ready when the moment arrives.`,
      sensoryDetails: {
        visual: '',
        auditory: '',
        olfactory: '',
        tactile: '',
        emotional: 'confident and prepared',
      },
      tags: [],
      ifThenPlans: formData.ifThenPlans.filter(plan => plan.trim().length > 0),
      scheduledFor: scheduledDateTime,
      completed: false,
    });

    // Reset form
    setFormData({
      title: '',
      seed: '',
      scheduledFor: '',
      scheduledTime: '',
      location: '',
      ifThenPlans: [''],
      narrative: '',
    });
    
    // Show success message
    alert(`Future scenario "${formData.title}" has been created successfully!`);
    setShowCreateForm(false);
  };

  const generateIfThenSuggestions = () => {
    const suggestions = [];
    const seed = formData.seed.toLowerCase();
    
    // Context-aware if-then suggestions
    if (seed.includes('interview')) {
      suggestions.push(
        "If I feel nervous, then I will take three deep breaths and remind myself of my qualifications",
        "If they ask a difficult question, then I will pause, think, and answer honestly",
        "If I arrive early, then I will use the time to review my notes and visualize success",
        "If I feel overwhelmed, then I will focus on one question at a time"
      );
    } else if (seed.includes('presentation') || seed.includes('speech')) {
      suggestions.push(
        "If I forget my next point, then I will pause and refer to my notes confidently",
        "If I feel anxious, then I will make eye contact with a friendly face in the audience",
        "If technology fails, then I will continue without slides and engage directly",
        "If someone asks a challenging question, then I will acknowledge it and provide my best answer"
      );
    } else if (seed.includes('meeting')) {
      suggestions.push(
        "If the discussion goes off-topic, then I will gently redirect to the agenda",
        "If I disagree with someone, then I will listen fully before presenting my perspective",
        "If I'm asked for input, then I will speak clearly and concisely",
        "If the meeting runs long, then I will suggest prioritizing the most important items"
      );
    } else if (seed.includes('date') || seed.includes('dinner')) {
      suggestions.push(
        "If conversation lulls, then I will ask an open-ended question about their interests",
        "If I feel nervous, then I will focus on being genuinely curious about them",
        "If they seem uncomfortable, then I will suggest a different activity or topic",
        "If I spill something, then I will laugh it off and continue enjoying the moment"
      );
    } else {
      // Generic suggestions
      suggestions.push(
        "If I feel overwhelmed, then I will take a moment to breathe and refocus",
        "If things don't go as planned, then I will adapt and find alternative solutions",
        "If I feel confident, then I will trust my preparation and stay present",
        "If I need help, then I will ask for assistance without hesitation"
      );
    }
    
    setIfThenSuggestions(suggestions);
    setShowIfThenHelper(true);
  };
  const handleMarkCompleted = (weaveId: string) => {
    updateWeave(weaveId, { completed: true });
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Scenarios</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Future Scenario</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Job Interview at TechCorp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario Seed
              </label>
              <input
                type="text"
                value={formData.seed}
                onChange={(e) => setFormData(prev => ({ ...prev, seed: e.target.value }))}
                placeholder="e.g., walking into the interview room"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                If-Then Implementation Plans
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Create specific "If X happens, then I will Y" plans to improve your follow-through
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  {formData.ifThenPlans.filter(p => p.trim().length > 0).length} plan(s) created
                </div>
                <button
                  onClick={generateIfThenSuggestions}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  <span>Get Suggestions</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.ifThenPlans.map((plan, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={plan}
                      onChange={(e) => handleIfThenPlanChange(index, e.target.value)}
                      placeholder="If I feel nervous, then I will take three deep breaths"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {formData.ifThenPlans.length > 1 && (
                      <button
                        onClick={() => handleRemoveIfThenPlan(index)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddIfThenPlan}
                  className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add another plan</span>
                </button>
              </div>
              
              {/* If-Then Suggestions Modal */}
              {showIfThenHelper && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-emerald-900">Smart Suggestions</span>
                    </div>
                    <button
                      onClick={() => setShowIfThenHelper(false)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2">
                    {ifThenSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const emptyIndex = formData.ifThenPlans.findIndex(p => p.trim().length === 0);
                          if (emptyIndex !== -1) {
                            handleIfThenPlanChange(emptyIndex, suggestion);
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              ifThenPlans: [...prev.ifThenPlans, suggestion]
                            }));
                          }
                        }}
                        className="w-full text-left p-3 bg-white border border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistance for Scenario Planning */}
            {showAIAssistance && formData.seed.length > 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">AI Scenario Assistant</h4>
                  <button
                    onClick={() => setShowAIAssistance(!showAIAssistance)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showAIAssistance ? 'Hide' : 'Show'} AI
                  </button>
                </div>
                
                <IntelligentScenarioPlanner
                  scenarioSeed={formData.seed}
                  scheduledDate={formData.scheduledFor && formData.scheduledTime ? 
                    new Date(`${formData.scheduledFor}T${formData.scheduledTime}`) : undefined}
                  onIfThenSuggestion={(plan, confidence, reasoning) => {
                    const emptyIndex = formData.ifThenPlans.findIndex(p => p.trim().length === 0);
                    if (emptyIndex !== -1) {
                      handleIfThenPlanChange(emptyIndex, plan);
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        ifThenPlans: [...prev.ifThenPlans, plan]
                      }));
                    }
                  }}
                  onConfidenceStrategy={(strategy) => {
                    setFormData(prev => ({
                      ...prev,
                      narrative: prev.narrative + (prev.narrative ? ' ' : '') + strategy
                    }));
                  }}
                  onRiskMitigation={(risk, mitigation) => {
                    console.log('Risk mitigation:', risk, mitigation);
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rehearsal Narrative (Optional)
              </label>
              <textarea
                value={formData.narrative}
                onChange={(e) => setFormData(prev => ({ ...prev, narrative: e.target.value }))}
                placeholder="Describe how you want this scenario to unfold..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScenario}
                disabled={!formData.title || !formData.seed}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Create Scenario</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Scenario Studio</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Scenario</span>
          </button>
        </div>
      </div>

      {futureWeaves.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Future Scenarios Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first scenario to start rehearsing upcoming events with evidence-based techniques.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Scenario</span>
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scenarios List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Scenarios</h2>
            <div className="space-y-3">
              {futureWeaves.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedScenario === scenario.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">{scenario.title}</h3>
                    {scenario.completed && (
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">"{scenario.seed}"</p>
                  {scenario.scheduledFor && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDateTime(scenario.scheduledFor)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Details */}
          <div className="lg:col-span-2">
            {selectedWeave ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedWeave.title}</h2>
                    <p className="text-gray-600">Seed: "{selectedWeave.seed}"</p>
                  </div>
                  {!selectedWeave.completed && (
                    <button
                      onClick={() => handleMarkCompleted(selectedWeave.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>

                {selectedWeave.scheduledFor && (
                  <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Scheduled for: {formatDateTime(selectedWeave.scheduledFor)}</span>
                  </div>
                )}

                {selectedWeave.narrative && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rehearsal Narrative</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedWeave.narrative}</p>
                    </div>
                  </div>
                )}

                {selectedWeave.ifThenPlans && selectedWeave.ifThenPlans.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">If-Then Implementation Plans</h3>
                    <div className="space-y-3">
                      {selectedWeave.ifThenPlans.map((plan, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                          <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-emerald-700">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{plan}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Coherence Score</h4>
                    <div className="text-2xl font-bold text-emerald-600">{selectedWeave.coherenceScore}</div>
                    <p className="text-sm text-gray-600">Narrative quality rating</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <div className={`text-2xl font-bold ${selectedWeave.completed ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedWeave.completed ? 'Completed' : 'Pending'}
                    </div>
                    <p className="text-sm text-gray-600">Scenario completion</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Scenario</h3>
                <p className="text-gray-600">Choose a scenario from the list to view its details and implementation plans.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioStudio;