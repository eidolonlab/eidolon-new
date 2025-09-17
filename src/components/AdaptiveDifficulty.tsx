import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Zap, Settings, Eye, Lightbulb, Award, BarChart3 } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface UserProfile {
  cognitiveLoad: 'low' | 'medium' | 'high';
  preferredSenses: string[];
  optimalSessionLength: number;
  bestPerformanceTime: string;
  difficultyPreference: 'gentle' | 'balanced' | 'challenging';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  strengths: string[];
  improvementAreas: string[];
}

interface AdaptiveRecommendation {
  type: 'difficulty' | 'timing' | 'technique' | 'focus';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  action: string;
}

const AdaptiveDifficulty: React.FC = () => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [adaptiveSettings, setAdaptiveSettings] = useState({
    enabled: true,
    autoAdjustDifficulty: true,
    personalizedTiming: true,
    smartSuggestions: true
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (weaves.length >= 3 || retrievalSessions.length >= 2) {
      analyzeUserProfile();
    }
  }, [weaves, retrievalSessions]);

  const analyzeUserProfile = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const profile = generateUserProfile();
      const recs = generateAdaptiveRecommendations(profile);
      
      setUserProfile(profile);
      setRecommendations(recs);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateUserProfile = (): UserProfile => {
    // Analyze cognitive load preference
    const avgCoherenceScore = weaves.length > 0 
      ? weaves.reduce((sum, w) => sum + w.coherenceScore, 0) / weaves.length 
      : 0;
    
    const cognitiveLoad = avgCoherenceScore > 85 ? 'high' : avgCoherenceScore > 70 ? 'medium' : 'low';

    // Analyze sensory preferences
    const sensoryUsage = {
      visual: 0, auditory: 0, olfactory: 0, tactile: 0, emotional: 0
    };

    weaves.forEach(weave => {
      Object.entries(weave.sensoryDetails).forEach(([sense, detail]) => {
        if (detail && detail.length > 20) {
          sensoryUsage[sense as keyof typeof sensoryUsage]++;
        }
      });
    });

    const preferredSenses = Object.entries(sensoryUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([sense]) => sense);

    // Analyze session patterns
    const sessionTimes = retrievalSessions.map(s => s.startTime.getHours());
    const avgSessionTime = sessionTimes.length > 0 
      ? sessionTimes.reduce((sum, time) => sum + time, 0) / sessionTimes.length 
      : 14;

    const bestPerformanceTime = avgSessionTime < 12 ? 'morning' : 
                               avgSessionTime < 17 ? 'afternoon' : 'evening';

    // Analyze difficulty preference
    const errorlessUsage = weaves.filter(w => w.errorlessMode).length / Math.max(weaves.length, 1);
    const difficultyPreference = errorlessUsage > 0.5 ? 'gentle' : 
                                avgCoherenceScore > 80 ? 'challenging' : 'balanced';

    // Determine learning style
    const visualStrong = sensoryUsage.visual > sensoryUsage.auditory;
    const auditoryStrong = sensoryUsage.auditory > sensoryUsage.visual;
    const learningStyle = visualStrong && !auditoryStrong ? 'visual' :
                         auditoryStrong && !visualStrong ? 'auditory' :
                         sensoryUsage.tactile > 2 ? 'kinesthetic' : 'mixed';

    // Identify strengths and improvement areas
    const strengths = [];
    const improvementAreas = [];

    if (avgCoherenceScore > 80) strengths.push('Narrative coherence');
    if (sensoryUsage.visual > weaves.length * 0.7) strengths.push('Visual detail richness');
    if (sensoryUsage.emotional > weaves.length * 0.6) strengths.push('Emotional depth');
    if (retrievalSessions.some(s => s.latencyMs < 10000)) strengths.push('Rapid recall');

    if (avgCoherenceScore < 70) improvementAreas.push('Narrative structure');
    if (sensoryUsage.olfactory < weaves.length * 0.3) improvementAreas.push('Olfactory details');
    if (sensoryUsage.tactile < weaves.length * 0.3) improvementAreas.push('Tactile sensations');
    if (retrievalSessions.length > 0 && retrievalSessions.every(s => s.accuracy < 80)) {
      improvementAreas.push('Retrieval accuracy');
    }

    return {
      cognitiveLoad,
      preferredSenses,
      optimalSessionLength: 15, // Default
      bestPerformanceTime,
      difficultyPreference,
      learningStyle,
      strengths,
      improvementAreas
    };
  };

  const generateAdaptiveRecommendations = (profile: UserProfile): AdaptiveRecommendation[] => {
    const recommendations = [];

    // Difficulty recommendations
    if (profile.cognitiveLoad === 'low' && profile.difficultyPreference !== 'challenging') {
      recommendations.push({
        type: 'difficulty',
        title: 'Ready for More Challenge',
        description: 'Your coherence scores suggest you can handle more complex memory tasks',
        confidence: 0.85,
        reasoning: 'Consistent performance indicates readiness for increased difficulty',
        action: 'Try creating longer, more detailed narratives with complex temporal sequences'
      });
    }

    // Timing recommendations
    if (profile.bestPerformanceTime) {
      recommendations.push({
        type: 'timing',
        title: `Optimize for ${profile.bestPerformanceTime} Training`,
        description: `Your best performance occurs during ${profile.bestPerformanceTime} hours`,
        confidence: 0.9,
        reasoning: 'Analysis of your session timing and performance correlation',
        action: `Schedule your most important memory training for ${profile.bestPerformanceTime}`
      });
    }

    // Technique recommendations
    if (profile.preferredSenses.length > 0) {
      recommendations.push({
        type: 'technique',
        title: `Leverage Your ${profile.preferredSenses[0]} Strength`,
        description: `You excel at ${profile.preferredSenses[0]} details - use this as your memory anchor`,
        confidence: 0.8,
        reasoning: 'Your strongest sensory modality can serve as a foundation for other details',
        action: `Start each memory with rich ${profile.preferredSenses[0]} details, then build other senses around it`
      });
    }

    // Focus area recommendations
    if (profile.improvementAreas.length > 0) {
      recommendations.push({
        type: 'focus',
        title: `Strengthen ${profile.improvementAreas[0]}`,
        description: `Focused practice on ${profile.improvementAreas[0]} will boost overall memory quality`,
        confidence: 0.75,
        reasoning: 'Targeted improvement in weak areas provides the highest cognitive return',
        action: `Spend extra time on ${profile.improvementAreas[0]} in your next 3 memory sessions`
      });
    }

    // Learning style recommendations
    if (profile.learningStyle !== 'mixed') {
      recommendations.push({
        type: 'technique',
        title: `${profile.learningStyle} Learning Optimization`,
        description: `Customize your approach for ${profile.learningStyle} learning preferences`,
        confidence: 0.7,
        reasoning: 'Matching training methods to learning style improves retention',
        action: profile.learningStyle === 'visual' ? 'Use more color coding and visual imagery' :
                profile.learningStyle === 'auditory' ? 'Add more sound descriptions and verbal rehearsal' :
                'Include more physical sensations and movement descriptions'
      });
    }

    return recommendations.slice(0, 4);
  };

  const applyRecommendation = (recommendation: AdaptiveRecommendation) => {
    // Here you would apply the recommendation to user settings
    alert(`Applied: ${recommendation.title}\n\n${recommendation.action}`);
  };

  const getRecommendationIcon = (type: AdaptiveRecommendation['type']) => {
    switch (type) {
      case 'difficulty': return Target;
      case 'timing': return BarChart3;
      case 'technique': return Zap;
      case 'focus': return Eye;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: AdaptiveRecommendation['type']) => {
    switch (type) {
      case 'difficulty': return 'red';
      case 'timing': return 'blue';
      case 'technique': return 'purple';
      case 'focus': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Adaptive Intelligence</h2>
            <p className="text-sm text-gray-600">Personalized optimization based on your patterns</p>
          </div>
        </div>
        
        <button
          onClick={analyzeUserProfile}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
        </button>
      </div>

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Analyzing your memory patterns...</p>
          <p className="text-sm text-gray-600 mt-2">Processing {weaves.length} memories and {retrievalSessions.length} sessions</p>
        </div>
      )}

      {/* User Profile Summary */}
      {userProfile && !isAnalyzing && (
        <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <h3 className="font-medium text-indigo-900 mb-4">Your Cognitive Profile</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Cognitive Load Preference</span>
                <span className="text-sm font-medium text-indigo-600 capitalize">{userProfile.cognitiveLoad}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Learning Style</span>
                <span className="text-sm font-medium text-indigo-600 capitalize">{userProfile.learningStyle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Best Performance Time</span>
                <span className="text-sm font-medium text-indigo-600 capitalize">{userProfile.bestPerformanceTime}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-700">Strongest Senses</span>
                <div className="flex space-x-2 mt-1">
                  {userProfile.preferredSenses.map(sense => (
                    <span key={sense} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full capitalize">
                      {sense}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-700">Key Strengths</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userProfile.strengths.slice(0, 3).map(strength => (
                    <span key={strength} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adaptive Recommendations */}
      {recommendations.length > 0 && !isAnalyzing && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Personalized Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = getRecommendationIcon(rec.type);
              const color = getRecommendationColor(rec.type);
              
              return (
                <div key={index} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.ceil(rec.confidence * 5) }).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 bg-${color}-400 rounded-full`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                      <p className="text-xs text-gray-600 mb-3 italic">{rec.reasoning}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-800 font-medium">{rec.action}</p>
                        <button
                          onClick={() => applyRecommendation(rec)}
                          className={`px-3 py-1.5 bg-${color}-600 text-white text-sm rounded-lg hover:bg-${color}-700 transition-colors`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Adaptive Settings */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Adaptive Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-Adjust Difficulty</label>
              <p className="text-xs text-gray-500 mt-1">Automatically increase challenge as you improve</p>
            </div>
            <input
              type="checkbox"
              checked={adaptiveSettings.autoAdjustDifficulty}
              onChange={(e) => setAdaptiveSettings(prev => ({ ...prev, autoAdjustDifficulty: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Personalized Timing</label>
              <p className="text-xs text-gray-500 mt-1">Suggest optimal training times based on your patterns</p>
            </div>
            <input
              type="checkbox"
              checked={adaptiveSettings.personalizedTiming}
              onChange={(e) => setAdaptiveSettings(prev => ({ ...prev, personalizedTiming: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Smart Suggestions</label>
              <p className="text-xs text-gray-500 mt-1">AI suggestions tailored to your strengths and preferences</p>
            </div>
            <input
              type="checkbox"
              checked={adaptiveSettings.smartSuggestions}
              onChange={(e) => setAdaptiveSettings(prev => ({ ...prev, smartSuggestions: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      {userProfile && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Performance Insights</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-emerald-900 mb-2">Your Strengths</h5>
              <div className="space-y-1">
                {userProfile.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-orange-900 mb-2">Growth Opportunities</h5>
              <div className="space-y-1">
                {userProfile.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Target className="w-3 h-3 text-orange-600" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      {!userProfile && !isAnalyzing && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Intelligence Loading</h3>
          <p className="text-gray-600 mb-4">
            Create a few more memories or complete some training sessions to unlock personalized recommendations
          </p>
          <div className="text-sm text-gray-500">
            Need: {Math.max(0, 3 - weaves.length)} more memories or {Math.max(0, 2 - retrievalSessions.length)} more sessions
          </div>
        </div>
      )}

      {/* Research Context */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Adaptive Learning Science</span>
        </div>
        <p className="text-sm text-purple-800">
          Adaptive difficulty systems are based on the Zone of Proximal Development theory - 
          optimal learning occurs when tasks are challenging but achievable. Our AI analyzes 
          your performance patterns to maintain this optimal challenge level automatically.
        </p>
      </div>
    </div>
  );
};

export default AdaptiveDifficulty;