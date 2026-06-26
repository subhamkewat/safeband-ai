import React from 'react';
import { Mic, Camera, Flame, Eye, HardDrive, BellRing, Sparkles } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

export const Settings: React.FC = () => {
  const {
    sosMessage,
    setSosMessage,
    autoRecordEvidence,
    setAutoRecordEvidence,
    wakeWordsEnabled,
    toggleWakeWords,
    threatAnalysisActive,
    toggleThreatAnalysis
  } = useSafety();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">System Parameters & Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Configure your SafeBand device parameters, customize automated messages, and adjust AI sensitivity levels.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Settings Modules */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Module 1: SOS Message Template */}
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
              <Flame className="w-4 h-4 text-brand-red" />
              SOS Text Notification Template
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              This message will be distributed via cellular SMS and email links to all registered emergency contacts upon countdown completion.
            </p>

            <div>
              <textarea
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
                rows={3}
                placeholder="Enter distress message template..."
                className="w-full bg-white/3 border border-white/5 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-brand-purple/40 leading-relaxed"
              />
              <span className="text-[10px] text-gray-500 mt-1.5 block">
                * Note: The placeholder <code className="bg-white/5 px-1 py-0.5 rounded text-white">[LINK]</code> will automatically resolve to your active GPS coordinates on Google Maps.
              </span>
            </div>
          </GlassCard>

          {/* Module 2: Sensors & AI Guard Toggles */}
          <GlassCard className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              Sensory Guard Configurations
            </h3>

            {/* Toggle 1: Voice Wake words */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-md">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-brand-purple" />
                  Continuous Voice Activation
                </h4>
                <p className="text-[10.5px] text-gray-400 leading-relaxed">
                  Enables Web Speech API to listen for wake words like <strong>"Save Me"</strong>, <strong>"Help Me"</strong>, or <strong>"Emergency"</strong>. triggers SOS countdown instantly.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={wakeWordsEnabled} 
                  onChange={(e) => toggleWakeWords(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple peer-checked:after:bg-white" />
              </label>
            </div>

            {/* Toggle 2: AI Threat Detection */}
            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-4">
              <div className="space-y-1 max-w-md">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-purple" />
                  AI Acoustic Threat Analysis
                </h4>
                <p className="text-[10.5px] text-gray-400 leading-relaxed">
                  Analyzes ambient audio levels and spikes (decibels) to identify distress screams. Triggers automatic SOS if threat likelihood exceeds 80%.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={threatAnalysisActive} 
                  onChange={(e) => toggleThreatAnalysis(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple peer-checked:after:bg-white" />
              </label>
            </div>

            {/* Toggle 3: Automatic Evidence Recording */}
            <div className="flex items-start justify-between gap-4 border-t border-white/5 pt-4">
              <div className="space-y-1 max-w-md">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-purple" />
                  Automatic Evidence Capture
                </h4>
                <p className="text-[10.5px] text-gray-400 leading-relaxed">
                  Forces device cameras and microphones to record a 15-second secure evidence log automatically when SOS completes.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoRecordEvidence} 
                  onChange={(e) => setAutoRecordEvidence(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple peer-checked:after:bg-white" />
              </label>
            </div>

          </GlassCard>

        </div>

        {/* Right: Informational Panels */}
        <div className="space-y-6 text-left">
          
          <GlassCard className="space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              Offline Fallback Protocol
            </h3>
            <p className="text-[10.5px] text-gray-400 leading-relaxed">
              If cellular internet is unavailable when an SOS is dispatched, SafeBand triggers an SMS fallback. Your device registers the distress log locally and launches the default SMS composer on your phone to transmit coordinates.
            </p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-emerald-400" />
              Firmware Diagnostics
            </h3>
            <div className="space-y-1.5 text-[10.5px] text-gray-300 font-semibold">
              <div className="flex justify-between">
                <span>SafeBand Version:</span>
                <span>v2.8.4</span>
              </div>
              <div className="flex justify-between">
                <span>Core Temperature:</span>
                <span>36.2 °C</span>
              </div>
              <div className="flex justify-between">
                <span>WLAN Frequency:</span>
                <span>5.8 GHz</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
export default Settings;
