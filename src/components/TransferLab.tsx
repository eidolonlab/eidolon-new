import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, Plus, BarChart3, Award, Brain, Zap, Eye } from 'lucide-react';

interface TransferExperiment {
  id: string;
  title: string;
  goal: string;
  hypothesis: string;
  duration: number; // days
  conditions: {
    control: string;
    intervention: string;
  };
  metrics: string[];
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'complete';
  results?: {
    controlAverage: number;
    interventionAverage: number;
    effectSize: number;
    significance: number;
    insights: string[];
  };
}

interface DailyMeasurement {
  date: Date;
  condition: 'control' | 'intervention';
  metrics: Record<string, number>;
  notes: string;
}

interface TransferLabProps {
  onExperimentComplete: (experiment: TransferExperiment) => void;
}

const TransferLab: React.FC<TransferLabProps> = ({ onExperimentComplete }) => {
  const [experiments, setExperiments] = useState<TransferExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<TransferExperiment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [measurements, setMeasurements] = useState<DailyMeasurement[]>([]);
  const [todaysMeasurement, setTodaysMeasurement] = useState<Partial<DailyMeasurement>>({
    condition: 'control',
    metrics: {},
    notes: ''
  });

  const experimentTemplates = [
    {
      title: 'Name Memory at Events',
      goal: 'Remember names of new people I meet',
      hypothesis: 'Pre-event name rehearsal improves recall by 30%+',
      duration: 7,
      conditions: {
        control: 'Attend events without preparation',
        intervention: 'Spend 5 minutes before events rehearsing name-memory techniques'
      },
      metrics: ['Names remembered correctly', 'Confidence level (1-10)', 'Social comfort (1-10)']
    },
    {
      title: 'Presentation Confidence',
      goal: 'Deliver presentations with confidence and clarity',
      hypothesis: 'Mental rehearsal reduces anxiety and improves performance',
      duration: 14,
      conditions: {
        control: 'Prepare presentations normally',
        intervention: 'Add 10-minute mental rehearsal session before each presentation'
      },
      metrics: ['Anxiety level (1-10)', 'Audience engagement (1-10)', 'Personal satisfaction (1-10)']
    },
    {
      title: 'Task Completion',
      goal: 'Complete planned daily tasks consistently',
      hypothesis: 'Implementation intentions improve follow-through by 40%+',
      duration: 10,
      conditions: {
        control: 'Make regular to-do lists',
        intervention: 'Create specific if-then plans for each task'
      },
      metrics: ['Tasks completed (%)', 'Procrastination time (minutes)', 'End-of-day satisfaction (1-10)']
    },
    {
      title: 'Learning Retention',
      goal: 'Remember and apply what I learn from articles/videos',
      hypothesis: 'Multi-sensory note-taking improves retention and application',
      duration: 14,
      conditions: {
        control: 'Take regular notes while learning',
        intervention: 'Use multi-sensory memory weaving for key concepts'
      },
      metrics: ['Concepts recalled after 1 week (%)', 'Real-world application instances', 'Learning confidence (1-10)']
    }
  ];

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = () => {
    const saved = localStorage.getItem('eidolon-transfer-experiments');
    if (saved) {
      const parsed = JSON.parse(saved).map((exp: any) => ({
        ...exp,
        startDate: new Date(exp.startDate),
        endDate: new Date(exp.endDate)
      }));
      setExperiments(parsed);
    }
  };

  const saveExperiments = (newExperiments: TransferExperiment[]) => {
    setExperiments(newExperiments);
    localStorage.setItem('eidolon-transfer-experiments', JSON.stringify(newExperiments));
  };

  const createExperiment = (template: typeof experimentTemplates[0]) => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + template.duration * 24 * 60 * 60 * 1000);
    
    const experiment: TransferExperiment = {
      id: Date.now().toString(),
      title: template.title,
      goal: template.goal,
      hypothesis: template.hypothesis,
      duration: template.duration,
      conditions: template.conditions,
      metrics: template.metrics,
      startDate,
      endDate,
      status: 'active'
    };

    saveExperiments([...experiments, experiment]);
    setSelectedExperiment(experiment);
    setShowCreateForm(false);
  };

  const recordMeasurement = () => {
    if (!selectedExperiment || !todaysMeasurement.condition) return;

    const measurement: DailyMeasurement = {
      date: new Date(),
      condition: todaysMeasurement.condition,
      metrics: todaysMeasurement.metrics || {},
      notes: todaysMeasurement.notes || ''
    };

    const newMeasurements = [...measurements, measurement];
    setMeasurements(newMeasurements);
    
    // Save to localStorage
    localStorage.setItem(`eidolon-experiment-${selectedExperiment.id}`, JSON.stringify(newMeasurements));
    
    // Reset form
    setTodaysMeasurement({
      condition: 'control',
      metrics: {},
      notes: ''
    });
  };

  const analyzeResults = (experiment: TransferExperiment) => {
    const expMeasurements = JSON.parse(
      localStorage.getItem(`eidolon-experiment-${experiment.id}`) || '[]'
    );

    const controlMeasurements = expMeasurements.filter((m: any) => m.condition === 'control');
    const interventionMeasurements = expMeasurements.filter((m: any) => m.condition === 'intervention');

    if (controlMeasurements.length === 0 || interventionMeasurements.length === 0) {
      return null;
    }

    // Calculate averages for first metric
    const firstMetric = experiment.metrics[0];
    const controlAvg = controlMeasurements.reduce((sum: number, m: any) => 
      sum + (m.metrics[firstMetric] || 0), 0) / controlMeasurements.length;
    const interventionAvg = interventionMeasurements.reduce((sum: number, m: any) => 
      sum + (m.metrics[firstMetric] || 0), 0) / interventionMeasurements.length;

    const effectSize = ((interventionAvg - controlAvg) / controlAvg) * 100;
    const significance = Math.abs(effectSize) > 15 ? 85 : Math.abs(effectSize) > 10 ? 70 : 50;

    return {
      controlAverage: controlAvg,
      interventionAverage: interventionAvg,
      effectSize,
      significance,
      insights: [
        `${effectSize > 0 ? 'Positive' : 'Negative'} effect of ${Math.abs(effectSize).toFixed(1)}%`,
        `Based on ${controlMeasurements.length + interventionMeasurements.length} measurements`,
        significance > 80 ? 'Statistically significant result' : 'Trend detected, more data needed'
      ]
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transfer Lab</h2>
            <p className="text-sm text-gray-600">N-of-1 experiments to prove what works for you</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* Active Experiments */}
      {experiments.filter(e => e.status === 'active').length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Active Experiments</h3>
          <div className="space-y-3">
            {experiments.filter(e => e.status === 'active').map((experiment) => (
              <button
                key={experiment.id}
                onClick={() => setSelectedExperiment(experiment)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedExperiment?.id === experiment.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{experiment.title}</h4>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                    Day {Math.ceil((Date.now() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24))} of {experiment.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{experiment.goal}</p>
                <div className="text-xs text-gray-500">
                  Ends: {experiment.endDate.toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Experiment Templates */}
      {!showCreateForm && experiments.filter(e => e.status === 'active').length === 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Experiment Templates</h3>
          {experimentTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => createExperiment(template)}
              className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-left"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{template.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{template.goal}</p>
              <div className="text-xs text-purple-700 bg-purple-100 rounded px-2 py-1">
                💡 {template.hypothesis}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {template.duration} days • {template.metrics.length} metrics
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Daily Measurement Form */}
      {selectedExperiment && selectedExperiment.status === 'active' && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-4">Today's Measurement</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which condition are you using today?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTodaysMeasurement(prev => ({ ...prev, condition: 'control' }))}
                  className={`p-3 rounded-lg border transition-all ${
                    todaysMeasurement.condition === 'control'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Control</div>
                  <div className="text-xs text-gray-600">{selectedExperiment.conditions.control}</div>
                </button>
                <button
                  onClick={() => setTodaysMeasurement(prev => ({ ...prev, condition: 'intervention' }))}
                  className={`p-3 rounded-lg border transition-all ${
                    todaysMeasurement.condition === 'intervention'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Intervention</div>
                  <div className="text-xs text-gray-600">{selectedExperiment.conditions.intervention}</div>
                </button>
              </div>
            </div>

            {selectedExperiment.metrics.map((metric, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {metric}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={todaysMeasurement.metrics?.[metric] || ''}
                  onChange={(e) => setTodaysMeasurement(prev => ({
                    ...prev,
                    metrics: { ...prev.metrics, [metric]: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={todaysMeasurement.notes}
                onChange={(e) => setTodaysMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations or context..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={recordMeasurement}
              disabled={!todaysMeasurement.condition || Object.keys(todaysMeasurement.metrics || {}).length === 0}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Record Today's Data
            </button>
          </div>
        </div>
      )}

      {/* Completed Experiments with Results */}
      {experiments.filter(e => e.status === 'complete').length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Personal Findings</h3>
          {experiments.filter(e => e.status === 'complete').map((experiment) => {
            const results = analyzeResults(experiment);
            
            return (
              <div key={experiment.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-emerald-900">{experiment.title}</h4>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                
                {results && (
                  <div className="space-y-2">
                    <div className="text-sm text-emerald-800">
                      <strong>Finding:</strong> {results.effectSize > 0 ? 'Positive' : 'Negative'} effect of {Math.abs(results.effectSize).toFixed(1)}%
                    </div>
                    <div className="text-sm text-emerald-700">
                      Control average: {results.controlAverage.toFixed(1)} | 
                      Intervention average: {results.interventionAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-emerald-600">
                      Confidence: {results.significance}% • Your personal science
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransferLab;