import React, { useState } from 'react';
import { HealthInputs, OverallAssessment } from '../types';
import {
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

interface HealthPassportCardProps {
  inputs: HealthInputs;
  assessment: OverallAssessment;
}

export const HealthPassportCard: React.FC<HealthPassportCardProps> = ({
  inputs,
  assessment,
}) => {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const doctorQuestions = [
    `My screening blood pressure was ${inputs.systolicBP}/${inputs.diastolicBP} mmHg. Would you recommend formal ambulatory 24-hr BP monitoring or in-clinic re-measurement?`,
    `My fasting blood glucose is ${inputs.fastingGlucose} mg/dL. Should we order a diagnostic Glycated Hemoglobin (HbA1c) lab?`,
    `My total cholesterol is recorded as ${inputs.cholesterolTotal} mg/dL. Is a full lipid fraction panel (LDL, HDL, Triglycerides) indicated?`,
    `Given my family history and ${inputs.dailyExerciseMinutes} min/day exercise, what target heart rate zone is safe for me to begin aerobic conditioning?`,
    inputs.symptoms.length > 0
      ? `I reported active symptoms (${inputs.symptoms.join(', ')}). Are these indicative of underlying vascular or metabolic strain?`
      : 'What is the recommended screening interval before my next preventive wellness check?',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs print:border-none print:shadow-none">
      {/* Top Header of Passport */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Patient Preventive Health Passport
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Doc Ref #{inputs.age}{inputs.gender[0].toUpperCase()}-XAI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Standardized biometric screening summary for clinical consultation & personal records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer w-fit"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Passport Identity & Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 mb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Age & Demographics
          </span>
          <span className="text-xs font-bold text-slate-900 capitalize">
            {inputs.age} yrs • {inputs.gender}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Blood Pressure
          </span>
          <span
            className={`text-xs font-bold ${
              inputs.systolicBP >= 130 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {inputs.systolicBP}/{inputs.diastolicBP} mmHg
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            BMI & Category
          </span>
          <span className="text-xs font-bold text-slate-900">
            {assessment.bmi} ({assessment.bmiCategory})
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Composite Screening Tier
          </span>
          <span
            className={`inline-block text-xs font-extrabold px-2 py-0.5 rounded-full mt-0.5 ${
              assessment.riskLevel === 'High'
                ? 'bg-rose-100 text-rose-800'
                : assessment.riskLevel === 'Moderate'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {assessment.riskLevel} Risk ({assessment.overallScore}/100)
          </span>
        </div>
      </div>

      {/* Biomarker Laboratory Summary */}
      <div className="mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Biomarker Lab Snapshot
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[11px]">Fasting Glucose</span>
            <span className="font-extrabold text-slate-800">{inputs.fastingGlucose} mg/dL</span>
            <span className="text-[10px] text-slate-400 block">Ref: 70-99</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[11px]">Total Cholesterol</span>
            <span className="font-extrabold text-slate-800">{inputs.cholesterolTotal} mg/dL</span>
            <span className="text-[10px] text-slate-400 block">Ref: &lt;200</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[11px]">Fasting Insulin</span>
            <span className="font-extrabold text-slate-800">{inputs.insulinLevel} uIU/mL</span>
            <span className="text-[10px] text-slate-400 block">Ref: 2-20</span>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[11px]">Resting Pulse</span>
            <span className="font-extrabold text-slate-800">{inputs.heartRate} bpm</span>
            <span className="text-[10px] text-slate-400 block">Ref: 60-80</span>
          </div>
        </div>
      </div>

      {/* Questions for Your Doctor Checklist */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Doctor Consultation Preparation Checklist
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Check off each question during your appointment to ensure every flagged biometric marker is evaluated.
        </p>

        <div className="space-y-2">
          {doctorQuestions.map((q, idx) => {
            const isDone = checkedQuestions[idx] || false;
            return (
              <div
                key={idx}
                onClick={() => toggleQuestion(idx)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 line-through opacity-80'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="font-medium leading-relaxed">{q}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Disclaimer Banner */}
      <div className="mt-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950 font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Educational Screening Document:</strong> This document is generated from an
          experimental explainable machine learning screening engine. It does not replace formal laboratory
          testing or clinical physician evaluation.
        </div>
      </div>
    </div>
  );
};
