import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Signal, Battery, Compass } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

export const LiveTracking: React.FC = () => {
  const { location } = useSafety();
  const [isTracking, setIsTracking] = useState(true);
  const [battery, setBattery] = useState(94);
  const [signal, setSignal] = useState(100);
  const [speed, setSpeed] = useState(2.8); // walking speed km/h
  const [elapsedSeconds, setElapsedSeconds] = useState(148);

  // Simulated tickers
  useEffect(() => {
    let interval: number;
    if (isTracking) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        // Slightly fluctuate parameters for visual effect
        setBattery(prev => Math.max(15, prev - (Math.random() > 0.9 ? 1 : 0)));
        setSpeed(() => Number((2.4 + Math.random() * 0.8).toFixed(1)));
        setSignal(() => Math.floor(90 + Math.random() * 10));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatElapsed = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTelemetryCoordinates = () => {
    if (location) {
      return { lat: location.lat.toFixed(6), lng: location.lng.toFixed(6) };
    }
    return { lat: '37.774900', lng: '-122.419400' };
  };

  const coords = getTelemetryCoordinates();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Live Location Telemetry</h2>
        <p className="text-xs text-gray-400 mt-1">Real-time GPS tracking stream. Safety nodes monitor coordinates every 2.5 seconds.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Map Radar Simulator */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative w-full h-[280px] sm:h-[380px] bg-[#0c0a1a] border border-white/8 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
            
            {/* Visual Grid Backing */}
            <div className="absolute inset-0 bg-[radial-gradient(#1f1842_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Radar Pulsing circle overlay */}
            <div className="absolute w-60 h-60 rounded-full border border-brand-purple/20 animate-radar flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-brand-purple/35 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-brand-red/20 flex items-center justify-center" />
              </div>
            </div>

            {/* Radar sweep lines */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-purple/5 to-transparent origin-center animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />

            {/* Center target node (User Location) */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-brand-purple/20 border border-brand-purple/65 flex items-center justify-center animate-bounce">
                <div className="w-4 h-4 rounded-full bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/60 border border-white/20" />
              </div>
              <span className="mt-2 text-[10px] font-extrabold uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-white/8 text-white backdrop-blur-sm">
                SafeBand Device Lock
              </span>
            </div>

            {/* Map Telemetry HUD indicators */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/5 text-left text-[10px]">
              <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/5 pb-1">Telemetry HUD</div>
              <div className="text-white font-medium flex items-center gap-1.5 mt-1">
                <Compass className="w-3.5 h-3.5 text-brand-purple" />
                HDOP: 0.82 (Excellent)
              </div>
              <div className="text-white font-medium">Bearing: 174.5° SSE</div>
              <div className="text-white font-medium">Satellites Locked: 11</div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/5 text-left text-xs">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Locked Address</span>
              <span className="text-white font-bold text-[11px]">{location?.address || 'Simulated Safe Zone, Standard Coordinates'}</span>
            </div>
            
          </div>

          {/* Tracking control bar */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-glass-bg border border-white/8 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTracking(!isTracking)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
                  isTracking 
                    ? 'bg-rose-500/10 border border-rose-500/25 text-brand-red hover:bg-rose-500/20'
                    : 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-lg'
                }`}
              >
                {isTracking ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause Tracking
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Resume Track
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setElapsedSeconds(0)}
                className="p-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                title="Reset session duration"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block">Session Duration</span>
              <span className="text-sm font-bold text-white font-mono">{formatElapsed(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Specs & History log */}
        <div className="space-y-6">
          {/* Telemetry Stats Card */}
          <GlassCard className="text-left space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-2">GPS Diagnostics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block">Latitude</span>
                <span className="text-sm font-extrabold text-white font-mono mt-0.5">{coords.lat}</span>
              </div>
              <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold block">Longitude</span>
                <span className="text-sm font-extrabold text-white font-mono mt-0.5">{coords.lng}</span>
              </div>
              <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Speed</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{isTracking ? `${speed} km/h` : '0.0 km/h'}</span>
                </div>
                <Compass className="w-5 h-5 text-brand-purple" />
              </div>
              <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Signal Lock</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{isTracking ? `${signal}%` : '0%'}</span>
                </div>
                <Signal className={`w-5 h-5 ${isTracking ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
            </div>

            {/* Battery Widget */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium flex items-center gap-1.5">
                <Battery className={`w-4 h-4 ${battery < 25 ? 'text-brand-red animate-pulse' : 'text-emerald-400'}`} />
                SafeBand Battery:
              </span>
              <span className={`font-bold ${battery < 25 ? 'text-brand-red animate-pulse' : 'text-white'}`}>
                {battery}%
              </span>
            </div>
          </GlassCard>

          {/* Location updates log */}
          <GlassCard className="text-left">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/5">Signal Update Timeline</h3>
            <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
              <div className="flex gap-3 text-xs relative">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1 flex-shrink-0 animate-ping absolute left-1" />
                <div className="w-3.5 h-3.5 rounded-full bg-brand-red/20 border border-brand-red/50 flex-shrink-0 flex items-center justify-center relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                </div>
                <div>
                  <div className="font-bold text-white">Coordinate Sync Complete</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">Just Now • Latitude: {coords.lat}</div>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-3.5 h-3.5 rounded-full bg-brand-purple/20 border border-brand-purple/50 flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                </div>
                <div>
                  <div className="font-bold text-gray-300">Heartbeat check successful</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">30s ago • Battery: {battery}%</div>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-3.5 h-3.5 rounded-full bg-brand-purple/20 border border-brand-purple/50 flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                </div>
                <div>
                  <div className="font-bold text-gray-300">Live stream initiated</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">2m ago • Tracking armed</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
export default LiveTracking;
