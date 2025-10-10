import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Palette, Volume2, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataExport from './DataExport';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'data' | 'notifications'>('general');
  const [settings, setSettings] = useState({
    notifications: {
      retrievalReminders: true,
      scenarioAlerts: true,
      progressUpdates: false,
    },
    training: {
      defaultDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
      errorlessMode: false,
      soundEffects: true,
    },
    privacy: {
      analytics: false,
      research: false,
    },
    appearance: {
      theme: 'light' as 'light' | 'dark' | 'auto',
      reducedMotion: false,
    }
  });

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    // Save to localStorage
    localStorage.setItem('eidolon-settings', JSON.stringify({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    }));
  };

  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
      onClose();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Training Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Difficulty Level
                  </label>
                  <select
                    value={settings.training.defaultDifficulty}
                    onChange={(e) => updateSetting('training', 'defaultDifficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="easy">Easy - More hints and guidance</option>
                    <option value="medium">Medium - Balanced challenge</option>
                    <option value="hard">Hard - Minimal assistance</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Errorless Mode by Default</label>
                    <p className="text-xs text-gray-500 mt-1">Use gentle hints instead of free recall</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.training.errorlessMode}
                    onChange={(e) => updateSetting('training', 'errorlessMode', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sound Effects</label>
                    <p className="text-xs text-gray-500 mt-1">Audio feedback for interactions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.training.soundEffects}
                    onChange={(e) => updateSetting('training', 'soundEffects', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Appearance</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reduce Motion</label>
                    <p className="text-xs text-gray-500 mt-1">Minimize animations for accessibility</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.reducedMotion}
                    onChange={(e) => updateSetting('appearance', 'reducedMotion', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Retrieval Reminders</label>
                    <p className="text-xs text-gray-500 mt-1">Spaced repetition training alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.retrievalReminders}
                    onChange={(e) => updateSetting('notifications', 'retrievalReminders', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Scenario Alerts</label>
                    <p className="text-xs text-gray-500 mt-1">Reminders for upcoming rehearsed events</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.scenarioAlerts}
                    onChange={(e) => updateSetting('notifications', 'scenarioAlerts', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Progress Updates</label>
                    <p className="text-xs text-gray-500 mt-1">Weekly training summaries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.progressUpdates}
                    onChange={(e) => updateSetting('notifications', 'progressUpdates', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">About Notifications</h4>
              <p className="text-sm text-blue-800">
                Notifications are delivered through your browser and respect your device's Do Not Disturb settings. 
                You can change these permissions in your browser settings at any time.
              </p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Privacy Controls</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Usage Analytics</label>
                    <p className="text-xs text-gray-500 mt-1">Anonymous usage data to improve the app</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.analytics}
                    onChange={(e) => updateSetting('privacy', 'analytics', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Research Participation</label>
                    <p className="text-xs text-gray-500 mt-1">Contribute to memory research studies</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.research}
                    onChange={(e) => updateSetting('privacy', 'research', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Data Storage</h3>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Local Storage Only</h4>
                </div>
                <p className="text-sm text-green-800">
                  All your memory content is stored locally on your device. We never upload your personal 
                  memory data to our servers. Your privacy is protected by design.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Privacy Policy</div>
                <div className="text-xs text-gray-500 mt-1">Read our full privacy policy</div>
              </a>
              
              <a
                href="/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Terms of Service</div>
                <div className="text-xs text-gray-500 mt-1">Review our terms and conditions</div>
              </a>
            </div>
          </div>
        );

      case 'data':
        return <DataExport />;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            {/* User Info */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-500">Signed in</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;