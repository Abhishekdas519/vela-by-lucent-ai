import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  BarChart3 
} from 'lucide-react';
import { CALL_CENTER_COMPARISONS } from '../data/initialData';

interface ProofOfResultsProps {
  onOpenSignUp: () => void;
}

export const ProofOfResults: React.FC<ProofOfResultsProps> = ({ onOpenSignUp }) => {
  const [repsCount, setRepsCount] = useState(5);
  const [hourlyWage, setHourlyWage] = useState(32);
  const [monthlyDials, setMonthlyDials] = useState(15000);

  // Calculations
  const humanMonthlyCost = repsCount * (hourlyWage * 160) + (repsCount * 450); // wages + telecom/management overhead
  const humanAnnualCost = humanMonthlyCost * 12;

  // Average call is ~2 minutes. 15,000 dials with 25% connection = 3,750 connected calls * 2.2 mins = 8,250 talktime mins
  const estimatedVelaMinutes = Math.round(monthlyDials * 0.25 * 2.2);
  const velaMonthlyCost = 629 + (Math.max(0, estimatedVelaMinutes - 5000) * 0.10); // Growth plan rate with 10% discount
  const velaAnnualCost = velaMonthlyCost * 12;

  const annualSavings = Math.max(0, humanAnnualCost - velaAnnualCost);
  const savingsPercent = Math.round((annualSavings / humanAnnualCost) * 100);

  return (
    <section id="proof-section" className="py-20 bg-white/50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Interactive ROI & Cost Savings Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-50 border border-cyan-200 shadow-2xl shadow-cyan-100/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>Interactive Call Center Cost Simulator</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Calculate Your Annual Savings with Vela
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust your current team size and call metrics to see immediate bottom-line impact.
                </p>
              </div>

              {/* Slider 1: Reps */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Current Call Center Reps / SDRs:</span>
                  <span className="text-cyan-600 font-mono font-bold text-sm">{repsCount} full-time seats</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={repsCount}
                  onChange={(e) => setRepsCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 Rep</span>
                  <span>15 Reps</span>
                  <span>30 Reps</span>
                </div>
              </div>

              {/* Slider 2: Hourly Wage */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Average Rep Hourly Wage (inc. benefits):</span>
                  <span className="text-cyan-600 font-mono font-bold text-sm">${hourlyWage}/hour</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>$15/hr</span>
                  <span>$35/hr</span>
                  <span>$60/hr</span>
                </div>
              </div>

              {/* Slider 3: Monthly Dials */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Desired Monthly Outbound Dials:</span>
                  <span className="text-cyan-600 font-mono font-bold text-sm">{monthlyDials.toLocaleString()} dials</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={monthlyDials}
                  onChange={(e) => setMonthlyDials(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2k Dials</span>
                  <span>25k Dials</span>
                  <span>50k Dials</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white/90 border border-slate-200 space-y-6">
              
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">
                    Human Call Center Cost
                  </span>
                  <span className="text-2xl font-extrabold text-rose-400 font-mono">
                    ${Math.round(humanAnnualCost).toLocaleString()}
                    <span className="text-xs text-slate-500 font-sans font-normal"> /yr</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Wages, training, telecom & churn</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block mb-1">
                    Vela Autonomous Fleet
                  </span>
                  <span className="text-2xl font-extrabold text-cyan-600 font-mono">
                    ${Math.round(velaAnnualCost).toLocaleString()}
                    <span className="text-xs text-slate-500 font-sans font-normal"> /yr</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">10% Below Market Rates</span>
                </div>
              </div>

              {/* Total Savings Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border border-emerald-500/40 text-center space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                  Estimated Net Annual Cost Savings
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                  ${Math.round(annualSavings).toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{savingsPercent}% Direct Operating Margin Increase</span>
                </div>
              </div>

              <button
                id="btn-roi-onboard-cta"
                onClick={onOpenSignUp}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lock In 10% Lower Pricing & Onboard Fleet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Why Vela Outperforms Traditional BPOs & Basic Bots
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              Engineered with sub-450ms voice pipelines, automated 12-hour follow-ups, and native Twilio/Vapi infrastructure.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/90 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-700">Operational Capability</th>
                  <th className="p-4 font-bold text-rose-400">Traditional Call Center (Human)</th>
                  <th className="p-4 font-bold text-cyan-600">Vela AI by Lucent AI</th>
                  <th className="p-4 font-bold text-emerald-600">Your Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {CALL_CENTER_COMPARISONS.map((row, index) => (
                  <tr key={index} className="hover:bg-white/40 transition">
                    <td className="p-4 font-semibold text-slate-700">{row.metric}</td>
                    <td className="p-4 text-slate-500">{row.humanCallCenter}</td>
                    <td className="p-4 font-semibold text-cyan-700 font-mono">{row.velaAiAgent}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {row.savings}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
