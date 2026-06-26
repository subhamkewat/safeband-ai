import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priorityAlert: boolean;
}

export interface IncidentLog {
  id: string;
  timestamp: string;
  triggerType: 'manual' | 'voice' | 'threat' | 'offline';
  location: { lat: number; lng: number; accuracy: number; address: string } | null;
  evidenceFiles: { type: 'audio' | 'video'; name: string; duration: string; url: string }[];
  contactsNotified: string[];
}

interface SafetyContextType {
  // Safety statuses
  guardianStatus: 'active' | 'searching' | 'standby' | 'alert';
  gpsStatus: 'online' | 'searching' | 'offline';
  micStatus: 'active' | 'muted' | 'error';
  cameraStatus: 'armed' | 'idle' | 'error';
  networkStatus: 'online' | 'offline';
  location: { lat: number; lng: number; accuracy: number; address: string } | null;

  // Emergency contacts CRUD
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  editContact: (contact: EmergencyContact) => void;
  deleteContact: (id: string) => void;

  // SOS workflow
  sosActive: boolean;
  sosCountdown: number;
  triggerSOS: (triggerType?: 'manual' | 'voice' | 'threat' | 'offline') => void;
  cancelSOS: () => void;
  sosAudioAlert: boolean;
  toggleSOSAudio: () => void;

  // AI Threat Detection & Speech Wake word
  wakeWordsEnabled: boolean;
  toggleWakeWords: (enabled: boolean) => void;
  threatLevel: number; // 0 to 100
  threatAnalysisActive: boolean;
  toggleThreatAnalysis: (enabled: boolean) => void;
  lastDetectedSound: string;

  // Fake Call
  fakeCallRinging: boolean;
  fakeCallName: string;
  fakeCallDelay: number; // seconds
  scheduleFakeCall: (name: string, delaySeconds: number) => void;
  dismissFakeCall: () => void;
  acceptFakeCall: () => void;
  fakeCallActive: boolean; // active call (in-progress)

  // Incident & Evidence
  incidents: IncidentLog[];
  isRecording: boolean;
  recordingType: 'audio' | 'video' | null;
  startRecording: (type: 'audio' | 'video') => void;
  stopRecording: () => void;
  recordings: { id: string; name: string; type: 'audio' | 'video'; url: string; timestamp: string; size: string }[];
  deleteRecording: (id: string) => void;

