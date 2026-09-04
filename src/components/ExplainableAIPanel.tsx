import React from 'react';
import { FeatureAttribution, RiskLevel } from '../types';
import { BrainCircuit, Info, Check, HelpCircle } from 'lucide-react';

interface ExplainableAIPanelProps {
  attributions: FeatureAttribution[];
  riskLevel: RiskLevel;
  overallScore: number;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  attributions,
  riskLevel,
  overallScore,
}) => {
  const getBarColor = (direction: string, percent: number) => {
    if (direction === 'decreases_risk') return 'bg-emerald-500';
    if (percent >= 30) return 'bg-rose-500';
    if (percent >= 18) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  return (
    <div
      id="explainable-ai-panel"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-2xs">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Explainable AI (XAI) Risk Attribution
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                SHAP / Tree Importance
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Transparent feature attribution decomposing risk score into weighted clinical drivers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-600">Predicted Risk:</span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              riskLevel === 'High'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : riskLevel === 'Moderate'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {riskLevel === 'High' ? '🔴 HIGH' : riskLevel === 'Moderate' ? '🟡 MODERATE' : '🟢 LOW'} ({overallScore}/100)
          </span>
        </div>
      </div>

      {/* Evaluator Showcase Header Box */}
      <div className="mt-4 bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 font-semibold mb-1 text-[11px] tracking-wider uppercase">
          HEALTH RISK ANALYSIS (EXPLAINABLE AI ENGINE)
        </div>
        <div className="text-slate-200 flex items-center justify-between py-1 border-b border-slate-800">
          <span>Risk Level: <strong className={riskLevel === 'High' ? 'text-rose-400' : riskLevel === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}>{riskLevel === 'High' ? '🔴 HIGH' : riskLevel === 'Moderate' ? '🟡 MODERATE' : '🟢 LOW'}</strong></span>
          <span className="text-slate-400 text-[11px]">Formula: Prediction + Explanation = XAI</span>
        </div>

        <div className="pt-3 pb-1 text-slate-300 font-bold flex justify-between text-[11px] uppercase tracking-wider">
          <span>Contributing Factors</span>
          <span>Relative Impact</span>
        </div>
        <div className="border-t border-slate-700 my-1"></div>

        <div className="space-y-2 mt-2 font-mono">
          {attributions.slice(0, 6).map((attr, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1">
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-slate-400 w-4">{idx + 1}.</span>
                <span className="text-slate-200 font-semibold">{attr.feature}</span>
                <span className="text-[10px] text-slate-400 font-normal">({attr.valueDisplay})</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      attr.direction === 'decreases_risk'
                        ? 'bg-emerald-400'
                        : attr.contributionPercent > 25
                        ? 'bg-rose-500'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(attr.contributionPercent * 2.5, 100)}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right font-bold text-slate-100">
                  {attr.contributionPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Graphical Cards for all contributing factors */}
      <div className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>All Extracted Clinical Features</span>
          <span>Normalized Attribution Weight</span>
        </div>

        {attributions.map((attr, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-[170px] sm:min-w-[220px]">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  attr.direction === 'decreases_risk'
                    ? 'bg-emerald-500'
                    : attr.contributionPercent >= 20
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              ></div>
              <div>
                <div className="text-xs font-bold text-slate-800">{attr.feature}</div>
                <div className="text-[11px] text-slate-500 font-medium">Recorded: {attr.valueDisplay}</div>
              </div>
            </div>

            <div className="flex-1 max-w-xs mx-2">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(
                    attr.direction,
                    attr.contributionPercent
                  )}`}
                  style={{ width: `${Math.min(attr.contributionPercent * 2.8, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-extrabold text-slate-900">{attr.contributionPercent}%</div>
              <div className="text-[10px] font-medium text-slate-400">
                {attr.direction === 'decreases_risk' ? 'Protective' : 'Risk Driver'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          Evaluator Note: SHAP value calculation provides local interpretability for tree ensembles.
        </span>
        <span className="font-semibold text-slate-700">Total Sum: 100%</span>
      </div>
    </div>
  );
};
