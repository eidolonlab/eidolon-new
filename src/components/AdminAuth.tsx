import React, { useState } from 'react';
import { Shield, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up new admin user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/admin'
          }
        });

        if (signUpError) throw signUpError;

        // Check if email confirmation is required
        if (data.user && !data.session) {
          setError('Please check your email to confirm your account before signing in. If you don\'t see the email, check your spam folder.');
          setIsSignUp(false);
          return;
        }

        if (data.user && data.session) {
          // User is auto-confirmed, add to admin_users table
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              email: data.user.email,
              role: 'admin',
              permissions: { dashboard: true, analytics: true, users: true }
            });

          if (adminError) {
            console.error('Admin user creation failed:', adminError);
            throw new Error('Failed to create admin account. Please contact support.');
          }

          alert('Admin account created successfully! Signing you in...');
          onAuthSuccess();
        }
      } else {
        // Sign in existing admin
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (!signInData.session) {
          throw new Error('Please confirm your email before signing in.');
        }

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', email)
          .maybeSingle();

        if (!adminData) {
          // If admin check fails, create admin user automatically
          const { error: createError } = await supabase
            .from('admin_users')
            .insert({
              email: email,
              role: 'admin',
              permissions: { dashboard: true, analytics: true, users: true }
            });

          if (createError) {
            console.error('Could not create admin user:', createError);
            throw new Error('Failed to create admin record. Please try again.');
          }
        }

        onAuthSuccess();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Create admin account' : 'Sign in to admin dashboard'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isSignUp ? 'Create Admin Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need to create an admin account?'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-xs font-semibold mb-2">
            Setup Instructions:
          </p>
          <ol className="text-blue-800 text-xs space-y-1 list-decimal list-inside">
            <li>Click "Need to create an admin account?" below</li>
            <li>Enter your email and password (6+ characters)</li>
            <li>Click "Create Admin Account"</li>
            <li>Check your email for confirmation link (if required)</li>
            <li>Return here and sign in</li>
          </ol>
          <p className="text-blue-800 text-xs mt-2">
            <strong>Note:</strong> If email confirmation is enabled in Supabase, you'll need to confirm your email before signing in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;