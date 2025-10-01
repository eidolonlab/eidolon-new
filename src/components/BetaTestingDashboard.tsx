import React, { useState, useEffect } from 'react';
import { 
  TestTube, Users, MessageSquare, TrendingUp, Star, 
  CheckCircle, AlertCircle, Clock, Mail, Download,
  Eye, Filter, Search, Plus, X, Award, Target
} from 'lucide-react';
import { useUserManagement } from '../contexts/UserManagementContext';

interface BetaMetrics {
  totalTesters: number;
  activeTesters: number;
  feedbackCount: number;
  averageRating: number;
  featureAdoption: Record<string, number>;
  retentionRate: number;
  bugReports: number;
  featureRequests: number;
}

const BetaTestingDashboard: React.FC = () => {
  const {
    users,
    betaFeatures,
    userFeedback,
    isFeatureEnabled,
    inviteBetaUser,
    submitFeedback,
    loadUsers
  } = useUserManagement();

  const [metrics, setMetrics] = useState<BetaMetrics>({
    totalTesters: 0,
    activeTesters: 0,
    feedbackCount: 0,
    averageRating: 0,
    featureAdoption: {},
    retentionRate: 0,
    bugReports: 0,
    featureRequests: 0
  });

  const [selectedTester, setSelectedTester] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    description: '',
    type: 'beta_feedback' as 'bug' | 'feature_request' | 'general' | 'beta_feedback',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    feature_id: ''
  });

  useEffect(() => {
    calculateMetrics();
  }, [users, userFeedback, betaFeatures]);

  const calculateMetrics = () => {
    const betaTesters = users.filter(u => u.role === 'beta_tester');
    const activeTesters = betaTesters.filter(u => 
      u.last_active > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const betaFeedback = userFeedback.filter(f => f.type === 'beta_feedback');
    const bugReports = userFeedback.filter(f => f.type === 'bug').length;
    const featureRequests = userFeedback.filter(f => f.type === 'feature_request').length;

    // Calculate feature adoption
    const featureAdoption: Record<string, number> = {};
    betaFeatures.forEach(feature => {
      const enabledUsers = users.filter(u => isFeatureEnabled(feature.id)).length;
      featureAdoption[feature.id] = betaTesters.length > 0 ? 
        (enabledUsers / betaTesters.length) * 100 : 0;
    });

    // Calculate retention rate (users active in last 7 days)
    const retentionRate = betaTesters.length > 0 ? 
      (activeTesters.length / betaTesters.length) * 100 : 0;

    setMetrics({
      totalTesters: betaTesters.length,
      activeTesters: activeTesters.length,
      feedbackCount: betaFeedback.length,
      averageRating: 4.2, // Would calculate from actual ratings
      featureAdoption,
      retentionRate,
      bugReports,
      featureRequests
    });
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.title || !newFeedback.description) return;

    try {
      await submitFeedback(newFeedback);
      setNewFeedback({
        title: '',
        description: '',
        type: 'beta_feedback',
        priority: 'medium',
        feature_id: ''
      });
      setShowFeedbackModal(false);
      alert('Feedback submitted successfully!');
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const exportBetaData = () => {
    const betaTesters = users.filter(u => u.role === 'beta_tester');
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      beta_testers: betaTesters.map(user => ({
        email: user.email,
        status: user.status,
        joined: user.created_at,
        last_active: user.last_active,
        session_count: user.session_count,
        avg_coherence: user.avg_coherence_score,
        beta_features: user.beta_features,
        feedback_count: userFeedback.filter(f => f.user_id === user.id).length
      })),
      feature_adoption: metrics.featureAdoption,
      feedback_summary: userFeedback.reduce((acc, f) => {
        acc[f.type] = (acc[f.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eidolon-beta-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <TestTube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Beta Testing Dashboard</h2>
            <p className="text-sm text-gray-600">Monitor beta user engagement and feedback</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Add Feedback</span>
          </button>
          <button
            onClick={exportBetaData}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Beta Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Beta Testers</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{metrics.totalTesters}</div>
          <div className="text-xs text-purple-700">{metrics.activeTesters} active this week</div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Retention</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{metrics.retentionRate.toFixed(0)}%</div>
          <div className="text-xs text-emerald-700">7-day retention rate</div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Feedback</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{metrics.feedbackCount}</div>
          <div className="text-xs text-blue-700">{metrics.bugReports} bugs, {metrics.featureRequests} requests</div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Satisfaction</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{metrics.averageRating.toFixed(1)}</div>
          <div className="text-xs text-yellow-700">Average rating</div>
        </div>
      </div>

      {/* Feature Adoption */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Adoption Rates</h3>
        <div className="space-y-3">
          {betaFeatures.map((feature) => {
            const adoptionRate = metrics.featureAdoption[feature.id] || 0;
            return (
              <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{feature.name}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{adoptionRate.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">adoption rate</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Beta Feedback */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Beta Feedback</h3>
        {userFeedback.filter(f => f.type === 'beta_feedback').slice(0, 5).map((feedback) => (
          <div key={feedback.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                <p className="text-sm text-gray-600">{feedback.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                feedback.priority === 'critical' ? 'bg-red-100 text-red-700' :
                feedback.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {feedback.priority}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{feedback.created_at.toLocaleDateString()}</span>
              {feedback.feature_id && (
                <>
                  <span>•</span>
                  <span>Feature: {betaFeatures.find(f => f.id === feedback.feature_id)?.name}</span>
                </>
              )}
              <span>•</span>
              <span className="capitalize">{feedback.status.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Submit Beta Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Title
                </label>
                <input
                  type="text"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of your feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of your feedback..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newFeedback.type}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="beta_feedback">Beta Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newFeedback.priority}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Feature (Optional)
                </label>
                <select
                  value={newFeedback.feature_id}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, feature_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">No specific feature</option>
                  {betaFeatures.map((feature) => (
                    <option key={feature.id} value={feature.id}>{feature.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!newFeedback.title || !newFeedback.description}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetaTestingDashboard;