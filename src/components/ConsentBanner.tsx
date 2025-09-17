import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield } from 'lucide-react';

const ConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    research: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('eidolon-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      research: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('eidolon-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('eidolon-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      research: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('eidolon-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto p-4">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-start space-x-3 flex-1">
              <Cookie className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Privacy & Data Usage</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use local storage to save your memory training data on your device. 
                  Optional analytics help us improve the app. Your memory content never leaves your device.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Customize</span>
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Privacy Preferences</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">Essential Storage</h4>
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Required for app functionality. Stores your memory weaves and training progress locally on your device.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Usage Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Anonymous usage statistics to help us improve the app. No personal memory content is included.
                  </p>
                </div>
              </div>

              {/* Research */}
              <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={preferences.research}
                  onChange={(e) => setPreferences(prev => ({ ...prev, research: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Research Participation</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Contribute anonymized training patterns to memory research studies. Always optional and revocable.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentBanner;