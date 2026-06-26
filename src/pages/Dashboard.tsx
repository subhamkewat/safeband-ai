import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Map, 
  Mic, 
  Camera, 
  Users, 
  Activity, 
  Volume2, 
  Radio, 
  AlertTriangle, 
  PhoneCall, 
  HardDrive,
  Signal
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

interface DashboardProps {
  setTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  const {
    guardianStatus,
    gpsStatus,
    micStatus,
    cameraStatus,
    networkStatus,
    triggerSOS,
    sosActive,
    threatLevel,
    lastDetectedSound,
    wakeWordsEnabled,
    scheduleFakeCall,
    isRecording,
    recordingType,
    startRecording,
    stopRecording,
    contacts,
    incidents
  } = useSafety();

  const [fakeCallNameInput, setFakeCallNameInput] = useState('Dad');
  const [fakeCallDelayInput, setFakeCallDelayInput] = useState(10); // 10 seconds

  const handleFakeCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleFakeCall(fakeCallNameInput, Number(fakeCallDelayInput));
  };

  // Generate fake decibel bars for the sound analysis visualization
  const renderVisualizer = () => {
    const barsCount = 28;
    return (
      <div className="flex items-end justify-between h-14 w-full bg-white/2 border border-white/5 rounded-xl p-3 gap-0.5 overflow-hidden">
        {Array.from({ length: barsCount }).map((_, idx) => {
          // Make center bars fluctuate higher depending on threat level
          const multiplier = 1 - Math.abs(idx - barsCount / 2) / (barsCount / 2);
          const barHeight = Math.max(12, Math.min(100, Math.round((threatLevel * multiplier * (0.6 + Math.random() * 0.5)))));
          
          let barBg = 'bg-brand-purple/40';
          if (threatLevel > 65) {
            barBg = 'bg-brand-red/60';
          } else if (threatLevel > 35) {
            barBg = 'bg-amber-400/50';
          }
          
          return (
            <div 
              key={idx}
              className={`w-1 rounded-t-sm transition-all duration-150 ${barBg}`}
              style={{ height: `${barHeight}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Top Section: Telemetry Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Card 1: AI Guardian */}
        <div className="bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">AI Guardian</span>
            <Activity className={`w-4 h-4 ${guardianStatus === 'alert' ? 'text-brand-red animate-pulse' : 'text-brand-purple animate-pulse'}`} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white uppercase tracking-wide">
              {guardianStatus === 'alert' ? 'Threat Alarm' : 'Secured'}
            </div>
            <div className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Realtime Active
            </div>
          </div>
        </div>

        {/* Card 2: GPS Telemetry */}
        <div className="bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">GPS Telemetry</span>
            <Map className={`w-4 h-4 ${gpsStatus === 'online' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white uppercase tracking-wide">
              {gpsStatus === 'online' ? 'Live Coordinates' : gpsStatus === 'searching' ? 'Locking GPS...' : 'GPS Offline'}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold mt-1">Accuracy: ~5 meters</div>
          </div>
        </div>

        {/* Card 3: Voice Activation */}
        <div className="bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Voice Guard</span>
            <Mic className={`w-4 h-4 ${micStatus === 'active' && wakeWordsEnabled ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white uppercase tracking-wide">
              {micStatus === 'active' && wakeWordsEnabled ? 'Listening' : 'Muted / Off'}
            </div>
            <div className="text-[9px] text-brand-purple font-semibold mt-1">Trigger: "Save Me"</div>
          </div>
        </div>

        {/* Card 4: Camera Guard */}
        <div className="bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Lens Guard</span>
            <Camera className={`w-4 h-4 ${cameraStatus === 'armed' ? 'text-emerald-400' : 'text-gray-500'}`} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white uppercase tracking-wide">
              {cameraStatus === 'armed' ? 'Armed' : 'Standby'}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold mt-1">Autorecord configured</div>
          </div>
        </div>

        {/* Card 5: Network Status */}
        <div className="bg-glass-bg border border-white/8 backdrop-blur-2xl rounded-2xl p-4 flex flex-col justify-between h-28 col-span-1 md:col-span-1 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Guardian Sync</span>
            <Signal className={`w-4 h-4 ${networkStatus === 'online' ? 'text-emerald-400' : 'text-rose-500'}`} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white uppercase tracking-wide">
              {networkStatus === 'online' ? 'Cloud Sync' : 'Offline Mode'}
            </div>
            <div className={`text-[9px] font-semibold mt-1 ${networkStatus === 'online' ? 'text-gray-400' : 'text-rose-400 animate-pulse'}`}>
              {networkStatus === 'online' ? 'Realtime logging' : 'SMS routing active'}
            </div>
          </div>
        </div>

      </div>

      {/* 2. SOS Button & AI Threat Analyzer split grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Main SOS Trigger Card */}
        <GlassCard glowColor={sosActive ? 'red' : 'none'} className="md:col-span-2 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-tr from-[#110515] to-[#0d071a]">
          <h3 className="text-lg font-bold text-white tracking-wide uppercase mb-2">Emergency Activation System</h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6">
            Pressing the button below initiates a 5-second countdown sequence, logging telemetry coordinates and alerting your contacts.
          </p>

          <button
            onClick={() => triggerSOS('manual')}
            disabled={sosActive}
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-white border-2 border-brand-red/30 cursor-pointer transition-all duration-300 relative group ${
              sosActive
                ? 'bg-rose-950 animate-ripple'
                : 'bg-gradient-to-br from-brand-red to-rose-700 hover:from-rose-500 hover:to-brand-red shadow-[0_5px_25px_rgba(244,63,94,0.4)] hover:shadow-[0_5px_30px_rgba(244,63,94,0.6)] transform active:scale-97'
            }`}
          >
            <ShieldAlert className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-xl font-black uppercase tracking-wider">SOS</span>
            <span className="text-[8px] text-white/70 uppercase tracking-widest font-semibold mt-1">HOLD / PRESS</span>
          </button>

          <div className="text-[10px] text-gray-500 italic mt-6 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
            Double tap to bypass confirmation or scream to trigger
          </div>
        </GlassCard>

        {/* AI Audio Threat Monitor Card */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Threat Analyzer</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                threatLevel > 65 ? 'bg-rose-500/10 text-brand-red border border-rose-500/20' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
              }`}>
                {threatLevel > 65 ? 'High Risk' : threatLevel > 35 ? 'Warning' : 'Shielded'}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              Analyzing background micro-signals and frequency spikes to calculate danger likelihood.
            </p>

            {/* Decibel Visualizer rendering */}
            {renderVisualizer()}
            
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Confidence Score:</span>
              <span className={`font-bold ${threatLevel > 65 ? 'text-brand-red' : 'text-brand-purple'}`}>
                {threatLevel}%
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1.5">Last Logged Signal</div>
            <div className="text-xs text-gray-300 font-semibold italic flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${threatLevel > 65 ? 'bg-brand-red animate-ping' : 'bg-brand-purple'}`} />
              "{lastDetectedSound}"
            </div>
          </div>
        </GlassCard>

      </div>

      {/* 3. Action Cards Grid (Fake Call, Evidence recording, Contacts) */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Fake Call Generator Card */}
        <GlassCard className="text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <PhoneCall className="w-5 h-5 text-brand-purple" />
              <h3 className="font-bold text-base text-white tracking-wide">Fake Call Generator</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Schedule a simulated cellular phone call to create a plausible excuse to exit uncomfortable scenarios.
            </p>
            
            <form onSubmit={handleFakeCallSubmit} className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Caller Alias</label>
                <input
                  type="text"
                  value={fakeCallNameInput}
                  onChange={(e) => setFakeCallNameInput(e.target.value)}
                  placeholder="e.g. Dad, Dispatcher..."
                  className="w-full bg-white/3 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Delay Timer</label>
                <select
                  value={fakeCallDelayInput}
                  onChange={(e) => setFakeCallDelayInput(Number(e.target.value))}
                  className="w-full bg-[#110e20] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={0}>Trigger Instantly</option>
                  <option value={10}>10 Seconds</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>1 Minute</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-brand-purple/20 cursor-pointer"
              >
                Schedule Call
              </button>
            </form>
          </div>
        </GlassCard>

        {/* Evidence Recorder Card */}
        <GlassCard className="text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <HardDrive className="w-5 h-5 text-brand-purple" />
              <h3 className="font-bold text-base text-white tracking-wide">Evidence Recorder</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Instantly lock and cache an audio or video clip to compile evidence. Files save locally even when offline.
            </p>

            {isRecording ? (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-red"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Recording {recordingType === 'video' ? 'Video' : 'Audio'}...
                </span>
                <button
                  onClick={stopRecording}
                  className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-colors"
                >
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => startRecording('audio')}
                  className="py-3 px-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-brand-purple/40 text-center flex flex-col items-center gap-2 hover:bg-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
                >
                  <Volume2 className="w-5 h-5 text-brand-purple" />
                  Capture Audio
                </button>
                <button
                  onClick={() => startRecording('video')}
                  className="py-3 px-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-brand-purple/40 text-center flex flex-col items-center gap-2 hover:bg-white/5 transition-all text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-brand-purple" />
                  Capture Video
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setTab('evidence')}
            className="w-full py-2 border border-white/5 rounded-xl hover:bg-white/3 text-[11px] text-gray-400 hover:text-white transition-colors mt-4 text-center"
          >
            Access Evidence Center
          </button>
        </GlassCard>

        {/* Emergency Contacts shortcuts */}
        <GlassCard className="text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Users className="w-5 h-5 text-brand-purple" />
              <h3 className="font-bold text-base text-white tracking-wide">Emergency Contacts</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Registered recipients that will receive automated distress links with GPS maps.
            </p>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center px-3 py-2 rounded-xl bg-white/3 border border-white/5 text-xs">
                  <div>
                    <div className="font-bold text-white">{contact.name}</div>
                    <div className="text-[10px] text-gray-500">{contact.phone}</div>
                  </div>
                  {contact.priorityAlert ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-brand-red border border-rose-500/15 text-[8.5px] font-bold uppercase">Priority</span>
                  ) : (
                    <span className="text-[10px] text-gray-500">{contact.relationship}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setTab('contacts')}
            className="w-full py-2 border border-white/5 rounded-xl hover:bg-white/3 text-[11px] text-gray-400 hover:text-white transition-colors mt-4 text-center"
          >
            Manage Contacts ({contacts.length})
          </button>
        </GlassCard>

      </div>

      {/* 4. Incident Logs Shortcut / Safety Status Feed */}
      {incidents.length > 0 && (
        <GlassCard className="text-left">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-red animate-pulse" />
              Active Incident Log History
            </h3>
            <span className="text-[10px] text-brand-purple font-semibold">Incident Registered: Local Cache Locked</span>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="flex gap-4 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="w-10 h-10 rounded-lg bg-rose-500/15 flex items-center justify-center flex-shrink-0 border border-rose-500/20 text-brand-red">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Emergency Warning (Trigger: {inc.triggerType.toUpperCase()})</span>
                    <span className="text-[10px] text-gray-500">{inc.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Location coordinates logged ({inc.location?.lat.toFixed(4)}, {inc.location?.lng.toFixed(4)}). Contacts notified: {inc.contactsNotified.join(', ')}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

    </div>
  );
};
export default Dashboard;
