import React from 'react';
import { DiabetesRiskResult } from '../types';
import { Droplet, Database, CheckCircle2, AlertCircle } from 'lucide-react';

interface ModuleCardDiabetesProps {
  diabetesResult: DiabetesRiskResult;
}

export const ModuleCardDiabetes: React.FC<ModuleCardDiabetesProps> = ({ diabetesResult }) => {
  const { riskScore, riskLevel, factors, insulinResistanceEstimate } = diabetesResult;

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (level === 'Moderate') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div
      id="module-diabetes-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
              <Droplet className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Module B</div>
              <h3 className="text-base font-bold text-slate-900">🩸 Diabetes Risk Prediction</h3>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskColor(riskLevel)}`}
          >
            {riskLevel} Risk ({riskScore}%)
          </span>
        </div>

        {/* Dataset & Insulin Resistance Tag */}
        <div className="mt-3 flex items-center justify-between gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-[11px]">Grounded in Pima Indians Dataset</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
            Insulin: {insulinResistanceEstimate}
          </span>
        </div>

        {/* Factors Breakdown */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Evaluated Pima Features
          </div>
          <div className="space-y-1.5">
            {factors.length > 0 ? (
              factors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-slate-700 bg-amber-50/60 p-2 rounded-lg border border-amber-100/80 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Normoglycemic fasting glucose & optimal insulin balance</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Variables: Glucose, BMI, Age, BP, Insulin, Family, Preg.</span>
        <span className="font-semibold text-slate-700">Weight: 30% in overall</span>
      </div>
    </div>
  );
};
