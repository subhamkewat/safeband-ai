import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AIAssistant from './components/AIAssistant';
import SOSCountdown from './components/SOSCountdown';
import FakeCallModal from './components/FakeCallModal';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Contacts } from './pages/Contacts';
import { LiveTracking } from './pages/LiveTracking';
import { EvidenceCenter } from './pages/EvidenceCenter';
import { NearbyHelp } from './pages/NearbyHelp';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [tab, setTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#03000a] text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center animate-spin mb-4 shadow-lg shadow-brand-red/25">
          <div className="w-6 h-6 rounded-lg bg-[#03000a]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Decrypting Guardian session...
        </span>
      </div>
    );
  }

  // 1. PUBLIC VIEWS (User is not logged in)
  if (!user) {
    switch (view) {
      case 'login':
        return <Login setView={setView} />;
      case 'signup':
        return <Signup setView={setView} />;
      case 'landing':
      default:
        return <Landing setView={setView} />;
    }
  }

  // 2. AUTHENTICATED VIEWS (Dashboard core layout)
  const renderTabContent = () => {
    switch (tab) {
      case 'contacts':
        return <Contacts />;
      case 'tracking':
        return <LiveTracking />;
      case 'evidence':
        return <EvidenceCenter />;
      case 'help':
        return <NearbyHelp />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard setTab={setTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-dark text-gray-200">
      {/* Navigation sidebar */}
      <Sidebar 
        currentTab={tab} 
        setTab={setTab} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <Topbar setTab={setTab} setMobileOpen={setMobileOpen} />
        
        {/* Tab Pages Scrollable Container */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-24">
          {renderTabContent()}
        </main>
      </div>

      {/* Floating AI chatbot bubble */}
      <AIAssistant />

      {/* Absolute Emergency countdown overlay */}
      <SOSCountdown />

      {/* Absolute Ringing Call Generator overlay */}
      <FakeCallModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SafetyProvider>
        <AppContent />
      </SafetyProvider>
    </AuthProvider>
  );
};

export default App;
