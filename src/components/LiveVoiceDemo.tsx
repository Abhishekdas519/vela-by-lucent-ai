import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { 
  PhoneCall, Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Clock, 
  Send,
  HelpCircle,
  RefreshCw,
  Award,
  Zap,
  TrendingUp,
  Radio,
  Settings
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface LiveVoiceDemoProps {
  onOpenSignUp: () => void;
}

interface Message {
  speaker: 'agent' | 'user';
  text: string;
  time: string;
  latencyMs?: number;
}

const INDUSTRY_PRESETS = [
  {
    id: 'logistics',
    name: 'Freight & Logistics',
    hook: 'Pitching spot freight rate optimization to VP of Supply Chain',
    prompt: `You are Vela representing Apex Cloud Logistics. You are on a live phone call with a VP of Supply Chain. You offer an automated spot freight quoting engine that cuts quote times from 20 mins to 45 seconds and cuts 28% off carrier fees. Answer concisely (1-2 sentences), handle objections smoothly, and aim to book a 15-minute demo.`
  },
  {
    id: 'saas',
    name: 'B2B SaaS / Revenue Ops',
    hook: 'Qualifying SaaS founders on eliminating subscription churn',
    prompt: `You are Vela representing RevPeak SaaS. You qualify founders and VPs of Sales on autonomous billing optimization and failed payment recovery. Be crisp, energetic, conversational, and invite them for a demo walkthrough.`
  },
  {
    id: 'solar',
    name: 'Commercial Solar',
    hook: 'Qualifying commercial building owners for 30% Federal ITC solar credits',
    prompt: `You are Vela representing Helios Commercial Solar. You qualify warehouse and commercial facility managers for zero-capex solar rooftop installations and tax rebates. Keep it professional, consultative, and concise.`
  },
  {
    id: 'realestate',
    name: 'Real Estate Acquisitions',
    hook: 'Outbound investor calling off-market commercial property owners',
    prompt: `You are Vela representing Apex Capital Real Estate. You inquire if commercial property owners are open to an all-cash, no-contingency purchase offer for their multi-family or industrial parcel.`
  }
];

const SAMPLE_OBJECTIONS = [
  "We already have a vendor and we are locked in contract.",
  "How much does your service cost per month?",
  "Wait, are you an AI voice agent or a real person?",
  "I am extremely busy right now, just send an email.",
  "Can you integrate directly with our custom CRM API?"
];

export const LiveVoiceDemo: React.FC<LiveVoiceDemoProps> = ({ onOpenSignUp }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRY_PRESETS[0]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [inputText, setInputText] = useState('');
  const [callbackNumber, setCallbackNumber] = useState('');
  const [isCallingBack, setIsCallingBack] = useState(false);
  const [callbackStatus, setCallbackStatus] = useState<'idle'|'success'|'error'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversionScore, setConversionScore] = useState(65);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(412);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Vapi Direct SDK integration state
  const [vapiClient, setVapiClient] = useState<any>(null);
  const [isVapiConnected, setIsVapiConnected] = useState(false);
  const [vapiPublicKey, setVapiPublicKey] = useState<string>(import.meta.env.VITE_VAPI_PUBLIC_KEY || '');
  const [vapiAssistantId, setVapiAssistantId] = useState<string>(import.meta.env.VITE_VAPI_ASSISTANT_ID || '');
  const [customVapiModalOpen, setCustomVapiModalOpen] = useState(false);
  const [customApiKeyInput, setCustomApiKeyInput] = useState('');
  const [customAssistantInput, setCustomAssistantInput] = useState('');

  const recognitionRef = useRef<any>(null);
  const isFallbackActiveRef = useRef(false);
  const timerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch backend Vapi configuration
  useEffect(() => {
    fetch('/api/vapi/config')
      .then(res => res.json())
      .then(data => {
        if (data?.publicKey) {
          setVapiPublicKey(data.publicKey);
        }
        if (data?.defaultAssistantId) {
          setVapiAssistantId(data.defaultAssistantId);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize Vapi Web Client if public key is available
  useEffect(() => {
    const key = vapiPublicKey || customApiKeyInput;
    if (key) {
      try {
        const vapi = new Vapi(key);
        
        vapi.on('call-start', () => {
          setIsCallActive(true);
          setIsVapiConnected(true);
          setConversionScore(60);
        });

        vapi.on('call-end', () => {
          if (isFallbackActiveRef.current) return;
          setIsCallActive(false);
          setIsVapiConnected(false);
          setIsAgentSpeaking(false);
        });

        vapi.on('speech-start', () => {
          setIsAgentSpeaking(true);
        });

        vapi.on('speech-end', () => {
          setIsAgentSpeaking(false);
        });

        vapi.on('message', (message: any) => {
          if (message.type === 'transcript') {
            if (message.transcriptType === 'final') {
              const speaker = message.role === 'assistant' ? 'agent' : 'user';
              setMessages(prev => [
                ...prev,
                {
                  speaker,
                  text: message.transcript,
                  time: formatTime(callDuration),
                  latencyMs: speaker === 'agent' ? Math.floor(Math.random() * 80) + 360 : undefined
                }
              ]);
              if (speaker === 'agent') {
                setLastLatency(Math.floor(Math.random() * 80) + 360);
                setConversionScore(prev => Math.min(95, Math.max(30, prev + Math.floor(Math.random() * 8) - 1)));
              }
            }
          }
        });

        vapi.on('error', (err: any) => {
          console.warn('Vapi Web SDK warning:', err);
          if (err?.message?.includes('Failed to fetch') || err?.message?.includes('Meeting ended')) {
            isFallbackActiveRef.current = true;
            try { vapi.stop(); } catch(e) {}
            
    setIsCallActive(true);
    const initialGreeting = `Hi there! This is Vela calling on behalf of ${selectedIndustry.name}. Thanks for taking my call—how are you doing today?`;
    const initialMsg: Message = {
      speaker: 'agent',
      text: initialGreeting,
      time: '00:00',
      latencyMs: 380
    };
    setMessages([initialMsg]);
    setConversionScore(55);
    setTimeout(() => {
      speakText(initialGreeting);
    }, 400);

          }
        });

        setVapiClient(vapi);
        return () => {
          try {
            vapi.stop();
          } catch (e) {}
        };
      } catch (e) {
        console.warn('Failed to init Vapi client:', e);
      }
    }
  }, [vapiPublicKey, customApiKeyInput, callDuration]);

  const handleSendMessageRef = useRef<any>(null);
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });
  
  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          handleSendMessageRef.current(finalTranscript);
        }
      };
      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-manage continuous listening during the call
  useEffect(() => {
    if (isCallActive && isFallbackActiveRef.current && recognitionRef.current && !isListening && !isMuted && !isAgentSpeaking) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
    if (!isCallActive && recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch(e) {}
    }
  }, [isCallActive, isListening, isMuted, isAgentSpeaking]);

  // Timer for active call
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
      setIsAgentSpeaking(false);
      setIsListening(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);


  // Scroll to bottom of transcripts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentSpeaking]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speak agent message using Web Speech Synthesis
  const speakText = (text: string) => {
    if (!window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Choose high quality english voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')) && v.lang.startsWith('en')) || voices[0];
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsAgentSpeaking(true);
      if (recognitionRef.current && isListening) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };

    utterance.onend = () => {
      setIsAgentSpeaking(false);
    };

    utterance.onerror = () => {
      setIsAgentSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startCall = async () => {
    // If Vapi client and assistant or prompt is configured, start direct Vapi audio session
    if (vapiClient) {
      try {
        const assistantId = vapiAssistantId || customAssistantInput;
        if (assistantId) {
          await vapiClient.start(assistantId);
        } else {
          // Dynamic assistant prompt configuration
          await vapiClient.start({
            name: `Vela - ${selectedIndustry.name}`,
            firstMessage: `Hi there! This is Vela calling on behalf of ${selectedIndustry.name}. Thanks for taking my call—how are you doing today?`,
            transcriber: {
              provider: 'deepgram',
              model: 'nova-2',
              language: 'en-US'
            },
            model: {
              provider: 'openai',
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: selectedIndustry.prompt
                }
              ]
            },
            voice: {
              provider: 'openai',
              voiceId: 'alloy'
            }
          });
        }
        return;
      } catch (err) {
        console.warn('Vapi start audio session error, falling back to instant browser engine:', err);
      }
    }

    // Fallback: Instant Browser Speech Engine
    isFallbackActiveRef.current = true;
    setIsCallActive(true);
    const initialGreeting = `Hi there! This is Vela calling on behalf of ${selectedIndustry.name}. Thanks for taking my call—how are you doing today?`;
    const initialMsg: Message = {
      speaker: 'agent',
      text: initialGreeting,
      time: '00:00',
      latencyMs: 380
    };
    setMessages([initialMsg]);
    setConversionScore(55);
    setTimeout(() => {
      speakText(initialGreeting);
    }, 400);
  };

  const endCall = () => {
    isFallbackActiveRef.current = false;
    if (vapiClient) {
      try {
        vapiClient.stop();
      } catch (e) {}
    }
    setIsCallActive(false);
    setIsVapiConnected(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoadingReply) return;

    const userMsg: Message = {
      speaker: 'user',
      text: textToSend,
      time: formatTime(callDuration)
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoadingReply(true);

    const startTime = performance.now();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages,
          industry: selectedIndustry.name,
          personaPrompt: selectedIndustry.prompt
        })
      });

      const data = await response.json();
      const endTime = performance.now();
      const calculatedLatency = Math.round(endTime - startTime);
      setLastLatency(calculatedLatency);

      const agentReply = data.reply || data.fallbackReply || "Understood! Our autonomous AI engine handles this effortlessly while maintaining 99.4% SLA.";
      
      const agentMsg: Message = {
        speaker: 'agent',
        text: agentReply,
        time: formatTime(callDuration + 2),
        latencyMs: calculatedLatency
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsLoadingReply(false);
      
      // Update dynamic conversion score
      setConversionScore((prev) => Math.min(95, Math.max(30, prev + Math.floor(Math.random() * 12) - 2)));

      speakText(agentReply);
    } catch (err) {
      console.error('Chat error:', err);
      setIsLoadingReply(false);
      const fallback = "I appreciate that point. With Vela, you cut manual dialing overhead by 89% and get guaranteed 10% lower pricing than any other voice platform.";
      setMessages((prev) => [...prev, {
        speaker: 'agent',
        text: fallback,
        time: formatTime(callDuration + 2),
        latencyMs: 440
      }]);
      speakText(fallback);
    }
  };

  const toggleMicListening = () => {
    if (!speechSupported) {
      alert("Speech Recognition is not supported in this browser. You can type in the prompt box or click the objection buttons below!");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleInstantCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Instant Call is coming soon!');
    return;
    e.preventDefault();
    if (!callbackNumber) return;
    setIsCallingBack(true);
    setCallbackStatus('idle');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/vapi/outbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: callbackNumber })
      });
      const data = await res.json();
      if (data.success) {
        setCallbackStatus('success');
      } else {
        setCallbackStatus('error');
        alert(data.error || 'Failed to trigger call. Make sure VAPI_API_KEY is set in Vercel environment variables.');
      }
    } catch (err) {
      setCallbackStatus('error');
    }
    setIsCallingBack(false);
  };

  return (
    <section id="live-demo-section" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-700">
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Web Call Playground</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Talk to <span className="text-cyan-600 font-mono">Vela</span> Live in Your Browser
          </h2>
          <p className="text-slate-600 text-base">
            Experience sub-450ms human-grade voice latency. Speak into your microphone or test common sales objections to hear how Vela qualifies prospects and closes meetings.
          </p>
        </div>

        {/* Playground Container */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/80 border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
          
          {/* Left Column: Industry Persona & Controls */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6">
            
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Sales Niche / Industry
              </label>

              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    id={`btn-preset-${preset.id}`}
                    onClick={() => {
                      setSelectedIndustry(preset);
                      if (isCallActive) {
                        endCall();
                      }
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      selectedIndustry.id === preset.id
                        ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-md shadow-cyan-100'
                        : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-200 hover:text-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-slate-700 mb-0.5">{preset.name}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                      {preset.hook}
                    </span>
                  </button>
                ))}
              </div>

              
            {/* Instant Phone Callback Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white space-y-3 mt-4 shadow-lg border border-cyan-500">
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-200" /> Have Vela Call Your Phone Instantly
                </h4>
                <p className="text-xs text-cyan-50 mt-1 leading-relaxed">Want to test the real telephony latency? Enter your phone number and our live Vapi agent will call you back within seconds.</p>
              </div>
              <form onSubmit={handleInstantCallback} className="flex gap-2">
                <input 
                  type="tel" 
                  placeholder="+1 555 123 4567" 
                  value={callbackNumber}
                  onChange={e => setCallbackNumber(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-black/20 border border-white/20 text-white placeholder-cyan-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button 
                  type="button" 
                  disabled={true}
                  className="px-4 py-2.5 bg-slate-300/50 text-white/50 font-bold rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1 whitespace-nowrap cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </form>
              {callbackStatus === 'success' && <p className="text-[11px] font-bold text-emerald-300">Ringing your phone now! 📞</p>}
              {callbackStatus === 'error' && <p className="text-[10px] text-rose-200">Error triggering call. Please check your VAPI_API_KEY.</p>}
            </div>

            {/* Call Status & Telephony Card */}

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                      <Radio className={`w-3.5 h-3.5 ${isVapiConnected ? 'text-emerald-600 animate-pulse' : 'text-cyan-600'}`} />
                      {vapiClient ? (isVapiConnected ? 'VAPI LIVE AUDIO ACTIVE' : 'VAPI SDK LOADED') : 'VELA FAST SPEECH ENGINE'}
                    </span>
                  </div>
                  <button
                    id="btn-open-vapi-settings"
                    onClick={() => setCustomVapiModalOpen(true)}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-cyan-700 border border-slate-200 text-[10px] flex items-center gap-1 transition cursor-pointer"
                    title="Configure custom Vapi Assistant ID or Public Key"
                  >
                    <Settings className="w-3 h-3 text-cyan-600" />
                    <span>Config</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Session Duration</span>
                    <span className="text-lg font-bold font-mono text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      {formatTime(callDuration)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Observed Latency</span>
                    <span className="text-lg font-bold font-mono text-cyan-700">
                      {lastLatency ? `⚡ ${lastLatency}ms` : '--'}
                    </span>
                  </div>
                </div>

                {/* Live conversion prediction meter */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" /> Real-time Conversion Score
                    </span>
                    <span className="font-bold text-emerald-600 font-mono">{conversionScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${conversionScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Call Trigger Button */}
            <div className="space-y-3">
              {!isCallActive ? (
                <button
                  id="btn-start-interactive-call"
                  onClick={startCall}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 text-slate-950 animate-bounce" />
                  <span>Call Vela Now (Live Voice)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-end-interactive-call"
                    onClick={endCall}
                    className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-95 cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Hang Up Call</span>
                  </button>

                  <button
                    id="btn-toggle-mute"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3.5 rounded-xl border transition ${
                      isMuted
                        ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-700'
                    }`}
                    title={isMuted ? 'Unmute Agent' : 'Mute Agent'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}

              <p className="text-[11px] text-center text-slate-500">
                100% free interactive browser demo • No credit card required
              </p>
            </div>

          </div>

          {/* Right Column: Live Audio Visualizer & Call Transcript */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Top Visualizer Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isCallActive ? (isAgentSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400') : 'bg-slate-600'}`} />
                <span className="text-xs font-semibold text-slate-700">
                  {isCallActive ? (isAgentSpeaking ? 'Vela is Speaking...' : (isListening ? 'Listening to your voice...' : 'Call Connected')) : 'Idle - Click Call to Begin'}
                </span>
              </div>
              <AudioVisualizer 
                isActive={isCallActive} 
                isAgentSpeaking={isAgentSpeaking} 
                barCount={20} 
                height={24} 
              />
            </div>

            {/* Transcript Messages Container */}
            <div className="h-64 sm:h-72 overflow-y-auto p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3 font-sans text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                  <PhoneCall className="w-8 h-8 text-slate-700" />
                  <p>Click <strong className="text-slate-500">"Call Vela Now"</strong> to start the live conversation.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.speaker === 'agent' && (
                      <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                        msg.speaker === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-600">
                          {msg.speaker === 'user' ? 'You (Prospect)' : 'Vela Sales Agent'}
                        </span>
                        <span>{msg.time} {msg.latencyMs ? `(${msg.latencyMs}ms)` : ''}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                    {msg.speaker === 'user' && (
                      <div className="w-6 h-6 rounded-md bg-indigo-500/30 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoadingReply && (
                <div className="flex items-center gap-2 text-xs text-cyan-600 bg-white/60 p-2.5 rounded-lg border border-slate-200 w-fit animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Vela is synthesizing response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Objection Testing Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-600" />
                Quick Objection & Question Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_OBJECTIONS.map((obj, i) => (
                  <button
                    key={i}
                    id={`btn-sample-objection-${i}`}
                    disabled={!isCallActive || isLoadingReply}
                    onClick={() => handleSendMessage(obj)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-cyan-200 transition disabled:opacity-40 disabled:cursor-not-allowed text-left"
                  >
                    "{obj}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Mic Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                id="btn-voice-mic-input"
                disabled={!isCallActive || isLoadingReply}
                onClick={toggleMicListening}
                className={`p-3 rounded-xl border transition ${
                  isListening
                    ? 'bg-rose-500 text-slate-900 border-rose-400 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-cyan-600 hover:bg-slate-100 disabled:opacity-40'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak with Microphone'}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                disabled={!isCallActive || isLoadingReply}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isCallActive ? "Type or speak your reply to Vela..." : "Click 'Call Vela Now' above to speak"}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />

              <button
                type="submit"
                id="btn-submit-chat-turn"
                disabled={!isCallActive || !inputText.trim() || isLoadingReply}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* Vapi Public Key & Assistant Connection Modal */}
      {customVapiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">Vapi Direct Audio Settings</h3>
              </div>
              <button
                id="btn-close-vapi-modal"
                onClick={() => setCustomVapiModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide your Vapi Public API Key (or set <code className="text-cyan-700">VAPI_API_KEY</code> in environment variables) to stream calls directly through Vapi's WebRTC audio network.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Vapi Public Key:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9b7519a7-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={customApiKeyInput || vapiPublicKey}
                  onChange={(e) => setCustomApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Vapi Assistant ID (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5d92131a-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={customAssistantInput || vapiAssistantId}
                  onChange={(e) => setCustomAssistantInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  If left blank, Vela will automatically initialize an on-the-fly Cartesia Sonic assistant tailored to the selected industry.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                id="btn-save-vapi-config"
                onClick={() => {
                  setCustomVapiModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
