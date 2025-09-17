import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Target, Award, Calendar, Clock, Eye, Lightbulb, CheckCircle } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

const MemoryInsights: React.FC = () => {
  const { weaves, retrievalSessions } = useWeave();
  const [insights, setInsights] = useState<{
    patterns: string[];
    recommendations: string[];
    strengths: string[];
    improvements: string[];
  }>({ patterns: [], recommendations: [], strengths: [], improvements: [] });

  useEffect(() => {
    generateInsights();
  }, [weaves, retrievalSessions]);

  const generateInsights = () => {
    const patterns = [];
    const recommendations = [];
    const strengths = [];
    const improvements = [];

    // Analyze retrieval patterns
    const recentSessions = retrievalSessions.slice(0, 10);
    const avgAccuracy = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length 
      : 0;

    // Pattern detection
    if (recentSessions.length >= 3) {
      const accuracyTrend = recentSessions.slice(0, 3).map(s => s.accuracy);
      if (accuracyTrend[0] < accuracyTrend[1] && accuracyTrend[1] < accuracyTrend[2]) {
        patterns.push("Your recall accuracy is improving with each session");
        strengths.push("Consistent improvement in memory retrieval");
      } else if (accuracyTrend.every(a => a > 80)) {
        patterns.push("You maintain consistently high accuracy across sessions");
        strengths.push("Excellent memory retention and recall ability");
      }
    }

    // Sensory analysis
    const sensoryUsage = {
      visual: 0, auditory: 0, olfactory: 0, tactile: 0, emotional: 0
    };

    weaves.forEach(weave => {
      Object.entries(weave.sensoryDetails).forEach(([sense, detail]) => {
        if (detail && detail.length > 10) {
          sensoryUsage[sense as keyof typeof sensoryUsage]++;
        }
      });
    });

    const mostUsedSense = Object.entries(sensoryUsage).reduce((a, b) => 
      sensoryUsage[a[0] as keyof typeof sensoryUsage] > sensoryUsage[b[0] as keyof typeof sensoryUsage] ? a : b
    )[0];

    const leastUsedSense = Object.entries(sensoryUsage).reduce((a, b) => 
      sensoryUsage[a[0] as keyof typeof sensoryUsage] < sensoryUsage[b[0] as keyof typeof sensoryUsage] ? a : b
    )[0];

    if (mostUsedSense) {
      strengths.push(`You excel at incorporating ${mostUsedSense} details in your memories`);
    }

    if (leastUsedSense && sensoryUsage[leastUsedSense as keyof typeof sensoryUsage] < weaves.length * 0.3) {
      improvements.push(`Try adding more ${leastUsedSense} details to strengthen your memory weaves`);
      recommendations.push(`Focus on ${leastUsedSense} elements in your next memory session`);
    }

    // Timing analysis
    const avgCoherenceScore = weaves.length > 0 
      ? weaves.reduce((sum, w) => sum + w.coherenceScore, 0) / weaves.length 
      : 0;

    if (avgCoherenceScore > 80) {
      strengths.push("Your narratives are highly coherent and well-structured");
    } else if (avgCoherenceScore < 60) {
      improvements.push("Work on creating more detailed and connected narratives");
      recommendations.push("Spend more time on the narrative building step");
    }

    // Future scenario analysis
    const futureWeaves = weaves.filter(w => w.type === 'future');
    const completedScenarios = futureWeaves.filter(w => w.completed);
    
    if (futureWeaves.length > 0) {
      const completionRate = (completedScenarios.length / futureWeaves.length) * 100;
      if (completionRate > 80) {
        strengths.push("Excellent follow-through on rehearsed scenarios");
      } else if (completionRate < 50) {
        improvements.push("Focus on completing your rehearsed scenarios");
        recommendations.push("Set reminders for your upcoming scenarios");
      }
    }

    // Training frequency
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTraining = retrievalSessions.filter(s => s.startTime > lastWeek);
    
    if (recentTraining.length === 0) {
      recommendations.push("Try to practice retrieval training at least once this week");
    } else if (recentTraining.length >= 5) {
      strengths.push("Consistent training schedule - great dedication!");
    }

    setInsights({ patterns, recommendations, strengths, improvements });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Memory Insights</h2>
          <p className="text-sm text-gray-600">AI-powered analysis of your training patterns</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        {insights.strengths.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="font-medium text-emerald-900">Your Strengths</h3>
            </div>
            <div className="space-y-2">
              {insights.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-emerald-800">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insights.recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-medium text-amber-900">Recommendations</h3>
            </div>
            <div className="space-y-2">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg">
                  <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {insights.patterns.length > 0 && (
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-indigo-900">Detected Patterns</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {insights.patterns.map((pattern, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-indigo-50 rounded-lg">
                  <Eye className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-800">{pattern}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {weaves.length === 0 && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600">
            Create some memory weaves and complete training sessions to unlock personalized insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemoryInsights;