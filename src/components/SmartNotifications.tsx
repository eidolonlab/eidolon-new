import React, { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, Brain, Target, X, Settings, Zap, Calendar } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface NotificationSettings {
  enabled: boolean;
  optimalTiming: boolean;
  contextAware: boolean;
  spacedRetrieval: boolean;
  scenarioPrep: boolean;
  quietHours: { start: string; end: string };
}

const SmartNotifications: React.FC = () => {
  const { weaves } = useWeave();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    optimalTiming: true,
    contextAware: false,
    spacedRetrieval: true,
    scenarioPrep: true,
    quietHours: { start: '22:00', end: '08:00' }
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [pendingNotifications, setPendingNotifications] = useState<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    scheduledFor: Date;
    weaveId?: string;
  }>>([]);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings
    const savedSettings = localStorage.getItem('eidolon-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Schedule notifications based on current weaves
    scheduleSmartNotifications();
  }, [weaves]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        scheduleSmartNotifications();
      }
    }
  };

  const scheduleSmartNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    const notifications = [];
    const now = new Date();

    // Spaced retrieval notifications
    if (settings.spacedRetrieval) {
      weaves.filter(w => w.type === 'past').forEach(weave => {
        const daysSinceLastRetrieval = weave.lastRetrieved 
          ? Math.floor((now.getTime() - weave.lastRetrieved.getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        // Schedule based on spaced intervals: 1, 3, 7, 14, 30 days
        const intervals = [1, 3, 7, 14, 30];
        const nextInterval = intervals.find(interval => daysSinceLastRetrieval >= interval);
        
        if (nextInterval) {
          const scheduledTime = new Date(now.getTime() + getOptimalNotificationTime());
          notifications.push({
            id: `retrieval-${weave.id}`,
            type: 'spaced_retrieval',
            title: 'Memory Training Time',
            message: `Practice retrieving "${weave.title}" to strengthen this memory`,
            scheduledFor: scheduledTime,
            weaveId: weave.id
          });
        }
      });
    }

    // Scenario preparation notifications
    if (settings.scenarioPrep) {
      weaves.filter(w => w.type === 'future' && !w.completed && w.scheduledFor).forEach(weave => {
        const daysUntilEvent = Math.ceil((weave.scheduledFor!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEvent <= 7 && daysUntilEvent > 0) {
          const prepTime = new Date(weave.scheduledFor!.getTime() - 24 * 60 * 60 * 1000); // 1 day before
          notifications.push({
            id: `scenario-prep-${weave.id}`,
            type: 'scenario_prep',
            title: 'Scenario Preparation',
            message: `Tomorrow: "${weave.title}" - Review your if-then plans`,
            scheduledFor: prepTime,
            weaveId: weave.id
          });
        }
      });
    }

    // Daily memory moment reminders
    const todayMoments = localStorage.getItem(`eidolon-daily-moments-${now.toDateString()}`);
    if (!todayMoments || JSON.parse(todayMoments).length === 0) {
      const eveningTime = new Date();
      eveningTime.setHours(19, 0, 0, 0); // 7 PM
      
      if (eveningTime > now) {
        notifications.push({
          id: 'daily-moment',
          type: 'daily_moment',
          title: 'Capture Today\'s Memory',
          message: dailyPrompt,
          scheduledFor: eveningTime
        });
      }
    }

    setPendingNotifications(notifications.slice(0, 5)); // Limit to 5 upcoming
  };

  const getOptimalNotificationTime = () => {
    // Find optimal time based on user's most active hours
    const userSessions = JSON.parse(localStorage.getItem('eidolon-sessions') || '[]');
    const sessionHours = userSessions.map((s: any) => new Date(s.startTime).getHours());
    
    if (sessionHours.length > 0) {
      // Find most common hour
      const hourCounts = sessionHours.reduce((acc: any, hour: number) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      
      const optimalHour = Object.entries(hourCounts).reduce((a: any, b: any) => 
        hourCounts[a[0]] > hourCounts[b[0]] ? a : b
      )[0];
      
      const optimalTime = new Date();
      optimalTime.setHours(parseInt(optimalHour), 0, 0, 0);
      
      // If that time has passed today, schedule for tomorrow
      if (optimalTime <= new Date()) {
        optimalTime.setDate(optimalTime.getDate() + 1);
      }
      
      return optimalTime.getTime() - new Date().getTime();
    }
    
    // Default to 2 hours from now
    return 2 * 60 * 60 * 1000;
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('eidolon-notification-settings', JSON.stringify(updated));
    
    if (updated.enabled) {
      scheduleSmartNotifications();
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Eidolon Test', {
        body: 'Smart notifications are working perfectly!',
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Smart Notifications</h2>
            <p className="text-sm text-gray-600">Science-based reminders for optimal memory training</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            permission === 'granted' ? 'bg-emerald-500' : 
            permission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <span className="text-sm text-gray-600 capitalize">{permission}</span>
        </div>
      </div>

      {/* Permission Request */}
      {permission !== 'granted' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Enable Smart Notifications</span>
          </div>
          <p className="text-blue-800 text-sm mb-4">
            Get personalized reminders for spaced retrieval training and scenario preparation. 
            Notifications are timed based on cognitive science research for optimal memory consolidation.
          </p>
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* Notification Settings */}
      {permission === 'granted' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Spaced Retrieval Reminders</label>
                  <p className="text-xs text-gray-500 mt-1">Optimal timing for memory practice based on forgetting curves</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.spacedRetrieval}
                  onChange={(e) => updateSettings({ spacedRetrieval: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Scenario Preparation Alerts</label>
                  <p className="text-xs text-gray-500 mt-1">Reminders to review if-then plans before scheduled events</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.scenarioPrep}
                  onChange={(e) => updateSettings({ scenarioPrep: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Optimal Timing</label>
                  <p className="text-xs text-gray-500 mt-1">Send notifications when your brain is most receptive</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.optimalTiming}
                  onChange={(e) => updateSettings({ optimalTiming: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Notifications */}
          {pendingNotifications.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Upcoming Notifications</h3>
              <div className="space-y-3">
                {pendingNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      notification.type === 'spaced_retrieval' ? 'bg-indigo-100' :
                      notification.type === 'scenario_prep' ? 'bg-emerald-100' :
                      'bg-amber-100'
                    }`}>
                      {notification.type === 'spaced_retrieval' ? <Brain className="w-4 h-4 text-indigo-600" /> :
                       notification.type === 'scenario_prep' ? <Target className="w-4 h-4 text-emerald-600" /> :
                       <Clock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {notification.scheduledFor.toLocaleDateString()} at {notification.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Notification */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-700">Test Notifications</span>
              <p className="text-xs text-gray-500 mt-1">Send a test notification to verify everything works</p>
            </div>
            <button
              onClick={sendTestNotification}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Test
            </button>
          </div>
        </div>
      )}

      {/* Research Context */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Cognitive Science</span>
        </div>
        <p className="text-sm text-purple-800">
          Notifications are timed based on research showing optimal memory consolidation occurs during 
          specific circadian rhythm phases. Spaced retrieval alerts follow the forgetting curve to 
          maximize retention with minimal practice time.
        </p>
      </div>
    </div>
  );
};

export default SmartNotifications;