import React, { useState, useEffect } from 'react';
import { Zap, Users, Settings, TrendingUp, Eye, CreditCard as Edit, Plus, X, CheckCircle, XCircle, Clock, Target, AlertTriangle, Award, Shield, Brain } from 'lucide-react';
import { useUserManagement } from '../contexts/UserManagementContext';

const FeatureFlagManager: React.FC = () => {
  const {
    betaFeatures,
    users,
    createBetaFeature,
    updateFeatureRollout,
    loadBetaFeatures,
    getCurrentEnvironment
  } = useUserManagement();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    enabled_for_roles: [] as string[],
    rollout_percentage: 0,
    status: 'development' as 'development' | 'beta' | 'production'
  });

  const environment = getCurrentEnvironment();
  const availableRoles = ['beta_tester', 'regular_user', 'admin', 'developer'];

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
      setShowCreateModal(false);
      alert('Feature flag created successfully!');
    } catch (error) {
      alert('Failed to create feature flag. Please try again.');
    }
  };

  const toggleRoleAccess = (featureId: string, role: string) => {
    // This would update the feature's enabled_for_roles in the database
    console.log(`Toggle ${role} access for feature ${featureId}`);
  };

  const getFeatureIcon = (featureName: string) => {
    if (featureName.toLowerCase().includes('story')) return Users;
    if (featureName.toLowerCase().includes('voice')) return Brain;
    if (featureName.toLowerCase().includes('biometric')) return Activity;
    if (featureName.toLowerCase().includes('analytics')) return TrendingUp;
    return Zap;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'emerald';
      case 'beta': return 'blue';
      case 'development': return 'yellow';
      case 'deprecated': return 'red';
      default: return 'gray';
    }
  };

  const calculateFeatureImpact = (feature: any) => {
    const enabledUsers = users.filter(u => 
      feature.enabled_for_roles.includes(u.role) || 
      feature.enabled_for_users.includes(u.id) ||
      (feature.rollout_percentage > 0 && Math.random() * 100 < feature.rollout_percentage)
    ).length;

    return {
      enabledUsers,
      totalReach: Math.round((enabledUsers / users.length) * 100),
      betaReach: Math.round((enabledUsers / users.filter(u => u.role === 'beta_tester').length) * 100)
    };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Feature Flag Manager</h2>
            <p className="text-sm text-gray-600">Control feature rollouts and user access</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Feature Flag</span>
        </button>
      </div>

      {/* Environment Warning */}
      {environment !== 'production' && (
        <div className={`mb-6 p-4 rounded-lg border ${
          environment === 'development' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`w-4 h-4 ${
              environment === 'development' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${
              environment === 'development' ? 'text-yellow-900' : 'text-blue-900'
            }`}>
              {environment === 'development' ? 'Development Mode' : 'Staging Mode'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            environment === 'development' ? 'text-yellow-800' : 'text-blue-800'
          }`}>
            Feature flags in {environment} mode. Changes here {environment === 'staging' ? 'will be tested before production' : 'are for development only'}.
          </p>
        </div>
      )}

      {/* Feature Flags List */}
      <div className="space-y-4">
        {betaFeatures.map((feature) => {
          const FeatureIcon = getFeatureIcon(feature.name);
          const statusColor = getStatusColor(feature.status);
          const impact = calculateFeatureImpact(feature);
          
          return (
            <div key={feature.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-${statusColor}-100 rounded-lg flex items-center justify-center`}>
                    <FeatureIcon className={`w-5 h-5 text-${statusColor}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-700 capitalize`}>
                        {feature.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created {feature.created_at.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setEditingFeature(editingFeature === feature.id ? null : feature.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Rollout Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rollout Percentage</span>
                  <span className="text-sm text-gray-600">{feature.rollout_percentage}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={feature.rollout_percentage}
                    onChange={(e) => updateFeatureRollout(feature.id, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex space-x-1">
                    {[0, 25, 50, 75, 100].map(percentage => (
                      <button
                        key={percentage}
                        onClick={() => updateFeatureRollout(feature.id, percentage)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          feature.rollout_percentage === percentage
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Role Access */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Role Access</div>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => toggleRoleAccess(feature.id, role)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        feature.enabled_for_roles.includes(role)
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-purple-600">{impact.enabledUsers}</div>
                  <div className="text-xs text-gray-600">Enabled Users</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-blue-600">{impact.totalReach}%</div>
                  <div className="text-xs text-gray-600">Total Reach</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-lg font-bold text-emerald-600">{impact.betaReach}%</div>
                  <div className="text-xs text-gray-600">Beta Reach</div>
                </div>
              </div>

              {/* Expanded Controls */}
              {editingFeature === feature.id && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Advanced Controls</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feature Status
                      </label>
                      <select
                        value={feature.status}
                        onChange={(e) => {
                          // Would update feature status in database
                          console.log(`Update feature ${feature.id} status to ${e.target.value}`);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="development">Development</option>
                        <option value="beta">Beta Testing</option>
                        <option value="production">Production</option>
                        <option value="deprecated">Deprecated</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateFeatureRollout(feature.id, 0)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Disable All
                      </button>
                      <button
                        onClick={() => updateFeatureRollout(feature.id, 100)}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Enable All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Feature Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Feature Flag</h3>
              <button
                onClick={() => setShowCreateModal(false)}
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
                  placeholder="e.g., Advanced Memory Analytics"
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
                  placeholder="Describe what this feature does and its purpose..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status
                </label>
                <select
                  value={newFeature.status}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="development">Development (0% rollout)</option>
                  <option value="beta">Beta Testing (beta testers only)</option>
                  <option value="production">Production Ready</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enable for Roles
                </label>
                <div className="space-y-2">
                  {availableRoles.map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newFeature.enabled_for_roles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewFeature(prev => ({
                              ...prev,
                              enabled_for_roles: [...prev.enabled_for_roles, role]
                            }));
                          } else {
                            setNewFeature(prev => ({
                              ...prev,
                              enabled_for_roles: prev.enabled_for_roles.filter(r => r !== role)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCreateFeature}
                  disabled={!newFeature.name || !newFeature.description}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Feature Flag
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
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

export default FeatureFlagManager;