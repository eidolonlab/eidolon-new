import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle, CheckCircle } from 'lucide-react';

const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-emerald-50 border border-emerald-200' 
        : 'bg-amber-50 border border-amber-200'
    }`}>
      <div className="flex items-center space-x-3">
        {isOnline ? (
          <>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium text-emerald-900">Back online!</div>
              <div className="text-sm text-emerald-700">All features available</div>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <WifiOff className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="font-medium text-amber-900">Offline mode</div>
              <div className="text-sm text-amber-700">Core features still work</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineDetector;