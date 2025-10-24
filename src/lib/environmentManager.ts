// Environment management for development/production

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  name: Environment;
  url: string;
  isActive: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export function getCurrentEnvironment(): Environment {
  const host = window.location.hostname;

  if (host === 'localhost' || host === '127.0.0.1') {
    return 'development';
  }

  if (host.includes('staging')) {
    return 'staging';
  }

  return 'production';
}

export function isProduction() {
  return getCurrentEnvironment() === 'production';
}

export function isDevelopment() {
  return getCurrentEnvironment() === 'development';
}

class EnvironmentManager {
  async getAvailableEnvironments(): Promise<EnvironmentConfig[]> {
    return [
      { name: 'development', url: 'http://localhost:5173', isActive: isDevelopment() },
      { name: 'staging', url: 'https://staging.example.com', isActive: false },
      { name: 'production', url: 'https://example.com', isActive: isProduction() }
    ];
  }

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return [];
  }

  async toggleFeatureFlag(flagId: string, enabled: boolean): Promise<void> {
    console.log('Toggle feature flag:', flagId, enabled);
  }

  async switchEnvironment(env: Environment): Promise<void> {
    console.log('Switch environment:', env);
  }
}

export const environmentManager = new EnvironmentManager();
