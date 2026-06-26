import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Mic, 
  MicOff, 
  Camera, 
  Volume2, 
  VolumeX, 
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

interface TopbarProps {
  setTab: (tab: string) => void;
  setMobileOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  setTab,
  setMobileOpen,
}) => {
  const { user } = useAuth();
  const { 
    gpsStatus, 
    micStatus, 
    cameraStatus, 
    networkStatus,
    sosAudioAlert,
    toggleSOSAudio
  } = useSafety();

  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Guardian Mode Enabled', desc: 'AI threat monitoring is active.', time: 'Just Now', unread: true },
    { id: 2, title: 'GPS Location Lock', desc: 'GPS coordinates verified within 5m.', time: '4m ago', unread: false },
    { id: 3, title: 'PWA Installed', desc: 'SafeBand is configured for offline launch.', time: '1h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#03000a]/50 backdrop-blur-md border-b border-white/5 py-3 px-4 lg:px-8 flex items-center justify-between">
      
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Dynamic Greeting (Desktop) */}
        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-white tracking-wide">
            Welcome, <span className="text-brand-purple">{user?.name || 'Guardian'}</span>
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">{formatDate(time)} • {formatTime(time)}</p>
        </div>
      </div>

      {/* Right: Sensors & Notifications */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Network & Sensor Telemetry Badges (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-white/3 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-medium">
          {/* Network Badge */}
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[11px]">
            {networkStatus === 'online' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">Cloud Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span className="text-rose-500 font-semibold uppercase text-[10px]">Offline (SMS Ready)</span>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1"></div>

          {/* GPS Status Badge */}
          <div className="flex items-center gap-1">
            <MapPin className={`w-3.5 h-3.5 ${
              gpsStatus === 'online' ? 'text-emerald-400' : gpsStatus === 'searching' ? 'text-amber-400 animate-pulse' : 'text-gray-500'
            }`} />
            <span className={gpsStatus === 'online' ? 'text-gray-300' : gpsStatus === 'searching' ? 'text-amber-300' : 'text-gray-500'}>
              GPS
            </span>
          </div>

          {/* Mic Status Badge */}
          <div className="flex items-center gap-1">
            {micStatus === 'active' ? (
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <MicOff className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span className={micStatus === 'active' ? 'text-gray-300' : 'text-gray-500'}>Voice</span>
          </div>

          {/* Camera Badge */}
          <div className="flex items-center gap-1">
            <Camera className={`w-3.5 h-3.5 ${cameraStatus === 'armed' ? 'text-emerald-400' : 'text-gray-500'}`} />
            <span className={cameraStatus === 'armed' ? 'text-gray-300' : 'text-gray-500'}>Lens</span>
          </div>
        </div>

        {/* SOS Mute Toggle */}
        <button
          onClick={toggleSOSAudio}
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            sosAudioAlert
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20'
              : 'bg-white/3 border-white/5 text-gray-400 hover:text-white'
          }`}
          title={sosAudioAlert ? 'Mute emergency alarms' : 'Unmute emergency alarms'}
        >
          {sosAudioAlert ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
        </button>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl border transition-all duration-200 relative ${
              showNotifications
                ? 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple'
                : 'bg-white/3 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2.5 w-80 bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <h3 className="font-semibold text-sm text-white">Alert Notifications</h3>
                  <button 
                    className="text-[10px] text-brand-purple hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`flex gap-3 p-2 rounded-xl transition-all duration-200 ${
                        notif.unread ? 'bg-white/3 border-l-2 border-brand-red' : 'opacity-85'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple/30 to-brand-red/10 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-4 h-4 text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                          <span className="text-[9px] text-gray-500">{notif.time}</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-0.5">{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Mini Profile */}
        <button
          onClick={() => setTab('profile')}
          className="flex items-center gap-2 border border-white/8 rounded-xl p-1 pr-3 bg-white/3 hover:border-brand-purple/35 transition-all duration-200"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-red text-white font-bold text-xs flex items-center justify-center">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-gray-300">
            {user?.name ? user.name.split(' ')[0] : 'Profile'}
          </span>
        </button>
        
      </div>
    </header>
  );
};
export default Topbar;
