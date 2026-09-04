export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type Gender = 'male' | 'female' | 'other';

export type DietHabit = 'balanced' | 'high_carb_sugar' | 'high_sodium_processed' | 'vegetarian_balanced' | 'low_fiber';

export type PhysicalActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active'; // <15m, 15-30m, 30-60m, >60m

export type SmokingHabit = 'never' | 'former' | 'occasional' | 'regular';

export type AlcoholHabit = 'never' | 'occasional' | 'moderate' | 'heavy';

export interface HealthInputs {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  systolicBP: number; // mmHg (e.g. 120)
  diastolicBP: number; // mmHg (e.g. 80)
  fastingGlucose: number; // mg/dL (e.g. 95)
  heartRate: number; // bpm (e.g. 72)
  cholesterolTotal: number; // mg/dL (e.g. 190)
  insulinLevel: number; // uIU/mL (e.g. 12, normal fasting 2-20)
  dailyExerciseMinutes: number; // minutes/day
  sleepHours: number; // hours/day
  waterLiters: number; // liters/day
  smokingHabit: SmokingHabit;
  alcoholHabit: AlcoholHabit;
  dietHabit: DietHabit;
  familyHistoryHeartDisease: boolean;
  familyHistoryDiabetes: boolean;
  familyHistoryHypertension: boolean;
  pregnancies?: number; // For females, useful in diabetes module
  symptoms: string[]; // e.g. 'chest_tightness', 'shortness_of_breath', 'excessive_thirst', 'fatigue', 'dizziness'
}

export type HeartModelAlgorithm = 'logistic_regression' | 'random_forest' | 'xgboost';

export interface HeartRiskResult {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  algorithmUsed: HeartModelAlgorithm;
  algorithmAccuracy: number; // e.g. 89.6%
  modelComparisons: {
    algorithm: HeartModelAlgorithm;
    name: string;
    accuracy: number;
    score: number;
    description: string;
  }[];
  keyIndicators: string[];
}

export interface DiabetesRiskResult {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  pimaFeaturesScore: number;
  factors: string[];
  insulinResistanceEstimate: 'Normal' | 'Borderline' | 'Elevated';
}

export interface LifestyleScoreResult {
  score: number; // 0 to 100
  grade: 'Optimal' | 'Good' | 'Fair' | 'Needs Improvement';
  strengths: string[];
  needsAttention: string[];
  subScores: {
    sleep: number;
    exercise: number;
    diet: number;
    hydration: number;
    habits: number;
    bmi: number;
    bp: number;
  };
}

export interface FeatureAttribution {
  feature: string;
  contributionPercent: number; // e.g. 35
  direction: 'increases_risk' | 'decreases_risk' | 'neutral';
  valueDisplay: string;
}

export interface OverallAssessment {
  overallScore: number; // 0 to 100
  riskLevel: RiskLevel;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obesity Class I' | 'Obesity Class II+';
  mainContributingFactors: string[];
  primaryRecommendedAction: string;
  featureAttributions: FeatureAttribution[];
  heartModule: HeartRiskResult;
  diabetesModule: DiabetesRiskResult;
  lifestyleModule: LifestyleScoreResult;
  radarScores: {
    heart: number;
    diabetes: number;
    lifestyleRisk: number; // inverted lifestyle score
    obesity: number;
    vitals: number;
  };
  recommendations: {
    activity: string;
    diet: string;
    sleep: string;
    clinical: string;
    urgentFlag?: string;
  };
}

export interface WhatIfChanges {
  dailyExerciseMinutes: number;
  sleepHours: number;
  weightKg: number;
  smokingHabit: SmokingHabit;
  dietHabit: DietHabit;
  waterLiters: number;
}

export interface AwarenessQuestion {
  id: string;
  question: string;
  explanation: string;
  guidance: string;
}

export interface CommunityScreeningEntry {
  id: string;
  timestamp: string;
  locality: 'Area A' | 'Area B' | 'Area C' | 'Area D';
  localityName: string;
  age: number;
  gender: Gender;
  systolicBP: number;
  diastolicBP: number;
  glucose: number;
  bmi: number;
  exerciseMins: number;
  smoking: boolean;
  riskLevel: RiskLevel;
  overallScore: number;
  primaryRiskFactor: string;
}

export interface CommunityDashboardStats {
  totalScreened: number;
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  riskFactorBreakdown: {
    factor: string;
    count: number;
    percentage: number;
  }[];
  localityBreakdown: {
    locality: 'Area A' | 'Area B' | 'Area C' | 'Area D';
    name: string;
    total: number;
    low: number;
    moderate: number;
    high: number;
    dominantFactor: string;
    status: RiskLevel;
  }[];
}
