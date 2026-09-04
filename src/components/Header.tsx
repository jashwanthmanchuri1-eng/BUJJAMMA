import React from 'react';
import { PRESET_PROFILES } from '../data/sampleData';
import { HealthInputs } from '../types';
import {
  HeartPulse,
  ClipboardList,
  Activity,
  BrainCircuit,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  Users,
  Printer,
  Sparkles,
} from 'lucide-react';

export type AppPage =
  | 'intake'
  | 'diagnostics'
  | 'xai'
  | 'simulator'
  | 'careplan'
  | 'quiz'
  | 'community';

interface HeaderProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
  onLoadPreset: (data: HealthInputs) => void;
  onOpenDisclaimer: () => void;
  communityCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onPageChange,
  onLoadPreset,
  onOpenDisclaimer,
  communityCount,
}) => {
  const pages: { id: AppPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'intake', label: '1. Vitals Intake', icon: ClipboardList },
    { id: 'diagnostics', label: '2. AI Diagnostics', icon: Activity },
    { id: 'xai', label: '3. Explainable AI', icon: BrainCircuit },
    { id: 'simulator', label: '4. What-If Lab', icon: Sliders },
    { id: 'careplan', label: '5. Care Plan & Passport', icon: ShieldCheck },
    { id: 'quiz', label: '6. Awareness Quiz', icon: GraduationCap },
    { id: 'community', label: '7. Community Camp', icon: Users, badge: `${communityCount}` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Clinical Screening Notice Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-[11px] font-medium flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Educational Screening Prototype</strong> — Machine Learning Risk Analytics & Community Epidemiological Hub.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenDisclaimer}
          className="underline text-slate-300 hover:text-white cursor-pointer ml-auto hidden sm:inline"
        >
          Clinical Protocol & Disclaimer
        </button>
      </div>

      {/* Main Branding & Action Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onPageChange('intake')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  AI Health Screening
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Multi-Module ML
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Explainable AI (XAI) & Community Intelligence
              </p>
            </div>
          </div>

          {/* Mobile Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Global Preset Selector & Quick Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 p-1 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold pl-1.5 hidden sm:inline">⚡ Quick Test:</span>
            <select
              onChange={(e) => {
                if (e.target.value && PRESET_PROFILES[e.target.value]) {
                  onLoadPreset(PRESET_PROFILES[e.target.value].data);
                }
              }}
              defaultValue=""
              className="text-xs p-1.5 rounded-lg bg-white border border-slate-200/80 font-bold text-slate-700 hover:border-indigo-400 cursor-pointer"
            >
              <option value="" disabled>
                Load Sample Patient Profile...
              </option>
              <option value="highRisk">🔴 High Risk Executive</option>
              <option value="moderateRisk">🟡 Prediabetes & Metabolic Profile</option>
              <option value="healthyProfile">🟢 Active Healthy Volunteer</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            title="Print Full Clinical Screening Summary"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary Page Navigation Tabs Bar */}
      <div className="bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto py-1.5 no-scrollbar text-xs">
            {pages.map((p) => {
              const Icon = p.icon;
              const isActive = currentPage === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPageChange(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{p.label}</span>
                  {p.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
