import { Capacitor } from '@capacitor/core';
import { smartPatternsService } from './smartPatterns';

export interface NotificationOptions {
  title: string;
  body: string;
  id: number;
  schedule?: {
    at: Date;
  };
  actionTypeId?: string;
  extra?: Record<string, any>;
}

class SmartNotificationsService {
  private permissionGranted = false;

  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        this.permissionGranted = permission === 'granted';
        return this.permissionGranted;
      }
      return false;
    }

    console.log('Notifications setup - native platform detected');
    return false;
  }

  async scheduleStreakReminder(userId: string): Promise<void> {
    if (!this.permissionGranted) {
      return;
    }

    const shouldRemind = await smartPatternsService.shouldSendStreakReminder(userId);
    if (!shouldRemind) {
      return;
    }

    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0);

    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    await this.scheduleNotification({
      id: 1,
      title: "Keep your streak alive!",
      body: "Quick tap to complete today's focus session",
      schedule: { at: reminderTime },
      actionTypeId: 'STREAK_REMINDER',
      extra: { action: 'start-focus' },
    });
  }

  async scheduleFocusReminder(userId: string): Promise<void> {
    if (!this.permissionGranted) {
      return;
    }

    const patterns = await smartPatternsService.getUserPatterns(userId);
    if (!patterns || patterns.preferredFocusTimes.length === 0) {
      return;
    }

    const nextFocusHour = patterns.preferredFocusTimes[0];
    const reminderTime = new Date();
    reminderTime.setHours(nextFocusHour, 0, 0, 0);

    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    await this.scheduleNotification({
      id: 2,
      title: "Your focus time",
      body: `You usually focus around this time. Ready for a ${patterns.averageSessionDuration}min session?`,
      schedule: { at: reminderTime },
      actionTypeId: 'FOCUS_REMINDER',
      extra: { action: 'start-focus', duration: patterns.averageSessionDuration },
    });
  }

  async sendInstantNotification(title: string, body: string): Promise<void> {
    if (!this.permissionGranted) {
      return;
    }

    await this.scheduleNotification({
      id: Date.now(),
      title,
      body,
      actionTypeId: 'INSTANT',
    });
  }

  private async scheduleNotification(options: NotificationOptions): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window && this.permissionGranted) {
        new Notification(options.title, {
          body: options.body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }
      return;
    }

    console.log('Notification scheduled (native):', options.title);
  }

  async cancelAllNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    console.log('Notifications cancelled (native)');
  }
}

export const smartNotificationsService = new SmartNotificationsService();
