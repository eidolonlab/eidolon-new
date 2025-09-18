import React, { useState, useEffect } from 'react';
import { Brain, Target, Clock, TrendingUp, Zap, Award, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

interface RetrievalProfile {
  optimalDifficulty: 'easy' | 'medium' | 'hard';
  bestRecallStrategy: 'free' | 'cued' | 'errorless';
  strengthSenses: string[];
  weaknessSenses: string[];
  optimalSessionLength: number;
  bestTimeOfDay: string;
  improvementRate: number;
  consistencyScore: number;
}

interface AdaptiveRetrievalSystemProps {
  weave: any;
  userResponse: string;
  sessionHistory: any[];
  onHint: (hint: string, hintType: 'gentle' | 'specific' | 'structural') => void;
  onEncouragement: (message: string, motivationType: 'progress' | 'effort' | 'achievement') => void;
  onDifficultyAdjustment: (newDifficulty: 'easy' | 'medium' | 'hard') => void;
}

const AdaptiveRetrievalSystem: React.FC<AdaptiveRetrievalSystemProps> = ({
  weave,
  userResponse,
  sessionHistory,
  onHint,
  onEncouragement,
  onDifficultyAdjustment
}) => {
  const [retrievalProfile, setRetrievalProfile] = useState<RetrievalProfile>({
    optimalDifficulty: 'medium',
    bestRecallStrategy: 'free',
    strengthSenses: ['visual'],
    weaknessSenses: ['olfactory'],
    optimalSessionLength: 300,
    bestTimeOfDay: 'morning',
    improvementRate: 0,
    consistencyScore: 0
  });

  const [realTimeAnalysis, setRealTimeAnalysis] = useState({
    currentDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
    strugglingAreas: [] as string[],
    strengthAreas: [] as string[],
    recommendedHints: [] as Array<{
      text: string;
      type: 'gentle' | 'specific' | 'structural';
      confidence: number;
      reasoning: string;
    }>,
    adaptiveEncouragement: [] as Array<{
      message: string;
      type: 'progress' | 'effort' | 'achievement';
      timing: 'immediate' | 'delayed';
    }>
  });

  const [intelligentHints, setIntelligentHints] = useState<Array<{
    hint: string;
    effectiveness: number;
    personalizedReason: string;
    category: string;
  }>>([]);

  useEffect(() => {
    analyzeUserProfile();
    performRealTimeAnalysis();
    generateIntelligentHints();
  }, [userResponse, sessionHistory]);

  const analyzeUserProfile = () => {
    if (sessionHistory.length < 3) return;

    const profile = { ...retrievalProfile };
    
    // Analyze performance patterns
    const recentSessions = sessionHistory.slice(0, 10);
    const avgAccuracy = recentSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / recentSessions.length;
    const avgLatency = recentSessions.reduce((sum, s) => sum + (s.latencyMs || 0), 0) / recentSessions.length;

    // Determine optimal difficulty
    if (avgAccuracy > 85 && avgLatency < 10000) {
      profile.optimalDifficulty = 'hard';
    } else if (avgAccuracy < 60 || avgLatency > 30000) {
      profile.optimalDifficulty = 'easy';
    } else {
      profile.optimalDifficulty = 'medium';
    }

    // Analyze sensory strengths
    const sensoryPerformance = {
      visual: 0,
      auditory: 0,
      olfactory: 0,
      tactile: 0,
      emotional: 0
    };

    recentSessions.forEach(session => {
      if (session.userResponse) {
        const response = session.userResponse.toLowerCase();
        Object.keys(sensoryPerformance).forEach(sense => {
          const senseWords = getSenseWords(sense);
          const mentions = senseWords.filter(word => response.includes(word)).length;
          sensoryPerformance[sense as keyof typeof sensoryPerformance] += mentions;
        });
      }
    });

    const sortedSenses = Object.entries(sensoryPerformance)
      .sort(([,a], [,b]) => b - a);
    
    profile.strengthSenses = sortedSenses.slice(0, 2).map(([sense]) => sense);
    profile.weaknessSenses = sortedSenses.slice(-2).map(([sense]) => sense);

    // Calculate improvement rate
    if (recentSessions.length >= 5) {
      const early = recentSessions.slice(-5, -2);
      const recent = recentSessions.slice(-3);
      const earlyAvg = early.reduce((sum, s) => sum + (s.accuracy || 0), 0) / early.length;
      const recentAvg = recent.reduce((sum, s) => sum + (s.accuracy || 0), 0) / recent.length;
      profile.improvementRate = recentAvg - earlyAvg;
    }

    setRetrievalProfile(profile);
  };

  const getSenseWords = (sense: string) => {
    const senseWords = {
      visual: ['see', 'saw', 'look', 'bright', 'dark', 'color', 'light', 'red', 'blue', 'green'],
      auditory: ['hear', 'heard', 'sound', 'music', 'voice', 'loud', 'quiet', 'noise'],
      olfactory: ['smell', 'scent', 'aroma', 'fragrance', 'fresh', 'sweet'],
      tactile: ['feel', 'felt', 'touch', 'warm', 'cold', 'soft', 'rough', 'smooth'],
      emotional: ['happy', 'sad', 'excited', 'nervous', 'calm', 'joy', 'fear', 'love']
    };
    return senseWords[sense as keyof typeof senseWords] || [];
  };

  const performRealTimeAnalysis = () => {
    if (!userResponse || userResponse.length < 10) return;

    const words = userResponse.toLowerCase().split(/\s+/);
    const sentences = userResponse.split('.').filter(s => s.trim().length > 0);
    
    const analysis = {
      currentDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
      strugglingAreas: [] as string[],
      strengthAreas: [] as string[],
      recommendedHints: [] as any[],
      adaptiveEncouragement: [] as any[]
    };

    // Detect struggling areas
    if (words.length < 20) {
      analysis.strugglingAreas.push('detail_quantity');
    }
    if (sentences.length < 2) {
      analysis.strugglingAreas.push('narrative_structure');
    }
    if (!words.some(w => ['feel', 'felt', 'emotion'].includes(w))) {
      analysis.strugglingAreas.push('emotional_depth');
    }

    // Detect strength areas
    if (words.length > 50) {
      analysis.strengthAreas.push('rich_detail');
    }
    if (sentences.length >= 4) {
      analysis.strengthAreas.push('narrative_flow');
    }

    // Generate targeted hints
    analysis.strugglingAreas.forEach(area => {
      switch (area) {
        case 'detail_quantity':
          analysis.recommendedHints.push({
            text: `What specific details made this moment unique? Focus on one sense at a time.`,
            type: 'specific',
            confidence: 0.9,
            reasoning: 'User needs more specific details to strengthen memory encoding'
          });
          break;
        case 'emotional_depth':
          analysis.recommendedHints.push({
            text: `How did this experience make you feel in your body? What emotions were present?`,
            type: 'gentle',
            confidence: 0.85,
            reasoning: 'Emotional content significantly enhances memory consolidation'
          });
          break;
        case 'narrative_structure':
          analysis.recommendedHints.push({
            text: `Try organizing this as: "First... then... finally..." to create clearer structure.`,
            type: 'structural',
            confidence: 0.8,
            reasoning: 'Temporal structure improves memory coherence and retrieval'
          });
          break;
      }
    });

    // Generate adaptive encouragement
    if (analysis.strengthAreas.length > 0) {
      analysis.adaptiveEncouragement.push({
        message: `Excellent work on ${analysis.strengthAreas.join(' and ')}! Your memory skills are developing beautifully.`,
        type: 'achievement',
        timing: 'immediate'
      });
    }

    if (words.length > 30 && analysis.strugglingAreas.length === 0) {
      analysis.adaptiveEncouragement.push({
        message: `Outstanding recall! You're creating a rich, multi-dimensional memory that will be easily accessible.`,
        type: 'achievement',
        timing: 'immediate'
      });
    }

    setRealTimeAnalysis(analysis);
  };

  const generateIntelligentHints = () => {
    const hints = [];

    // Personalized hints based on user profile
    if (retrievalProfile.strengthSenses.includes('visual') && !userResponse.includes('color')) {
      hints.push({
        hint: "What colors dominated this memory? Your visual processing is strong - leverage it!",
        effectiveness: 90,
        personalizedReason: "Based on your profile, visual details significantly enhance your recall",
        category: 'visual_strength'
      });
    }

    if (retrievalProfile.weaknessSenses.includes('olfactory') && userResponse.length > 30) {
      hints.push({
        hint: "Challenge yourself: were there any scents present? This could strengthen a weaker area.",
        effectiveness: 75,
        personalizedReason: "Developing your olfactory recall will create more retrieval pathways",
        category: 'weakness_development'
      });
    }

    // Context-aware hints based on original memory
    if (weave?.narrative && weave.narrative.includes('conversation') && !userResponse.includes('"')) {
      hints.push({
        hint: "Can you remember any specific words or phrases that were said?",
        effectiveness: 95,
        personalizedReason: "Dialogue creates extremely strong memory anchors",
        category: 'dialogue_enhancement'
      });
    }

    setIntelligentHints(hints.slice(0, 3));
  };

  return (
    <div className="space-y-6">
      {/* Real-time Performance Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Live Retrieval Analysis</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{userResponse.split(' ').length}</div>
            <div className="text-xs text-blue-700">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{realTimeAnalysis.strengthAreas.length}</div>
            <div className="text-xs text-blue-700">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(((userResponse.split(' ').length / 50) * 100))}%
            </div>
            <div className="text-xs text-blue-700">Completeness</div>
          </div>
        </div>

        {realTimeAnalysis.strengthAreas.length > 0 && (
          <div className="text-sm text-blue-800">
            ✨ <strong>Strengths detected:</strong> {realTimeAnalysis.strengthAreas.join(', ').replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Intelligent Hints */}
      {intelligentHints.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Personalized Hints</h4>
          {intelligentHints.map((hint, index) => (
            <button
              key={index}
              onClick={() => onHint(hint.hint, 'specific')}
              className="w-full text-left p-4 bg-purple-50 border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-100 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-purple-700 capitalize">
                      {hint.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-purple-600">{hint.effectiveness}% effective</span>
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors mb-2">
                    {hint.hint}
                  </p>
                  <div className="text-xs text-purple-600 bg-purple-100 rounded px-2 py-1">
                    💡 {hint.personalizedReason}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Adaptive Encouragement */}
      {realTimeAnalysis.adaptiveEncouragement.length > 0 && (
        <div className="space-y-2">
          {realTimeAnalysis.adaptiveEncouragement.map((encouragement, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              encouragement.type === 'achievement' ? 'bg-emerald-50 border-emerald-200' :
              encouragement.type === 'progress' ? 'bg-blue-50 border-blue-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                {encouragement.type === 'achievement' ? <Award className="w-4 h-4 text-emerald-600" /> :
                 encouragement.type === 'progress' ? <TrendingUp className="w-4 h-4 text-blue-600" /> :
                 <Target className="w-4 h-4 text-yellow-600" />}
                <span className={`text-sm font-medium ${
                  encouragement.type === 'achievement' ? 'text-emerald-900' :
                  encouragement.type === 'progress' ? 'text-blue-900' :
                  'text-yellow-900'
                }`}>
                  {encouragement.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile-Based Recommendations */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Your Retrieval Profile</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <div className="font-medium mb-1">Strengths:</div>
            {retrievalProfile.strengthSenses.map(sense => (
              <div key={sense}>• {sense.charAt(0).toUpperCase() + sense.slice(1)} processing</div>
            ))}
          </div>
          <div>
            <div className="font-medium mb-1">Growth Areas:</div>
            {retrievalProfile.weaknessSenses.map(sense => (
              <div key={sense}>• {sense.charAt(0).toUpperCase() + sense.slice(1)} details</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveRetrievalSystem;