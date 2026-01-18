"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Reading your CV...", duration: 4000 },
  { label: "Analyzing job description match...", duration: 6000 },
  { label: "Scoring each section...", duration: 7000 },
  { label: "Generating actionable feedback...", duration: 8000 },
  { label: "Almost there — finalizing report...", duration: 5000 },
];

const TOTAL = STEPS.reduce((s, st) => s + st.duration, 0);

export function AnalysisSkeleton() {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 100), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < STEPS.length - 1; i++) {
      acc += STEPS[i].duration;
      if (elapsed < acc) { setStepIndex(i); return; }
    }
    setStepIndex(STEPS.length - 1);
  }, [elapsed]);

  const progress = Math.min((elapsed / TOTAL) * 100, 95);

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Progress header */}
      <div className="card-lg p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="skeleton-pulse w-8 h-8 rounded-full" />
          <div>
            <div className="skeleton-pulse w-40 h-4 rounded mb-1.5" />
            <div className="skeleton-pulse w-24 h-3 rounded" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="bg-[var(--surface-2)] rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-secondary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-dot inline-block" />
          {STEPS[stepIndex].label}
        </p>
      </div>

      {/* Score rings skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="card p-6">
            <div className="skeleton-pulse w-3/5 h-3.5 rounded mb-5" />
            <div className="flex items-center gap-4">
              <div className="skeleton-pulse w-[72px] h-[72px] rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="skeleton-pulse w-4/5 h-3 rounded mb-2" />
                <div className="skeleton-pulse w-3/5 h-3 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section cards skeleton */}
      <div>
        <div className="skeleton-pulse w-48 h-5 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5">
              <div className="flex justify-between mb-3.5">
                <div className="skeleton-pulse w-1/2 h-3.5 rounded" />
                <div className="skeleton-pulse w-10 h-5 rounded-full" />
              </div>
              <div className="skeleton-pulse w-full h-2.5 rounded mb-2" />
              <div className="skeleton-pulse w-11/12 h-2.5 rounded mb-2" />
              <div className="skeleton-pulse w-3/4 h-2.5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
