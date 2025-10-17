import { Capacitor } from '@capacitor/core';

export interface QuickAction {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

export type QuickActionHandler = (actionId: string) => void;

class QuickActionsService {
  private handler: QuickActionHandler | null = null;

  async setupQuickActions(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    console.log('Quick actions setup - native platform detected');
  }

  setHandler(handler: QuickActionHandler): void {
    this.handler = handler;
  }

  private triggerAction(actionId: string): void {
    if (this.handler) {
      this.handler(actionId);
    }
  }
}

export const quickActionsService = new QuickActionsService();
