import React, { useState, useEffect } from 'react';
import { 
  Code, GitBranch, Rocket, Users, TestTube, Settings,
  TrendingUp, AlertTriangle, CheckCircle, Clock, Eye,
  Download, Upload, RefreshCw, Shield, Zap, Target
} from 'lucide-react';
import UserManagementDashboard from './UserManagementDashboard';
import DeploymentManager from './DeploymentManager';
import BetaTestingDashboard from './BetaTestingDashboard';
import FeatureFlagManager from './FeatureFlagManager';
import EnvironmentIndicator from './EnvironmentIndicator';
import { useUserManagement } from '../contexts/UserManagementContext';

const DeveloperDashboard: React.FC = () => {
  const { getCurrentEnvironment } = useUserManagement();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'features' | 'deployments' | 'beta'>('overview');
  const [systemHealth, setSystemHealth] = useState({
    api_status: 'healthy',
    database_status: 'healthy',
    deployment_status: 'ready',
    user_load: 'normal'
  });

  const environment = getCurrentEnvironment();

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = () => {
    // Simulate system health check
    setTimeout(() => {
      setSystemHealth({
        api_status: Math.random() > 0.1 ? 'healthy' : 'degraded',
        database_status: Math.random() > 0.05 ? 'healthy' : 'slow',
        deployment_status: 'ready',
        user_load: Math.random() > 0.2 ? 'normal' : 'high'
      });
    }, 1000);
  };

  const handleDeploy = (env: 'staging' | 'production') => {
    console.log(`Deploying to ${env}`);
    alert(`Deployment to ${env} initiated! Check the deployments tab for progress.`);
  };

  const handleRollback = (deploymentId: string) => {
    console.log(`Rolling back deployment ${deploymentId}`);
    alert('Rollback initiated successfully!');
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'degraded': case 'slow': return 'yellow';
      case 'down': case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': case 'slow': return AlertTriangle;
      case 'down': case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Environment Status */}
      <div className="flex items-center justify-between">
        <EnvironmentIndicator environment={environment} />
        <div className="flex items-center space-x-2">
          <button
            onClick={checkSystemHealth}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="grid md:grid-cols-4 gap-4">
        {Object.entries(systemHealth).map(([key, status]) => {
          const HealthIcon = getHealthIcon(status);
          const color = getHealthColor(status);
          
          return (
            <div key={key} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
              <div className="flex items-center space-x-2 mb-2">
                <HealthIcon className={`w-4 h-4 text-${color}-600`} />
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {key.replace('_', ' ')}
                </span>
              </div>
              <div className={`text-lg font-bold text-${color}-600 capitalize`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('deployments')}
          className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left"
        >
          <Rocket className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Deploy</h3>
          <p className="text-sm text-gray-600">Manage staging and production deployments</p>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors text-left"
        >
          <Users className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Users</h3>
          <p className="text-sm text-gray-600">Manage user roles and permissions</p>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left"
        >
          <Zap className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Features</h3>
          <p className="text-sm text-gray-600">Control feature flags and rollouts</p>
        </button>

        <button
          onClick={() => setActiveTab('beta')}
          className="p-6 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-left"
        >
          <TestTube className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Beta Testing</h3>
          <p className="text-sm text-gray-600">Monitor beta user feedback and metrics</p>
        </button>
      </div>

      {/* Environment URLs */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Environment URLs</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Development</div>
              <div className="text-sm text-gray-600">http://localhost:5173</div>
            </div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Open</span>
            </a>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Staging</div>
              <div className="text-sm text-gray-600">https://staging.tryeidolon.com</div>
            </div>
            <a
              href="https://staging.tryeidolon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Open</span>
            </a>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Production</div>
              <div className="text-sm text-gray-600">https://tryeidolon.com</div>
            </div>
            <a
              href="https://tryeidolon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Open</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
                <p className="text-sm text-gray-600">Eidolon Development & Deployment Management</p>
              </div>
            </div>
            
            <EnvironmentIndicator environment={environment} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'features', label: 'Feature Flags', icon: Zap },
              { id: 'deployments', label: 'Deployments', icon: Rocket },
              { id: 'beta', label: 'Beta Testing', icon: TestTube },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'users' && <UserManagementDashboard />}
        {activeTab === 'features' && <FeatureFlagManager />}
        {activeTab === 'deployments' && (
          <DeploymentManager onDeploy={handleDeploy} onRollback={handleRollback} />
        )}
        {activeTab === 'beta' && <BetaTestingDashboard />}
      </div>
    </div>
  );
};

export default DeveloperDashboard;