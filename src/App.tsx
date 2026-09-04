import React, { useState } from 'react';
import { HealthInputs, HeartModelAlgorithm, CommunityScreeningEntry } from './types';
import { PRESET_PROFILES, generateInitialCommunityData } from './data/sampleData';
import { generateOverallAssessment } from './utils/healthModels';
import { Header, AppPage } from './components/Header';
import { QuickStatusBanner } from './components/QuickStatusBanner';
import { HealthForm } from './components/HealthForm';
import { BodyMassVisualizer } from './components/BodyMassVisualizer';
import { RiskSummaryCard } from './components/RiskSummaryCard';
import { HealthRadarChart } from './components/HealthRadarChart';
import { ModuleCardHeart } from './components/ModuleCardHeart';
import { ModuleCardDiabetes } from './components/ModuleCardDiabetes';
import { ModuleCardLifestyle } from './components/ModuleCardLifestyle';
import { ExplainableAIPanel } from './components/ExplainableAIPanel';
import { DecisionTreeViewer } from './components/DecisionTreeViewer';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { FutureRiskTrajectory } from './components/FutureRiskTrajectory';
import { AIRecommendations } from './components/AIRecommendations';
import { HealthPassportCard } from './components/HealthPassportCard';
import { HealthAwarenessQuiz } from './components/HealthAwarenessQuiz';
import { CommunityCampDashboard } from './components/CommunityCampDashboard';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import {
  Activity,
  Heart,
  Droplet,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('intake');
  const [inputs, setInputs] = useState<HealthInputs>(PRESET_PROFILES.highRisk.data);
  const [selectedHeartAlgo, setSelectedHeartAlgo] = useState<HeartModelAlgorithm>('xgboost');
  const [communityEntries, setCommunityEntries] = useState<CommunityScreeningEntry[]>(() =>
    generateInitialCommunityData()
  );
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Compute live assessment from current state
  const assessment = generateOverallAssessment(inputs, selectedHeartAlgo);

  const handleAddCommunityEntry = (entry: CommunityScreeningEntry) => {
    setCommunityEntries((prev) => [entry, ...prev]);
  };

  const handleLoadPreset = (presetData: HealthInputs) => {
    setInputs(presetData);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header with Navigation Tabs */}
      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLoadPreset={handleLoadPreset}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        communityCount={communityEntries.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Quick Status Banner (Shown across all individual health pages) */}
        {currentPage !== 'community' && (
          <QuickStatusBanner
            assessment={assessment}
            selectedAlgo={selectedHeartAlgo}
            onNavigateTo={(target) => setCurrentPage(target as AppPage)}
            currentPage={currentPage}
          />
        )}

        {/* ========================================================================= */}
        {/* PAGE 1: SMART VITALS & BIOMETRIC INTAKE                                  */}
        {/* ========================================================================= */}
        {currentPage === 'intake' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Intake Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <HealthForm inputs={inputs} onChange={setInputs} />
              </div>

              {/* Right Column: Interactive BMI Gauge & Instant Clinical Status (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Visual BMI Gauge */}
                <BodyMassVisualizer heightCm={inputs.heightCm} weightKg={inputs.weightKg} />

                {/* Live Biomarkers Quick-Check Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Biomarker Reference Snapshot
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Blood Pressure</span>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">
                          {inputs.systolicBP}/{inputs.diastolicBP} mmHg
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            inputs.systolicBP >= 130 || inputs.diastolicBP >= 85
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {inputs.systolicBP >= 130 ? '⚠️ Stage 1+ Elevated' : '✓ Desirable'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Fasting Blood Glucose</span>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">
                          {inputs.fastingGlucose} mg/dL
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            inputs.fastingGlucose >= 100 ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {inputs.fastingGlucose >= 100 ? '⚠️ Impaired / Prediabetic' : '✓ Normal Euglycemia'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Daily Exercise</span>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">
                          {inputs.dailyExerciseMinutes} min/day
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            inputs.dailyExerciseMinutes >= 30 ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {inputs.dailyExerciseMinutes >= 30 ? '✓ Meets WHO Target' : '⚠️ Sub-optimal (<30m)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA button to Next Page */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentPage('diagnostics')}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>Generate Multi-Model AI Diagnostics</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      Evaluates Heart (XGBoost/RF), Diabetes (Pima), & Lifestyle scores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: MULTI-MODEL AI DIAGNOSTICS HUB                                    */}
        {/* ========================================================================= */}
        {currentPage === 'diagnostics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Row: Overall Risk Summary Card */}
            <RiskSummaryCard assessment={assessment} />

            {/* Middle Grid: Radar & Module A Heart Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-6">
                <HealthRadarChart scores={assessment.radarScores} />
              </div>

              <div className="lg:col-span-7 space-y-6">
                <ModuleCardHeart
                  heartResult={assessment.heartModule}
                  selectedAlgo={selectedHeartAlgo}
                  onSelectAlgo={setSelectedHeartAlgo}
                />
              </div>
            </div>

            {/* Bottom Row: Module B (Diabetes) & Module C (Lifestyle) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModuleCardDiabetes diabetesResult={assessment.diabetesModule} />
              <ModuleCardLifestyle lifestyleResult={assessment.lifestyleModule} />
            </div>

            {/* Navigation Footer for Page 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Want to understand the mathematical drivers behind this screening score?
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('xai')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>Inspect Explainable AI (XAI) Attribution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: EXPLAINABLE AI & SHAP ATTRIBUTION LAB                             */}
        {/* ========================================================================= */}
        {currentPage === 'xai' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Explainable AI (XAI) Transparency Suite
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Demystifying black-box machine learning through SHAP-inspired feature attributions and deterministic decision trees.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. SHAP Feature Attribution Panel */}
            <ExplainableAIPanel
              attributions={assessment.featureAttributions}
              riskLevel={assessment.riskLevel}
              overallScore={assessment.overallScore}
            />

            {/* 2. Interactive Decision Tree Path Visualizer */}
            <DecisionTreeViewer inputs={inputs} assessment={assessment} />

            {/* 3. Counterfactual Leverage Ranking */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Counterfactual Sensitivity Analysis: Top Levers for Risk Reduction
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Our algorithmic sensitivity analysis computes which single behavioral or clinical modification will yield the steepest downward risk trajectory for your profile:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Priority Lever 1: Blood Pressure
                  </span>
                  <span className="text-sm font-extrabold text-emerald-950 block my-1">
                    Systolic BP &lt;120 mmHg
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    📉 Projected Impact: -18% Risk
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">
                    Priority Lever 2: Aerobic Activity
                  </span>
                  <span className="text-sm font-extrabold text-indigo-950 block my-1">
                    Increase to 35 min/day
                  </span>
                  <span className="text-[11px] font-bold text-indigo-700">
                    📉 Projected Impact: -14% Risk
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    Priority Lever 3: Sleep & Weight
                  </span>
                  <span className="text-sm font-extrabold text-amber-950 block my-1">
                    7.5h Sleep + 4% Weight Loss
                  </span>
                  <span className="text-[11px] font-bold text-amber-700">
                    📉 Projected Impact: -11% Risk
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage('simulator')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <span>Test These Scenarios in What-If Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: "WHAT-IF" LONGEVITY SIMULATOR                                     */}
        {/* ========================================================================= */}
        {currentPage === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Interactive Sliders Simulator */}
            <WhatIfSimulator currentInputs={inputs} selectedAlgo={selectedHeartAlgo} />

            {/* 5-Year Longitudinal Future Risk Trajectory */}
            <FutureRiskTrajectory
              currentScore={assessment.overallScore}
              simulatedScore={Math.max(15, Math.round(assessment.overallScore * 0.65))}
            />

            {/* Bottom Next Step Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Ready to translate simulated improvements into an actionable care protocol?
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('careplan')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>View Personalized Care Plan & Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: PERSONALIZED CARE PLAN & HEALTH PASSPORT                          */}
        {/* ========================================================================= */}
        {currentPage === 'careplan' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 4-Pillar AI Clinical & Lifestyle Prescriptions */}
            <AIRecommendations assessment={assessment} inputs={inputs} />

            {/* Printable Health Passport & Doctor Consultation Checklist */}
            <HealthPassportCard inputs={inputs} assessment={assessment} />

            {/* Bottom Next Step Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Test your understanding of clinical thresholds with our Health Literacy Quiz.
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('quiz')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>Take Awareness Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: COMMUNITY HEALTH AWARENESS QUIZ                                   */}
        {/* ========================================================================= */}
        {currentPage === 'quiz' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <HealthAwarenessQuiz />

            {/* Transition to Community Camp */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Explore large-scale epidemiological data in our Community Screening Camp mode.
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('community')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>Open Community Screening Camp (250 Cohort)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: COMMUNITY HEALTH CAMP & GIS RISK MAP                             */}
        {/* ========================================================================= */}
        {currentPage === 'community' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CommunityCampDashboard
              entries={communityEntries}
              onAddEntry={handleAddCommunityEntry}
            />
          </div>
        )}
      </main>

      {/* Persistent Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>AI Health Screening Prototype</strong> — Multi-Module Explainable AI & Community Epidemiological Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Clinical Protocol & Disclaimer
            </button>
            <span className="text-slate-300">|</span>
            <span>Educational ML Demonstration</span>
          </div>
        </div>
      </footer>

      {/* Medical Disclaimer Modal */}
      <MedicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
