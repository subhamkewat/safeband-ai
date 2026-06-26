import React, { useState } from 'react';
import { 
  Shield, 
  Play, 
  Volume2, 
  Flame, 
  Activity, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  AudioLines, 
  HardDrive, 
  Compass, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';

interface LandingProps {
  setView: (view: 'landing' | 'login' | 'signup') => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  const [demoActive, setDemoActive] = useState(false);
  const [audioOsc, setAudioOsc] = useState<OscillatorNode | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const startDemoAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.start();
      setAudioOsc(osc);
      setAudioCtx(ctx);
    } catch (e) {
      console.warn('Audio demo blocked by browser policy', e);
    }
  };

  const stopDemoAlarm = () => {
    if (audioOsc) {
      try {
        audioOsc.stop();
      } catch (e) {}
      setAudioOsc(null);
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (e) {}
      setAudioCtx(null);
    }
  };

  const handleSOSDemoClick = () => {
    if (demoActive) {
      stopDemoAlarm();
      setDemoActive(false);
    } else {
      setDemoActive(true);
      startDemoAlarm();
      // Auto turn off demo after 4 seconds
      setTimeout(() => {
        stopDemoAlarm();
        setDemoActive(false);
      }, 4000);
    }
  };

  const features = [
    { 
      title: 'Smart SOS Alert', 
      desc: 'One-tap trigger that instantly locks your status and initiates protective protocols.', 
      icon: ShieldAlert,
      glow: 'from-rose-500/20 to-red-500/10'
    },
    { 
      title: 'Voice Activation ("Save Me")', 
      desc: 'Hands-free monitoring that triggers automatically when wake words are spoken.', 
      icon: AudioLines,
      glow: 'from-violet-500/20 to-purple-500/10'
    },
    { 
      title: 'Live Location Tracking', 
      desc: 'Real-time telemetry streaming that tracks coordinates with high precision.', 
      icon: MapPin,
      glow: 'from-blue-500/20 to-indigo-500/10'
    },
    { 
      title: 'Fake Call Generator', 
      desc: 'Instantly schedule simulated incoming calls with audio speech to deflect attention.', 
      icon: PhoneCall,
      glow: 'from-emerald-500/20 to-teal-500/10'
    },
    { 
      title: 'AI Threat Detection', 
      desc: 'Continuous decibel level analysis that monitors for screams or sound spikes.', 
      icon: Sparkles,
      glow: 'from-fuchsia-500/20 to-pink-500/10'
    },
    { 
      title: 'Emergency SMS Alert', 
      desc: 'Distributes instant distress reports and map links to your priority contacts list.', 
      icon: Flame,
      glow: 'from-orange-500/20 to-amber-500/10'
    },
    { 
      title: 'Nearby Police & Hospitals', 
      desc: 'Locates nearby secure zones and healthcare services with route details.', 
      icon: Compass,
      glow: 'from-cyan-500/20 to-sky-500/10'
    },
    { 
      title: 'Automatic Evidence Recording', 
      desc: 'Armed micro-recorder that captures audio/video files and stores them locally.', 
      icon: HardDrive,
      glow: 'from-rose-500/20 to-pink-500/10'
    },
  ];

  const steps = [
    { num: '01', title: 'Detect Danger', desc: 'AI threat monitoring flags loud screeches or vocal wake commands.' },
    { num: '02', title: 'Trigger SOS', desc: 'A 5-second countdown starts with audible warning frequencies.' },
    { num: '03', title: 'Share Location', desc: 'Live GPS location is locked and formatted into alert links.' },
    { num: '04', title: 'Notify Contacts', desc: 'Emergency contacts receive SMS coordinates and evidence syncs.' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-bg-dark">
      
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center shadow-md shadow-brand-red/20">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg text-white tracking-wider">
            SafeBand <span className="text-brand-red">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setView('login')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Log In
          </button>
          <button 
            onClick={() => setView('signup')}
            className="text-sm font-bold bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors shadow-lg cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy */}
        <div className="text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-semibold tracking-wider uppercase animate-pulse"
          >
            <Activity className="w-3.5 h-3.5" />
            AI-POWERED EMERGENCY GUARDIAN
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            SafeBand AI - Your <span className="bg-gradient-to-r from-brand-red to-brand-purple bg-clip-text text-transparent animate-cyber-glow">Intelligent</span> Safety Companion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed font-normal"
          >
            AI-powered emergency assistance for personal safety. Monitor audio threats, trigger location broadcasts, and sync evidence files instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => setView('signup')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-red to-rose-600 text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_4px_25px_rgba(244,63,94,0.35)] transform active:scale-95 transition-all cursor-pointer"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-brand-purple fill-brand-purple" />
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Right Column: SOS Interactive Button Illustration */}
        <div className="flex justify-center items-center py-6 relative">
          <div className="absolute w-72 h-72 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="relative flex flex-col items-center"
          >
            {/* Interactive SOS Dial */}
            <button
              onClick={handleSOSDemoClick}
              className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center text-white select-none transition-all duration-500 cursor-pointer ${
                demoActive 
                  ? 'bg-rose-600 animate-ripple border-4 border-white/20' 
                  : 'bg-gradient-to-tr from-[#16060c] via-[#2d050f] to-[#4c0519] border border-rose-500/30 shadow-[0_10px_40px_rgba(244,63,94,0.15)] hover:shadow-[0_10px_45px_rgba(244,63,94,0.3)] hover:border-brand-red/50 hover:scale-103'
              }`}
            >
              {demoActive ? (
                <>
                  <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 mb-1 animate-bounce" />
                  <span className="text-xl sm:text-2xl font-black tracking-widest uppercase">SIREN ON</span>
                  <span className="text-[10px] text-white/70 uppercase font-semibold mt-1">Click to Mute</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 mb-2 text-brand-red animate-pulse" />
                  <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase">SOS</span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mt-2">TEST INTERFACE</span>
                </>
              )}
            </button>
            
            <span className="text-xs text-gray-500 font-medium italic mt-6">
              * Click the button above to simulate a live SOS countdown sound
            </span>
          </motion.div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Futuristic Security Capabilities
          </h2>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            SafeBand AI is equipped with state of the art sensory and communication modules designed to operate seamlessly under critical conditions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <GlassCard 
                key={index}
                delay={index * 0.05}
                glowColor={index === 0 ? 'red' : 'none'}
                className="flex flex-col text-left group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.glow} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base text-white tracking-wide">{feat.title}</h3>
                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#05030f]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Automated Emergency Response
          </h2>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Four key steps execute synchronously within seconds to guarantee coordinate logging and secure alert delivery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-red via-brand-purple to-brand-purple/20 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 space-y-4">
              {/* Number circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-red text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-brand-purple/25 border-2 border-bg-dark">
                {step.num}
              </div>
              <h3 className="font-bold text-base text-white">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-brand-purple/10 to-brand-red/10 border border-white/8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-left">
            <h3 className="font-bold text-lg text-white">Join the Next-Gen Safety Network</h3>
            <p className="text-xs text-gray-400 mt-1">Create your secure account, register emergency contacts, and configure voice wake words.</p>
          </div>
          <button
            onClick={() => setView('signup')}
            className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-all font-bold text-xs tracking-wider uppercase whitespace-nowrap shadow-md cursor-pointer"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 w-full border-t border-white/5 text-center text-xs text-gray-500 mt-auto relative z-10">
        <p>© 2026 SafeBand AI Security Systems. All rights reserved.</p>
        <p className="mt-1 text-gray-600">Simulated emergency response system for personal safety monitoring.</p>
      </footer>

    </div>
  );
};
export default Landing;
