import { HealthInputs, CommunityScreeningEntry, AwarenessQuestion } from '../types';

export const PRESET_PROFILES: Record<string, { title: string; subtitle: string; data: HealthInputs }> = {
  highRisk: {
    title: 'High Risk Executive Profile',
    subtitle: 'Elevated BP, BMI 29.4, low activity, poor sleep, tobacco exposure',
    data: {
      age: 52,
      gender: 'male',
      heightCm: 175,
      weightKg: 90,
      systolicBP: 144,
      diastolicBP: 92,
      fastingGlucose: 118,
      heartRate: 84,
      cholesterolTotal: 235,
      insulinLevel: 19,
      dailyExerciseMinutes: 10,
      sleepHours: 5.5,
      waterLiters: 1.2,
      smokingHabit: 'regular',
      alcoholHabit: 'moderate',
      dietHabit: 'high_sodium_processed',
      familyHistoryHeartDisease: true,
      familyHistoryDiabetes: true,
      familyHistoryHypertension: true,
      symptoms: ['fatigue', 'mild_breathlessness'],
    },
  },
  moderateRisk: {
    title: 'Prediabetes & Metabolic Profile',
    subtitle: 'Borderline glucose, BMI 27.2, sedentary desk job, irregular diet',
    data: {
      age: 44,
      gender: 'female',
      heightCm: 162,
      weightKg: 71,
      systolicBP: 128,
      diastolicBP: 84,
      fastingGlucose: 110,
      heartRate: 76,
      cholesterolTotal: 205,
      insulinLevel: 15,
      dailyExerciseMinutes: 15,
      sleepHours: 6.5,
      waterLiters: 1.8,
      smokingHabit: 'never',
      alcoholHabit: 'occasional',
      dietHabit: 'high_carb_sugar',
      familyHistoryHeartDisease: false,
      familyHistoryDiabetes: true,
      familyHistoryHypertension: true,
      pregnancies: 2,
      symptoms: ['excessive_thirst', 'afternoon_fatigue'],
    },
  },
  healthyProfile: {
    title: 'Active Community Volunteer',
    subtitle: 'Normal vitals, balanced Mediterranean diet, 45m daily exercise, 8h sleep',
    data: {
      age: 32,
      gender: 'male',
      heightCm: 178,
      weightKg: 72,
      systolicBP: 116,
      diastolicBP: 74,
      fastingGlucose: 88,
      heartRate: 64,
      cholesterolTotal: 172,
      insulinLevel: 6,
      dailyExerciseMinutes: 45,
      sleepHours: 7.8,
      waterLiters: 2.8,
      smokingHabit: 'never',
      alcoholHabit: 'occasional',
      dietHabit: 'balanced',
      familyHistoryHeartDisease: false,
      familyHistoryDiabetes: false,
      familyHistoryHypertension: false,
      symptoms: [],
    },
  },
};

export const AWARENESS_QUESTIONS: AwarenessQuestion[] = [
  {
    id: 'bp_knowledge',
    question: 'Do you know your typical Blood Pressure numbers (Systolic / Diastolic)?',
    explanation:
      'Blood pressure is often called a "silent killer" because elevated pressure rarely exhibits noticeable symptoms until organ strain occurs.',
    guidance:
      'A normal reading is under 120/80 mmHg. Hypertension starts at 130/80 mmHg or higher according to current AHA/ACC clinical thresholds.',
  },
  {
    id: 'glucose_knowledge',
    question: 'Do you know your fasting blood glucose or HbA1c level from the past 12 months?',
    explanation:
      'Early prediabetes is completely asymptomatic and affects roughly 1 in 3 adults, yet >80% are unaware of their status.',
    guidance:
      'Normal fasting blood sugar is 70–99 mg/dL. 100–125 mg/dL indicates prediabetes, while 126+ mg/dL on repeated tests points to diabetes.',
  },
  {
    id: 'exercise_routine',
    question: 'Do you achieve at least 150 minutes of moderate aerobic exercise per week (e.g. 30 min × 5 days)?',
    explanation:
      'Regular cardiovascular movement promotes arterial elasticity, sensitizes insulin receptors in skeletal muscle, and curbs resting heart rate.',
    guidance:
      'Even brisk 10-minute walks after meals substantially blunt postprandial glucose spikes.',
  },
  {
    id: 'sleep_hygiene',
    question: 'Do you regularly achieve 7 to 9 hours of restorative sleep each night?',
    explanation:
      'Sleep deprivation under 6 hours causes nocturnal sympathetic nervous system hyperactivity, spikes cortisol, and promotes leptin resistance.',
    guidance:
      'Maintain consistent bedtimes and keep screens away 45 minutes before sleep to optimize melatonin synthesis.',
  },
  {
    id: 'bmi_understanding',
    question: 'Do you know your current Body Mass Index (BMI) and abdominal waist circumference?',
    explanation:
      'While BMI measures mass relative to height, central abdominal visceral adiposity is particularly metabolic and inflammatory.',
    guidance:
      'Aim for a BMI between 18.5 and 24.9 kg/m², and waist circumference under 35 inches (females) or 40 inches (males).',
  },
];

