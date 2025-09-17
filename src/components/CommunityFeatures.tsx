import React, { useState, useEffect } from 'react';
import { Users, Share2, Trophy, Target, TrendingUp, Heart, MessageCircle, Award, Zap, Shield } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  endDate: Date;
  participants: number;
  type: 'collective' | 'individual';
  reward: string;
}

interface AnonymousShare {
  id: string;
  type: 'technique' | 'insight' | 'milestone';
  content: string;
  category: string;
  likes: number;
  timestamp: Date;
  userLevel: number;
}

const CommunityFeatures: React.FC = () => {
  const { weaves, retrievalSessions, getMetrics } = useWeave();
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [shares, setShares] = useState<AnonymousShare[]>([]);
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [shareType, setShareType] = useState<'technique' | 'insight' | 'milestone'>('technique');
  const [userContributions, setUserContributions] = useState(0);

  useEffect(() => {
    generateCommunityData();
    loadUserContributions();
  }, [weaves, retrievalSessions]);

  const generateCommunityData = () => {
    // Generate community challenges
    const now = new Date();
    const weekEnd = new Date(now.getTime() + (7 - now.getDay()) * 24 * 60 * 60 * 1000);
    
    const newChallenges: CommunityChallenge[] = [
      {
        id: 'weekly-memories',
        title: 'Community Memory Week',
        description: 'Collective goal: Create 1,000 new memories this week',
        goal: 1000,
        current: 847, // Simulated progress
        endDate: weekEnd,
        participants: 234,
        type: 'collective',
        reward: 'Unlock exclusive weekly insights'
      },
      {
        id: 'coherence-challenge',
        title: 'Coherence Masters',
        description: 'Achieve 85+ coherence score on 3 memories',
        goal: 3,
        current: weaves.filter(w => w.coherenceScore >= 85).length,
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        participants: 156,
        type: 'individual',
        reward: '50 XP + Master badge'
      },
      {
        id: 'future-focus',
        title: 'Future Planners Unite',
        description: 'Community goal: 500 future scenarios created',
        goal: 500,
        current: 387, // Simulated progress
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        participants: 189,
        type: 'collective',
        reward: 'Advanced scenario planning features'
      }
    ];

    setChallenges(newChallenges);

    // Generate anonymous community shares
    const sampleShares: AnonymousShare[] = [
      {
        id: '1',
        type: 'technique',
        content: 'I discovered that adding specific scents to my memories makes them 3x easier to recall. Now I always include what the air smelled like!',
        category: 'Sensory Enhancement',
        likes: 23,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        userLevel: 4
      },
      {
        id: '2',
        type: 'milestone',
        content: 'Just hit my 30-day streak! The daily memory moments feature has completely changed how I experience each day.',
        category: 'Habit Building',
        likes: 18,
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        userLevel: 6
      },
      {
        id: '3',
        type: 'insight',
        content: 'Realized that my childhood memories are much more vivid when I include the emotional state of my parents. Context matters!',
        category: 'Memory Insights',
        likes: 31,
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        userLevel: 3
      },
      {
        id: '4',
        type: 'technique',
        content: 'Pro tip: Record yourself describing a memory, then listen back while doing the retrieval training. Game changer!',
        category: 'Training Methods',
        likes: 27,
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        userLevel: 7
      }
    ];

    setShares(sampleShares);
  };

  const loadUserContributions = () => {
    const contributions = localStorage.getItem('eidolon-community-contributions');
    if (contributions) {
      setUserContributions(parseInt(contributions));
    }
  };

  const shareTooCommunity = () => {
    if (!shareContent.trim()) return;

    const metrics = getMetrics();
    const userLevel = Math.floor(metrics.totalWeaves / 5) + 1;

    const newShare: AnonymousShare = {
      id: Date.now().toString(),
      type: shareType,
      content: shareContent.trim(),
      category: shareType === 'technique' ? 'User Techniques' : 
                shareType === 'insight' ? 'User Insights' : 'User Milestones',
      likes: 0,
      timestamp: new Date(),
      userLevel
    };

    setShares(prev => [newShare, ...prev]);
    
    // Update user contributions
    const newContributions = userContributions + 1;
    setUserContributions(newContributions);
    localStorage.setItem('eidolon-community-contributions', newContributions.toString());

    setShareContent('');
    setShowShareForm(false);
    
    alert('Thank you for sharing with the community! Your contribution helps others learn.');
  };

  const likeShare = (shareId: string) => {
    setShares(prev => prev.map(share => 
      share.id === shareId 
        ? { ...share, likes: share.likes + 1 }
        : share
    ));
  };

  const getShareIcon = (type: AnonymousShare['type']) => {
    switch (type) {
      case 'technique': return Zap;
      case 'insight': return TrendingUp;
      case 'milestone': return Trophy;
      default: return MessageCircle;
    }
  };

  const getShareColor = (type: AnonymousShare['type']) => {
    switch (type) {
      case 'technique': return 'blue';
      case 'insight': return 'purple';
      case 'milestone': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Community Hub</h2>
            <p className="text-sm text-gray-600">Connect, share, and grow together (privacy-safe)</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowShareForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Community Challenges */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-900 mb-4">Active Community Challenges</h3>
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const progressPercentage = (challenge.current / challenge.goal) * 100;
            const daysLeft = Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={challenge.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">{daysLeft} days left</div>
                    <div className="text-xs text-gray-500">{challenge.participants} participants</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{challenge.current.toLocaleString()} / {challenge.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Reward: {challenge.reward}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-600">{challenge.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Shares */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Community Insights</h3>
          <div className="text-sm text-gray-600">
            Your contributions: {userContributions}
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {shares.map((share) => {
            const IconComponent = getShareIcon(share.type);
            const color = getShareColor(share.type);
            
            return (
              <div key={share.id} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium text-${color}-700 capitalize`}>
                          {share.type}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Level {share.userLevel}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {share.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => likeShare(share.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>{share.likes}</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{share.content}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full`}>
                        {share.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Form */}
      {showShareForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share with Community</h3>
              <button
                onClick={() => setShowShareForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'technique', label: 'Technique', icon: Zap },
                    { value: 'insight', label: 'Insight', icon: TrendingUp },
                    { value: 'milestone', label: 'Milestone', icon: Trophy }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setShareType(value as any)}
                      className={`p-3 rounded-lg border transition-colors ${
                        shareType === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (no personal details)
                </label>
                <textarea
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  placeholder={
                    shareType === 'technique' ? 'Share a memory training technique that works for you...' :
                    shareType === 'insight' ? 'Share an insight about memory or cognitive training...' :
                    'Share a milestone or achievement in your memory journey...'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Privacy Protected</span>
                </div>
                <p className="text-xs text-green-800">
                  Shares are completely anonymous. No personal memory content or identifying information is included.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={shareTooCommunity}
                  disabled={!shareContent.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Share Anonymously
                </button>
                <button
                  onClick={() => setShowShareForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-600">1,247</div>
          <div className="text-sm text-gray-600">Active Members</div>
        </div>
        
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
          <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-600">3,891</div>
          <div className="text-sm text-gray-600">Memories Created</div>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-600">847</div>
          <div className="text-sm text-gray-600">Goals Achieved</div>
        </div>
      </div>

      {/* Research Context */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-900">Social Learning</span>
        </div>
        <p className="text-sm text-amber-800">
          Community features leverage social learning theory - people learn more effectively when 
          they can observe others' strategies and share their own discoveries. Anonymous sharing 
          protects privacy while enabling collective knowledge building.
        </p>
      </div>
    </div>
  );
};

export default CommunityFeatures;