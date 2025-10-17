import { Capacitor } from '@capacitor/core';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export type ShareHandler = (data: ShareData) => Promise<void>;

class ShareIntegrationService {
  private handler: ShareHandler | null = null;

  async setupShareTarget(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      this.setupWebShareTarget();
      return;
    }

    console.log('Share integration setup - native platform detected');
  }

  private setupWebShareTarget(): void {
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (launchParams.targetURL) {
          const url = new URL(launchParams.targetURL);
          const shareData: ShareData = {
            title: url.searchParams.get('title') || undefined,
            text: url.searchParams.get('text') || undefined,
            url: url.searchParams.get('url') || undefined,
          };

          await this.handleShare(shareData);
        }
      });
    }
  }

  setHandler(handler: ShareHandler): void {
    this.handler = handler;
  }

  private async handleShare(data: ShareData): Promise<void> {
    if (this.handler) {
      await this.handler(data);
    }
  }

  async shareContent(data: ShareData): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });
        return true;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.warn('Share failed:', error);
        }
        return false;
      }
    }
    return false;
  }
}

export const shareIntegrationService = new ShareIntegrationService();
