import React from 'react';
import { AlertTriangle, XCircle, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';

export const SOSCountdown: React.FC = () => {
  const { 
    sosActive, 
    sosCountdown, 
    cancelSOS, 
    sosAudioAlert, 
    toggleSOSAudio,
    contacts,
    networkStatus
  } = useSafety();

  if (!sosActive) return null;

  const alertingContacts = contacts.filter(c => c.priorityAlert).map(c => c.name);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
        {/* Pulsing Alarm Background circles */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-red/5 border border-brand-red/10 animate-ripple pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-red/5 border border-brand-red/10 animate-ripple pointer-events-none" style={{ animationDelay: '0.5s' }} />

        <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center">
          
          {/* Top Hazard Warning Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 px-4 py-1.5 rounded-full text-brand-red text-xs font-bold uppercase tracking-widest mb-6 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-brand-red" />
            Critical Safety Warning
          </motion.div>

          {/* Large Countdown Circle */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-rose-950 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="w-full h-full rounded-full border-4 border-brand-red opacity-80 animate-ping absolute" />
            </div>
            
            {/* The Number */}
            <motion.div 
              key={sosCountdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-5xl sm:text-7xl font-extrabold text-white tracking-tighter"
            >
              {sosCountdown === 0 ? (
                <span className="text-3xl text-emerald-400 font-bold uppercase tracking-wider">Armed</span>
              ) : (
                sosCountdown
              )}
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide uppercase">
            {sosCountdown === 0 ? 'Guardian Mode Engaged' : 'Emergency Countdown'}
          </h2>
          
          <p className="text-sm text-gray-400 mb-8 max-w-xs">
            {sosCountdown === 0 
              ? 'GPS tracked. Audio/Video recording active. Alerting dispatch.'
              : `SOS will trigger in ${sosCountdown} seconds. Press cancel if this is a false alarm.`
            }
          </p>

          {/* Action Log Widget */}
          <div className="w-full bg-white/3 border border-white/5 rounded-2xl p-4 text-left space-y-2.5 mb-8">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/5 pb-1">
              Active Security Processes
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">GPS Telemetry Capture</span>
              <span className="text-emerald-400 font-semibold uppercase text-[10px]">Active</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Evidence Recorder Status</span>
              <span className={sosCountdown <= 2 ? "text-emerald-400 font-semibold uppercase text-[10px]" : "text-amber-400 font-semibold uppercase text-[10px]"}>
                {sosCountdown <= 2 ? 'Recording' : 'Armed'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Contacts SMS Queue</span>
              {networkStatus === 'offline' ? (
                <span className="text-rose-400 font-semibold uppercase text-[10px]">Offline Fallback (SMS Ready)</span>
              ) : (
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                  {sosCountdown === 0 ? 'SMS Dispatched' : 'Queued'}
                </span>
              )}
            </div>

            {alertingContacts.length > 0 && (
              <div className="text-[10px] text-gray-400 italic pt-1 border-t border-white/5">
                Queued contacts: {alertingContacts.join(', ')}
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            {/* Alarm Mute toggle */}
            <button
              onClick={toggleSOSAudio}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 w-full sm:flex-1 font-semibold text-xs tracking-wider uppercase ${
                sosAudioAlert
                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-white/3 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {sosAudioAlert ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Mute Siren
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Unmute Alarm
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={cancelSOS}
              className="py-3.5 px-6 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full sm:flex-[2] font-bold text-xs tracking-wider uppercase cursor-pointer"
            >
              <XCircle className="w-4.5 h-4.5" />
              Cancel SOS
            </button>
          </div>

        </div>
      </div>
    </AnimatePresence>
  );
};
export default SOSCountdown;
