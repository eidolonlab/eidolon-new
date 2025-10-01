import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  user_hash: string;
  role: 'beta_tester' | 'regular_user' | 'admin' | 'developer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: Date;
  last_active: Date;
  beta_features: string[];
  feedback_count: number;
  session_count: number;
  avg_coherence_score: number;
  onboarding_completed: boolean;
  consent_analytics: boolean;
  consent_research: boolean;
  metadata: {
    signup_source?: string;
    referral_code?: string;
    device_info?: string;
    location?: string;
  };
}

export interface BetaFeature {
  id: string;
  name: string;
  description: string;
  enabled_for_roles: string[];
  enabled_for_users: string[];
  rollout_percentage: number;
  created_at: Date;
  status: 'development' | 'beta' | 'production' | 'deprecated';
}

export interface UserFeedback {
  id: string;
  user_id: string;
  feature_id?: string;
  type: 'bug' | 'feature_request' | 'general' | 'beta_feedback';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: Date;
  resolved_at?: Date;
  admin_response?: string;
}

interface UserManagementContextType {
  currentUser: User | null;
  users: User[];
  betaFeatures: BetaFeature[];
  userFeedback: UserFeedback[];
  isFeatureEnabled: (featureId: string) => boolean;
  inviteBetaUser: (email: string, features: string[]) => Promise<void>;
  updateUserRole: (userId: string, role: User['role']) => Promise<void>;
  submitFeedback: (feedback: Omit<UserFeedback, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  loadUsers: () => Promise<void>;
  loadBetaFeatures: () => Promise<void>;
  createBetaFeature: (feature: Omit<BetaFeature, 'id' | 'created_at'>) => Promise<void>;
  updateFeatureRollout: (featureId: string, percentage: number) => Promise<void>;
  getCurrentEnvironment: () => 'development' | 'staging' | 'production';
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};

export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [betaFeatures, setBetaFeatures] = useState<BetaFeature[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);

  useEffect(() => {
    initializeUser();
    loadBetaFeatures();
  }, []);

  const getCurrentEnvironment = (): 'development' | 'staging' | 'production' => {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'development';
    } else if (hostname.includes('staging')) {
      return 'staging';
    } else {
      return 'production';
    }
  };

  const initializeUser = async () => {
    try {
      // Check if user exists in localStorage
      const userHash = localStorage.getItem('eidolon-user-hash');
      if (userHash) {
        // Load user from database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_hash', userHash)
          .single();

        if (data && !error) {
          setCurrentUser({
            ...data,
            created_at: new Date(data.created_at),
            last_active: new Date(data.last_active),
            beta_features: data.beta_features || [],
            metadata: data.metadata || {}
          });
        }
      }
    } catch (error) {
      console.warn('Failed to initialize user:', error);
    }
  };

  const isFeatureEnabled = (featureId: string): boolean => {
    if (!currentUser) return false;

    const feature = betaFeatures.find(f => f.id === featureId);
    if (!feature) return false;

    // Check if feature is enabled for user's role
    if (feature.enabled_for_roles.includes(currentUser.role)) {
      return true;
    }

    // Check if feature is enabled for specific user
    if (feature.enabled_for_users.includes(currentUser.id)) {
      return true;
    }

    // Check rollout percentage
    if (feature.rollout_percentage > 0) {
      const userNumber = parseInt(currentUser.user_hash.slice(-4), 16);
      const threshold = (feature.rollout_percentage / 100) * 65535;
      return userNumber < threshold;
    }

    return false;
  };

  const inviteBetaUser = async (email: string, features: string[]) => {
    try {
      // Create invitation record
      const { data, error } = await supabase
        .from('beta_invitations')
        .insert({
          email,
          invited_by: currentUser?.id,
          features,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send invitation email (would integrate with email service)
      console.log('Beta invitation sent to:', email, 'for features:', features);
      
      return data;
    } catch (error) {
      console.error('Failed to invite beta user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: User['role']) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role, last_active: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  };

  const submitFeedback = async (feedback: Omit<UserFeedback, 'id' | 'user_id' | 'created_at'>) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .insert({
          ...feedback,
          user_id: currentUser.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setUserFeedback(prev => [data, ...prev]);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        ...user,
        created_at: new Date(user.created_at),
        last_active: new Date(user.last_active),
        beta_features: user.beta_features || [],
        metadata: user.metadata || {}
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadBetaFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('beta_features')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, create sample features
        const sampleFeatures: BetaFeature[] = [
          {
            id: 'story-graph',
            name: 'StoryGraph',
            description: 'Visual knowledge map of people, places, projects & promises',
            enabled_for_roles: ['beta_tester', 'admin'],
            enabled_for_users: [],
            rollout_percentage: 0,
            created_at: new Date(),
            status: 'beta'
          },
          {
            id: 'voice-interface',
            name: 'Voice Memory Interface',
            description: 'Speak your memories with emotional analysis',
            enabled_for_roles: ['admin'],
            enabled_for_users: [],
            rollout_percentage: 0,
            created_at: new Date(),
            status: 'development'
          },
          {
            id: 'biometric-integration',
            name: 'Biometric Integration',
            description: 'Heart rate and stress monitoring during training',
            enabled_for_roles: [],
            enabled_for_users: [],
            rollout_percentage: 0,
            created_at: new Date(),
            status: 'development'
          }
        ];
        setBetaFeatures(sampleFeatures);
        return;
      }

      const formattedFeatures = data.map(feature => ({
        ...feature,
        created_at: new Date(feature.created_at)
      }));

      setBetaFeatures(formattedFeatures);
    } catch (error) {
      console.error('Failed to load beta features:', error);
    }
  };

  const createBetaFeature = async (feature: Omit<BetaFeature, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('beta_features')
        .insert({
          ...feature,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setBetaFeatures(prev => [data, ...prev]);
    } catch (error) {
      console.error('Failed to create beta feature:', error);
      throw error;
    }
  };

  const updateFeatureRollout = async (featureId: string, percentage: number) => {
    try {
      const { error } = await supabase
        .from('beta_features')
        .update({ rollout_percentage: percentage })
        .eq('id', featureId);

      if (error) throw error;

      setBetaFeatures(prev => prev.map(feature =>
        feature.id === featureId ? { ...feature, rollout_percentage: percentage } : feature
      ));
    } catch (error) {
      console.error('Failed to update feature rollout:', error);
      throw error;
    }
  };

  return (
    <UserManagementContext.Provider value={{
      currentUser,
      users,
      betaFeatures,
      userFeedback,
      isFeatureEnabled,
      inviteBetaUser,
      updateUserRole,
      submitFeedback,
      loadUsers,
      loadBetaFeatures,
      createBetaFeature,
      updateFeatureRollout,
      getCurrentEnvironment
    }}>
      {children}
    </UserManagementContext.Provider>
  );
};