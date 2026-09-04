import React from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">
              Educational & Screening Prototype Notice
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Screening Purpose:</strong> This application is an educational prototype built
            to demonstrate explainable multi-module machine learning architectures (XGBoost, Random Forest,
            Logistic Regression) and community epidemiological analytics.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
            ⚠️ <strong>Not a Medical Diagnosis:</strong> This tool does not provide clinical diagnoses,
            prescriptions, or definitive medical treatment plans. Always consult a qualified medical
            doctor or certified healthcare provider for medical evaluations.
          </div>
          <p>
            <strong>Emergency Care:</strong> If you or anyone you know experiences chest discomfort,
            severe sudden breathlessness, acute pain radiating to the jaw/arm, or neurological deficits,
            seek immediate emergency medical attention.
          </p>
          <p>
            <strong>Community Camp Privacy:</strong> The Community Health Camp mode operates on
            strictly de-identified demographic and physiological parameters without storing names,
            phone numbers, government IDs, or street addresses.
          </p>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
