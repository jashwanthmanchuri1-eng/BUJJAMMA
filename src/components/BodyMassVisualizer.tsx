import React from 'react';
import { calculateBMI } from '../utils/healthModels';
import { Scale, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BodyMassVisualizerProps {
  heightCm: number;
  weightKg: number;
}

export const BodyMassVisualizer: React.FC<BodyMassVisualizerProps> = ({ heightCm, weightKg }) => {
  const { bmi, category } = calculateBMI(weightKg, heightCm);

  // Calculate position on BMI spectrum (15 to 40)
  const minBMI = 15;
  const maxBMI = 40;
  const clampedBMI = Math.min(Math.max(bmi, minBMI), maxBMI);
  const percent = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;

  const getCategoryColor = () => {
    switch (category) {
      case 'Normal':
        return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'Overweight':
        return 'text-amber-800 bg-amber-100 border-amber-300';
      case 'Underweight':
        return 'text-blue-800 bg-blue-100 border-blue-300';
      default:
        return 'text-rose-800 bg-rose-100 border-rose-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Live Body Mass Index (BMI) Analysis
          </h4>
        </div>
        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getCategoryColor()}`}>
          {category}
        </span>
      </div>

      {/* Main Metric & Dial Bar */}
      <div className="text-center my-3">
        <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {bmi} <span className="text-xs text-slate-400 font-semibold">kg/m²</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Calculated for {heightCm} cm & {weightKg} kg
        </p>
      </div>

      {/* Visual Color Spectrum Bar */}
      <div className="relative pt-6 pb-2">
        {/* Indicator marker pin */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
          style={{ left: `${percent}%` }}
        >
          <span className="text-[10px] font-extrabold bg-slate-900 text-white px-1.5 py-0.5 rounded-md shadow-xs">
            {bmi}
          </span>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900" />
        </div>

        {/* Continuous Bar with WHO standard ranges */}
        <div className="h-3 rounded-full overflow-hidden flex bg-slate-100">
          <div className="w-[14%] bg-blue-400" title="Underweight (<18.5)" />
          <div className="w-[26%] bg-emerald-400" title="Normal (18.5-24.9)" />
          <div className="w-[20%] bg-amber-400" title="Overweight (25-29.9)" />
          <div className="w-[40%] bg-rose-400" title="Obese (30+)" />
        </div>

        {/* Labels below bar */}
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5 px-0.5">
          <span>&lt;18.5</span>
          <span>18.5–24.9</span>
          <span>25.0–29.9</span>
          <span>30.0+</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
        {category === 'Normal' ? (
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Your BMI falls within the healthy standard range recommended by the World Health Organization.
          </span>
        ) : (
          <span className="text-amber-800 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            BMI is an anthropometric screening indicator. Adjusting diet and daily physical activity can assist in shifting toward optimal metabolic range.
          </span>
        )}
      </div>
    </div>
  );
};
