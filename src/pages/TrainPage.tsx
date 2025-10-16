import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Eye, Zap, Heart, Timer } from 'lucide-react';
import AppShell from '../components/AppShell';

const trainingModules = [
  {
    title: 'Working Memory',
    description: 'Span builder starting at 3 digits',
    icon: Brain,
    href: '/adhd-focus-trainer',
    color: 'violet'
  },
  {
    title: 'Sustained Attention',
    description: 'Increase focus duration gradually',
    icon: Eye,
    href: '/attention-rescue',
    color: 'blue'
  },
  {
    title: 'Executive Function',
    description: 'Plan, prioritize, and execute',
    icon: Zap,
    href: '/cognitive-state',
    color: 'emerald'
  },
  {
    title: 'Coherence Training',
    description: 'Heart-rate variability for regulation',
    icon: Heart,
    href: '/working-memory-trainer',
    color: 'rose'
  },
  {
    title: 'Micro-Attention',
    description: '30-120 second focus drills',
    icon: Timer,
    href: '/micro-attention',
    color: 'amber'
  }
];

export default function TrainPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Training Modules</h1>
          <p className="text-slate-600 text-sm mt-1">
            Evidence-based exercises to build your cognitive fitness
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {trainingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                to={module.href}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-${module.color}-100 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-slate-600">{module.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-violet-50 rounded-2xl border border-violet-100 p-5">
          <h2 className="font-medium text-slate-900 mb-2">How Training Works</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-violet-600">•</span>
              <span>Start at your baseline and progress gradually</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">•</span>
              <span>Practice 5-10 minutes daily for best results</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-600">•</span>
              <span>Combine with Focus sessions for maximum impact</span>
            </li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