// Generate exactly 250 community screening entries to match prompt:
// Total Screened: 250
// 🟢 Low Risk: 152
// 🟡 Moderate Risk: 67
// 🔴 High Risk: 31
export function generateInitialCommunityData(): CommunityScreeningEntry[] {
  const entries: CommunityScreeningEntry[] = [];
  const localities: Array<{ id: 'Area A' | 'Area B' | 'Area C' | 'Area D'; name: string }> = [
    { id: 'Area A', name: 'Area A — Greenfields North' },
    { id: 'Area B', name: 'Area B — Central Market Ward' },
    { id: 'Area C', name: 'Area C — Industrial Belt' },
    { id: 'Area D', name: 'Area D — Riverside Settlement' },
  ];

  let idCounter = 1001;

  // 152 Low Risk entries
  for (let i = 0; i < 152; i++) {
    // Area distribution: Area A (65), Area D (52), Area B (25), Area C (10)
    let loc = localities[0];
    if (i < 65) loc = localities[0]; // Area A
    else if (i < 117) loc = localities[3]; // Area D
    else if (i < 142) loc = localities[1]; // Area B
    else loc = localities[2]; // Area C

    const age = 20 + Math.floor(Math.random() * 38);
    const systolic = 110 + Math.floor(Math.random() * 14);
    const diastolic = 70 + Math.floor(Math.random() * 9);
    const glucose = 82 + Math.floor(Math.random() * 16);
    const bmi = Number((20.5 + Math.random() * 3.8).toFixed(1));
    const exercise = 30 + Math.floor(Math.random() * 35);

    entries.push({
      id: `CS-${idCounter++}`,
      timestamp: `2026-09-${String((i % 4) + 1).padStart(2, '0')} 09:${String(10 + (i % 50)).padStart(2, '0')}`,
      locality: loc.id,
      localityName: loc.name,
      age,
      gender: i % 2 === 0 ? 'female' : 'male',
      systolicBP: systolic,
      diastolicBP: diastolic,
      glucose,
      bmi,
      exerciseMins: exercise,
      smoking: false,
      riskLevel: 'Low',
      overallScore: 18 + Math.floor(Math.random() * 16),
      primaryRiskFactor: 'Within Normal Baseline Limits',
    });
  }

  // 67 Moderate Risk entries
  for (let i = 0; i < 67; i++) {
    // Distributed mostly in Area B (32) and Area C (22), and some in Area A (7) & D (6)
    let loc = localities[1]; // Area B
    if (i < 32) loc = localities[1];
    else if (i < 54) loc = localities[2]; // Area C
    else if (i < 61) loc = localities[0]; // Area A
    else loc = localities[3]; // Area D

    const age = 35 + Math.floor(Math.random() * 30);
    const systolic = 126 + Math.floor(Math.random() * 12);
    const diastolic = 82 + Math.floor(Math.random() * 8);
    const glucose = 100 + Math.floor(Math.random() * 22);
    const bmi = Number((25.5 + Math.random() * 4.2).toFixed(1));
    const exercise = 10 + Math.floor(Math.random() * 15);
    const smoking = i % 3 === 0;

    const riskFactors = [
      'Borderline BP (Prehypertension)',
      'Impaired Fasting Glucose',
      'Overweight BMI (>26)',
      'Low Daily Physical Activity',
    ];

    entries.push({
      id: `CS-${idCounter++}`,
      timestamp: `2026-09-${String((i % 4) + 1).padStart(2, '0')} 11:${String(15 + (i % 40)).padStart(2, '0')}`,
      locality: loc.id,
      localityName: loc.name,
      age,
      gender: i % 2 === 0 ? 'male' : 'female',
      systolicBP: systolic,
      diastolicBP: diastolic,
      glucose,
      bmi,
      exerciseMins: exercise,
      smoking,
      riskLevel: 'Moderate',
      overallScore: 42 + Math.floor(Math.random() * 18),
      primaryRiskFactor: riskFactors[i % riskFactors.length],
    });
  }

  // 31 High Risk entries
  for (let i = 0; i < 31; i++) {
    // Distributed heavily in Area C (18 - industrial), Area B (9), Area D (3), Area A (1)
    let loc = localities[2]; // Area C
    if (i < 18) loc = localities[2];
    else if (i < 27) loc = localities[1];
    else if (i < 30) loc = localities[3];
    else loc = localities[0];

    const age = 48 + Math.floor(Math.random() * 25);
    const systolic = 142 + Math.floor(Math.random() * 26);
    const diastolic = 92 + Math.floor(Math.random() * 16);
    const glucose = 130 + Math.floor(Math.random() * 65);
    const bmi = Number((29.5 + Math.random() * 7.5).toFixed(1));
    const exercise = Math.floor(Math.random() * 12);
    const smoking = i % 2 === 0;

    const highFactors = [
      'Severe High BP (Stage 2 Hypertension)',
      'Hyperglycemia (Blood Sugar >140 mg/dL)',
      'Severe Obesity + Sedentary Habits',
      'Hypertension & Active Tobacco Use',
    ];

    entries.push({
      id: `CS-${idCounter++}`,
      timestamp: `2026-09-${String((i % 4) + 1).padStart(2, '0')} 14:${String(10 + (i % 45)).padStart(2, '0')}`,
      locality: loc.id,
      localityName: loc.name,
      age,
      gender: i % 2 === 0 ? 'male' : 'female',
      systolicBP: systolic,
      diastolicBP: diastolic,
      glucose,
      bmi,
      exerciseMins: exercise,
      smoking,
      riskLevel: 'High',
      overallScore: 68 + Math.floor(Math.random() * 24),
      primaryRiskFactor: highFactors[i % highFactors.length],
    });
  }

  return entries;
}
