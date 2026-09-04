import React, { useState } from 'react';
import { OverallAssessment, HealthInputs } from '../types';
import { Bot, Footprints, Salad, Moon, Stethoscope, AlertTriangle, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AIRecommendationsProps {
  assessment: OverallAssessment;
  inputs: HealthInputs;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ assessment, inputs }) => {
  const { riskLevel, recommendations, mainContributingFactors } = assessment;
  const [showFullReport, setShowFullReport] = useState(false);

  const getRiskTheme = () => {
    if (riskLevel === 'High') {
      return {
        badge: '🔴 High Cardiovascular & Metabolic Risk',
        banner: 'bg-rose-50 border-rose-200 text-rose-900',
        alert: 'Clinical Follow-up Strongly Advised: Schedule a comprehensive evaluation with a physician.',
      };
    }
    if (riskLevel === 'Moderate') {
      return {
        badge: '🟡 Moderate Risk (Preventive Intervention Window)',
        banner: 'bg-amber-50 border-amber-200 text-amber-900',
        alert: 'Opportunity for Risk Reversal: Targeted lifestyle modifications can substantially normalize parameters.',
      };
    }
    return {
      badge: '🟢 Low Risk (Optimal Maintenance)',
      banner: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      alert: 'Baseline Vitals Optimal: Continue protective daily habits and routine surveillance.',
    };
  };

  const theme = getRiskTheme();

  return (
    <div
      id="ai-recommendation-engine"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                🧠 AI Recommendation Engine
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Personalized Guidance
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Evidence-based preventive guidance tailored to your biometric screening profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFullReport(!showFullReport)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <FileText className="w-3.5 h-3.5 text-sky-600" />
          <span>{showFullReport ? 'Hide Detailed Summary' : 'View Complete Report'}</span>
          {showFullReport ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Synthesis Banner */}
      <div className={`mt-4 p-3.5 rounded-xl border ${theme.banner}`}>
        <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>AI Screening Synthesis</span>
          <span className="font-extrabold">{theme.badge}</span>
        </div>
        <div className="text-xs space-y-1 font-medium">
          <div>
            <strong>AI Explanation:</strong> Identified contributors include{' '}
            <span className="underline decoration-slate-400 font-semibold">
              {mainContributingFactors.join(', ')}
            </span>
            .
          </div>
          <div className="flex items-center gap-1 text-slate-700 font-semibold pt-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{theme.alert}</span>
          </div>
        </div>
      </div>

      {/* 4 Core Actionable Recommendation Pillars matching prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
        {/* 1. Physical Activity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              🏃 Physical Activity Action
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {recommendations.activity}
          </p>
        </div>

        {/* 2. Diet & Nutrition */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Salad className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              🥗 Dietary Protocol
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {recommendations.diet}
          </p>
        </div>

        {/* 3. Sleep Hygiene */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              😴 Sleep & Recovery
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {recommendations.sleep}
          </p>
        </div>

        {/* 4. Clinical Review */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              🩺 Clinical Follow-Up
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {recommendations.clinical}
          </p>
        </div>
      </div>

      {/* Expandable Comprehensive Report */}
      {showFullReport && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">AI SCREENING DOSSIER</span>
            <span className="text-slate-400">{new Date().toISOString().split('T')[0]}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>Age: <strong className="text-slate-200">{inputs.age} yrs</strong></div>
            <div>BP: <strong className="text-slate-200">{inputs.systolicBP}/{inputs.diastolicBP}</strong></div>
            <div>Glucose: <strong className="text-slate-200">{inputs.fastingGlucose} mg/dL</strong></div>
            <div>BMI: <strong className="text-slate-200">{assessment.bmi} ({assessment.bmiCategory})</strong></div>
          </div>
          <div className="border-t border-slate-800 pt-2 space-y-1">
            <div className="text-slate-400">Heart Module (XGBoost): <strong className="text-emerald-400">{assessment.heartModule.riskScore}% Risk</strong></div>
            <div className="text-slate-400">Diabetes Module (Pima): <strong className="text-amber-400">{assessment.diabetesModule.riskScore}% Risk</strong></div>
            <div className="text-slate-400">Lifestyle Health Score: <strong className="text-teal-400">{assessment.lifestyleModule.score}/100</strong></div>
          </div>
          <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-300">
            <strong>Physician Referral Note:</strong> &ldquo;This screening is generated via ensemble predictive models. Fasting metabolic lab panels (Lipid fractionation, HbA1c, Serum Creatinine) are recommended for formal risk staging.&rdquo;
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Medical Notice:</strong> Please consider consulting a qualified healthcare
          professional. This result is strictly an educational screening estimate and is NOT a medical
          diagnosis.
        </p>
      </div>
    </div>
  );
};
