import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Brain, Plus, Calendar, BarChart3, Settings, Home, TrendingUp, ArrowLeft } from 'lucide-react';
import IntelligentDashboard from './components/IntelligentDashboard';
import WeaveCanvas from './components/WeaveCanvas';
import RetrievalTrainer from './components/RetrievalTrainer';
import ScenarioStudio from './components/ScenarioStudio';
import InstallPrompt from './components/InstallPrompt';
import LegalFooter from './components/LegalFooter';
import ConsentBanner from './components/ConsentBanner';
import SettingsPanel from './components/SettingsPanel';
import { WeaveProvider } from './contexts/WeaveContext';
import { CognitiveStateProvider } from './contexts/CognitiveStateContext';
import { ChallengeProvider } from './contexts/ChallengeContext';
import MemoryInsights from './components/MemoryInsights';
import AdminDashboard from './components/AdminDashboard';
import AdminAuth from './components/AdminAuth';
import ADHDDashboard from './components/ADHDDashboard';
import { supabase } from './lib/supabase';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminDemoMode, setAdminDemoMode] = useState(false);

  const currentPath = location.pathname;
  
  // Debug logging
  console.log('App - Current path:', currentPath);

  // Check admin status
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    setCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setIsAuthenticated(true);
        
        // Check if user is admin, if not, make them admin automatically for demo
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('email', user.email)
          .single();
        
        if (error || !data) {
          // Auto-create admin user
          const { error: createError } = await supabase
            .from('admin_users')
            .insert({
              email: user.email,
              role: 'admin',
              permissions: { dashboard: true, analytics: true, users: true }
            });
          
          if (!createError) {
            setIsAdmin(true);
          }
        } else {
          setIsAdmin(true);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      // Not an admin or not authenticated
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    checkAdminStatus();
  };

  const InsightsPage = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
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

  // Admin route component
  const AdminRoute = () => {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
    }

    return <AdminDashboard />;
  };

  return (
    <CognitiveStateProvider>
      <WeaveProvider>
        <ChallengeProvider>
          <Routes>
            {/* Admin route - completely separate */}
            <Route path="/admin" element={<AdminRoute />} />
            
            {/* Main app routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                {/* Simplified Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                  <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold text-gray-900">Eidolon</h1>
                          <p className="text-sm text-gray-600">Intelligent Memory Companion</p>
                        </div>
                      </div>
                      
                      {/* Simplified Navigation */}
                      <nav className="hidden md:flex items-center space-x-1">
                        <button
                          onClick={() => navigate('/')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPath === '/'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Home className="w-4 h-4 inline mr-2" />
                          Home
                        </button>
                        <button
                          onClick={() => navigate('/insights')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPath === '/insights'
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
                            onClick={() => navigate('/admin')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPath === '/admin'
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
                  <Routes>
                    <Route path="/" element={<IntelligentDashboard onNavigate={(view) => navigate(`/${view}`)} />} />
                    <Route path="/weave" element={<WeaveCanvas onBack={() => navigate('/')} />} />
                    <Route path="/scenario" element={<ScenarioStudio onBack={() => navigate('/')} />} />
                    <Route path="/training" element={<RetrievalTrainer onBack={() => navigate('/')} />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/adhd" element={<ADHDDashboard onBack={() => navigate('/')} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              
              {/* Legal Footer */}
              <LegalFooter />

              {/* Mobile Navigation */}
                {/* Simplified Mobile Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                  <div className="flex items-center justify-around py-2">
                    {[
                      { path: '/', icon: Home, label: 'Home' },
                      { path: '/insights', icon: TrendingUp, label: 'Insights' },
                    ].map(({ path, icon: Icon, label }) => (
                      <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                          currentPath === path
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
            } />
          </Routes>
        </ChallengeProvider>
      </WeaveProvider>
    </CognitiveStateProvider>
  );
}

export default App;