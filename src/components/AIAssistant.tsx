import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, HeartPulse, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your SafeBand AI Assistant. I can guide you with safety recommendations, first-aid tips, self-defense moves, or show you how to use this app. How can I help you feel secure today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Simulated AI response engine
  const handleQuery = (queryText: string) => {
    const userMsg: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let aiText = '';
      const text = queryText.toLowerCase();

      if (text.includes('first aid') || text.includes('panic') || text.includes('hurt') || text.includes('breathing')) {
        aiText = "🚑 **First Aid & Panic Relief Guide:**\n\n1. **Deep Breathing**: Follow a 4-4-4 rhythm (Inhale for 4s, Hold for 4s, Exhale for 4s) to reset your nervous system.\n2. **Physical Injury**: If bleeding, apply firm, direct pressure with a clean cloth. Elevate the injured area above the heart if possible.\n3. **De-escalate**: If suffering a panic attack, look around and name 5 things you can see, 4 things you can touch, 3 things you hear, 2 smell, 1 taste (5-4-3-2-1 Grounding Method).";
      } else if (text.includes('night') || text.includes('walk') || text.includes('alone') || text.includes('unsafe')) {
        aiText = "🚶‍♀️ **Safe Night Walking Tips:**\n\n1. **Stay Alert**: Never use headphones or stare down at your phone. Keep your chin up and scanning.\n2. **Virtual Escort**: Arm the **SafeBand Live Tracking** tab. Keep your hand near your phone or band to trigger SOS.\n3. **Deterrent**: Use the **Fake Call** module in your dashboard. Hearing you say 'Yeah, I see you, I\\'m almost at the gate' makes you a difficult target.\n4. **Public Places**: Stick to well-lit main roads. Never take shortcuts through dark parks or alleyways.";
      } else if (text.includes('voice') || text.includes('wake') || text.includes('save me') || text.includes('activation')) {
        aiText = "🎙️ **Voice Activation Configuration:**\n\n- SafeBand monitors for trigger phrases: **'Save Me'**, **'Help Me'**, or **'Emergency'**.\n- Ensure you have granted microphone access (indicated by the **Voice Status Badge** in the top bar).\n- You can toggle this service on/off or configure custom parameters directly inside the **Settings** page.";
      } else if (text.includes('who are you') || text.includes('safeband') || text.includes('how does it work')) {
        aiText = "🛡️ **SafeBand AI** is your smart safety system. In danger, double tap or voice activate to start a **5-second countdown**. If not cancelled, it captures your **GPS coordinates**, begins **auto-recording video/audio**, sends **secure SMS links** to your emergency contacts, and maps out the **closest police and hospital centers**.";
      } else {
        aiText = "Understood. SafeBand AI is currently monitoring your environment. If you ever feel unsafe, press the red **SOS Button** on the dashboard, double tap, or call out **'Save Me'**. For other safety suggestions, feel free to ask about night walks, first-aid, or voice activations.";
      }

      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 850);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleQuery(inputText);
    setInputText('');
  };

  const suggestedPrompts = [
    { label: 'Night walk safety tips', icon: UserCheck, query: 'Night walking safety tips' },
    { label: 'First aid / Panic attack', icon: HeartPulse, query: 'First aid for panic attack' },
    { label: 'Voice activation trigger', icon: Sparkles, query: 'How does voice activation work?' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[calc(100vw-2rem)] max-w-[360px] sm:w-[380px] h-[450px] sm:h-[500px] flex flex-col z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="flex flex-col h-full bg-glass-bg backdrop-blur-2xl">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-purple/20 to-brand-red/10 px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-red flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">SafeBand AI Guard</h3>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      AI Agent Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs line-clamp-none ${
                        msg.sender === 'user'
                          ? 'bg-brand-purple/70 text-white rounded-br-none'
                          : 'bg-white/5 border border-white/8 text-gray-200 rounded-bl-none leading-relaxed'
                      }`}
                    >
                      {/* Simple markdown parsing for bold elements */}
                      {msg.text.split('\n').map((line, idx) => {
                        let content = line;
                        // Replace markdown bold **text** with strong HTML
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        if (boldRegex.test(line)) {
                          const parts = line.split('**');
                          return (
                            <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                              {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-brand-purple">{part}</strong> : part)}
                            </p>
                          );
                        }
                        return <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>{content}</p>;
                      })}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Grid */}
              {messages.length === 1 && (
                <div className="p-4 pt-0 space-y-2 border-t border-white/5 pt-3">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Suggested Questions</span>
                  <div className="grid gap-1.5">
                    {suggestedPrompts.map((prompt, i) => {
                      const Icon = prompt.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuery(prompt.query)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/5 hover:border-brand-purple/35 text-[11px] text-gray-300 hover:text-white transition-all duration-200"
                        >
                          <Icon className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" />
                          <span>{prompt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask for first aid, safety advice..."
                  className="flex-1 bg-white/3 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white flex items-center justify-center transition-colors shadow-lg shadow-brand-purple/25"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-brand-red flex items-center justify-center text-white shadow-[0_5px_25px_rgba(168,85,247,0.45)] hover:shadow-[0_5px_30px_rgba(244,63,94,0.6)] cursor-pointer relative"
      >
        {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : <MessageSquare className="w-6 h-6 animate-pulse-slow" />}
        
        {/* Subtle dot indicator */}
        {!isOpen && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-black/20"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
export default AIAssistant;
