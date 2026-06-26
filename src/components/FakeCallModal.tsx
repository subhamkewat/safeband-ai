import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, Mic, Volume2, Grid, MessageSquare, Plus } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const FakeCallModal: React.FC = () => {
  const { 
    fakeCallRinging, 
    fakeCallName, 
    dismissFakeCall, 
    acceptFakeCall, 
    fakeCallActive 
  } = useSafety();

  const [callDuration, setCallDuration] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Call duration counter when active
  useEffect(() => {
    let interval: number;
    if (fakeCallActive) {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setAudioPlayed(false);
    }
    return () => clearInterval(interval);
  }, [fakeCallActive]);

  // Self defense voice line simulation
  useEffect(() => {
    if (fakeCallActive && !audioPlayed) {
      setAudioPlayed(true);
      // Play a synthetic speech voice helper through speech synthesis
      if ('speechSynthesis' in window) {
        const lines = [
          `Hey! I'm nearby. I just crossed the main street. I see you, where are you now?`,
          `Okay, I'm heading towards you. Keep walking towards the brightly lit corner store, I will meet you there in two minutes.`
        ];
        
        let utteranceIndex = 0;
        const playNextLine = () => {
          if (utteranceIndex < lines.length && fakeCallActive) {
            const utterance = new SpeechSynthesisUtterance(lines[utteranceIndex]);
            utterance.rate = 0.95;
            utterance.pitch = 0.9;
            utterance.onend = () => {
              utteranceIndex++;
              // Delay next line slightly for realism
              setTimeout(playNextLine, 3500);
            };
            window.speechSynthesis.speak(utterance);
          }
        };

        // Delay starting speak for 1 second after accept
        setTimeout(playNextLine, 1000);
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [fakeCallActive, audioPlayed]);

  if (!fakeCallRinging && !fakeCallActive) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08080f] text-white p-8">
      
      {/* Top Section */}
      <div className="flex flex-col items-center mt-16 text-center">
        <span className="text-sm font-semibold tracking-wider text-brand-purple uppercase mb-1">
          {fakeCallActive ? 'Call Connected' : 'Incoming Call'}
        </span>
        <h2 className="text-3xl font-extrabold tracking-wide mb-1 text-white">{fakeCallName}</h2>
        <span className="text-xs text-gray-400 font-medium">
          {fakeCallActive ? formatDuration(callDuration) : 'Mobile'}
        </span>
      </div>

      {/* Center Call Panel (Only active when call accepted) */}
      {fakeCallActive ? (
        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto w-full my-8">
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <Mic className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">Mute</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <Grid className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">Keypad</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <Volume2 className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">Speaker</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <Plus className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">Add Call</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <Video className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">FaceTime</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-[10px] font-medium">Contacts</span>
          </button>
        </div>
      ) : (
        /* Ringing Circle Illustration */
        <div className="w-32 h-32 rounded-full border border-white/5 bg-white/3 flex items-center justify-center mx-auto my-12 relative">
          <div className="w-24 h-24 rounded-full bg-brand-purple/20 border border-brand-purple/20 flex items-center justify-center animate-ping absolute" />
          <Phone className="w-8 h-8 text-brand-purple" />
        </div>
      )}

      {/* Bottom Controls Section */}
      <div className="flex items-center justify-around w-full max-w-xs mx-auto mb-16">
        {/* Reject / End Call Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={dismissFakeCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 transform active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Decline</span>
        </div>

        {/* Accept Button (Only visible when ringing) */}
        {!fakeCallActive && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={acceptFakeCall}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 transform active:scale-95 transition-all animate-bounce cursor-pointer"
            >
              <Phone className="w-6 h-6" />
            </button>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Accept</span>
          </div>
        )}
      </div>

    </div>
  );
};
export default FakeCallModal;
