import React, { useState } from 'react';
import AppShell from '../components/AppShell';
import QuickTrainingStart from '../components/training/QuickTrainingStart';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

export default function TrainPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Training Center</h1>
            <p className="text-slate-600">Sign in to access training exercises</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <QuickTrainingStart />
    </AppShell>
  );
}
