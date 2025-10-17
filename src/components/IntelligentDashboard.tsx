import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Sparkles, Calendar, Target, Brain, ChevronDown, ChevronUp, Search } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { useCognitiveState } from '../contexts/CognitiveStateContext';
import { useWeave } from '../contexts/WeaveContext';
import AdaptiveMemoryCapture from './AdaptiveMemoryCapture';
import MemoryRetrievalGuide from './MemoryRetrievalGuide';
import SmartScenarioPlanner from './SmartScenarioPlanner';
import IntelligentTrainingCoach from './IntelligentTrainingCoach';

interface IntelligentDashboardProps {
  onNavigate: (view: 'weave' | 'scenario' | 'training' | 'insights' | 'adhd' | 'more') => void;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({ onNavigate }) => {
  const { cognitiveState, userPattern } = useCognitiveState();
  const { weaves } = useWeave();
  const [focusedActivity, setFocusedActivity] = useState<string | null>(null);
  const [showMoreTools, setShowMoreTools] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const upcomingScenarios = weaves
    .filter(w => w.type === 'future' && !w.completed && w.scheduledFor)
    .sort((a, b) => (a.scheduledFor!.getTime() - b.scheduledFor!.getTime()))
    .slice(0, 3);

  const memoriesThisWeek = weaves.filter(w => {
    if (!w.timestamp) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return w.timestamp > weekAgo;
  }).length;

  if (focusedActivity === 'capture') {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <AdaptiveMemoryCapture
            cognitiveState={cognitiveState}
            onComplete={() => setFocusedActivity(null)}
          />
        </div>
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'retrieve') {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <MemoryRetrievalGuide
            cognitiveState={cognitiveState}
            onMemoryRetrieved={() => setFocusedActivity(null)}
            onCreateWeave={() => onNavigate('weave')}
          />
        </div>
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'plan') {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <SmartScenarioPlanner
            cognitiveState={cognitiveState}
            upcomingEvents={upcomingScenarios}
            onComplete={() => setFocusedActivity(null)}
          />
        </div>
      </ErrorBoundary>
    );
  }

  if (focusedActivity === 'train') {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <button
            onClick={() => setFocusedActivity(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <IntelligentTrainingCoach
            cognitiveState={cognitiveState}
            userPattern={userPattern}
            onComplete={() => setFocusedActivity(null)}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6 pb-8">
        <button
          onClick={() => onNavigate('more')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">More</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Cognitive Tools</h1>
          <p className="text-gray-600">Quick memory capture and advanced features</p>
        </div>

        <button
          onClick={() => setFocusedActivity('capture')}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-8 rounded-2xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="text-white text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
              10 seconds
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Quick Memory Capture</h3>
          <p className="text-teal-100 text-lg">
            Save something important right now
          </p>
        </button>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Your Memory Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">{memoriesThisWeek}</div>
              <div className="text-sm text-gray-600">Memories this week</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{weaves.length}</div>
              <div className="text-sm text-gray-600">Total memories</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowMoreTools(!showMoreTools)}
          className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 p-4 rounded-xl transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">More Memory Tools</span>
          </div>
          {showMoreTools ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {showMoreTools && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <button
              onClick={() => onNavigate('weave')}
              className="w-full bg-white border border-gray-200 hover:border-teal-300 hover:bg-teal-50 p-6 rounded-xl transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Memory Weaving</h4>
              </div>
              <p className="text-gray-600 text-sm ml-13">
                Create rich, multi-sensory memories with guided encoding
              </p>
            </button>

            <button
              onClick={() => setFocusedActivity('plan')}
              className="w-full bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 p-6 rounded-xl transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Scenario Planning</h4>
              </div>
              <p className="text-gray-600 text-sm ml-13">
                Rehearse future events with mental simulation
              </p>
            </button>

            <button
              onClick={() => setFocusedActivity('retrieve')}
              className="w-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 p-6 rounded-xl transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Memory Retrieval</h4>
              </div>
              <p className="text-gray-600 text-sm ml-13">
                Recover past experiences with guided cues
              </p>
            </button>

            <button
              onClick={() => setFocusedActivity('train')}
              className="w-full bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 p-6 rounded-xl transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Memory Training</h4>
              </div>
              <p className="text-gray-600 text-sm ml-13">
                Strengthen recall with spaced practice exercises
              </p>
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default IntelligentDashboard;