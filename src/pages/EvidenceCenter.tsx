import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, ShieldCheck, Video, Mic, HardDrive, Download, AlertTriangle, Eye } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

export const EvidenceCenter: React.FC = () => {
  const { 
    recordings, 
    deleteRecording, 
    isRecording, 
    recordingType, 
    startRecording, 
    stopRecording 
  } = useSafety();

  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bind live camera preview inside Evidence Center when page is active (for premium visual experience!)
  useEffect(() => {
    let localStream: MediaStream | null = null;

    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera preview permission blocked. Showing visual camera simulator.', err);
      }
    };

    startPreview();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handlePlayDemo = (id: string) => {
    if (activePlayId === id) {
      setActivePlayId(null);
    } else {
      setActivePlayId(id);
      // Automatically stop play after 5s
      setTimeout(() => {
        setActivePlayId(prev => prev === id ? null : prev);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Evidence Storage Center</h2>
        <p className="text-xs text-gray-400 mt-1">
          Secure offline repository. Files are metadata-stamped and encrypted with SHA-256 signatures for tamper-proof evidence.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Live Capture Panel */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="text-left flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand-purple" />
                  Live Lens Feed Simulator
                </h3>
                <span className="text-[9px] text-brand-red font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  Sensor Arm Ready
                </span>
              </div>

              {/* Webcam Preview Screen */}
              <div className="relative w-full h-[200px] sm:h-[280px] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                
                {/* Fallback overlay if stream is blocked/unavailable */}
                <div className="absolute inset-0 bg-[#080714] flex flex-col items-center justify-center text-center p-6 z-0 pointer-events-none">
                  <Eye className="w-10 h-10 text-brand-purple/40 mb-2" />
                  <span className="text-xs text-gray-500 font-medium">Digital HUD Camera Stream</span>
                  <span className="text-[10px] text-gray-600 italic mt-1">Preview feeds prioritize native hardware if camera permissions are approved.</span>
                </div>

                {/* Cyber HUD markings */}
                <div className="absolute inset-4 border border-white/5 pointer-events-none flex flex-col justify-between text-[9px] font-mono text-gray-500 p-2">
                  <div className="flex justify-between">
                    <span>[REC.READY]</span>
                    <span>FPS: 30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1080P FHD</span>
                    <span>ISO: AUTO</span>
                  </div>
                </div>

                {/* Active recording overlay */}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-brand-red/90 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    CAPTURING {recordingType?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Capture Panel Buttons */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-xl bg-brand-red hover:bg-rose-700 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-brand-red/25 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 animate-spin-once" />
                  Stop Recording (Save)
                </button>
              ) : (
                <>
                  <button
                    onClick={() => startRecording('video')}
                    className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    Record Video (15s)
                  </button>
                  <button
                    onClick={() => startRecording('audio')}
                    className="px-5 py-2.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 text-white transition-all font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    Record Audio (15s)
                  </button>
                </>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right: Storage Stats & History log */}
        <div className="space-y-6">
          {/* Storage stats */}
          <GlassCard className="text-left space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-brand-purple" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Device Storage Lock</h3>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Recorded Files</span>
                <span className="font-bold text-white">{recordings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cache Usage</span>
                <span className="font-bold text-white">
                  {(recordings.reduce((sum, r) => sum + (r.type === 'video' ? 1.8 : 0.2), 0)).toFixed(2)} MB / 500 MB
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-brand-purple h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(2, (recordings.length * 2)))}%` }}
                />
              </div>
            </div>
          </GlassCard>

          {/* Incident Verification Certificate */}
          <GlassCard glowColor="purple" className="text-left">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Evidence Verification
            </h3>
            <p className="text-[10.5px] text-gray-400 leading-relaxed">
              Every media file captured is watermarked with an immutable epoch timestamp, location signature, and device ID, allowing it to serve as authentic courtroom documentation.
            </p>
          </GlassCard>
        </div>

      </div>

      {/* 4. Recorded Evidence History Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-left">Incident Evidence Archive</h3>
        
        {recordings.length === 0 ? (
          <div className="bg-glass-bg border border-white/5 rounded-2xl p-10 text-center text-gray-500 text-xs">
            No local evidence files found. Start recording or trigger SOS to generate media logs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec) => (
              <GlassCard key={rec.id} className="text-left flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                      rec.type === 'video' ? 'bg-rose-500/10 text-brand-red border border-rose-500/15' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/15'
                    }`}>
                      {rec.type}
                    </span>
                    <span className="text-[9px] text-gray-500 font-semibold">{rec.size}</span>
                  </div>

                  <h4 className="font-bold text-xs text-white truncate mb-1" title={rec.name}>{rec.name}</h4>
                  <p className="text-[10px] text-gray-400">{rec.timestamp}</p>

                  {/* Simulated audio visual player output */}
                  {activePlayId === rec.id && (
                    <div className="mt-4 p-2 bg-black/40 border border-white/5 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[9px] text-emerald-400 font-semibold">Playing secure demo stream...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayDemo(rec.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        activePlayId === rec.id
                          ? 'bg-brand-purple border-brand-purple text-white'
                          : 'bg-white/3 border-white/5 text-gray-300 hover:text-white'
                      }`}
                      title={activePlayId === rec.id ? 'Pause playback' : 'Play secure preview'}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    
                    <a
                      href={rec.url === '#' ? undefined : rec.url}
                      download={rec.name}
                      onClick={(e) => rec.url === '#' && e.preventDefault()}
                      className="p-2 rounded-xl border border-white/5 bg-white/3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Download source evidence"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="p-2 rounded-xl border border-white/5 bg-white/3 text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
export default EvidenceCenter;
