import { supabase } from './supabase';

export type Environment = 'dev' | 'staging' | 'production';

export interface EnvironmentConfig {
  id: string;
  name: Environment;
  display_name: string;
  is_active: boolean;
  config: {
    description: string;
    auto_sync?: boolean;
    require_approval?: boolean;
    public_access?: boolean;
  };
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  environment: string;
  ip_address?: string;
  user_agent?: string;
  session_duration_ms?: number;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  flag_key: string;
  name: string;
  description?: string;
  enabled_environments: string[];
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

class EnvironmentManager {
  private currentEnvironment: Environment = 'production';

  constructor() {
    // Load environment from localStorage or default to production
    const stored = localStorage.getItem('app_environment');
    if (stored && ['dev', 'staging', 'production'].includes(stored)) {
      this.currentEnvironment = stored as Environment;
    }
  }

  getCurrentEnvironment(): Environment {
    return this.currentEnvironment;
  }

  async setEnvironment(env: Environment): Promise<void> {
    // Check if user has access to this environment
    const hasAccess = await this.checkEnvironmentAccess(env);
    if (!hasAccess) {
      throw new Error(`Access denied to ${env} environment`);
    }

    this.currentEnvironment = env;
    localStorage.setItem('app_environment', env);

    // Track environment switch
    await this.trackActivity('environment_switched', {
      from: this.currentEnvironment,
      to: env
    });
  }

  async checkEnvironmentAccess(env: Environment): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return env === 'production'; // Only production is public

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', user.email)
        .single();

      if (adminData?.role === 'admin') return true;

      // Check environment access table
      const { data: envData } = await supabase
        .from('environments')
        .select('id, config')
        .eq('name', env)
        .single();

      if (!envData) return false;

      // Production is public
      if (envData.config?.public_access) return true;

      // Check explicit access grant
      const { data: accessData } = await supabase
        .from('environment_access')
        .select('access_level')
        .eq('user_id', user.id)
        .eq('environment_id', envData.id)
        .single();

      return !!accessData;
    } catch (error) {
      console.error('Error checking environment access:', error);
      return false;
    }
  }

  async getAvailableEnvironments(): Promise<EnvironmentConfig[]> {
    try {
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Filter by access
      const accessible: EnvironmentConfig[] = [];
      for (const env of data || []) {
        if (await this.checkEnvironmentAccess(env.name as Environment)) {
          accessible.push(env);
        }
      }

      return accessible;
    } catch (error) {
      console.error('Error fetching environments:', error);
      return [];
    }
  }

  async trackActivity(
    activityType: string,
    activityData: Record<string, unknown> = {},
    sessionDuration?: number
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user agent and approximate IP (Supabase doesn't expose real IP)
      const userAgent = navigator.userAgent;

      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData,
        environment: this.currentEnvironment,
        user_agent: userAgent,
        session_duration_ms: sessionDuration || 0
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  async getUserActivities(
    userId?: string,
    limit: number = 100
  ): Promise<UserActivity[]> {
    try {
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      return [];
    }
  }

  async isFeatureEnabled(flagKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('enabled_environments')
        .eq('flag_key', flagKey)
        .single();

      if (error || !data) return false;

      return data.enabled_environments.includes(this.currentEnvironment);
    } catch (error) {
      console.error('Error checking feature flag:', error);
      return false;
    }
  }

  async updateFeatureFlag(
    flagKey: string,
    enabledEnvironments: string[]
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({
          enabled_environments: enabledEnvironments,
          updated_at: new Date().toISOString()
        })
        .eq('flag_key', flagKey);

      if (error) throw error;

      await this.trackActivity('feature_flag_updated', {
        flag_key: flagKey,
        enabled_environments: enabledEnvironments
      });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      throw error;
    }
  }

  async grantEnvironmentAccess(
    userId: string,
    environmentName: Environment,
    accessLevel: 'viewer' | 'editor' | 'admin'
  ): Promise<void> {
    try {
      // Get environment ID
      const { data: envData, error: envError } = await supabase
        .from('environments')
        .select('id')
        .eq('name', environmentName)
        .single();

      if (envError || !envData) throw new Error('Environment not found');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Grant access
      const { error } = await supabase
        .from('environment_access')
        .upsert({
          user_id: userId,
          environment_id: envData.id,
          access_level: accessLevel,
          granted_by: user.id
        });

      if (error) throw error;

      await this.trackActivity('access_granted', {
        target_user: userId,
        environment: environmentName,
        access_level: accessLevel
      });
    } catch (error) {
      console.error('Error granting access:', error);
      throw error;
    }
  }

  async revokeEnvironmentAccess(
    userId: string,
    environmentName: Environment
  ): Promise<void> {
    try {
      // Get environment ID
      const { data: envData, error: envError } = await supabase
        .from('environments')
        .select('id')
        .eq('name', environmentName)
        .single();

      if (envError || !envData) throw new Error('Environment not found');

      const { error } = await supabase
        .from('environment_access')
        .delete()
        .eq('user_id', userId)
        .eq('environment_id', envData.id);

      if (error) throw error;

      await this.trackActivity('access_revoked', {
        target_user: userId,
        environment: environmentName
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      throw error;
    }
  }
}

export const environmentManager = new EnvironmentManager();
