import React from 'react';
import { Compass, Phone, Shield, HeartPulse, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const NearbyHelp: React.FC = () => {
  const centers = [
    {
      id: '1',
      name: 'City Police Headquarters - Zone 4',
      type: 'police',
      distance: '0.4 miles',
      time: '2 mins drive / 8 mins walk',
      address: '750 Security Parkway, Core Sector',
      phone: '+1 (555) 911-0422',
      status: 'Active Dispatch',
      coordinates: '37.7761° N, 122.4182° W'
    },
    {
      id: '2',
      name: 'General Medical Center & Emergency Care',
      type: 'hospital',
      distance: '1.2 miles',
      time: '5 mins drive / 18 mins walk',
      address: '120 Health Sciences Blvd',
      phone: '+1 (555) 911-0810',
      status: 'ER Open 24/7',
      coordinates: '37.7712° N, 122.4215° W'
    },
    {
      id: '3',
      name: 'Community Safety Precinct Station',
      type: 'police',
      distance: '1.8 miles',
      time: '7 mins drive',
      address: '22 Baker St, West District',
      phone: '+1 (555) 911-0988',
      status: 'Active Dispatch',
      coordinates: '37.7815° N, 122.4091° W'
    },
    {
      id: '4',
      name: 'Mercy Trauma Clinic',
      type: 'hospital',
      distance: '2.5 miles',
      time: '10 mins drive',
      address: '900 Recovery Way',
      phone: '+1 (555) 911-0731',
      status: 'ER Open 24/7',
      coordinates: '37.7655° N, 122.4302° W'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Nearby Emergency Help Centers</h2>
        <p className="text-xs text-gray-400 mt-1">
          Locates closest certified security checkpoints and trauma clinics. Click calling badges to initiate priority dispatch.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: List of Help Centers */}
        <div className="lg:col-span-2 space-y-4">
          {centers.map((center) => (
            <GlassCard 
              key={center.id}
              glowColor={center.type === 'police' ? 'none' : 'purple'}
              className="text-left p-5 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-purple/35"
            >
              <div className="flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                  center.type === 'police' 
                    ? 'bg-rose-500/10 border-rose-500/20 text-brand-red' 
                    : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple'
                }`}>
                  {center.type === 'police' ? <Shield className="w-5.5 h-5.5" /> : <HeartPulse className="w-5.5 h-5.5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-white text-sm tracking-wide">{center.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      center.type === 'police' ? 'bg-rose-500/10 text-brand-red border border-rose-500/15' : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/15'
                    }`}>
                      {center.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold">{center.address}</p>
                  <div className="text-[10px] text-gray-500 flex items-center gap-2">
                    <span>{center.coordinates}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{center.status}</span>
                  </div>
                </div>
              </div>

              {/* Distances HUD */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0 mt-2 md:mt-0">
                <div className="text-left md:text-right">
                  <span className="text-base font-black text-white">{center.distance}</span>
                  <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{center.time}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${center.phone}`}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/3 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    title={`Dial ${center.name}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-white/5 bg-white/3 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    title="Get GPS routes"
                  >
                    <ExternalLink className="w-4 h-4 text-brand-purple" />
                  </a>
                </div>
              </div>

            </GlassCard>
          ))}
        </div>

        {/* Right: Security Checkpoint Radar widget */}
        <div className="space-y-6">
          <GlassCard className="text-left flex flex-col justify-between h-80 relative overflow-hidden">
            
            {/* Visual Radar Map Grid Backing */}
            <div className="absolute inset-0 bg-[#0c0a1a] opacity-60 z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#1f1842_1px,transparent_1px)] [background-size:20px_20px] opacity-40 z-0 pointer-events-none" />

            {/* Sweep radar line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-purple/5 to-transparent origin-center animate-spin-slow pointer-events-none z-0" style={{ animationDuration: '6s' }} />

            {/* Radar layout graphics nodes */}
            <div className="relative z-10 space-y-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Compass className="w-4 h-4 text-brand-purple" />
                  Target Compass
                </h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Automatic bearing mapping centered on locked device coordinates.
                </p>
              </div>

              {/* Pulsing Target nodes */}
              <div className="relative w-full h-28 flex items-center justify-center">
                {/* Center */}
                <div className="w-2.5 h-2.5 rounded-full bg-brand-red shadow-md" />
                
                {/* Police station 1 (0.4m, North) */}
                <div className="absolute top-4 left-[40%] text-center">
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-[8px] text-gray-500 font-bold block mt-0.5">P1 (0.4m)</span>
                </div>
                
                {/* ER Hospital 1 (1.2m, South West) */}
                <div className="absolute bottom-6 left-[20%] text-center">
                  <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                  <span className="text-[8px] text-gray-500 font-bold block mt-0.5">H1 (1.2m)</span>
                </div>
              </div>

              <div className="text-[9px] text-gray-500 font-mono tracking-widest text-center">
                SCANNING SECTOR LOCK... OK
              </div>
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
};
export default NearbyHelp;
