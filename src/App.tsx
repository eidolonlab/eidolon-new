import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Brain, Plus, Calendar, BarChart3, Settings, Home, TrendingUp, ArrowLeft, LogIn, User } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
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
import MemoryInsights from './components/MemoryInsights';
import AdminDashboard from './components/AdminDashboard';
import AdminAuth from './components/AdminAuth';
import ADHDDashboard from './components/ADHDDashboard';
import FocusPage from './pages/FocusPage';
import TrainPage from './pages/TrainPage';
import ADHDInsightsPage from './pages/InsightsPage';
import MorePage from './pages/MorePage';
import { UserManagementProvider } from './contexts/UserManagementContext';
import { CognitiveStateProvider } from './contexts/CognitiveStateContext';
import { WeaveProvider } from './contexts/WeaveContext';
import { ChallengeProvider } from './contexts/ChallengeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { initializeAppIntegrations, setupQuickActionHandlers, setupShareHandler } from './lib/appIntegrations';

// Main App component - providers are now in main.tsx
function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const currentPath = location.pathname;
  
  // Move all hooks to the top before any conditional logic
  const handleAuthSuccess = React.useCallback(() => {
    setIsAuthenticated(true);
    checkAdminStatus();
  }, []);

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

  // Initialize app integrations
  useEffect(() => {
    initializeAppIntegrations(user?.id);

    setupQuickActionHandlers({
      onStartFocus25: () => {
        navigate('/focus');
      },
      onStartFocus45: () => {
        navigate('/focus');
      },
      onQuickMemory: () => {
        navigate('/weave');
      },
      onViewStreak: () => {
        navigate('/insights');
      },
    });

    setupShareHandler(async (data) => {
      if (data.text || data.title) {
        navigate('/weave', { state: { sharedContent: data } });
      }
    });
  }, [user, navigate]);

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

  // Don't show global auth form - let individual pages handle auth
  // This prevents duplicate auth forms

  return (
    <>
      <ScrollToTop />
      <OfflineDetector />
      <Routes>
      {/* Admin route - completely separate */}
      <Route path="/admin" element={<AdminRoute />} />

      {/* Main app routes - using new ADHD-first structure */}
      <Route path="/*" element={
        <div className="min-h-screen">
          <Routes>
            {/* Redirect root to /focus (ADHD-first) */}
            <Route path="/" element={<Navigate to="/focus" replace />} />

            {/* New ADHD-first routes with AppShell */}
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/train" element={<TrainPage />} />
            <Route path="/insights" element={<ADHDInsightsPage />} />
            <Route path="/more" element={<MorePage />} />

            {/* Existing features (accessible from More) - wrapped with minimal layout */}
            <Route path="/weave" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><WeaveCanvas onBack={() => navigate('/more')} /></div>} />
            <Route path="/scenarios" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ScenarioStudio onBack={() => navigate('/more')} /></div>} />
            <Route path="/training" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><RetrievalTrainer onBack={() => navigate('/more')} /></div>} />
            <Route path="/memory-training" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><RetrievalTrainer onBack={() => navigate('/more')} /></div>} />
            <Route path="/adhd-focus-trainer" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ADHDDashboard onBack={() => navigate('/train')} /></div>} />
            <Route path="/attention-rescue" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ADHDDashboard onBack={() => navigate('/train')} /></div>} />
            <Route path="/cognitive-state" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ADHDDashboard onBack={() => navigate('/train')} /></div>} />
            <Route path="/working-memory-trainer" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ADHDDashboard onBack={() => navigate('/train')} /></div>} />
            <Route path="/micro-attention" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><ADHDDashboard onBack={() => navigate('/train')} /></div>} />
            <Route path="/cognitive-regulation" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><IntelligentDashboard onNavigate={(view) => navigate(`/${view}`)} /></div>} />
            <Route path="/wins" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><MemoryInsights /></div>} />
            <Route path="/settings" element={<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"><SettingsPanel onClose={() => navigate('/more')} /></div>} />

            <Route path="*" element={<Navigate to="/focus" replace />} />
          </Routes>

          <InstallPrompt />
          <ConsentBanner />
        </div>
      } />
      </Routes>
    </>
  );
}

// Wrapper component with all providers
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserManagementProvider>
          <CognitiveStateProvider>
            <WeaveProvider>
              <ChallengeProvider>
                <AppContent />
              </ChallengeProvider>
            </WeaveProvider>
          </CognitiveStateProvider>
        </UserManagementProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;