import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { canInstall, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (canInstall) {
      // Show prompt after user has used the app for a bit
      const timer = setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!showPrompt || !canInstall) return null;

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setShowPrompt(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Install Eidolon
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Add to your home screen for quick access and offline training
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;