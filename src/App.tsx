import React, { useState, useEffect } from 'react';
import { Brain, Plus, Calendar, BarChart3, Settings, Home, TrendingUp, ArrowLeft } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WeaveCanvas from './components/WeaveCanvas';
import RetrievalTrainer from './components/RetrievalTrainer';
import ScenarioStudio from './components/ScenarioStudio';
import InstallPrompt from './components/InstallPrompt';
import LegalFooter from './components/LegalFooter';
import ConsentBanner from './components/ConsentBanner';
import SettingsPanel from './components/SettingsPanel';
import { WeaveProvider } from './contexts/WeaveContext';
import MemoryInsights from './components/MemoryInsights';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './lib/supabase';

type View = 'dashboard' | 'weave' | 'scenario' | 'retrieval' | 'insights' | 'settings' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', user.email)
          .single();
        
        setIsAdmin(!!data);
      }
    } catch (error) {
      // Not an admin or not authenticated
      setIsAdmin(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'weave':
        return <WeaveCanvas onBack={() => setCurrentView('dashboard')} />;
      case 'scenario':
        return <ScenarioStudio onBack={() => setCurrentView('dashboard')} />;
      case 'retrieval':
        return <RetrievalTrainer onBack={() => setCurrentView('dashboard')} />;
      case 'insights':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Memory Insights</h1>
            </div>
            <MemoryInsights />
          </div>
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <WeaveProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Eidolon</h1>
                  <p className="text-sm text-gray-600">Memory Training & Recall</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('weave')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'weave'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Weave
                </button>
                <button
                  onClick={() => setCurrentView('scenario')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'scenario'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Scenarios
                </button>
                <button
                  onClick={() => setCurrentView('retrieval')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'retrieval'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Training
                </button>
                <button
                  onClick={() => setCurrentView('insights')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'insights'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Insights
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showSettings
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    <span>Admin</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {renderView()}
        </main>
        
        {/* Legal Footer */}
        <LegalFooter />

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Home' },
              { id: 'weave', icon: Plus, label: 'Weave' },
              { id: 'scenario', icon: Calendar, label: 'Future' },
              { id: 'retrieval', icon: BarChart3, label: 'Train' },
              { id: 'insights', icon: TrendingUp, label: 'Insights' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as View)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  currentView === id
                    ? 'text-indigo-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </nav>
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
        
        {/* Consent Banner */}
        <ConsentBanner />
        
        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </div>
    </WeaveProvider>
  );
}

export default App;