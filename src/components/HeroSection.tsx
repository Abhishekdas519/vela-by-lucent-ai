import React from 'react';
import { 
  PhoneCall, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Bot,
  Activity,
  Award
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface HeroSectionProps {
  onTryDemo: () => void;
  onOpenSignUp: () => void;
  onOpenAdminConsole?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTryDemo,
  onOpenSignUp,
  onOpenAdminConsole,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-50">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-cyan-200 text-xs text-slate-600 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-cyan-700">Vela 3.5 Engine Released</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-600">Sub-450ms Latency • Guaranteed 10% Lower Pricing</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Replace Costly Call Centers with <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Vela AI Voice Sales Fleet
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Deploy hyper-realistic autonomous AI voice agents powered by <strong className="text-cyan-700 font-semibold">Vapi</strong> and <strong className="text-indigo-700 font-semibold">Twilio</strong>. Upload CSV lead lists, dial thousands of prospects daily, overcome objections in real-time, and trigger automated 12-hour follow-up pipelines.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="btn-hero-live-demo"
              onClick={onTryDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2.5 active:scale-95 group cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Test Live Voice Demo</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">Instant Free</span>
            </button>

            <button
              id="btn-hero-signup"
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200/80 text-slate-900 font-semibold text-base transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Onboard Your Business</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Value Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>10% Lower Cost than Competitors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Human Fatigue or Script Drift</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>15-Minute Instant Minute Top-ups</span>
            </div>
          </div>
        </div>

        {/* Interactive Hero Visual / Live Call Terminal Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/90 shadow-2xl shadow-cyan-100/40 overflow-hidden">
          
          {/* Terminal Window Header */}
          <div className="bg-white/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-500 ml-2">
                active-session: vela-agent-vapi // twilio-did: +1 (415) 890-4321
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-500/30 px-2 py-0.5 rounded">
                <Activity className="w-3 h-3 animate-pulse" /> LIVE TELEPHONY ONLINE
              </span>
              <span className="text-xs font-mono text-cyan-700">LATENCY: 418ms</span>
            </div>
          </div>

          {/* Terminal Body Simulation */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50">
            
            {/* Left Column: Live Audio & Dialogue Stream */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Agent Call Box */}
              <div className="p-4 rounded-xl bg-white/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-600 flex items-center justify-center font-bold font-mono text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        Vela Autonomous Voice Agent
                        <span className="text-[10px] px-1.5 py-0.2 bg-cyan-900/60 text-cyan-700 rounded border border-cyan-500/20">
                          Cartesia Sonic HD
                        </span>
                      </h4>
                      <span className="text-[11px] text-slate-500">Outbound Call to VP of Logistics</span>
                    </div>
                  </div>
                  <div className="h-6 flex items-center">
                    <AudioVisualizer isActive={true} isAgentSpeaking={true} barCount={16} height={28} />
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50/60 p-3 rounded-lg border border-slate-200/60 font-sans leading-relaxed">
                  "Hi Marcus! This is Vela from Apex Cloud. We noticed your logistics team manages 500+ monthly LTL loads. Our autonomous engine reduces spot quote cycle times from 20 minutes down to 45 seconds. Do you have 2 minutes to see how this cuts 28% off carrier fees?"
                </p>
              </div>

              {/* Lead Response Box */}
              <div className="p-4 rounded-xl bg-white/40 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      PROSPECT
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Marcus Sterling (COO, Freight Co.)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono">Live Transcription</span>
                </div>
                <p className="text-xs text-slate-600 italic bg-slate-50/40 p-2.5 rounded-lg border border-slate-200/40">
                  "We have looked into automation before, but does this integrate with McLeod TMS without custom coding?"
                </p>
              </div>

              {/* Live Intelligence Feed */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-50 border border-cyan-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-600" />
                  <span className="text-cyan-200">AI Objection Handled:</span>
                  <span className="text-slate-600 font-medium">McLeod Native 2-Way REST Webhook</span>
                </div>
                <span className="text-emerald-600 font-mono font-bold">92% Intent Match</span>
              </div>
            </div>

            {/* Right Column: Real-Time Intelligence & ROI Telemetry */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/90 to-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                  Live Call Intelligence Metrics
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Chance of Conversion</span>
                      <span className="font-bold text-emerald-600 font-mono">92% (High Intent)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[92%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Caller Sentiment</span>
                      <span className="font-bold text-cyan-700 font-mono">Positive (+0.88)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-cyan-400 w-[88%] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Auto 12-Hr Follow-Up:</span>
                    <span className="text-purple-700 font-mono font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Queued for 02:24 AM
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Cost of this 2.5m Call:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 line-through font-mono">$3.50 Human</span>
                      <span className="text-emerald-600 font-bold font-mono">$0.25 Vela</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Launch CTA Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Ready to deploy your fleet?</span>
                  <span className="text-[11px] text-cyan-700">Set up Vapi + Twilio in 3 minutes</span>
                </div>
                <button
                  id="btn-hero-deploy-now"
                  onClick={onOpenSignUp}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer"
                >
                  Start Now
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Trust Badges / Operational Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-white/60 border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 font-mono block">15,000+</span>
            <span className="text-xs text-slate-500 font-medium">Daily Outbound Dials / Fleet</span>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono block">89%</span>
            <span className="text-xs text-slate-500 font-medium">Operating Cost Savings</span>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono block">&lt; 450ms</span>
            <span className="text-xs text-slate-500 font-medium">Ultra-Low Voice Latency</span>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono block">3.4x</span>
            <span className="text-xs text-slate-500 font-medium">Higher Conversion Rate</span>
          </div>
        </div>

      </div>
    </section>
  );
};
