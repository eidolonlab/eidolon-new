import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Dumbbell, Zap, BarChart3, Menu } from 'lucide-react';

const tabs = [
  { to: '/focus', label: 'Focus', Icon: Brain },
  { to: '/train', label: 'Train', Icon: Dumbbell },
  { to: '/boosts', label: 'Boosts', Icon: Zap },
  { to: '/insights', label: 'Insights', Icon: BarChart3 },
  { to: '/more', label: 'More', Icon: Menu },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur safe-area-inset-bottom">
      <div className="mx-auto max-w-5xl grid grid-cols-5">
        {tabs.map(({ to, label, Icon }) => {
          const active = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center py-3 text-xs transition-colors ${
                active ? 'text-violet-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? 'fill-violet-100' : ''}`} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
