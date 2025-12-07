import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoleGuard from './components/RoleGuard';
import BackgroundLogo from './components/BackgroundLogo';
import Watermark from './components/Watermark';
import Toast from './components/Toast';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterSettings from './pages/MasterSettings';
import AddContent from './pages/AddContent';
import VideoLibrary from './pages/VideoLibrary';
import SearchContent from './pages/SearchContent';
import ShareContent from './pages/ShareContent';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import NotFound from './pages/NotFound';

// Layout component for protected routes
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background relative">
      <BackgroundLogo />
      <Watermark />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col relative z-10 lg:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="w-full">
            {children}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs lg:text-sm text-gray-600 relative z-10">
          SanganakHQ - Innovation & Growth Boutique
        </footer>
      </div>
    </div>
  );
};

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </RoleGuard>
  );
};

// Public Route (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  // Global keyboard shortcuts
  useKeyboardShortcuts({
    disabled: !user // Only enable when logged in
  });

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/master-settings"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin']}>
            <MasterSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-content"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff']}>
            <AddContent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/video-library"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff']}>
            <VideoLibrary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchContent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/share"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff']}>
            <ShareContent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin']}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin']}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['Super Admin', 'Dept Admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpCenter />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Toast />
          <PWAInstallPrompt />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

