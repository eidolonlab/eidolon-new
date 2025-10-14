import React, { useState, useEffect } from 'react';
import { Server, CheckCircle, XCircle, Users, Key, RefreshCw, AlertTriangle } from 'lucide-react';
import { environmentManager, Environment, EnvironmentConfig, FeatureFlag } from '../lib/environmentManager';

export const EnvironmentManagerComponent: React.FC = () => {
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [currentEnv, setCurrentEnv] = useState<Environment>('production');
  const [loading, setLoading] = useState(true);
  const [editingFlag, setEditingFlag] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [envs, flags] = await Promise.all([
        environmentManager.getAvailableEnvironments(),
        environmentManager.getFeatureFlags()
      ]);
      setEnvironments(envs);
      setFeatureFlags(flags);
      setCurrentEnv(environmentManager.getCurrentEnvironment());
    } catch (error) {
      console.error('Error loading environment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchEnvironment = async (env: Environment) => {
    try {
      await environmentManager.setEnvironment(env);
      setCurrentEnv(env);
      alert(`Switched to ${env} environment`);
      window.location.reload(); // Reload to apply environment changes
    } catch (error: any) {
      alert(error.message || 'Failed to switch environment');
    }
  };

  const handleToggleFeature = async (flagKey: string, env: string) => {
    try {
      const flag = featureFlags.find(f => f.flag_key === flagKey);
      if (!flag) return;

      const newEnvs = flag.enabled_environments.includes(env)
        ? flag.enabled_environments.filter(e => e !== env)
        : [...flag.enabled_environments, env];

      await environmentManager.updateFeatureFlag(flagKey, newEnvs);
      await loadData();
      alert('Feature flag updated successfully');
    } catch (error) {
      alert('Failed to update feature flag');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Environment Management</h2>
          <p className="text-gray-600 mt-1">Manage environments and feature flags</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Current Environment Alert */}
      <div className={`rounded-lg p-4 ${
        currentEnv === 'production' ? 'bg-green-50 border border-green-200' :
        currentEnv === 'staging' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center space-x-3">
          <Server className={`w-5 h-5 ${
            currentEnv === 'production' ? 'text-green-600' :
            currentEnv === 'staging' ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <div>
            <p className="font-semibold text-gray-900">
              Current Environment: <span className="capitalize">{currentEnv}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              All changes and data will be applied to this environment
            </p>
          </div>
        </div>
      </div>

      {/* Environments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {environments.map((env) => (
          <div
            key={env.id}
            className={`bg-white rounded-lg shadow p-6 border-2 transition-all ${
              currentEnv === env.name
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{env.display_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{env.config.description}</p>
              </div>
              {env.is_active ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="space-y-2 mb-4">
              {env.config.public_access && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Public Access</span>
                </div>
              )}
              {env.config.require_approval && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Key className="w-4 h-4" />
                  <span>Requires Approval</span>
                </div>
              )}
              {env.config.auto_sync && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto Sync Enabled</span>
                </div>
              )}
            </div>

            {currentEnv !== env.name && (
              <button
                onClick={() => handleSwitchEnvironment(env.name as Environment)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Switch to {env.display_name}
              </button>
            )}
            {currentEnv === env.name && (
              <div className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-center font-medium">
                Active Environment
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature Flags Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Feature Flags</h3>
          <p className="text-sm text-gray-600 mt-1">
            Control which features are enabled in each environment
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Development</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Staging</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Production</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {featureFlags.map((flag) => (
                <tr key={flag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{flag.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{flag.flag_key}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {flag.description}
                  </td>
                  {['dev', 'staging', 'production'].map((env) => {
                    const isEnabled = flag.enabled_environments.includes(env);
                    return (
                      <td key={env} className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeature(flag.flag_key, env)}
                          className={`inline-flex items-center justify-center w-16 h-8 rounded-full transition-colors ${
                            isEnabled
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                              isEnabled ? 'translate-x-2' : '-translate-x-2'
                            }`}
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Warning */}
      {currentEnv !== 'production' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Testing Environment</p>
              <p className="text-sm text-yellow-700 mt-1">
                You are currently in {currentEnv} environment. Changes made here will NOT affect production users.
                Test thoroughly before deploying to production.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManagerComponent;
