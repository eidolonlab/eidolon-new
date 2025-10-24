import React from 'react';
import AppShell from '../components/AppShell';
import UserActivityAnalytics from '../components/UserActivityAnalytics';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

export default function InsightsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Insights</h1>
            <p className="text-slate-600">Sign in to view your analytics</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <UserActivityAnalytics />
      </div>
    </AppShell>
  );
}
