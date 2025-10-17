import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import BottomNav from './BottomNav';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/focus')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Eidolon</div>
              <div className="text-xs text-slate-500">ADHD Focus Companion</div>
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
