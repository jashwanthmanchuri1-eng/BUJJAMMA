import React, { useState } from 'react';
import { AWARENESS_QUESTIONS } from '../data/sampleData';
import confetti from 'canvas-confetti';
import { GraduationCap, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

export const HealthAwarenessQuiz: React.FC = () => {
  // State tracking answers: key is question id, value is boolean
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    bp_knowledge: true,
    glucose_knowledge: true,
    exercise_routine: false,
    sleep_hygiene: false,
    bmi_understanding: true,
  });

  const [expandedId, setExpandedId] = useState<string | null>('bp_knowledge');

  const positiveCount = Object.values(answers).filter(Boolean).length;
  const awarenessScore = Math.round((positiveCount / AWARENESS_QUESTIONS.length) * 100);

  const toggleAnswer = (id: string, value: boolean) => {
    const updated = { ...answers, [id]: value };
    setAnswers(updated);
    const newCount = Object.values(updated).filter(Boolean).length;
    if (newCount === AWARENESS_QUESTIONS.length) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
    }
  };

  const getScoreRating = (sc: number) => {
    if (sc >= 80) return { label: 'High Health Literacy', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (sc >= 60) return { label: 'Moderate Literacy', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'Knowledge Gap Identified', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const rating = getScoreRating(awarenessScore);

  return (
    <div
      id="health-awareness-quiz"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                🏆 Community Health Awareness Score
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Health Literacy Metric
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Community empowerment checklist assessing preventive health literacy and personal biometric awareness.
            </p>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-center">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awareness Score</div>
            <div className="text-xl font-extrabold text-slate-900">
              {awarenessScore}<span className="text-xs text-slate-400 font-semibold"> / 100</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${rating.color}`}>
            {rating.label}
          </span>
        </div>
      </div>

      {/* Checklist items matching prompt */}
      <div className="mt-4 space-y-2.5">
        {AWARENESS_QUESTIONS.map((item, idx) => {
          const isKnown = answers[item.id] ?? false;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'border-indigo-300 bg-indigo-50/20 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xs font-bold text-slate-400 mt-0.5 w-4">{idx + 1}.</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{item.question}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAnswer(item.id, true)}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isKnown
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yes (Know)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAnswer(item.id, false)}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      !isKnown
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>No (Unsure)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="View educational guidance"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Educational Explanation Box */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-slate-100/80 text-xs text-slate-600 space-y-1.5 bg-slate-50/50 rounded-b-xl">
                  <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Why this matters:</strong> {item.explanation}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Educational Guidance:</strong> {item.guidance}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Community Service Metric: Educates citizens on their vital signs during screening</span>
        <span className="font-bold text-slate-700">{positiveCount} / 5 Questions Mastered</span>
      </div>
    </div>
  );
};
