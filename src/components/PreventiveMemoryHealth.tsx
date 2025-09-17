import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingDown, TrendingUp, Brain, Activity, Clock, Target, Eye, Heart } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface MemoryHealthIndicator {
  metric: string;
  current: number;
  baseline: number;
  trend: 'improving' | 'stable' | 'declining';
  significance: 'normal' | 'attention' | 'concern';
  description: string;
  recommendation?: string;
}

interface EarlyWarning {
  id: string;
  type: 'pattern_change' | 'performance_decline' | 'consistency_drop' | 'quality_reduction';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  detected: Date;
  recommendation: string;
  dismissed: boolean;
}

const PreventiveMemoryHealth: React.FC = () => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const [healthIndicators, setHealthIndicators] = useState<MemoryHealthIndicator[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarning[]>([]);
  const [cognitiveTrajectory, setCognitiveTrajectory] = useState<'positive' | 'stable' | 'concerning'>('stable');
  const [baselineEstablished, setBaselineEstablished] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(0);

  useEffect(() => {
    if (weaves.length >= 5 && retrievalSessions.length >= 3) {
      analyzeMemoryHealth();
      detectEarlyWarnings();
      calculateWellnessScore();
      setBaselineEstablished(true);
    }
  }, [weaves, retrievalSessions]);

  const analyzeMemoryHealth = () => {
    const metrics = getMetrics();
    const indicators: MemoryHealthIndicator[] = [];

    // Memory Formation Quality
    const recentWeaves = weaves.slice(0, 5);
    const olderWeaves = weaves.slice(5, 10);
    
    if (olderWeaves.length > 0) {
      const recentAvgCoherence = recentWeaves.reduce((sum, w) => sum + w.coherenceScore, 0) / recentWeaves.length;
      const olderAvgCoherence = olderWeaves.reduce((sum, w) => sum + w.coherenceScore, 0) / olderWeaves.length;
      
      indicators.push({
        metric: 'Memory Formation Quality',
        current: recentAvgCoherence,
        baseline: olderAvgCoherence,
        trend: recentAvgCoherence > olderAvgCoherence + 5 ? 'improving' :
               recentAvgCoherence < olderAvgCoherence - 5 ? 'declining' : 'stable',
        significance: recentAvgCoherence < olderAvgCoherence - 10 ? 'concern' :
                     recentAvgCoherence < olderAvgCoherence - 5 ? 'attention' : 'normal',
        description: 'Quality and coherence of newly created memories',
        recommendation: recentAvgCoherence < olderAvgCoherence - 5 ? 
          'Focus on adding more sensory details and temporal structure' : undefined
      });
    }

    // Retrieval Performance
    const recentSessions = retrievalSessions.slice(0, 5);
    const olderSessions = retrievalSessions.slice(5, 10);
    
    if (olderSessions.length > 0) {
      const recentAvgLatency = recentSessions.reduce((sum, s) => sum + s.latencyMs, 0) / recentSessions.length;
      const olderAvgLatency = olderSessions.reduce((sum, s) => sum + s.latencyMs, 0) / olderSessions.length;
      
      indicators.push({
        metric: 'Retrieval Speed',
        current: recentAvgLatency,
        baseline: olderAvgLatency,
        trend: recentAvgLatency < olderAvgLatency - 2000 ? 'improving' :
               recentAvgLatency > olderAvgLatency + 2000 ? 'declining' : 'stable',
        significance: recentAvgLatency > olderAvgLatency + 5000 ? 'concern' :
                     recentAvgLatency > olderAvgLatency + 2000 ? 'attention' : 'normal',
        description: 'Speed of memory retrieval from cue to recall',
        recommendation: recentAvgLatency > olderAvgLatency + 2000 ? 
          'Consider more frequent retrieval practice or reducing session difficulty' : undefined
      });
    }

    // Training Consistency
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTraining = retrievalSessions.filter(s => s.startTime >= last30Days);
    const expectedSessions = 12; // 3 per week for 4 weeks
    
    indicators.push({
      metric: 'Training Consistency',
      current: recentTraining.length,
      baseline: expectedSessions,
      trend: recentTraining.length >= expectedSessions ? 'improving' :
             recentTraining.length >= expectedSessions * 0.7 ? 'stable' : 'declining',
      significance: recentTraining.length < expectedSessions * 0.5 ? 'concern' :
                   recentTraining.length < expectedSessions * 0.7 ? 'attention' : 'normal',
      description: 'Frequency of memory training sessions',
      recommendation: recentTraining.length < expectedSessions * 0.7 ? 
        'Aim for 3-4 training sessions per week for optimal cognitive benefit' : undefined
    });

    // Sensory Integration
    const sensoryCompleteness = weaves.map(w => {
      const filledSenses = Object.values(w.sensoryDetails).filter(d => d.length > 10).length;
      return (filledSenses / 5) * 100;
    });
    
    const avgSensoryCompleteness = sensoryCompleteness.reduce((sum, score) => sum + score, 0) / sensoryCompleteness.length;
    
    indicators.push({
      metric: 'Sensory Integration',
      current: avgSensoryCompleteness,
      baseline: 60, // Expected baseline
      trend: avgSensoryCompleteness > 70 ? 'improving' :
             avgSensoryCompleteness > 50 ? 'stable' : 'declining',
      significance: avgSensoryCompleteness < 40 ? 'concern' :
                   avgSensoryCompleteness < 60 ? 'attention' : 'normal',
      description: 'Richness of multi-sensory memory encoding',
      recommendation: avgSensoryCompleteness < 60 ? 
        'Focus on including details from all five senses in your memories' : undefined
    });

    setHealthIndicators(indicators);
  };

  const detectEarlyWarnings = () => {
    const warnings: EarlyWarning[] = [];
    const now = new Date();

    // Check for performance decline
    if (retrievalSessions.length >= 5) {
      const recent = retrievalSessions.slice(0, 3);
      const older = retrievalSessions.slice(3, 6);
      
      const recentAvgAccuracy = recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length;
      const olderAvgAccuracy = older.reduce((sum, s) => sum + s.accuracy, 0) / older.length;
      
      if (recentAvgAccuracy < olderAvgAccuracy - 15) {
        warnings.push({
          id: 'accuracy-decline',
          type: 'performance_decline',
          severity: 'medium',
          title: 'Retrieval Accuracy Decline',
          description: `Recent sessions show ${Math.round(olderAvgAccuracy - recentAvgAccuracy)}% decrease in accuracy`,
          detected: now,
          recommendation: 'Consider using errorless mode or reducing difficulty temporarily',
          dismissed: false
        });
      }
    }

    // Check for consistency issues
    const last14Days = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const recentActivity = retrievalSessions.filter(s => s.startTime >= last14Days);
    
    if (recentActivity.length < 3) {
      warnings.push({
        id: 'low-activity',
        type: 'consistency_drop',
        severity: 'low',
        title: 'Reduced Training Activity',
        description: 'Only ' + recentActivity.length + ' training sessions in the last 2 weeks',
        detected: now,
        recommendation: 'Try shorter, more frequent sessions to rebuild consistency',
        dismissed: false
      });
    }

    // Check for memory quality decline
    if (weaves.length >= 5) {
      const recentMemories = weaves.slice(0, 3);
      const olderMemories = weaves.slice(3, 6);
      
      const recentAvgCoherence = recentMemories.reduce((sum, w) => sum + w.coherenceScore, 0) / recentMemories.length;
      const olderAvgCoherence = olderMemories.reduce((sum, w) => sum + w.coherenceScore, 0) / olderMemories.length;
      
      if (recentAvgCoherence < olderAvgCoherence - 10) {
        warnings.push({
          id: 'quality-decline',
          type: 'quality_reduction',
          severity: 'medium',
          title: 'Memory Quality Decline',
          description: `Recent memories show ${Math.round(olderAvgCoherence - recentAvgCoherence)} point decrease in coherence`,
          detected: now,
          recommendation: 'Spend more time on narrative development and sensory details',
          dismissed: false
        });
      }
    }

    setEarlyWarnings(warnings);
  };

  const calculateWellnessScore = () => {
    let score = 0;
    const maxScore = 100;

    // Memory creation frequency (25 points)
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMemories = weaves.filter(w => w.createdAt >= last30Days);
    score += Math.min((recentMemories.length / 8) * 25, 25); // 8 memories per month is optimal

    // Training consistency (25 points)
    const recentSessions = retrievalSessions.filter(s => s.startTime >= last30Days);
    score += Math.min((recentSessions.length / 12) * 25, 25); // 12 sessions per month is optimal

    // Memory quality (25 points)
    const avgCoherence = getMetrics().avgCoherenceScore;
    score += (avgCoherence / 100) * 25;

    // Future planning (25 points)
    const futureWeaves = weaves.filter(w => w.type === 'future');
    const completedScenarios = futureWeaves.filter(w => w.completed);
    const completionRate = futureWeaves.length > 0 ? (completedScenarios.length / futureWeaves.length) : 0;
    score += completionRate * 25;

    setWellnessScore(Math.round(score));
  };

  const dismissWarning = (warningId: string) => {
    setEarlyWarnings(prev => prev.map(w => 
      w.id === warningId ? { ...w, dismissed: true } : w
    ));
  };

  const getIndicatorIcon = (metric: string) => {
    switch (metric) {
      case 'Memory Formation Quality': return Brain;
      case 'Retrieval Speed': return Clock;
      case 'Training Consistency': return Activity;
      case 'Sensory Integration': return Eye;
      default: return Target;
    }
  };

  const getWellnessColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'yellow';
    return 'red';
  };

  const getWellnessLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Needs Attention';
  };

  if (!baselineEstablished) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Establishing Baseline</h3>
          <p className="text-gray-600 mb-4">
            Create more memories and complete training sessions to establish your cognitive health baseline
          </p>
          <div className="text-sm text-gray-500">
            Need: {Math.max(0, 5 - weaves.length)} more memories, {Math.max(0, 3 - retrievalSessions.length)} more sessions
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${getWellnessColor(wellnessScore)}-100 rounded-lg flex items-center justify-center`}>
            <Shield className={`w-5 h-5 text-${getWellnessColor(wellnessScore)}-600`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Preventive Memory Health</h2>
            <p className="text-sm text-gray-600">Early detection and cognitive wellness monitoring</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold text-${getWellnessColor(wellnessScore)}-600`}>
            {wellnessScore}
          </div>
          <div className="text-sm text-gray-600">{getWellnessLabel(wellnessScore)}</div>
          <div className="text-xs text-gray-500">Wellness Score</div>
        </div>
      </div>

      {/* Early Warning System */}
      {earlyWarnings.filter(w => !w.dismissed).length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Early Warning System</h3>
          <div className="space-y-3">
            {earlyWarnings.filter(w => !w.dismissed).map((warning) => (
              <div key={warning.id} className={`p-4 rounded-lg border ${
                warning.severity === 'high' ? 'bg-red-50 border-red-200' :
                warning.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      warning.severity === 'high' ? 'text-red-600' :
                      warning.severity === 'medium' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        warning.severity === 'high' ? 'text-red-900' :
                        warning.severity === 'medium' ? 'text-amber-900' :
                        'text-blue-900'
                      }`}>
                        {warning.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        warning.severity === 'high' ? 'text-red-800' :
                        warning.severity === 'medium' ? 'text-amber-800' :
                        'text-blue-800'
                      }`}>
                        {warning.description}
                      </p>
                      <p className={`text-sm mt-2 font-medium ${
                        warning.severity === 'high' ? 'text-red-900' :
                        warning.severity === 'medium' ? 'text-amber-900' :
                        'text-blue-900'
                      }`}>
                        💡 {warning.recommendation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissWarning(warning.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Indicators */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Cognitive Health Indicators</h3>
        <div className="space-y-4">
          {healthIndicators.map((indicator, index) => {
            const IconComponent = getIndicatorIcon(indicator.metric);
            const trendIcon = indicator.trend === 'improving' ? TrendingUp :
                            indicator.trend === 'declining' ? TrendingDown : Activity;
            const TrendIcon = trendIcon;
            
            return (
              <div key={index} className={`p-4 rounded-lg border ${
                indicator.significance === 'concern' ? 'bg-red-50 border-red-200' :
                indicator.significance === 'attention' ? 'bg-amber-50 border-amber-200' :
                'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${
                      indicator.significance === 'concern' ? 'text-red-600' :
                      indicator.significance === 'attention' ? 'text-amber-600' :
                      'text-emerald-600'
                    }`} />
                    <h4 className="font-medium text-gray-900">{indicator.metric}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendIcon className={`w-4 h-4 ${
                      indicator.trend === 'improving' ? 'text-emerald-600' :
                      indicator.trend === 'declining' ? 'text-red-600' :
                      'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      indicator.significance === 'concern' ? 'text-red-900' :
                      indicator.significance === 'attention' ? 'text-amber-900' :
                      'text-emerald-900'
                    }`}>
                      {indicator.current.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm ${
                  indicator.significance === 'concern' ? 'text-red-800' :
                  indicator.significance === 'attention' ? 'text-amber-800' :
                  'text-emerald-800'
                }`}>
                  {indicator.description}
                </p>
                
                {indicator.recommendation && (
                  <p className={`text-sm mt-2 font-medium ${
                    indicator.significance === 'concern' ? 'text-red-900' :
                    indicator.significance === 'attention' ? 'text-amber-900' :
                    'text-emerald-900'
                  }`}>
                    💡 {indicator.recommendation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cognitive Trajectory */}
      <div className={`p-4 rounded-lg border ${
        cognitiveTrajectory === 'positive' ? 'bg-emerald-50 border-emerald-200' :
        cognitiveTrajectory === 'concerning' ? 'bg-red-50 border-red-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-3 mb-3">
          <TrendingUp className={`w-5 h-5 ${
            cognitiveTrajectory === 'positive' ? 'text-emerald-600' :
            cognitiveTrajectory === 'concerning' ? 'text-red-600' :
            'text-blue-600'
          }`} />
          <h4 className={`font-medium ${
            cognitiveTrajectory === 'positive' ? 'text-emerald-900' :
            cognitiveTrajectory === 'concerning' ? 'text-red-900' :
            'text-blue-900'
          }`}>
            Cognitive Trajectory: {cognitiveTrajectory.charAt(0).toUpperCase() + cognitiveTrajectory.slice(1)}
          </h4>
        </div>
        <p className={`text-sm ${
          cognitiveTrajectory === 'positive' ? 'text-emerald-800' :
          cognitiveTrajectory === 'concerning' ? 'text-red-800' :
          'text-blue-800'
        }`}>
          {cognitiveTrajectory === 'positive' ? 
            'Your memory training metrics show consistent improvement across multiple domains. Continue your current approach.' :
            cognitiveTrajectory === 'concerning' ?
            'Some metrics show declining trends. Consider adjusting your training approach or consulting with a healthcare provider.' :
            'Your cognitive metrics are stable. Maintain consistent training to preserve and enhance your memory abilities.'}
        </p>
      </div>

      {/* Medical Disclaimer */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-red-600" />
          <span className="font-medium text-red-900">Important Medical Notice</span>
        </div>
        <p className="text-sm text-red-800">
          This preventive monitoring is for wellness tracking only and does not constitute medical diagnosis. 
          Any concerning patterns should be discussed with qualified healthcare professionals. 
          Eidolon is designed for cognitive wellness, not medical assessment.
        </p>
      </div>
    </div>
  );
};

export default PreventiveMemoryHealth;