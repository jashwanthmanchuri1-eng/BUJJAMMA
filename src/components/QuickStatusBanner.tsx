import React from 'react';
import { OverallAssessment, HeartModelAlgorithm } from '../types';
import { HeartPulse, Activity, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

interface QuickStatusBannerProps {
  assessment: OverallAssessment;
  selectedAlgo: HeartModelAlgorithm;
  onNavigateTo: (page: string) => void;
  currentPage: string;
}

export const QuickStatusBanner: React.FC<QuickStatusBannerProps> = ({
  assessment,
  selectedAlgo,
  onNavigateTo,
  currentPage,
}) => {
  const getRiskBg = () => {
    switch (assessment.riskLevel) {
      case 'High':
        return 'bg-gradient-to-r from-rose-50 via-white to-amber-50 border-rose-200';
      case 'Moderate':
        return 'bg-gradient-to-r from-amber-50 via-white to-indigo-50 border-amber-200';
      default:
        return 'bg-gradient-to-r from-emerald-50 via-white to-indigo-50 border-emerald-200';
    }
  };

  const getRiskBadge = () => {
    switch (assessment.riskLevel) {
      case 'High':
        return 'bg-rose-600 text-white shadow-xs';
      case 'Moderate':
        return 'bg-amber-500 text-white shadow-xs';
      default:
        return 'bg-emerald-600 text-white shadow-xs';
    }
  };

  return (
    <div className={`p-3 sm:p-4 rounded-2xl border shadow-xs transition-all ${getRiskBg()} mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
            <HeartPulse className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${getRiskBadge()}`}>
                {assessment.riskLevel} Health Risk
              </span>
              <span className="text-sm font-black text-slate-900">
                Composite Score: {assessment.overallScore}/100
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-600">
                BMI: {assessment.bmi} ({assessment.bmiCategory})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Evaluated with <strong className="text-slate-800 uppercase">{selectedAlgo}</strong> ({assessment.heartModule.algorithmAccuracy}% accuracy) & Pima Diabetes logic.
            </p>
          </div>
        </div>

        {/* Quick Jump Action */}
        <div className="flex items-center gap-2 self-end md:self-center">
          {currentPage === 'intake' && (
            <button
              type="button"
              onClick={() => onNavigateTo('diagnostics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>View AI Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'diagnostics' && (
            <button
              type="button"
              onClick={() => onNavigateTo('xai')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Explain Model (XAI)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'xai' && (
            <button
              type="button"
              onClick={() => onNavigateTo('simulator')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Simulate Improvements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'simulator' && (
            <button
              type="button"
              onClick={() => onNavigateTo('careplan')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Get Care Plan & Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'careplan' && (
            <button
              type="button"
              onClick={() => onNavigateTo('quiz')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Take Awareness Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'quiz' && (
            <button
              type="button"
              onClick={() => onNavigateTo('community')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Community Camp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPage === 'community' && (
            <button
              type="button"
              onClick={() => onNavigateTo('intake')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>New Patient Intake</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
