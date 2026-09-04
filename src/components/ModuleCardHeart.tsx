import React from 'react';
import { HeartRiskResult, HeartModelAlgorithm } from '../types';
import { Heart, Award, Cpu, ShieldCheck } from 'lucide-react';

interface ModuleCardHeartProps {
  heartResult: HeartRiskResult;
  selectedAlgo: HeartModelAlgorithm;
  onSelectAlgo: (algo: HeartModelAlgorithm) => void;
}

export const ModuleCardHeart: React.FC<ModuleCardHeartProps> = ({
  heartResult,
  selectedAlgo,
  onSelectAlgo,
}) => {
  const { riskScore, riskLevel, algorithmAccuracy, modelComparisons, keyIndicators } = heartResult;

  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (level === 'Moderate') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div
      id="module-heart-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Module A</div>
              <h3 className="text-base font-bold text-slate-900">❤️ Heart Risk Prediction</h3>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskColor(riskLevel)}`}
          >
            {riskLevel} Risk ({riskScore}%)
          </span>
        </div>

        {/* Algorithm Comparison & Switcher */}
        <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Algorithm Comparison & Selection
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Best: XGBoost ({modelComparisons[2].accuracy}%)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {modelComparisons.map((model) => {
              const isSelected = selectedAlgo === model.algorithm;
              const isBest = model.algorithm === 'xgboost';

              return (
                <button
                  key={model.algorithm}
                  type="button"
                  onClick={() => onSelectAlgo(model.algorithm)}
                  className={`flex flex-col text-left p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500/30'
                      : 'bg-slate-100/70 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[11px] truncate text-slate-900">
                      {model.algorithm === 'logistic_regression'
                        ? 'Log. Reg.'
                        : model.algorithm === 'random_forest'
                        ? 'Random Forest'
                        : 'XGBoost'}
                    </span>
                    {isBest && (
                      <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-amber-100 text-amber-800">
                        Top
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Acc: <span className="text-slate-800 font-bold">{model.accuracy}%</span>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-600">
                    Pred: {model.score}%
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Active Model: <strong className="text-slate-700">{selectedAlgo.replace('_', ' ').toUpperCase()}</strong> ({algorithmAccuracy}% CV accuracy).
          </p>
        </div>

        {/* Feature Inputs Evaluated */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Key Cardiovascular Indicators
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keyIndicators.length > 0 ? (
              keyIndicators.map((ind, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-rose-800"
                >
                  {ind}
                </span>
              ))
            ) : (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800">
                Healthy baseline parameters (BP, Chol, HR, BMI)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Cross-validated Model Ensemble
        </span>
        <span className="font-semibold text-slate-700">Weight: 35% in overall</span>
      </div>
    </div>
  );
};
