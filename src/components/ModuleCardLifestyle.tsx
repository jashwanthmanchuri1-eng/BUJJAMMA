import React from 'react';
import { LifestyleScoreResult } from '../types';
import { Activity, Trophy, CheckCircle, AlertCircle } from 'lucide-react';

interface ModuleCardLifestyleProps {
  lifestyleResult: LifestyleScoreResult;
}

export const ModuleCardLifestyle: React.FC<ModuleCardLifestyleProps> = ({ lifestyleResult }) => {
  const { score, grade, strengths, needsAttention, subScores } = lifestyleResult;

  const getScoreBadge = (sc: number) => {
    if (sc >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (sc >= 65) return 'text-sky-700 bg-sky-50 border-sky-300';
    if (sc >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div
      id="module-lifestyle-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Module C</div>
              <h3 className="text-base font-bold text-slate-900">🫁 Lifestyle Risk Score</h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            {grade}
          </span>
        </div>

        {/* Big Health Score Banner matching prompt */}
        <div className="mt-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3.5 border border-teal-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white text-amber-500 flex items-center justify-center shadow-xs border border-teal-100">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                Community Health Score
              </div>
              <div className="text-xl font-extrabold text-teal-950">
                🏆 Your Health Score: <span className="text-teal-700">{score}</span>
                <span className="text-sm font-semibold text-teal-600"> / 100</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreBadge(score)}`}>
            {score >= 70 ? '🟢 Resilient' : score >= 50 ? '🟡 Moderate' : '🔴 Suboptimal'}
          </span>
        </div>

        {/* Strengths and Needs Attention (Direct prompt requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Strengths */}
          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {strengths.length > 0 ? (
                strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 font-medium leading-tight">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No notable lifestyle strengths identified yet</li>
              )}
            </ul>
          </div>

          {/* Needs Attention */}
          <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100">
            <div className="flex items-center gap-1 text-xs font-bold text-rose-800 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Needs Attention</span>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-950">
              {needsAttention.length > 0 ? (
                needsAttention.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 font-medium leading-tight">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{need}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-700 font-medium">All routine lifestyle markers within targets!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Mini component bars */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10px] text-slate-500">
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="font-semibold text-slate-700">{subScores.exercise}/20</div>
            <div>Exercise</div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="font-semibold text-slate-700">{subScores.sleep}/15</div>
            <div>Sleep</div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="font-semibold text-slate-700">{subScores.diet}/15</div>
            <div>Diet</div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="font-semibold text-slate-700">{subScores.bp}/10</div>
            <div>BP Vitals</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Evaluates: Sleep, Exercise, Diet, Water, Tobacco, Alcohol, BMI, BP</span>
        <span className="font-semibold text-slate-700">Community Health Pillar</span>
      </div>
    </div>
  );
};
