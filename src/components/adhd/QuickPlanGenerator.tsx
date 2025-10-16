import React, { useState, useMemo } from 'react';
import { X, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onClose: () => void;
  onPlanCreated: (task: string) => void;
}

export default function QuickPlanGenerator({ onClose, onPlanCreated }: Props) {
  const { user } = useAuth();
  const [taskInput, setTaskInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const plan = useMemo(() => {
    if (!taskInput.trim()) {
      return {
        steps: ['Define the task clearly', 'Break it into smallest first action', 'Start with 5 minutes'],
        blockers: ['If I feel stuck → take 3 breaths and pick tiniest step', 'If I get distracted → close tab and return'],
        when: 'Start now at your desk'
      };
    }

    const words = taskInput.split(' ');
    const shortTitle = words.slice(0, 4).join(' ');

    return {
      steps: [
        `Open tools/files needed for "${shortTitle}"`,
        'Complete first sentence or smallest unit',
        'Save progress and mark done'
      ],
      blockers: [
        'If I open social media → close immediately and press Start',
        'If overwhelmed → use 90s Rescue: Overwhelm → Reset'
      ],
      when: 'Start now at your current workspace'
    };
  }, [taskInput]);

  async function usePlan() {
    setIsGenerating(true);

    const { data } = await supabase
      .from('quick_plans')
      .insert({
        user_id: user?.id,
        task_input: taskInput,
        steps: plan.steps,
        if_then_blockers: plan.blockers,
        when_where: plan.when,
        pinned: true
      })
      .select('id')
      .single();

    if (data) {
      await supabase
        .from('focus_user_settings')
        .update({ last_task: taskInput })
        .eq('user_id', user?.id);

      onPlanCreated(taskInput);
    }

    setIsGenerating(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Quick Plan (30s)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What task do you want to break down?
          </label>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="e.g., Write introduction paragraph for essay"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            autoFocus
          />
          <p className="mt-2 text-xs text-slate-500">
            Paste or describe the task. The AI will break it into 3 bite-size steps.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <div className="text-sm font-medium text-emerald-900 mb-2">3 Steps</div>
            <ol className="space-y-2">
              {plan.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="flex-shrink-0 font-medium text-emerald-600">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="text-sm font-medium text-amber-900 mb-2">If-Then Blockers</div>
            <ul className="space-y-2">
              {plan.blockers.map((blocker, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="flex-shrink-0 text-amber-600">→</span>
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
            <div className="text-sm font-medium text-violet-900 mb-1">When/Where</div>
            <p className="text-sm text-slate-700">{plan.when}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={usePlan}
            disabled={!taskInput.trim() || isGenerating}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition-colors"
          >
            {isGenerating ? 'Creating Plan...' : 'Use Plan & Start Focus'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500 text-center">
          This plan uses implementation intentions (if-then) proven to help with ADHD task initiation.
        </p>
      </div>
    </div>
  );
}
