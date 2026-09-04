import React from 'react';
import { HealthInputs, Gender, SmokingHabit, AlcoholHabit, DietHabit } from '../types';
import { calculateBMI } from '../utils/healthModels';
import { Heart, Activity, Droplet, Moon, Footprints, AlertCircle, Sparkles } from 'lucide-react';

interface HealthFormProps {
  inputs: HealthInputs;
  onChange: (updated: HealthInputs) => void;
}

export const HealthForm: React.FC<HealthFormProps> = ({ inputs, onChange }) => {
  const { bmi, category: bmiCategory } = calculateBMI(inputs.weightKg, inputs.heightCm);

  const updateField = <K extends keyof HealthInputs>(field: K, value: HealthInputs[K]) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const toggleSymptom = (symptom: string) => {
    const exists = inputs.symptoms.includes(symptom);
    const updated = exists
      ? inputs.symptoms.filter((s) => s !== symptom)
      : [...inputs.symptoms, symptom];
    updateField('symptoms', updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Biometric & Lifestyle Health Inputs
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Enter routine screening values. The multi-module AI assistant evaluates your profile automatically.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400 font-medium">Calculated BMI</span>
          <div className="text-sm font-extrabold text-slate-900">
            {bmi} <span className="text-xs font-semibold text-indigo-600">({bmiCategory})</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 text-xs">
        {/* Section 1: Demographics & Anthropometrics */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. Demographics & Body Mass</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                min="18"
                max="100"
                value={inputs.age}
                onChange={(e) => updateField('age', Math.max(18, Number(e.target.value)))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={inputs.gender}
                onChange={(e) => updateField('gender', e.target.value as Gender)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Height (cm)</label>
              <input
                type="number"
                min="120"
                max="230"
                value={inputs.heightCm}
                onChange={(e) => updateField('heightCm', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Weight (kg)</label>
              <input
                type="number"
                min="35"
                max="220"
                value={inputs.weightKg}
                onChange={(e) => updateField('weightKg', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Pregnancies if female */}
          {inputs.gender === 'female' && (
            <div className="mt-2.5 max-w-xs">
              <label className="font-semibold text-slate-700 block mb-1">
                Pregnancies (Pima Diabetes Feature)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={inputs.pregnancies || 0}
                onChange={(e) => updateField('pregnancies', Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          )}
        </div>

        {/* Section 2: Clinical Vitals & Lab Biomarkers */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>2. Clinical Vitals & Laboratory Biomarkers</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                min="80"
                max="240"
                value={inputs.systolicBP}
                onChange={(e) => updateField('systolicBP', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="120"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Target: &lt;120 mmHg</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                min="50"
                max="140"
                value={inputs.diastolicBP}
                onChange={(e) => updateField('diastolicBP', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="80"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Target: &lt;80 mmHg</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fasting Glucose (mg/dL)</label>
              <input
                type="number"
                min="60"
                max="350"
                value={inputs.fastingGlucose}
                onChange={(e) => updateField('fastingGlucose', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="95"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 70–99 mg/dL</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                min="40"
                max="180"
                value={inputs.heartRate}
                onChange={(e) => updateField('heartRate', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="72"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Typical: 60–80 bpm</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Cholesterol (mg/dL)</label>
              <input
                type="number"
                min="100"
                max="400"
                value={inputs.cholesterolTotal}
                onChange={(e) => updateField('cholesterolTotal', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="190"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Desirable: &lt;200 mg/dL</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fasting Insulin (uIU/mL)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={inputs.insulinLevel}
                onChange={(e) => updateField('insulinLevel', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="10"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Normal: 2–20 uIU/mL</span>
            </div>
          </div>
        </div>

        {/* Section 3: Lifestyle Habits */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Modifiable Daily Lifestyle Habits</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Physical Activity (min/day)</label>
              <input
                type="number"
                min="0"
                max="180"
                value={inputs.dailyExerciseMinutes}
                onChange={(e) => updateField('dailyExerciseMinutes', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="30"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">WHO Rec: 30+ min/day</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sleep Duration (hours/night)</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="14"
                value={inputs.sleepHours}
                onChange={(e) => updateField('sleepHours', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="7.5"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Optimal: 7–8 hours</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Water Intake (Liters/day)</label>
              <input
                type="number"
                step="0.2"
                min="0.5"
                max="6"
                value={inputs.waterLiters}
                onChange={(e) => updateField('waterLiters', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="2.5"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Adequate: 2.0–3.0 L</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Dietary Pattern</label>
              <select
                value={inputs.dietHabit}
                onChange={(e) => updateField('dietHabit', e.target.value as DietHabit)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              >
                <option value="balanced">Balanced / Whole Foods</option>
                <option value="vegetarian_balanced">Vegetarian Balanced</option>
                <option value="high_carb_sugar">High Refined Carbs / Sugar</option>
                <option value="high_sodium_processed">High Sodium & Processed</option>
                <option value="low_fiber">Low Fiber / Fast Food</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Smoking Exposure</label>
              <select
                value={inputs.smokingHabit}
                onChange={(e) => updateField('smokingHabit', e.target.value as SmokingHabit)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              >
                <option value="never">Never Smoked (Tobacco Free)</option>
                <option value="former">Former Smoker (Quit &gt;1 yr)</option>
                <option value="occasional">Occasional / Social</option>
                <option value="regular">Regular Daily Smoker</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alcohol Consumption</label>
              <select
                value={inputs.alcoholHabit}
                onChange={(e) => updateField('alcoholHabit', e.target.value as AlcoholHabit)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:border-indigo-500 transition-colors"
              >
                <option value="never">None (Zero Alcohol)</option>
                <option value="occasional">Occasional / Rare</option>
                <option value="moderate">Moderate (1-2 drinks/wk)</option>
                <option value="heavy">Frequent / Heavy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Family History & Existing Symptoms */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>4. Family Genetic History & Existing Symptoms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Family History */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-700 block mb-2">
                First-Degree Family Predisposition
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={inputs.familyHistoryHeartDisease}
                    onChange={(e) => updateField('familyHistoryHeartDisease', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Early Cardiovascular Disease (Heart Attack / Angina)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={inputs.familyHistoryDiabetes}
                    onChange={(e) => updateField('familyHistoryDiabetes', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Type 2 Diabetes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={inputs.familyHistoryHypertension}
                    onChange={(e) => updateField('familyHistoryHypertension', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Chronic Hypertension</span>
                </label>
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-700 block mb-2">
                Presenting Symptoms (Flag for Clinical Attention)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'fatigue', label: 'Persistent Fatigue' },
                  { id: 'mild_breathlessness', label: 'Shortness of Breath on Exertion' },
                  { id: 'chest_tightness', label: '⚠️ Chest Discomfort' },
                  { id: 'excessive_thirst', label: 'Excessive Thirst / Urination' },
                  { id: 'dizziness', label: 'Dizziness / Lightheadedness' },
                  { id: 'swelling_ankles', label: 'Lower Leg / Ankle Swelling' },
                ].map((sym) => {
                  const isChecked = inputs.symptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`text-left p-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {sym.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
