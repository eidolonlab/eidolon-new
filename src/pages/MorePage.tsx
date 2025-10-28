import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import { Settings, FileText, Shield, HelpCircle, LogOut, User, Brain, Calendar, Zap } from 'lucide-react';

export default function MorePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">More Options</h1>
            <p className="text-slate-600">Sign in to access all features</p>
          </div>
          <AuthForm />
        </div>
      </AppShell>
    );
  }

  const menuItems = [
    {
      icon: Brain,
      label: 'Memory Weave',
      description: 'Create narrative memories',
      route: '/weave',
      color: 'text-violet-600'
    },
    {
      icon: Calendar,
      label: 'Scenario Planner',
      description: 'Plan future scenarios',
      route: '/scenarios',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      label: 'Memory Training',
      description: 'Improve recall skills',
      route: '/training',
      color: 'text-amber-600'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
      route: '/settings',
      color: 'text-slate-600'
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      description: 'Your data protection',
      onClick: () => window.open('/privacy-policy.html', '_blank'),
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      label: 'Terms of Service',
      description: 'Usage terms',
      onClick: () => window.open('/terms-of-service.html', '_blank'),
      color: 'text-slate-600'
    }
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">More</h1>
          <p className="text-slate-600">Additional features and settings</p>
        </div>

        {/* User Info Card */}
        <div className="mb-6 bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                {user.email}
              </div>
              <div className="text-sm text-slate-600">Signed in</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full bg-white rounded-xl border border-slate-200 p-4 hover:border-violet-300 hover:shadow-md transition-all flex items-center gap-4 text-left"
            >
              <div className={`${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-sm text-slate-600">{item.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full bg-red-50 text-red-700 rounded-xl border border-red-200 p-4 hover:bg-red-100 transition-all flex items-center justify-center gap-2 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>

        <div className="mt-8 text-center text-xs text-slate-500">
          Eidolon v1.0 - ADHD Focus Support
        </div>
      </div>
    </AppShell>
  );
}
