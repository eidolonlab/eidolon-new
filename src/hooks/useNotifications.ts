import { useState, useEffect } from 'react';
import { useWeave } from '../contexts/WeaveContext';

interface NotificationSchedule {
  id: string;
  type: 'spaced_retrieval' | 'scenario_prep' | 'daily_moment' | 'weekly_challenge';
  title: string;
  message: string;
  scheduledFor: Date;
  weaveId?: string;
  completed: boolean;
}

export const useNotifications = () => {
  const { weaves, retrievalSessions } = useWeave();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [schedule, setSchedule] = useState<NotificationSchedule[]>([]);
  const [settings, setSettings] = useState({
    enabled: false,
    spacedRetrieval: true,
    scenarioPrep: true,
    dailyMoments: true,
    optimalTiming: true,
    quietHours: { start: '22:00', end: '08:00' }
  });

  useEffect(() => {
    checkPermission();
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings.enabled && permission === 'granted') {
      generateNotificationSchedule();
    }
  }, [weaves, retrievalSessions, settings]);

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('eidolon-notification-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        saveSettings({ ...settings, enabled: true });
      }
      
      return result === 'granted';
    }
    return false;
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('eidolon-notification-settings', JSON.stringify(newSettings));
  };

  const generateNotificationSchedule = () => {
    const newSchedule: NotificationSchedule[] = [];
    const now = new Date();

    // Spaced retrieval notifications
    if (settings.spacedRetrieval) {
      weaves.filter(w => w.type === 'past').forEach(weave => {
        const daysSinceLastRetrieval = weave.lastRetrieved 
          ? Math.floor((now.getTime() - weave.lastRetrieved.getTime()) / (1000 * 60 * 60 * 24))
          : Math.floor((now.getTime() - weave.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        // Spaced intervals: 1, 3, 7, 14, 30 days
        const intervals = [1, 3, 7, 14, 30];
        const nextInterval = intervals.find(interval => daysSinceLastRetrieval >= interval);
        
        if (nextInterval) {
          const scheduledTime = getOptimalNotificationTime();
          newSchedule.push({
            id: `retrieval-${weave.id}`,
            type: 'spaced_retrieval',
            title: 'Memory Training Time',
            message: `Practice retrieving "${weave.title}" to strengthen this memory`,
            scheduledFor: scheduledTime,
            weaveId: weave.id,
            completed: false
          });
        }
      });
    }

    // Scenario preparation notifications
    if (settings.scenarioPrep) {
      weaves.filter(w => w.type === 'future' && !w.completed && w.scheduledFor).forEach(weave => {
        const daysUntilEvent = Math.ceil((weave.scheduledFor!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEvent <= 7 && daysUntilEvent > 0) {
          const prepTime = new Date(weave.scheduledFor!.getTime() - 24 * 60 * 60 * 1000);
          newSchedule.push({
            id: `scenario-prep-${weave.id}`,
            type: 'scenario_prep',
            title: 'Scenario Preparation',
            message: `Tomorrow: "${weave.title}" - Review your if-then plans`,
            scheduledFor: prepTime,
            weaveId: weave.id,
            completed: false
          });
        }
      });
    }

    // Daily memory moment reminders
    if (settings.dailyMoments) {
      const todayMoments = localStorage.getItem(`eidolon-daily-moments-${now.toDateString()}`);
      if (!todayMoments || JSON.parse(todayMoments).length === 0) {
        const eveningTime = new Date();
        eveningTime.setHours(19, 0, 0, 0);
        
        if (eveningTime > now) {
          newSchedule.push({
            id: 'daily-moment',
            type: 'daily_moment',
            title: 'Capture Today\'s Memory',
            message: 'What moment from today would you like to remember?',
            scheduledFor: eveningTime,
            completed: false
          });
        }
      }
    }

    setSchedule(newSchedule.slice(0, 10)); // Limit to 10 upcoming notifications
  };

  const getOptimalNotificationTime = (): Date => {
    // Analyze user's most active training times
    const sessionHours = retrievalSessions.map(s => s.startTime.getHours());
    
    if (sessionHours.length > 0) {
      // Find most common hour
      const hourCounts = sessionHours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const optimalHour = Object.entries(hourCounts).reduce((a, b) => 
        hourCounts[parseInt(a[0])] > hourCounts[parseInt(b[0])] ? a : b
      )[0];
      
      const optimalTime = new Date();
      optimalTime.setHours(parseInt(optimalHour), 0, 0, 0);
      
      // If that time has passed today, schedule for tomorrow
      if (optimalTime <= new Date()) {
        optimalTime.setDate(optimalTime.getDate() + 1);
      }
      
      return optimalTime;
    }
    
    // Default to 2 PM tomorrow
    const defaultTime = new Date();
    defaultTime.setDate(defaultTime.getDate() + 1);
    defaultTime.setHours(14, 0, 0, 0);
    return defaultTime;
  };

  const scheduleNotification = (notification: NotificationSchedule) => {
    if (permission !== 'granted') return;

    const timeUntilNotification = notification.scheduledFor.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: notification.id,
          requireInteraction: false,
          actions: [
            { action: 'open', title: 'Open App' },
            { action: 'dismiss', title: 'Later' }
          ]
        });
      }, Math.min(timeUntilNotification, 2147483647)); // Max setTimeout value
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Eidolon Test Notification', {
        body: 'Smart notifications are working perfectly! 🧠✨',
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  return {
    permission,
    settings,
    schedule,
    requestPermission,
    saveSettings,
    sendTestNotification,
    scheduleNotification
  };
};