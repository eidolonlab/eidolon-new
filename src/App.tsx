import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Brain, Plus, Calendar, BarChart3, Settings, Home, TrendingUp, ArrowLeft } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import OfflineDetector from './components/OfflineDetector';
import OnboardingFlow from './components/OnboardingFlow';
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const currentPath = location.pathname;
  
  const checkAdminStatus = React.useCallback(async () => {
    // Only check admin status if we're on the admin route
    if (!currentPath.startsWith('/admin')) {
      setCheckingAuth(false);
      return;
    }

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
      console.warn('Admin check failed:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  }, [currentPath]);

  // Check if user needs onboarding
  useEffect(() => {
    try {
      const hasCompletedOnboarding = localStorage.getItem('eidolon-onboarding-complete');
      const hasExistingData = localStorage.getItem('eidolon-weaves');
      
      if (!hasCompletedOnboarding && !hasExistingData) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.warn('LocalStorage check failed:', error);
      // Continue without onboarding if localStorage fails
    }
    
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Check admin status
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  // Show loading screen on initial load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Eidolon</h1>
          <p className="text-gray-600 mb-6">Evidence-Based Memory Training</p>
          <LoadingSpinner variant="dots" message="Initializing your memory training environment..." />
        </div>
      </div>
    );
  }

  // Show onboarding flow
  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingFlow
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      </ErrorBoundary>
    );
  }

  const handleAuthSuccess = React.useCallback(() => {
    setIsAuthenticated(true);
    checkAdminStatus();
  }, [checkAdminStatus]);

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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Eidolon</h1>
            <p className="text-sm text-gray-600">Evidence-Based Memory Training</p>
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
    <ErrorBoundary>
      <CognitiveStateProvider>
        <WeaveProvider>
          <ChallengeProvider>
            <OfflineDetector />
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
                            <p className="text-sm text-gray-600">Memory Training & Recall</p>
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
                  <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen" role="main">
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
    </ErrorBoundary>
  );
}

export default App;