import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  HardDrive, 
  Compass, 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { logout } = useAuth();
  const { triggerSOS, sosActive } = useSafety();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'tracking', label: 'Live Tracking', icon: MapPin },
    { id: 'evidence', label: 'Evidence Center', icon: HardDrive },
    { id: 'help', label: 'Nearby Help', icon: Compass },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-glass-bg border-r border-white/8 backdrop-blur-2xl p-5">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center shadow-lg shadow-brand-red/35">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            SafeBand <span className="text-brand-red">AI</span>
          </span>
          <div className="text-[10px] text-brand-purple uppercase tracking-widest font-semibold">Guardian System</div>
        </div>
      </div>

      {/* SOS Quick Launch */}
      <div className="mb-8 px-1">
        <button
          onClick={() => triggerSOS('manual')}
          disabled={sosActive}
          className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 ${
            sosActive 
              ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30 cursor-not-allowed animate-pulse'
              : 'bg-gradient-to-r from-brand-red to-rose-600 hover:from-rose-500 hover:to-brand-red text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_25px_rgba(244,63,94,0.5)] transform active:scale-95'
          }`}
        >
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 ${sosActive ? 'hidden' : ''}`}></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          {sosActive ? 'SOS Arming...' : 'Trigger SOS Alert'}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-brand-purple/20 to-brand-red/5 text-white border-l-2 border-brand-purple shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/4'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${
                isActive ? 'text-brand-purple scale-110' : 'text-gray-400 group-hover:scale-105'
              }`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-white/5 mt-auto px-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          <span className="tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/75 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer (Sliding) */}
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
        <button 
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-[-48px] w-10 h-10 bg-glass-bg border border-white/8 rounded-full flex items-center justify-center text-white backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </aside>
    </>
  );
};
export default Sidebar;
