import { Capacitor } from '@capacitor/core';
import { quickActionsService } from './quickActions';
import { shareIntegrationService } from './shareIntegration';
import { smartNotificationsService } from './smartNotifications';

export async function initializeAppIntegrations(userId?: string) {
  if (!Capacitor.isNativePlatform()) {
    console.log('Running in web mode, some integrations may be limited');
  }

  try {
    await quickActionsService.setupQuickActions();
    console.log('✓ Quick actions initialized');
  } catch (error) {
    console.warn('Quick actions setup failed:', error);
  }

  try {
    await shareIntegrationService.setupShareTarget();
    console.log('✓ Share integration initialized');
  } catch (error) {
    console.warn('Share integration setup failed:', error);
  }

  if (userId) {
    try {
      const granted = await smartNotificationsService.requestPermission();
      if (granted) {
        await smartNotificationsService.scheduleFocusReminder(userId);
        await smartNotificationsService.scheduleStreakReminder(userId);
        console.log('✓ Smart notifications initialized');
      }
    } catch (error) {
      console.warn('Notifications setup failed:', error);
    }
  }
}

export function setupQuickActionHandlers(handlers: {
  onStartFocus25: () => void;
  onStartFocus45: () => void;
  onQuickMemory: () => void;
  onViewStreak: () => void;
}) {
  quickActionsService.setHandler((actionId) => {
    switch (actionId) {
      case 'start-focus-25':
        handlers.onStartFocus25();
        break;
      case 'start-focus-45':
        handlers.onStartFocus45();
        break;
      case 'quick-memory':
        handlers.onQuickMemory();
        break;
      case 'view-streak':
        handlers.onViewStreak();
        break;
    }
  });
}

export function setupShareHandler(handler: (data: { title?: string; text?: string; url?: string }) => Promise<void>) {
  shareIntegrationService.setHandler(handler);
}
