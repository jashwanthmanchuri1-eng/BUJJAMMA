import React, { useState } from 'react';
import { HealthInputs, WhatIfChanges, HeartModelAlgorithm } from '../types';
import { runWhatIfSimulation, calculateBMI } from '../utils/healthModels';
import { Sliders, Sparkles, ArrowDownRight, RefreshCw, AlertCircle, TrendingDown } from 'lucide-react';

interface WhatIfSimulatorProps {
  currentInputs: HealthInputs;
  selectedAlgo: HeartModelAlgorithm;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentInputs,
  selectedAlgo,
}) => {
  // Modifiable parameters
  const [changes, setChanges] = useState<WhatIfChanges>({
    dailyExerciseMinutes: Math.max(currentInputs.dailyExerciseMinutes, 35),
    sleepHours: Math.max(currentInputs.sleepHours, 7.5),
    weightKg: Math.max(Math.round(currentInputs.weightKg * 0.92), 50),
    smokingHabit: 'never',
    dietHabit: 'balanced',
    waterLiters: Math.max(currentInputs.waterLiters, 2.5),
  });

  const { currentAssessment, simulatedAssessment, scoreDifference, bmiDifference } =
    runWhatIfSimulation(currentInputs, changes, selectedAlgo);

  const currentBMI = calculateBMI(currentInputs.weightKg, currentInputs.heightCm).bmi;
  const simulatedBMI = calculateBMI(changes.weightKg, currentInputs.heightCm).bmi;

  const handleResetToCurrent = () => {
    setChanges({
      dailyExerciseMinutes: currentInputs.dailyExerciseMinutes,
      sleepHours: currentInputs.sleepHours,
      weightKg: currentInputs.weightKg,
      smokingHabit: currentInputs.smokingHabit,
      dietHabit: currentInputs.dietHabit,
      waterLiters: currentInputs.waterLiters,
    });
  };

  const handleQuickPresetOptimal = () => {
    setChanges({
      dailyExerciseMinutes: 45,
      sleepHours: 8,
      weightKg: Math.round(22.5 * Math.pow(currentInputs.heightCm / 100, 2)), // target normal BMI 22.5
      smokingHabit: 'never',
      dietHabit: 'balanced',
      waterLiters: 3,
    });
  };

  return (
    <div
      id="what-if-simulator"
      className="bg-white rounded-2xl border border-indigo-200 p-5 sm:p-6 shadow-sm ring-1 ring-indigo-500/10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                🔥 What-If Health Simulator
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Interactive Scenario Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Simulate how evidence-based lifestyle modifications alter AI risk projections in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickPresetOptimal}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Apply Optimal Scenario
          </button>
          <button
            type="button"
            onClick={handleResetToCurrent}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Reset to current inputs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Before vs After Display (matching prompt format) */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Current State */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Current Profile
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 flex items-center justify-center gap-2">
            <span>
              {currentAssessment.riskLevel === 'High'
                ? '🔴'
                : currentAssessment.riskLevel === 'Moderate'
                ? '🟡'
                : '🟢'}
            </span>
            <span>{currentAssessment.overallScore}</span>
            <span className="text-xs font-semibold text-slate-400">/100</span>
          </div>
          <div className="text-xs font-semibold text-slate-700">
            {currentAssessment.riskLevel} Risk Level
          </div>
          <div className="text-[11px] text-slate-500 mt-2 space-y-0.5 border-t border-slate-200/60 pt-2">
            <div>Exercise: <strong>{currentInputs.dailyExerciseMinutes} min/day</strong></div>
            <div>Sleep: <strong>{currentInputs.sleepHours} hrs</strong> | BMI: <strong>{currentBMI}</strong></div>
          </div>
        </div>

        {/* Delta Center Indicator */}
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm shadow-xs">
            <TrendingDown className="w-4 h-4" />
            {scoreDifference < 0 ? (
              <span>↓ {Math.abs(scoreDifference)} points lower risk</span>
            ) : scoreDifference > 0 ? (
              <span>↑ {scoreDifference} points increase</span>
            ) : (
              <span>No change</span>
            )}
          </div>
          {bmiDifference !== 0 && (
            <div className="text-[11px] font-semibold text-slate-500 mt-1.5">
              BMI: {bmiDifference < 0 ? `↓ ${Math.abs(bmiDifference)}` : `↑ ${bmiDifference}`} kg/m²
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-1 max-w-[170px] leading-tight">
            Dynamic algorithm re-estimation
          </div>
        </div>

        {/* Simulated State */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-emerald-50/70 rounded-xl p-4 border border-indigo-200 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
            Simulated Outcome
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 flex items-center justify-center gap-2">
            <span>
              {simulatedAssessment.riskLevel === 'High'
                ? '🔴'
                : simulatedAssessment.riskLevel === 'Moderate'
                ? '🟡'
                : '🟢'}
            </span>
            <span className="text-indigo-950">{simulatedAssessment.overallScore}</span>
            <span className="text-xs font-semibold text-slate-400">/100</span>
          </div>
          <div className="text-xs font-bold text-indigo-800">
            {simulatedAssessment.riskLevel} Risk Level
          </div>
          <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 border-t border-indigo-100 pt-2">
            <div>Exercise: <strong className="text-indigo-950">{changes.dailyExerciseMinutes} min/day</strong></div>
            <div>Sleep: <strong className="text-indigo-950">{changes.sleepHours} hrs</strong> | BMI: <strong className="text-indigo-950">{simulatedBMI}</strong></div>
          </div>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
          Adjust Modifiable Lifestyle Knobs
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Exercise Slider */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-700">Daily Exercise</span>
              <span className="font-extrabold text-indigo-600">
                {changes.dailyExerciseMinutes} min / day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={changes.dailyExerciseMinutes}
              onChange={(e) =>
                setChanges({ ...changes, dailyExerciseMinutes: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 min (Sedentary)</span>
              <span>30 min (WHO Target)</span>
              <span>90 min</span>
            </div>
          </div>

          {/* Sleep Slider */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-700">Sleep Duration</span>
              <span className="font-extrabold text-indigo-600">{changes.sleepHours} hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={changes.sleepHours}
              onChange={(e) => setChanges({ ...changes, sleepHours: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>4 hrs</span>
              <span>7–8 hrs (Optimal)</span>
              <span>10 hrs</span>
            </div>
          </div>

          {/* Body Weight / BMI Slider */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-700">Target Body Weight</span>
              <span className="font-extrabold text-indigo-600">
                {changes.weightKg} kg (BMI {simulatedBMI})
              </span>
            </div>
            <input
              type="range"
              min={Math.max(40, Math.round(currentInputs.weightKg * 0.65))}
              max={Math.round(currentInputs.weightKg * 1.3)}
              step="1"
              value={changes.weightKg}
              onChange={(e) => setChanges({ ...changes, weightKg: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Current: {currentInputs.weightKg} kg</span>
              <span>Normal BMI zone: ~{Math.round(22 * Math.pow(currentInputs.heightCm / 100, 2))} kg</span>
            </div>
          </div>

          {/* Smoking & Diet Toggles */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-700 mb-2">Habit Modifications</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setChanges({
                    ...changes,
                    smokingHabit: changes.smokingHabit === 'never' ? 'regular' : 'never',
                  })
                }
                className={`text-xs p-2 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                  changes.smokingHabit === 'never'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                {changes.smokingHabit === 'never' ? '✅ Tobacco-Free' : '🚬 Active Smoking'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setChanges({
                    ...changes,
                    dietHabit: changes.dietHabit === 'balanced' ? 'high_sodium_processed' : 'balanced',
                  })
                }
                className={`text-xs p-2 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                  changes.dietHabit === 'balanced'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                {changes.dietHabit === 'balanced' ? '🥗 Balanced Whole Diet' : '🍔 Processed Foods'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Disclaimer (Mandatory by prompt) */}
      <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-2 text-xs text-indigo-950">
        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Model Simulation Note:</strong> This is an algorithmic simulation
          demonstrating statistical correlations between lifestyle inputs and risk estimates. It is
          not a clinical guarantee that lifestyle adjustments will reduce individual medical risk by
          that exact numerical amount.
        </p>
      </div>
    </div>
  );
};
