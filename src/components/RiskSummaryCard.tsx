import React from 'react';
import { OverallAssessment } from '../types';
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowUpRight, Activity, Sparkles } from 'lucide-react';

interface RiskSummaryCardProps {
  assessment: OverallAssessment;
}

export const RiskSummaryCard: React.FC<RiskSummaryCardProps> = ({ assessment }) => {
  const { overallScore, riskLevel, bmi, bmiCategory, mainContributingFactors, primaryRecommendedAction, recommendations } =
    assessment;

  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'Low':
        return {
          pill: '🟢 Low Risk',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          textColor: 'text-emerald-700',
          icon: CheckCircle2,
          progressColor: 'bg-emerald-500',
          borderColor: 'border-emerald-300',
        };
      case 'Moderate':
        return {
          pill: '🟡 Moderate Risk',
          bg: 'bg-amber-50 border-amber-200 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          textColor: 'text-amber-700',
          icon: AlertCircle,
          progressColor: 'bg-amber-500',
          borderColor: 'border-amber-300',
        };
      case 'High':
      default:
        return {
          pill: '🔴 High Risk',
          bg: 'bg-rose-50 border-rose-200 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          textColor: 'text-rose-700',
          icon: AlertTriangle,
          progressColor: 'bg-rose-500',
          borderColor: 'border-rose-300',
        };
    }
  };

  const config = getRiskConfig();
  const IconComponent = config.icon;

  return (
    <div
      id="risk-summary-card"
      className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-all ${config.bg} ${config.borderColor}`}
    >
      {recommendations.urgentFlag && (
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-rose-600 p-3.5 text-white shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-100">Medical Attention Notice</div>
            <p className="text-sm font-semibold">{recommendations.urgentFlag}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              id="risk-level-badge"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-xs ${config.badgeBg}`}
            >
              <IconComponent className="h-4 w-4" />
              {config.pill}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 border border-slate-200 text-slate-700">
              <Activity className="h-3 w-3 text-sky-600" />
              BMI: {bmi} ({bmiCategory})
            </span>
            <span className="text-xs text-slate-500 font-medium">Educational Screening Model</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Multi-Module AI Health Synthesis
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-slate-200 shrink-0">
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Risk Index</div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {overallScore}
              <span className="text-xs text-slate-400 font-medium"> / 100</span>
            </div>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={riskLevel === 'High' ? '#ef4444' : riskLevel === 'Moderate' ? '#f59e0b' : '#10b981'}
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * overallScore) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-700">{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Contributing Factors & Recommended Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="bg-white/90 rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Main Contributing Factors
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {mainContributingFactors.join(' + ')}.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mainContributingFactors.map((factor, idx) => (
              <span
                key={idx}
                className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/90 rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
            Recommended Action
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {primaryRecommendedAction}
          </p>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Prototype guidance for preventive health screening; consult a licensed clinician for diagnosis.
          </div>
        </div>
      </div>
    </div>
  );
};