  // Settings
  sosMessage: string;
  setSosMessage: (msg: string) => void;
  autoRecordEvidence: boolean;
  setAutoRecordEvidence: (enabled: boolean) => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

// Sound effects or alarm using Web Audio API (so we don't rely on remote file loads)
const playAlarmSound = (ctx: AudioContext | null) => {
  if (!ctx) return null;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch siren
  // Modulate siren pitch
  osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.4);
  osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.8);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  osc.start();
  
  // Make it repeat
  const interval = setInterval(() => {
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.8);
  }, 800);

  return { osc, interval, gain };
};

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Telemetry status
  const [guardianStatus, setGuardianStatus] = useState<'active' | 'searching' | 'standby' | 'alert'>('active');
  const [gpsStatus, setGpsStatus] = useState<'online' | 'searching' | 'offline'>('online');
  const [micStatus, setMicStatus] = useState<'active' | 'muted' | 'error'>('active');
  const [cameraStatus] = useState<'armed' | 'idle' | 'error'>('armed');
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline');
  const [location, setLocation] = useState<SafetyContextType['location']>(null);

  // Settings state
  const [sosMessage, setSosMessageState] = useState(() => 
    localStorage.getItem('safeband_sos_message') || "EMERGENCY! I need help immediately. My tracked location: [LINK]"
  );
  const [autoRecordEvidence, setAutoRecordEvidenceState] = useState(() => 
    JSON.parse(localStorage.getItem('safeband_auto_record') || 'true')
  );
  const [wakeWordsEnabled, setWakeWordsEnabled] = useState(() => 
    JSON.parse(localStorage.getItem('safeband_wake_words_enabled') || 'true')
  );
  const [threatAnalysisActive, setThreatAnalysisActive] = useState(() => 
    JSON.parse(localStorage.getItem('safeband_threat_analysis_enabled') || 'true')
  );

  const setSosMessage = (msg: string) => {
    setSosMessageState(msg);
    localStorage.setItem('safeband_sos_message', msg);
  };
  const setAutoRecordEvidence = (enabled: boolean) => {
    setAutoRecordEvidenceState(enabled);
    localStorage.setItem('safeband_auto_record', JSON.stringify(enabled));
  };

  // Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('safeband_contacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'John Doe', phone: '+1 (555) 019-2834', relationship: 'Guardian / Father', priorityAlert: true },
      { id: '2', name: 'Jane Smith', phone: '+1 (555) 012-9843', relationship: 'Sister', priorityAlert: true },
      { id: '3', name: 'Sherlock Holmes', phone: '+1 (555) 777-8888', relationship: 'Friend', priorityAlert: false }
    ];
  });

  // Incidents & Evidence
  const [incidents, setIncidents] = useState<IncidentLog[]>(() => {
    const saved = localStorage.getItem('safeband_incidents');
    return saved ? JSON.parse(saved) : [];
  });
  const [recordings, setRecordings] = useState<SafetyContextType['recordings']>(() => {
    const saved = localStorage.getItem('safeband_recordings');
    return saved ? JSON.parse(saved) : [];
  });

  // SOS Workflow state
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosAudioAlert, setSosAudioAlert] = useState(true);
  const countdownIntervalRef = useRef<number | null>(null);

  // Sound generator references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenRef = useRef<{ osc: OscillatorNode; interval: any; gain: GainNode } | null>(null);

  // AI Threat detection state
  const [threatLevel, setThreatLevel] = useState(12);
  const [lastDetectedSound, setLastDetectedSound] = useState('Normal ambient level');
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const threatIntervalRef = useRef<number | null>(null);

  // Voice recognition references
  const recognitionRef = useRef<any>(null);

  // Fake call details
  const [fakeCallRinging, setFakeCallRinging] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallName, setFakeCallName] = useState('Dad');
  const [fakeCallDelay, setFakeCallDelay] = useState(10);
  const fakeCallTimerRef = useRef<number | null>(null);
  const ringtoneOscRef = useRef<OscillatorNode | null>(null);
  const ringtoneCtxRef = useRef<AudioContext | null>(null);

  // Evidence Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Monitor network status
  useEffect(() => {
    const goOnline = () => setNetworkStatus('online');
    const goOffline = () => setNetworkStatus('offline');
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Sync contacts and logs to localStorage
  useEffect(() => {
    localStorage.setItem('safeband_contacts', JSON.stringify(contacts));
  }, [contacts]);
  useEffect(() => {
    localStorage.setItem('safeband_incidents', JSON.stringify(incidents));
  }, [incidents]);
  useEffect(() => {
    localStorage.setItem('safeband_recordings', JSON.stringify(recordings));
  }, [recordings]);

  // Retrieve Location coordinates
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            address: 'Simulated Secure Zone, Current Location'
          });
          setGpsStatus('online');
        },
        (err) => {
          console.warn('Geolocation access failed', err);
          // Standard fallback (mock coordinates)
          setLocation({
            lat: 37.7749,
            lng: -122.4194,
            accuracy: 15,
            address: 'Simulated fallback (San Francisco, CA)'
          });
          setGpsStatus('online');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setGpsStatus('offline');
    }
  }, []);

  // Web Speech API Voice Activation
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (e: any) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          text += e.results[i][0].transcript;
        }

        const transcript = text.toLowerCase();
        // Check keywords
        if (
          transcript.includes('save me') || 
          transcript.includes('help me') || 
          transcript.includes('emergency') ||
          transcript.includes('sos alert')
        ) {
          setLastDetectedSound(`Keyword detected: "${text.trim()}"`);
          triggerSOS('voice');
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error', e.error);
        if (e.error === 'not-allowed') {
          setMicStatus('error');
        }
      };

      recognition.onend = () => {
        // Automatically restart speech recognizer if enabled and not SOS active
        if (wakeWordsEnabled && !sosActive) {
          try {
            recognition.start();
          } catch (e) {
            // Ignore if already starting
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech Recognition start error:', e);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Toggle speech recognition trigger
  const toggleWakeWords = (enabled: boolean) => {
    setWakeWordsEnabled(enabled);
    localStorage.setItem('safeband_wake_words_enabled', JSON.stringify(enabled));
    if (enabled) {
      initSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  };

  // Sound Analyzer / decibel monitor for AI Threat Detection
  const initAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicStatus('active');

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioAnalyserRef.current = analyser;

      // Start looping volume analysis
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const monitorAudio = () => {
        if (!audioAnalyserRef.current) return;
        audioAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const mappedThreat = Math.min(100, Math.max(8, Math.round((average / 128) * 100)));

        setThreatLevel((prev) => {
          // Slowly decay threat level
          if (mappedThreat > prev) {
            // If sound decibels are high, threat confidence raises
            if (mappedThreat > 65) {
              setLastDetectedSound('Sudden high-decibel spike detected (potential scream/distress)');
              if (mappedThreat > 82) {
                // Auto trigger SOS if threat level reaches peak confidence
                setTimeout(() => triggerSOS('threat'), 500);
              }
            }
            return mappedThreat;
          } else {
            return Math.max(12, prev - 2);
          }
        });
        threatIntervalRef.current = requestAnimationFrame(monitorAudio);
      };

      threatIntervalRef.current = requestAnimationFrame(monitorAudio);
    } catch (e) {
      console.warn('Microphone access denied or not available', e);
      setMicStatus('error');
      // Simulate fake threat spikes if permission is not available but analyzer is enabled
      const simInterval = window.setInterval(() => {
        if (threatAnalysisActive) {
          const mockSpike = Math.random() > 0.95;
          if (mockSpike) {
            setThreatLevel(85);
            setLastDetectedSound('AI simulated audio distress trigger (95% scream match)');
            setTimeout(() => triggerSOS('threat'), 500);
          } else {
            setThreatLevel((prev) => Math.max(8, prev - 4));
          }
        }
      }, 1500);
      (threatIntervalRef.current as any) = simInterval;
    }
  };

  const stopAudioAnalyser = () => {
    if (threatIntervalRef.current) {
      if (typeof threatIntervalRef.current === 'number') {
        cancelAnimationFrame(threatIntervalRef.current);
        clearInterval(threatIntervalRef.current);
      }
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    audioAnalyserRef.current = null;
  };

  const toggleThreatAnalysis = (enabled: boolean) => {
    setThreatAnalysisActive(enabled);
    localStorage.setItem('safeband_threat_analysis_enabled', JSON.stringify(enabled));
    if (enabled) {
      initAudioAnalyser();
    } else {
      stopAudioAnalyser();
    }
  };

  // Start background services on mount
  useEffect(() => {
    if (wakeWordsEnabled) {
      initSpeechRecognition();
    }
    if (threatAnalysisActive) {
      initAudioAnalyser();
    }
    return () => {
      stopSpeechRecognition();
      stopAudioAnalyser();
    };
  }, []);

  // SOS Countdown and Trigger flow
  const triggerSOS = (triggerType: IncidentLog['triggerType'] = 'manual') => {
    if (sosActive) return; // already active

    // Start 5 second countdown
    setSosActive(true);
    setSosCountdown(5);
    setGuardianStatus('alert');

    // Siren setup if sound alert enabled
    if (sosAudioAlert) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const actx = new AudioContextClass();
      audioCtxRef.current = actx;
      sirenRef.current = playAlarmSound(actx);
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setSosCountdown((prev) => {
        if (prev <= 1) {
          // Countdown complete! Trigger ultimate response
          clearInterval(countdownIntervalRef.current!);
          executeEmergencyResponse(triggerType);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Execute emergency functions (capturing metadata, notifying contacts, starting record)
  const executeEmergencyResponse = async (triggerType: IncidentLog['triggerType']) => {
    // 1. Get GPS coordinates
    let loc = location;
    if (!loc && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          address: 'Verified SOS Coordinates'
        };
        setLocation(loc);
      });
    }

    // 2. Start Automatic Recording (Audio or Video)
    if (autoRecordEvidence) {
      // Prioritize video evidence, fallback to audio
      startRecording('video');
    }

    // 3. Notify contacts (Mocking network/SMS API alerts)
    const contactsToAlert = contacts.filter((c) => c.priorityAlert).map((c) => c.name);
    
    // If network status is offline, cache the notifications for later
    const newIncident: IncidentLog = {
      id: 'inc_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      triggerType: networkStatus === 'offline' ? 'offline' : triggerType,
      location: loc || { lat: 37.7749, lng: -122.4194, accuracy: 10, address: 'Fallback location (Simulated offline)' },
      evidenceFiles: [],
      contactsNotified: contactsToAlert.length > 0 ? contactsToAlert : ['Emergency Dispatch Center (Fallback)']
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Simple desktop notification mockup
    if (Notification.permission === 'granted') {
      new Notification('SafeBand SOS Triggered', {
        body: `Alerting ${newIncident.contactsNotified.join(', ')} of your emergency.`,
        icon: '/favicon.svg'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const cancelSOS = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    // Stop alarms
    if (sirenRef.current) {
      try {
        clearInterval(sirenRef.current.interval);
        sirenRef.current.osc.stop();
        sirenRef.current.gain.disconnect();
      } catch (e) {}
      sirenRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }

    // Stop recordings if active
    if (isRecording) {
      stopRecording();
    }

    setSosActive(false);
    setSosCountdown(5);
    setGuardianStatus('active');
  };

  const toggleSOSAudio = () => {
    setSosAudioAlert((prev) => !prev);
    // If SOS already active, mute/unmute
    if (sosActive) {
      if (sosAudioAlert) {
        // Mute
        if (sirenRef.current) {
          sirenRef.current.gain.gain.setValueAtTime(0, audioCtxRef.current!.currentTime);
        }
      } else {
        // Unmute
        if (sirenRef.current) {
          sirenRef.current.gain.gain.setValueAtTime(0.3, audioCtxRef.current!.currentTime);
        } else {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const actx = new AudioContextClass();
          audioCtxRef.current = actx;
          sirenRef.current = playAlarmSound(actx);
        }
      }
    }
  };

  // Contacts CRUD
  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = { ...contact, id: 'contact_' + Math.random().toString(36).substr(2, 9) };
    setContacts((prev) => [...prev, newContact]);
  };

  const editContact = (updatedContact: EmergencyContact) => {
    setContacts((prev) => prev.map((c) => (c.id === updatedContact.id ? updatedContact : c)));
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Audio/Video Evidence Recording Logic
  const startRecording = async (type: 'audio' | 'video') => {
    setIsRecording(true);
    setRecordingType(type);
    recordedChunksRef.current = [];

    const constraints = {
      audio: true,
      video: type === 'video' ? { facingMode: 'user' } : false
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mime = type === 'video' ? 'video/webm' : 'audio/webm';
      
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        const fileName = `Evidence_${type === 'video' ? 'Video' : 'Audio'}_${new Date().toLocaleDateString().replace(/\//g, '-')}_${Date.now().toString().slice(-4)}.${type === 'video' ? 'webm' : 'webm'}`;
        const newRecord = {
          id: 'rec_' + Math.random().toString(36).substr(2, 9),
          name: fileName,
          type,
          url,
          timestamp: new Date().toLocaleString(),
          size: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`
        };

        setRecordings((prev) => [newRecord, ...prev]);

        // Add to last incident if available
        setIncidents((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            evidenceFiles: [...updated[0].evidenceFiles, { type, name: fileName, duration: '0:15', url }]
          };
          return updated;
        });

        // Close streams
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      // Automatically limit recording to 15 seconds to prevent browser memory leaks
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          stopRecording();
        }
      }, 15000);
    } catch (e) {
      console.warn('Device recording permissions blocked or not supported. Loading simulated evidence capture.', e);
      // Simulate standard capture
      setTimeout(() => {
        const fileName = `Simulated_${type === 'video' ? 'Video' : 'Audio'}_${Date.now().toString().slice(-4)}.${type === 'video' ? 'mp4' : 'wav'}`;
        const mockRecord = {
          id: 'rec_' + Math.random().toString(36).substr(2, 9),
          name: fileName,
          type,
          url: '#', // simulation placeholder
          timestamp: new Date().toLocaleString(),
          size: type === 'video' ? '1.8 MB' : '230 KB'
        };
        setRecordings((prev) => [mockRecord, ...prev]);

        // Link with incident
        setIncidents((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            evidenceFiles: [...updated[0].evidenceFiles, { type, name: fileName, duration: '0:08', url: '#' }]
          };
          return updated;
        });

        setIsRecording(false);
        setRecordingType(null);
      }, 4000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingType(null);
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  // Fake Call sound player
  const startRingtone = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      ringtoneCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(453, ctx.currentTime); // Standard phone ring mix
      osc2.frequency.setValueAtTime(400, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Simulate ring cadence: 2 seconds on, 4 seconds off
      const ringCadence = () => {
        if (!ringtoneCtxRef.current) return;
        const now = ringtoneCtxRef.current.currentTime;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0, now + 2);
      };
      
      ringCadence();
      const interval = setInterval(ringCadence, 6000);

      osc1.start();
      osc2.start();
      ringtoneOscRef.current = osc1; // store reference
      (ringtoneOscRef.current as any).interval = interval;
      (ringtoneOscRef.current as any).osc2 = osc2;
      (ringtoneOscRef.current as any).gain = gain;
    } catch (e) {
      console.warn('Failed to start ringtone audio', e);
    }
  };

  const stopRingtone = () => {
    if (ringtoneOscRef.current) {
      try {
        clearInterval((ringtoneOscRef.current as any).interval);
        ringtoneOscRef.current.stop();
        (ringtoneOscRef.current as any).osc2.stop();
        (ringtoneOscRef.current as any).gain.disconnect();
      } catch (e) {}
      ringtoneOscRef.current = null;
    }
    if (ringtoneCtxRef.current) {
      try {
        ringtoneCtxRef.current.close();
      } catch (e) {}
      ringtoneCtxRef.current = null;
    }
  };

  // Fake Call Generator Actions
  const scheduleFakeCall = (name: string, delaySeconds: number) => {
    setFakeCallName(name);
    setFakeCallDelay(delaySeconds);
    
    if (fakeCallTimerRef.current) {
      clearTimeout(fakeCallTimerRef.current);
    }

    fakeCallTimerRef.current = window.setTimeout(() => {
      setFakeCallRinging(true);
      startRingtone();
    }, delaySeconds * 1000);
  };

  const dismissFakeCall = () => {
    if (fakeCallTimerRef.current) {
      clearTimeout(fakeCallTimerRef.current);
    }
    stopRingtone();
    setFakeCallRinging(false);
    setFakeCallActive(false);
  };

  const acceptFakeCall = () => {
    stopRingtone();
    setFakeCallRinging(false);
    setFakeCallActive(true);
  };

  return (
    <SafetyContext.Provider value={{
      guardianStatus,
      gpsStatus,
      micStatus,
      cameraStatus,
      networkStatus,
      location,
      contacts,
      addContact,
      editContact,
      deleteContact,
      sosActive,
      sosCountdown,
      triggerSOS,
      cancelSOS,
      sosAudioAlert,
      toggleSOSAudio,
      wakeWordsEnabled,
      toggleWakeWords,
      threatLevel,
      threatAnalysisActive,
      toggleThreatAnalysis,
      lastDetectedSound,
      fakeCallRinging,
      fakeCallName,
      fakeCallDelay,
      scheduleFakeCall,
      dismissFakeCall,
      acceptFakeCall,
      fakeCallActive,
      incidents,
      isRecording,
      recordingType,
      startRecording,
      stopRecording,
      recordings,
      deleteRecording,
      sosMessage,
      setSosMessage,
      autoRecordEvidence,
      setAutoRecordEvidence
    }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
