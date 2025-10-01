import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Settings, Shield, Mail, Calendar, 
  TrendingUp, Award, AlertCircle, CheckCircle, X, 
  Search, Filter, Download, Upload, Eye, Edit,
  MessageSquare, Star, Clock, Target, Zap
} from 'lucide-react';
import { useUserManagement } from '../contexts/UserManagementContext';

const UserManagementDashboard: React.FC = () => {
  const {
    users,
    betaFeatures,
    userFeedback,
    loadUsers,
    loadBetaFeatures,
    inviteBetaUser,
    updateUserRole,
    createBetaFeature,
    updateFeatureRollout,
    getCurrentEnvironment
  } = useUserManagement();

  const [activeTab, setActiveTab] = useState<'users' | 'features' | 'feedback' | 'invitations'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    features: [] as string[]
  });
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    enabled_for_roles: [] as string[],
    rollout_percentage: 0,
    status: 'development' as 'development' | 'beta' | 'production'
  });

  useEffect(() => {
    loadUsers();
    loadBetaFeatures();
  }, []);

  const environment = getCurrentEnvironment();
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteBetaUser = async () => {
    if (!inviteData.email || inviteData.features.length === 0) return;

    try {
      await inviteBetaUser(inviteData.email, inviteData.features);
      setInviteData({ email: '', features: [] });
      setShowInviteModal(false);
      alert('Beta invitation sent successfully!');
    } catch (error) {
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleCreateFeature = async () => {
    if (!newFeature.name || !newFeature.description) return;

    try {
      await createBetaFeature(newFeature);
      setNewFeature({
        name: '',
        description: '',
        enabled_for_roles: [],
        rollout_percentage: 0,
        status: 'development'
      });
      setShowFeatureModal(false);
      alert('Beta feature created successfully!');
    } catch (error) {
      alert('Failed to create feature. Please try again.');
    }
  };

  const exportUserData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      environment,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        last_active: user.last_active,
        session_count: user.session_count,
        avg_coherence_score: user.avg_coherence_score,
        beta_features: user.beta_features
      })),
      beta_features: betaFeatures,
      feedback_summary: {
        total: userFeedback.length,
        by_type: userFeedback.reduce((acc, f) => {
          acc[f.type] = (acc[f.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eidolon-user-data-${environment}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">
            {users.filter(u => u.role === 'beta_tester').length}
          </div>
          <div className="text-sm text-gray-600">Beta Testers</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.last_active > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-sm text-gray-600">Active This Week</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="beta_tester">Beta Testers</option>
          <option value="regular_user">Regular Users</option>
          <option value="admin">Admins</option>
          <option value="developer">Developers</option>
        </select>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Beta User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        Joined {user.created_at.toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'beta_tester' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'developer' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div>Last: {user.last_active.toLocaleDateString()}</div>
                      <div className="text-gray-500">{user.session_count} sessions</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div>Coherence: {user.avg_coherence_score || 0}/100</div>
                      <div className="text-gray-500">{user.feedback_count || 0} feedback</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newRole = prompt('Enter new role (beta_tester, regular_user, admin, developer):', user.role);
                          if (newRole && ['beta_tester', 'regular_user', 'admin', 'developer'].includes(newRole)) {
                            updateUserRole(user.id, newRole as any);
                          }
                        }}
                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title="Edit role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          alert(`User Details:\n\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}\nBeta Features: ${user.beta_features.join(', ') || 'None'}\nCreated: ${user.created_at.toLocaleString()}\nLast Active: ${user.last_active.toLocaleString()}`);
                        }}
                        className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Beta Features Management</h3>
        <button
          onClick={() => setShowFeatureModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span>Create Feature</span>
        </button>
      </div>

      <div className="grid gap-4">
        {betaFeatures.map((feature) => (
          <div key={feature.id} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{feature.name}</h4>
                <p className="text-gray-600">{feature.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    feature.status === 'production' ? 'bg-emerald-100 text-emerald-700' :
                    feature.status === 'beta' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {feature.status}
                  </span>
                  <span>Rollout: {feature.rollout_percentage}%</span>
                  <span>Roles: {feature.enabled_for_roles.join(', ') || 'None'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={feature.rollout_percentage}
                  onChange={(e) => updateFeatureRollout(feature.id, parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 w-12">{feature.rollout_percentage}%</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Enabled Users</div>
                <div className="text-lg font-bold text-gray-900">
                  {users.filter(u => 
                    feature.enabled_for_roles.includes(u.role) || 
                    feature.enabled_for_users.includes(u.id)
                  ).length}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Rollout Reach</div>
                <div className="text-lg font-bold text-gray-900">
                  {Math.round((feature.rollout_percentage / 100) * users.length)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Feedback</div>
                <div className="text-lg font-bold text-gray-900">
                  {userFeedback.filter(f => f.feature_id === feature.id).length}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {['bug', 'feature_request', 'general', 'beta_feedback'].map(type => (
          <div key={type} className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {userFeedback.filter(f => f.type === type).length}
            </div>
            <div className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {userFeedback.slice(0, 10).map((feedback) => (
          <div key={feedback.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                <p className="text-sm text-gray-600">{feedback.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  feedback.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  feedback.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {feedback.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  feedback.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                  feedback.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {feedback.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="capitalize">{feedback.type.replace('_', ' ')}</span>
              <span>•</span>
              <span>{feedback.created_at.toLocaleDateString()}</span>
              {feedback.feature_id && (
                <>
                  <span>•</span>
                  <span>Feature: {betaFeatures.find(f => f.id === feedback.feature_id)?.name}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600">Environment: {environment}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={exportUserData}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={loadUsers}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Environment Warning */}
      {environment !== 'production' && (
        <div className={`mb-6 p-4 rounded-lg border ${
          environment === 'development' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertCircle className={`w-4 h-4 ${
              environment === 'development' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${
              environment === 'development' ? 'text-yellow-900' : 'text-blue-900'
            }`}>
              {environment === 'development' ? 'Development Environment' : 'Staging Environment'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            environment === 'development' ? 'text-yellow-800' : 'text-blue-800'
          }`}>
            {environment === 'development' ? 
              'You are in development mode. Changes here will not affect production users.' :
              'You are in staging mode. Test thoroughly before promoting to production.'
            }
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'features', label: 'Beta Features', icon: Zap },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'features' && renderFeaturesTab()}
      {activeTab === 'feedback' && renderFeedbackTab()}

      {/* Invite Beta User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite Beta User</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beta Features Access
                </label>
                <div className="space-y-2">
                  {betaFeatures.map((feature) => (
                    <label key={feature.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={inviteData.features.includes(feature.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInviteData(prev => ({ 
                              ...prev, 
                              features: [...prev.features, feature.id] 
                            }));
                          } else {
                            setInviteData(prev => ({ 
                              ...prev, 
                              features: prev.features.filter(f => f !== feature.id) 
                            }));
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleInviteBetaUser}
                  disabled={!inviteData.email || inviteData.features.length === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Feature Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Beta Feature</h3>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Name
                </label>
                <input
                  type="text"
                  value={newFeature.name}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Advanced Analytics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newFeature.description}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this feature does..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newFeature.status}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="development">Development</option>
                  <option value="beta">Beta Testing</option>
                  <option value="production">Production Ready</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCreateFeature}
                  disabled={!newFeature.name || !newFeature.description}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Feature
                </button>
                <button
                  onClick={() => setShowFeatureModal(false)}
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

export default UserManagementDashboard;