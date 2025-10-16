import React from 'react';
import AppShell from '../components/AppShell';
import FocusCenterHome from '../components/adhd/FocusCenterHome';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

export default function FocusPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Eidolon</h1>
            <p className="text-slate-600">Sign in to start your ADHD-focused journey</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FocusCenterHome />
    </AppShell>
  );
}
