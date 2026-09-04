import React, { useState, useMemo } from 'react';
import { CommunityScreeningEntry, RiskLevel } from '../types';
import { calculateBMI } from '../utils/healthModels';
import {
  Users,
  MapPin,
  TrendingUp,
  PlusCircle,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Activity,
  Heart,
  FileSpreadsheet,
} from 'lucide-react';

interface CommunityCampDashboardProps {
  entries: CommunityScreeningEntry[];
  onAddEntry: (entry: CommunityScreeningEntry) => void;
}

export const CommunityCampDashboard: React.FC<CommunityCampDashboardProps> = ({
  entries,
  onAddEntry,
}) => {
  // Rapid Kiosk Form state
  const [showKiosk, setShowKiosk] = useState(false);
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');

  // Kiosk Form fields
  const [kioskAge, setKioskAge] = useState<number>(45);
  const [kioskGender, setKioskGender] = useState<'male' | 'female' | 'other'>('female');
  const [kioskLocality, setKioskLocality] = useState<'Area A' | 'Area B' | 'Area C' | 'Area D'>('Area B');
  const [kioskSystolic, setKioskSystolic] = useState<number>(132);
  const [kioskDiastolic, setKioskDiastolic] = useState<number>(86);
  const [kioskGlucose, setKioskGlucose] = useState<number>(108);
  const [kioskHeight, setKioskHeight] = useState<number>(164);
  const [kioskWeight, setKioskWeight] = useState<number>(72);
  const [kioskExercise, setKioskExercise] = useState<number>(15);
  const [kioskSmoking, setKioskSmoking] = useState<boolean>(false);

  // Computed live metrics
  const totalScreened = entries.length;
  const lowRiskCount = entries.filter((e) => e.riskLevel === 'Low').length;
  const moderateRiskCount = entries.filter((e) => e.riskLevel === 'Moderate').length;
  const highRiskCount = entries.filter((e) => e.riskLevel === 'High').length;

  // Most common risk factors across cohort
  const riskFactorCounts = useMemo(() => {
    let highBP = 0;
    let lowActivity = 0;
    let highBMI = 0;
    let highGlucose = 0;
    let smoking = 0;

    entries.forEach((e) => {
      if (e.systolicBP >= 130 || e.diastolicBP >= 85) highBP++;
      if (e.exerciseMins < 30) lowActivity++;
      if (e.bmi >= 25) highBMI++;
      if (e.glucose >= 100) highGlucose++;
      if (e.smoking) smoking++;
    });

    return [
      { name: 'High Blood Pressure (BP)', count: highBP, pct: Math.round((highBP / totalScreened) * 100) },
      { name: 'Low Physical Activity (<30m)', count: lowActivity, pct: Math.round((lowActivity / totalScreened) * 100) },
      { name: 'High BMI (Overweight / Obese)', count: highBMI, pct: Math.round((highBMI / totalScreened) * 100) },
      { name: 'High Blood Sugar (Glucose ≥100)', count: highGlucose, pct: Math.round((highGlucose / totalScreened) * 100) },
      { name: 'Active Tobacco / Smoking', count: smoking, pct: Math.round((smoking / totalScreened) * 100) },
    ];
  }, [entries, totalScreened]);

  // Locality aggregated map data
  const localities = [
    {
      id: 'Area A' as const,
      name: 'Area A — Greenfields North',
      desc: 'Suburban residential zone with green parks & community walking paths.',
      status: 'Low' as RiskLevel,
      badge: '🟢 Low Risk Ward',
      color: '#10b981',
      action: 'Conduct regular wellness seminars; maintain community sports centers.',
    },
    {
      id: 'Area B' as const,
      name: 'Area B — Central Market Ward',
      desc: 'High-density commercial precinct with busy shopkeepers and irregular meal routines.',
      status: 'Moderate' as RiskLevel,
      badge: '🟡 Moderate Risk Ward',
      color: '#f59e0b',
      action: 'Setup merchant health camps; promote hydration and dietary sodium reduction.',
    },
    {
      id: 'Area C' as const,
      name: 'Area C — Industrial Belt',
      desc: 'Manufacturing corridor with high shift work, occupational stress, and tobacco use.',
      status: 'High' as RiskLevel,
      badge: '🔴 High Priority Intervention',
      color: '#ef4444',
      action: 'Deploy mobile cardiology van; sponsor smoking cessation & hypertension screening.',
    },
    {
      id: 'Area D' as const,
      name: 'Area D — Riverside Settlement',
      desc: 'Mixed residential neighborhood near waterway with good walking access.',
      status: 'Low' as RiskLevel,
      badge: '🟢 Low Risk Ward',
      color: '#10b981',
      action: 'Continue baseline periodic screenings and maternal-child health checks.',
    },
  ];

  const localityStats = useMemo(() => {
    return localities.map((loc) => {
      const areaEntries = entries.filter((e) => e.locality === loc.id);
      const count = areaEntries.length;
      const low = areaEntries.filter((e) => e.riskLevel === 'Low').length;
      const mod = areaEntries.filter((e) => e.riskLevel === 'Moderate').length;
      const high = areaEntries.filter((e) => e.riskLevel === 'High').length;
      const highRate = count > 0 ? Math.round((high / count) * 100) : 0;

      return {
        ...loc,
        count,
        low,
        mod,
        high,
        highRate,
      };
    });
  }, [entries]);

  // Handle volunteer Kiosk submission
  const handleKioskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bmiResult = calculateBMI(kioskWeight, kioskHeight);

    // Score synthesis for volunteer entry
    let score = 20;
    if (kioskSystolic >= 140 || kioskDiastolic >= 90) score += 25;
    else if (kioskSystolic >= 130) score += 15;
    if (kioskGlucose >= 126) score += 28;
    else if (kioskGlucose >= 100) score += 14;
    if (bmiResult.bmi >= 30) score += 20;
    else if (bmiResult.bmi >= 25) score += 10;
    if (kioskExercise < 20) score += 12;
    if (kioskSmoking) score += 15;

    score = Math.min(Math.max(score, 12), 94);

    let riskLevel: RiskLevel = 'Low';
    if (score >= 60) riskLevel = 'High';
    else if (score >= 35) riskLevel = 'Moderate';

    const localityObj = localities.find((l) => l.id === kioskLocality);

    const newEntry: CommunityScreeningEntry = {
      id: `CS-${1000 + entries.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      locality: kioskLocality,
      localityName: localityObj ? localityObj.name : kioskLocality,
      age: kioskAge,
      gender: kioskGender,
      systolicBP: kioskSystolic,
      diastolicBP: kioskDiastolic,
      glucose: kioskGlucose,
      bmi: bmiResult.bmi,
      exerciseMins: kioskExercise,
      smoking: kioskSmoking,
      riskLevel,
      overallScore: score,
      primaryRiskFactor:
        riskLevel === 'High'
          ? 'Elevated BP & Glucose Thresholds'
          : riskLevel === 'Moderate'
          ? 'Overweight BMI & Low Physical Activity'
          : 'Baseline Normal Parameters',
    };

    onAddEntry(newEntry);
    setShowKiosk(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Locality,Age,Gender,SystolicBP,DiastolicBP,Glucose,BMI,ExerciseMins,Smoking,RiskLevel,Score\n';
    const rows = entries
      .map(
        (e) =>
          `${e.id},${e.timestamp},${e.locality},${e.age},${e.gender},${e.systolicBP},${e.diastolicBP},${e.glucose},${e.bmi},${e.exerciseMins},${e.smoking ? 'Yes' : 'No'},${e.riskLevel},${e.overallScore}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Community_Health_Camp_Screenings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered entries for table
  const filteredEntries = entries.filter((e) => {
    if (selectedLocalityFilter !== 'all' && e.locality !== selectedLocalityFilter) return false;
    if (selectedRiskFilter !== 'all' && e.riskLevel !== selectedRiskFilter) return false;
    return true;
  });

  return (
    <div id="community-camp-dashboard" className="space-y-6">
      {/* Camp Header & Kiosk Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Users className="w-3.5 h-3.5" />
              Community Service Project
            </span>
            <span className="text-xs text-slate-400">De-identified Epidemiological Screening</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            COMMUNITY HEALTH DASHBOARD
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-medium">
            Aggregated intelligence from mobile health camps. Privacy-first architecture: zero personal identifiers, names, or contact data stored.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowKiosk(!showKiosk)}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showKiosk ? 'Close Kiosk Form' : '+ New Participant Intake'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Rapid Intake Kiosk Form Modal/Drawer */}
      {showKiosk && (
        <form
          onSubmit={handleKioskSubmit}
          className="bg-indigo-50/70 border-2 border-indigo-300 rounded-2xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between pb-3 border-b border-indigo-200 mb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
                Volunteer Kiosk: Rapid Participant Measurement Entry
              </h3>
            </div>
            <span className="text-xs text-indigo-700 font-semibold">15-Second Screening Intake</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Locality Ward</label>
              <select
                value={kioskLocality}
                onChange={(e) => setKioskLocality(e.target.value as any)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
              >
                <option value="Area A">Area A (Greenfields)</option>
                <option value="Area B">Area B (Central Market)</option>
                <option value="Area C">Area C (Industrial Belt)</option>
                <option value="Area D">Area D (Riverside)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Age & Gender</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={kioskAge}
                  onChange={(e) => setKioskAge(Number(e.target.value))}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                  placeholder="Age"
                />
                <select
                  value={kioskGender}
                  onChange={(e) => setKioskGender(e.target.value as any)}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Pressure (Sys / Dia)</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={kioskSystolic}
                  onChange={(e) => setKioskSystolic(Number(e.target.value))}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                  placeholder="120"
                />
                <input
                  type="number"
                  value={kioskDiastolic}
                  onChange={(e) => setKioskDiastolic(Number(e.target.value))}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                  placeholder="80"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Sugar (mg/dL)</label>
              <input
                type="number"
                value={kioskGlucose}
                onChange={(e) => setKioskGlucose(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
                placeholder="Fasting glucose"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Height (cm) & Weight (kg)</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={kioskHeight}
                  onChange={(e) => setKioskHeight(Number(e.target.value))}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                  placeholder="165"
                />
                <input
                  type="number"
                  value={kioskWeight}
                  onChange={(e) => setKioskWeight(Number(e.target.value))}
                  className="w-1/2 p-2 bg-white rounded-lg border border-slate-300"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Daily Exercise (min)</label>
              <input
                type="number"
                value={kioskExercise}
                onChange={(e) => setKioskExercise(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
                placeholder="Minutes"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tobacco / Smoking</label>
              <select
                value={kioskSmoking ? 'yes' : 'no'}
                onChange={(e) => setKioskSmoking(e.target.value === 'yes')}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              >
                <option value="no">No / Non-smoker</option>
                <option value="yes">Yes / Active Smoker</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
              >
                Save & Classify Record
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4 KPI Cards: Total Screened & Breakdown (Direct prompt requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* People Screened */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            People Screened
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            {totalScreened}
            <span className="text-xs font-semibold text-emerald-600">Active cohort</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Standard health camp volume target
          </div>
        </div>

        {/* Low Risk */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm bg-emerald-50/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
            🟢 Low Risk
          </div>
          <div className="text-3xl font-black text-emerald-700 tracking-tight flex items-baseline gap-2">
            {lowRiskCount}
            <span className="text-xs font-semibold text-emerald-600">
              ({Math.round((lowRiskCount / totalScreened) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Healthy or normotensive profile</div>
        </div>

        {/* Moderate Risk */}
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm bg-amber-50/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">
            🟡 Moderate Risk
          </div>
          <div className="text-3xl font-black text-amber-700 tracking-tight flex items-baseline gap-2">
            {moderateRiskCount}
            <span className="text-xs font-semibold text-amber-600">
              ({Math.round((moderateRiskCount / totalScreened) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Overweight / Prehypertension</div>
        </div>

        {/* High Risk */}
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm bg-rose-50/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 mb-1">
            🔴 High Risk
          </div>
          <div className="text-3xl font-black text-rose-700 tracking-tight flex items-baseline gap-2">
            {highRiskCount}
            <span className="text-xs font-semibold text-rose-600">
              ({Math.round((highRiskCount / totalScreened) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Referred for medical examination</div>
        </div>
      </div>

      {/* Most Common Risk Factors (Exact prompt requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Most Common Risk Factors</h3>
            <p className="text-xs text-slate-500 font-medium">
              Prevalence across the screened community cohort (n={totalScreened}).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Cohort Prevalence %</span>
        </div>

        <div className="space-y-3">
          {riskFactorCounts.map((rf, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>{rf.name}</span>
                <span>
                  {rf.count} people ({rf.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    idx === 0
                      ? 'bg-rose-500'
                      : idx === 1
                      ? 'bg-amber-500'
                      : idx === 2
                      ? 'bg-indigo-500'
                      : idx === 3
                      ? 'bg-sky-500'
                      : 'bg-slate-600'
                  }`}
                  style={{ width: `${rf.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Community Risk Map (Exact prompt requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                🗺️ COMMUNITY HEALTH MAP (AGGREGATED LOCALITY RISK)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Locality-level aggregation to deploy targeted health awareness camps and screening vans.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-center">
            Privacy-Preserved Aggregation
          </span>
        </div>

        {/* Visual Map Layout connecting Area A, Area B, Area C, Area D */}
        <div className="bg-slate-900 rounded-xl p-5 text-white shadow-inner mb-5">
          <div className="text-center font-mono text-xs text-slate-400 mb-2">
            REGIONAL HEALTH INTELLIGENCE GRID
          </div>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-4 py-4 relative">
            {/* Area A (Top Left) */}
            <div className="bg-slate-800/90 border-2 border-emerald-500/80 rounded-xl p-3 text-center shadow-lg">
              <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Area A 🟢
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">Greenfields North</div>
              <div className="text-[11px] text-slate-300 mt-1 font-mono">
                Screened: {localityStats[0].count} | High Risk: {localityStats[0].high}
              </div>
              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Baseline Healthy
              </span>
            </div>

            {/* Area C (Top Right) */}
            <div className="bg-slate-800/90 border-2 border-rose-500/80 rounded-xl p-3 text-center shadow-lg">
              <div className="text-rose-400 font-bold text-xs flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
                Area C 🔴
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">Industrial Belt</div>
              <div className="text-[11px] text-slate-300 mt-1 font-mono">
                Screened: {localityStats[2].count} | High Risk: {localityStats[2].high} ({localityStats[2].highRate}%)
              </div>
              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                Critical Intervention
              </span>
            </div>

            {/* Area B (Bottom Left) */}
            <div className="bg-slate-800/90 border-2 border-amber-500/80 rounded-xl p-3 text-center shadow-lg">
              <div className="text-amber-400 font-bold text-xs flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Area B 🟡
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">Central Market</div>
              <div className="text-[11px] text-slate-300 mt-1 font-mono">
                Screened: {localityStats[1].count} | High Risk: {localityStats[1].high}
              </div>
              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Moderate / Pre-diabetes
              </span>
            </div>

            {/* Area D (Bottom Right) */}
            <div className="bg-slate-800/90 border-2 border-emerald-500/80 rounded-xl p-3 text-center shadow-lg">
              <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Area D 🟢
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">Riverside Ward</div>
              <div className="text-[11px] text-slate-300 mt-1 font-mono">
                Screened: {localityStats[3].count} | High Risk: {localityStats[3].high}
              </div>
              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Stable Surveillance
              </span>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Privacy Guarantee: Non-identifying spatial clustering designed for resource allocation, not individual tracing.
          </div>
        </div>

        {/* Detailed Locality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {localityStats.map((loc) => (
            <div
              key={loc.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: loc.color }}
                  ></span>
                  <h4 className="text-sm font-bold text-slate-900">{loc.name}</h4>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${loc.color}15`, color: loc.color }}
                >
                  {loc.badge}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3">{loc.desc}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-slate-200 mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Screened</div>
                  <div className="font-extrabold text-slate-800">{loc.count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Mod. Risk</div>
                  <div className="font-extrabold text-amber-600">{loc.mod}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">High Risk</div>
                  <div className="font-extrabold text-rose-600">{loc.high}</div>
                </div>
              </div>

              <div className="text-xs bg-indigo-50/70 text-indigo-950 p-2.5 rounded-lg border border-indigo-100 font-medium">
                <strong>Targeted Community Action:</strong> {loc.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screened Cohort Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Community Health Camp Registry (Sample View)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Showing {filteredEntries.length} de-identified entries.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <span>Ward:</span>
            </div>
            <select
              value={selectedLocalityFilter}
              onChange={(e) => setSelectedLocalityFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="all">All Wards</option>
              <option value="Area A">Area A</option>
              <option value="Area B">Area B</option>
              <option value="Area C">Area C</option>
              <option value="Area D">Area D</option>
            </select>

            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="all">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Participant ID</th>
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3">Age/Sex</th>
                <th className="py-2.5 px-3">BP (mmHg)</th>
                <th className="py-2.5 px-3">Glucose</th>
                <th className="py-2.5 px-3">BMI</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Primary Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.slice(0, 10).map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{entry.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{entry.locality}</td>
                  <td className="py-2.5 px-3 capitalize text-slate-600">
                    {entry.age}y / {entry.gender[0]}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    {entry.systolicBP}/{entry.diastolicBP}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{entry.glucose} mg/dL</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{entry.bmi}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        entry.riskLevel === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : entry.riskLevel === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {entry.riskLevel} ({entry.overallScore})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[180px]">
                    {entry.primaryRiskFactor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Displaying latest cohort screenings</span>
          <span>Showing 10 of {filteredEntries.length} entries</span>
        </div>
      </div>
    </div>
  );
};
