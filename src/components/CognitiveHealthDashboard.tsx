import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Shield, AlertTriangle, CheckCircle, Activity, Target, Calendar, Award, Zap } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface CognitiveHealthMetrics {
  overallScore: number;
  memoryStrength: number;
  narrativeQuality: number;
  retrievalSpeed: number;
  consistency: number;
  improvement: number;
  riskFactors: string[];
  strengths: string[];
  trend: 'improving' | 'stable' | 'declining';
}

interface HealthAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string;
  timestamp: Date;
}

const CognitiveHealthDashboard: React.FC = () => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const [healthMetrics, setHealthMetrics] = useState<CognitiveHealthMetrics | null>(null);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [trendData, setTrendData] = useState<Array<{ date: string; score: number }>>([]);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  useEffect(() => {
    calculateCognitiveHealth();
    generateHealthAlerts();
    generateTrendData();
  }, [weaves, retrievalSessions]);

  const calculateCognitiveHealth = () => {
    if (weaves.length === 0) {
      setHealthMetrics(null);
      return;
    }

    const metrics = getMetrics();
    
    // Memory strength (based on coherence scores)
    const memoryStrength = metrics.avgCoherenceScore;
    
    // Narrative quality (detailed analysis)
    const narrativeQuality = calculateNarrativeQuality();
    
    // Retrieval speed (inverse of latency, normalized)
    const retrievalSpeed = metrics.avgRecallLatency > 0 
      ? Math.max(0, 100 - (metrics.avgRecallLatency / 1000 - 5) * 10)
      : 75;
    
    // Consistency (based on regular practice)
    const consistency = calculateConsistency();
    
    // Improvement trend
    const improvement = calculateImprovement();
    
    // Overall cognitive health score
    const overallScore = (memoryStrength + narrativeQuality + retrievalSpeed + consistency + improvement) / 5;
    
    // Risk factors and strengths
    const riskFactors = [];
    const strengths = [];
    
    if (memoryStrength < 60) riskFactors.push('Low narrative coherence');
    if (retrievalSpeed < 50) riskFactors.push('Slow memory retrieval');
    if (consistency < 40) riskFactors.push('Irregular training pattern');
    if (improvement < 0) riskFactors.push('Declining performance trend');
    
    if (memoryStrength > 80) strengths.push('Excellent memory coherence');
    if (retrievalSpeed > 80) strengths.push('Rapid memory access');
    if (consistency > 70) strengths.push('Consistent training habits');
    if (improvement > 20) strengths.push('Strong improvement trajectory');
    
    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (improvement > 10) trend = 'improving';
    else if (improvement < -10) trend = 'declining';

    setHealthMetrics({
      overallScore,
      memoryStrength,
      narrativeQuality,
      retrievalSpeed,
      consistency,
      improvement,
      riskFactors,
      strengths,
      trend
    });
  };

  const calculateNarrativeQuality = () => {
    if (weaves.length === 0) return 0;
    
    let qualityScore = 0;
    
    weaves.forEach(weave => {
      let weaveQuality = 0;
      
      // Sensory richness (20 points)
      const filledSenses = Object.values(weave.sensoryDetails).filter(d => d.length > 10).length;
      weaveQuality += (filledSenses / 5) * 20;
      
      // Narrative length and structure (30 points)
      const wordCount = weave.narrative.split(' ').length;
      const sentenceCount = weave.narrative.split('.').filter(s => s.trim().length > 0).length;
      weaveQuality += Math.min((wordCount / 100) * 20, 20);
      weaveQuality += Math.min((sentenceCount / 3) * 10, 10);
      
      // Emotional depth (25 points)
      const emotionalWords = ['feel', 'felt', 'emotion', 'happy', 'sad', 'excited', 'nervous', 'calm', 'love', 'fear'];
      const emotionalCount = emotionalWords.filter(word => 
        weave.narrative.toLowerCase().includes(word) || 
        weave.sensoryDetails.emotional.toLowerCase().includes(word)
      ).length;
      weaveQuality += Math.min(emotionalCount * 5, 25);
      
      // Temporal structure (25 points)
      const temporalMarkers = ['first', 'then', 'next', 'after', 'before', 'while', 'during', 'finally'];
      const temporalCount = temporalMarkers.filter(marker => 
        weave.narrative.toLowerCase().includes(marker)
      ).length;
      weaveQuality += Math.min(temporalCount * 5, 25);
      
      qualityScore += Math.min(weaveQuality, 100);
    });
    
    return qualityScore / weaves.length;
  };

  const calculateConsistency = () => {
    if (retrievalSessions.length < 2) return 0;
    
    // Calculate training frequency over last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSessions = retrievalSessions.filter(s => s.startTime >= thirtyDaysAgo);
    
    // Ideal is 3-4 sessions per week
    const weeksInPeriod = 4;
    const idealSessions = weeksInPeriod * 3.5;
    const consistencyScore = Math.min((recentSessions.length / idealSessions) * 100, 100);
    
    return consistencyScore;
  };

  const calculateImprovement = () => {
    if (weaves.length < 3) return 0;
    
    // Compare first 3 weaves to last 3 weaves
    const firstThree = weaves.slice(-3).map(w => w.coherenceScore);
    const lastThree = weaves.slice(0, 3).map(w => w.coherenceScore);
    
    const firstAvg = firstThree.reduce((sum, score) => sum + score, 0) / firstThree.length;
    const lastAvg = lastThree.reduce((sum, score) => sum + score, 0) / lastThree.length;
    
    return ((lastAvg - firstAvg) / firstAvg) * 100;
  };

  const generateHealthAlerts = () => {
    const alerts: HealthAlert[] = [];
    const now = new Date();
    
    // Check for inactivity
    const lastSession = retrievalSessions[0];
    if (lastSession) {
      const daysSinceLastSession = Math.floor((now.getTime() - lastSession.startTime.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastSession > 7) {
        alerts.push({
          id: 'inactivity',
          type: 'warning',
          title: 'Training Gap Detected',
          message: `It's been ${daysSinceLastSession} days since your last session. Regular practice maintains cognitive gains.`,
          action: 'Schedule a quick 10-minute session',
          timestamp: now
        });
      }
    }
    
    // Check for declining performance
    if (healthMetrics?.trend === 'declining') {
      alerts.push({
        id: 'decline',
        type: 'warning',
        title: 'Performance Trend Alert',
        message: 'Recent sessions show declining performance. Consider adjusting difficulty or taking a rest day.',
        action: 'Review your training approach',
        timestamp: now
      });
    }
    
    // Positive reinforcement
    if (healthMetrics?.overallScore > 85) {
      alerts.push({
        id: 'excellence',
        type: 'success',
        title: 'Excellent Cognitive Health',
        message: 'Your memory training metrics indicate strong cognitive fitness. Keep up the great work!',
        timestamp: now
      });
    }
    
    // Milestone celebrations
    const totalSessions = retrievalSessions.length;
    if (totalSessions > 0 && totalSessions % 10 === 0) {
      alerts.push({
        id: 'milestone',
        type: 'success',
        title: `${totalSessions} Sessions Milestone!`,
        message: 'Congratulations on your consistent training dedication.',
        timestamp: now
      });
    }

    setHealthAlerts(alerts);
  };

  const generateTrendData = () => {
    // Generate 30-day trend data
    const trends = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate daily cognitive score based on activities
      const dayWeaves = weaves.filter(w => 
        w.createdAt.toISOString().split('T')[0] === dateStr
      );
      const daySessions = retrievalSessions.filter(s => 
        s.startTime.toISOString().split('T')[0] === dateStr
      );
      
      let dayScore = 50; // Baseline
      dayScore += dayWeaves.length * 5; // +5 per weave
      dayScore += daySessions.length * 3; // +3 per session
      dayScore += dayWeaves.reduce((sum, w) => sum + (w.coherenceScore - 70) * 0.5, 0); // Coherence bonus
      
      trends.push({
        date: dateStr,
        score: Math.max(0, Math.min(100, dayScore))
      });
    }
    
    setTrendData(trends);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'yellow';
    if (score >= 55) return 'orange';
    return 'red';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Needs Attention';
  };

  if (!healthMetrics) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cognitive Health Analysis</h3>
          <p className="text-gray-600">
            Create some memories and complete training sessions to unlock your cognitive health dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${getHealthScoreColor(healthMetrics.overallScore)}-100 rounded-lg flex items-center justify-center`}>
            <Brain className={`w-5 h-5 text-${getHealthScoreColor(healthMetrics.overallScore)}-600`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cognitive Health Dashboard</h2>
            <p className="text-sm text-gray-600">Comprehensive analysis of your memory fitness</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold text-${getHealthScoreColor(healthMetrics.overallScore)}-600`}>
            {Math.round(healthMetrics.overallScore)}
          </div>
          <div className="text-sm text-gray-600">{getHealthScoreLabel(healthMetrics.overallScore)}</div>
        </div>
      </div>

      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Health Alerts</h3>
          <div className="space-y-3">
            {healthAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                alert.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    alert.type === 'warning' ? 'bg-amber-100' :
                    alert.type === 'success' ? 'bg-emerald-100' :
                    'bg-blue-100'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> :
                     alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                     <Activity className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      alert.type === 'warning' ? 'text-amber-900' :
                      alert.type === 'success' ? 'text-emerald-900' :
                      'text-blue-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      alert.type === 'warning' ? 'text-amber-800' :
                      alert.type === 'success' ? 'text-emerald-800' :
                      'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                    {alert.action && (
                      <button className={`text-sm font-medium mt-2 ${
                        alert.type === 'warning' ? 'text-amber-600 hover:text-amber-700' :
                        alert.type === 'success' ? 'text-emerald-600 hover:text-emerald-700' :
                        'text-blue-600 hover:text-blue-700'
                      } transition-colors`}>
                        {alert.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Health Metrics */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <Brain className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-indigo-600">{Math.round(healthMetrics.memoryStrength)}</div>
          <div className="text-xs text-gray-600">Memory Strength</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-purple-600">{Math.round(healthMetrics.narrativeQuality)}</div>
          <div className="text-xs text-gray-600">Narrative Quality</div>
        </div>
        
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <Zap className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-emerald-600">{Math.round(healthMetrics.retrievalSpeed)}</div>
          <div className="text-xs text-gray-600">Retrieval Speed</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-blue-600">{Math.round(healthMetrics.consistency)}</div>
          <div className="text-xs text-gray-600">Consistency</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className={`text-xl font-bold ${healthMetrics.improvement >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {healthMetrics.improvement >= 0 ? '+' : ''}{Math.round(healthMetrics.improvement)}%
          </div>
          <div className="text-xs text-gray-600">Improvement</div>
        </div>
      </div>

      {/* Trend Visualization */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">30-Day Cognitive Fitness Trend</h3>
        <div className="h-32 flex items-end space-x-1">
          {trendData.slice(-14).map((point, index) => {
            const height = (point.score / 100) * 100;
            const isRecent = index >= trendData.length - 7;
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center"
                title={`${point.date}: ${point.score.toFixed(1)}`}
              >
                <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100px' }}>
                  <div
                    className={`rounded-t-lg transition-all duration-300 ${
                      isRecent 
                        ? 'bg-gradient-to-t from-indigo-500 to-indigo-400' 
                        : 'bg-gradient-to-t from-gray-400 to-gray-300'
                    }`}
                    style={{ height: `${height}%`, position: 'absolute', bottom: 0, width: '100%' }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(point.date).getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>2 weeks ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Strengths and Risk Factors */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {healthMetrics.strengths.length > 0 && (
          <div>
            <h4 className="font-medium text-emerald-900 mb-3">Cognitive Strengths</h4>
            <div className="space-y-2">
              {healthMetrics.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {healthMetrics.riskFactors.length > 0 && (
          <div>
            <h4 className="font-medium text-amber-900 mb-3">Areas for Attention</h4>
            <div className="space-y-2">
              {healthMetrics.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Analysis Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
        </button>
      </div>

      {/* Detailed Analysis */}
      {showDetailedAnalysis && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Detailed Cognitive Analysis</h4>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong>Memory Encoding Efficiency:</strong> Based on your sensory integration patterns, 
              you encode memories most effectively using {healthMetrics.memoryStrength > 80 ? 'multiple sensory channels' : 'your strongest sensory modalities'}.
            </div>
            <div>
              <strong>Retrieval Optimization:</strong> Your recall latency patterns suggest 
              {healthMetrics.retrievalSpeed > 80 ? 'excellent memory consolidation' : 'room for improvement in memory accessibility'}.
            </div>
            <div>
              <strong>Training Consistency:</strong> Your practice patterns indicate 
              {healthMetrics.consistency > 70 ? 'strong habit formation' : 'opportunity to build more regular training routines'}.
            </div>
            <div>
              <strong>Cognitive Trajectory:</strong> Your overall trend is {healthMetrics.trend}, 
              suggesting {healthMetrics.trend === 'improving' ? 'continued cognitive enhancement' : 
                         healthMetrics.trend === 'stable' ? 'maintained cognitive fitness' : 
                         'need for training adjustment'}.
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-red-600" />
          <span className="font-medium text-red-900">Important Medical Notice</span>
        </div>
        <p className="text-sm text-red-800">
          This cognitive health dashboard is for wellness tracking only and does not constitute medical advice. 
          Consult healthcare professionals for any memory concerns or cognitive health questions.
        </p>
      </div>
    </div>
  );
};

export default CognitiveHealthDashboard;