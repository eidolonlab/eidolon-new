import React, { useState, useEffect } from 'react';
import { 
  Rocket, GitBranch, CheckCircle, XCircle, Clock, 
  ArrowRight, RefreshCw, AlertTriangle, Download,
  Upload, Eye, Settings, Target, Zap, Shield
} from 'lucide-react';

interface Deployment {
  id: string;
  environment: 'staging' | 'production';
  version: string;
  commit_hash: string;
  deployed_by: string;
  deployed_at: Date;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled_back';
  build_time: number;
  features: string[];
  rollback_target?: string;
}

interface DeploymentManagerProps {
  onDeploy: (environment: 'staging' | 'production') => void;
  onRollback: (deploymentId: string) => void;
}

const DeploymentManager: React.FC<DeploymentManagerProps> = ({ onDeploy, onRollback }) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentStaging, setCurrentStaging] = useState<Deployment | null>(null);
  const [currentProduction, setCurrentProduction] = useState<Deployment | null>(null);
  const [showDeployModal, setShowDeployModal] = useState<'staging' | 'production' | null>(null);
  const [deploymentNotes, setDeploymentNotes] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const availableFeatures = [
    'story-graph',
    'voice-interface', 
    'biometric-integration',
    'advanced-analytics',
    'social-features',
    'ai-coaching'
  ];

  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = () => {
    // Simulate deployment history
    const sampleDeployments: Deployment[] = [
      {
        id: 'deploy-1',
        environment: 'production',
        version: 'v1.2.0',
        commit_hash: 'abc123',
        deployed_by: 'admin@tryeidolon.com',
        deployed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'success',
        build_time: 120,
        features: ['memory-weaving', 'scenario-planning', 'retrieval-training']
      },
      {
        id: 'deploy-2',
        environment: 'staging',
        version: 'v1.3.0-beta',
        commit_hash: 'def456',
        deployed_by: 'dev@tryeidolon.com',
        deployed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'success',
        build_time: 95,
        features: ['memory-weaving', 'scenario-planning', 'retrieval-training', 'story-graph']
      }
    ];

    setDeployments(sampleDeployments);
    setCurrentProduction(sampleDeployments.find(d => d.environment === 'production') || null);
    setCurrentStaging(sampleDeployments.find(d => d.environment === 'staging') || null);
  };

  const handleDeploy = async (environment: 'staging' | 'production') => {
    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      const newDeployment: Deployment = {
        id: `deploy-${Date.now()}`,
        environment,
        version: environment === 'staging' ? 'v1.3.0-beta' : 'v1.3.0',
        commit_hash: Math.random().toString(36).substring(2, 8),
        deployed_by: 'admin@tryeidolon.com',
        deployed_at: new Date(),
        status: 'deploying',
        build_time: 0,
        features: selectedFeatures
      };

      setDeployments(prev => [newDeployment, ...prev]);

      // Simulate build process
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        setDeployments(prev => prev.map(d => 
          d.id === newDeployment.id 
            ? { 
                ...d, 
                status: success ? 'success' : 'failed',
                build_time: 60 + Math.random() * 120
              }
            : d
        ));

        if (success) {
          if (environment === 'staging') {
            setCurrentStaging(newDeployment);
          } else {
            setCurrentProduction(newDeployment);
          }
          onDeploy(environment);
        }

        setIsDeploying(false);
        setShowDeployModal(null);
        setSelectedFeatures([]);
        setDeploymentNotes('');
      }, 3000);

    } catch (error) {
      console.error('Deployment failed:', error);
      setIsDeploying(false);
    }
  };

  const handleRollback = async (deploymentId: string) => {
    if (!window.confirm('Are you sure you want to rollback this deployment? This will revert to the previous version.')) {
      return;
    }

    try {
      onRollback(deploymentId);
      
      // Update deployment status
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId 
          ? { ...d, status: 'rolled_back' }
          : d
      ));

      alert('Rollback initiated successfully!');
    } catch (error) {
      console.error('Rollback failed:', error);
      alert('Rollback failed. Please try again.');
    }
  };

  const promoteToProduction = () => {
    if (!currentStaging) return;
    
    setShowDeployModal('production');
    setSelectedFeatures(currentStaging.features);
    setDeploymentNotes(`Promoting staging v${currentStaging.version} to production`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'emerald';
      case 'failed': return 'red';
      case 'deploying': return 'blue';
      case 'rolled_back': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      case 'deploying': return Clock;
      case 'rolled_back': return RefreshCw;
      default: return Clock;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Deployment Manager</h2>
            <p className="text-sm text-gray-600">Manage staging and production deployments</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDeployModal('staging')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Deploy to Staging</span>
          </button>
          {currentStaging && currentStaging.status === 'success' && (
            <button
              onClick={promoteToProduction}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Promote to Production</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Deployments */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Staging */}
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Staging Environment</h3>
            </div>
            <a
              href="https://staging.tryeidolon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View</span>
            </a>
          </div>
          
          {currentStaging ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="font-medium text-gray-900">{currentStaging.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const StatusIcon = getStatusIcon(currentStaging.status);
                    const color = getStatusColor(currentStaging.status);
                    return (
                      <>
                        <StatusIcon className={`w-4 h-4 text-${color}-600`} />
                        <span className={`text-sm font-medium text-${color}-700 capitalize`}>
                          {currentStaging.status.replace('_', ' ')}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deployed:</span>
                <span className="text-sm text-gray-900">{currentStaging.deployed_at.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Features:</span>
                <span className="text-sm text-gray-900">{currentStaging.features.length}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No staging deployment</p>
              <button
                onClick={() => setShowDeployModal('staging')}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Deploy to Staging
              </button>
            </div>
          )}
        </div>

        {/* Production */}
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Production Environment</h3>
            </div>
            <a
              href="https://tryeidolon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View</span>
            </a>
          </div>
          
          {currentProduction ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="font-medium text-gray-900">{currentProduction.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const StatusIcon = getStatusIcon(currentProduction.status);
                    const color = getStatusColor(currentProduction.status);
                    return (
                      <>
                        <StatusIcon className={`w-4 h-4 text-${color}-600`} />
                        <span className={`text-sm font-medium text-${color}-700 capitalize`}>
                          {currentProduction.status.replace('_', ' ')}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deployed:</span>
                <span className="text-sm text-gray-900">{currentProduction.deployed_at.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Features:</span>
                <span className="text-sm text-gray-900">{currentProduction.features.length}</span>
              </div>
              
              {currentProduction.status === 'success' && (
                <button
                  onClick={() => handleRollback(currentProduction.id)}
                  className="w-full mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Rollback Deployment
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No production deployment</p>
            </div>
          )}
        </div>
      </div>

      {/* Deployment History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Deployment History</h3>
        <div className="space-y-3">
          {deployments.slice(0, 10).map((deployment) => {
            const StatusIcon = getStatusIcon(deployment.status);
            const color = getStatusColor(deployment.status);
            
            return (
              <div key={deployment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <StatusIcon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {deployment.version} → {deployment.environment}
                    </div>
                    <div className="text-sm text-gray-600">
                      {deployment.deployed_at.toLocaleString()} • {deployment.build_time}s build
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-700 capitalize`}>
                    {deployment.status.replace('_', ' ')}
                  </span>
                  {deployment.status === 'success' && deployment.environment === 'production' && (
                    <button
                      onClick={() => handleRollback(deployment.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                    >
                      Rollback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Deploy to {showDeployModal === 'staging' ? 'Staging' : 'Production'}
              </h3>
              <button
                onClick={() => setShowDeployModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {showDeployModal === 'production' && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-900">Production Deployment</span>
                  </div>
                  <p className="text-sm text-red-800">
                    This will deploy to the live production environment. Ensure all changes have been tested in staging.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features to Deploy
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures(prev => [...prev, feature]);
                          } else {
                            setSelectedFeatures(prev => prev.filter(f => f !== feature));
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{feature.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Notes
                </label>
                <textarea
                  value={deploymentNotes}
                  onChange={(e) => setDeploymentNotes(e.target.value)}
                  placeholder="Describe the changes being deployed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeploy(showDeployModal)}
                  disabled={isDeploying || selectedFeatures.length === 0}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${
                    showDeployModal === 'production' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isDeploying ? 'Deploying...' : `Deploy to ${showDeployModal}`}
                </button>
                <button
                  onClick={() => setShowDeployModal(null)}
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

export default DeploymentManager;