import React from 'react';
import { TrendingDown, Calendar, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface FutureRiskTrajectoryProps {
  currentScore: number;
  simulatedScore: number;
}

export const FutureRiskTrajectory: React.FC<FutureRiskTrajectoryProps> = ({
  currentScore,
  simulatedScore,
}) => {
  // Generate 5-year projected trajectory data points
  // Status quo: cumulative age + unchecked lifestyle slowly accelerates risk (+1.8 to +2.5 per yr)
  // Intervention: drops sharply at year 1, then stabilizes in a protective corridor
  const years = [
    {
      label: 'Today',
      baseline: currentScore,
      intervention: simulatedScore,
    },
    {
      label: 'Year 1',
      baseline: Math.min(100, Math.round(currentScore + 2.5)),
      intervention: Math.max(12, Math.round(simulatedScore * 0.92)),
    },
    {
      label: 'Year 2',
      baseline: Math.min(100, Math.round(currentScore + 5.2)),
      intervention: Math.max(12, Math.round(simulatedScore * 0.88)),
    },
    {
      label: 'Year 3',
      baseline: Math.min(100, Math.round(currentScore + 8.1)),
      intervention: Math.max(12, Math.round(simulatedScore * 0.86)),
    },
    {
      label: 'Year 5',
      baseline: Math.min(100, Math.round(currentScore + 13.5)),
      intervention: Math.max(12, Math.round(simulatedScore * 0.84)),
    },
  ];

  const diff5Year = years[4].baseline - years[4].intervention;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              5-Year Projected Risk Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Longitudinal projection comparing status quo trajectory against your simulated lifestyle protocol.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold w-fit">
          5-Year Risk Avoidance: -{diff5Year} pts
        </div>
      </div>

      {/* Trajectory comparison visual bars / timeline */}
      <div className="space-y-4">
        {years.map((pt, i) => (
          <div key={pt.label} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {pt.label}
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-rose-600 font-extrabold">Status Quo: {pt.baseline}</span>
                <span className="text-emerald-600 font-extrabold">Simulated: {pt.intervention}</span>
                <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-full font-extrabold text-[10px]">
                  -{pt.baseline - pt.intervention} pts
                </span>
              </div>
            </div>

            {/* Side by side visual gauge bars */}
            <div className="space-y-1.5">
              {/* Baseline Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 w-16 shrink-0">Unchanged</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, pt.baseline)}%` }}
                  />
                </div>
              </div>

              {/* Simulated Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-emerald-600 w-16 shrink-0">Simulated</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, pt.intervention)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Target Milestone Roadmap */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100">
        <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Milestone Action Roadmap to Lock in These Gains
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white/80 p-2.5 rounded-lg border border-indigo-100">
            <span className="font-bold text-slate-900 block">Weeks 1–4</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Lock in 25–30 min daily brisk walking and shift sleep to a consistent 7.5 hr window.
            </p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-indigo-100">
            <span className="font-bold text-slate-900 block">Months 2–3</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Target 3–5% progressive body weight reduction and cut ultra-processed dietary sodium.
            </p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-indigo-100">
            <span className="font-bold text-slate-900 block">Month 6 Checkup</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Repeat fasting glucose, lipid panel, and blood pressure monitoring with your clinician.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
