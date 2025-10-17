import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Heart,
  Trophy,
  FileText,
  Shield,
  LogOut,
  Settings,
  Laptop
} from 'lucide-react';
import AppShell from '../components/AppShell';
import SimpleDisclaimer from '../components/SimpleDisclaimer';
import { useAuth } from '../contexts/AuthContext';

const sections = [
  {
    title: 'Memory & Planning',
    items: [
      { label: 'Memory Weaving', href: '/weave', icon: Sparkles, description: 'Build context-rich memories' },
      { label: 'Future Scenarios', href: '/scenarios', icon: Calendar, description: 'Rehearse upcoming situations' },
      { label: 'Memory Training', href: '/memory-training', icon: Trophy, description: 'Strengthen recall skills' }
    ]
  },
  {
    title: 'Wellbeing Tools',
    items: [
      { label: 'Cognitive Regulation', href: '/cognitive-regulation', icon: Heart, description: 'Emotional balance tools' },
      { label: 'Meaningful Wins', href: '/wins', icon: Trophy, description: 'Celebrate your progress' }
    ]
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Developer Dashboard', href: '/developer', icon: Laptop, description: 'Feature flags & testing' },
      { label: 'Settings', href: '/settings', icon: Settings, description: 'App preferences' }
    ]
  },
  {
    title: 'Legal & Support',
    items: [
      { label: 'User Guide', href: '/user-guide.html', icon: FileText, description: 'How to use Eidolon', external: true },
      { label: 'Privacy Policy', href: '/privacy-policy.html', icon: Shield, description: 'Your data is private', external: true },
      { label: 'Terms of Service', href: '/terms-of-service.html', icon: FileText, description: 'Usage terms', external: true }
    ]
  }
];

export default function MorePage() {
  const { user, signOut } = useAuth();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">More</h1>
          <p className="text-slate-600 text-sm mt-1">
            Access all Eidolon features and settings
          </p>
        </div>

        {user && (
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Signed in as</div>
                <div className="font-medium text-slate-900">{user.email}</div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {section.items.map((item) => {
                const Icon = item.icon;
                const Component = item.external ? 'a' : Link;
                const props = item.external
                  ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                  : { to: item.href };

                return (
                  <Component
                    key={item.label}
                    {...props}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="p-2 rounded-xl bg-slate-100">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-slate-400">→</div>
                  </Component>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-slate-100 rounded-2xl p-5 text-center">
          <div className="text-xs text-slate-600">
            Eidolon v1.0 • ADHD Focus Edition
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Made with care for neurodivergent minds
          </div>
        </div>

        <SimpleDisclaimer />
      </div>
    </AppShell>
  );
}
