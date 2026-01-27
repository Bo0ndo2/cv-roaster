"use client";

import { useRoast } from "@/context/roast-context";
import { ScoresOverview } from "./scores-overview";
import { KeyInsights } from "./key-insights";
import { SectionCards } from "./section-cards";
import { ErrorBoundary } from "@/components/error-boundary";
import { RotateCcw, FileText } from "lucide-react";

export function RoastResults() {
  const { report, fileName, clearReport } = useRoast();
  if (!report) return null;

  return (
    <div className="animate-fade-in-up flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-[28px] text-[var(--text-primary)] leading-tight mb-1.5">
            Your CV Analysis
          </h2>
          {fileName && (
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[13px]">
              <FileText size={14} />
              {fileName}
            </div>
          )}
        </div>
        <button onClick={clearReport} className="btn-secondary flex-shrink-0">
          <RotateCcw size={14} />
          Start over
        </button>
      </div>

      {/* Summary card */}
      <div
        className="card p-6 border-l-4 border-l-[var(--accent)]"
        style={{ background: "linear-gradient(135deg, #eff6ff 0%, var(--surface) 60%)" }}
      >
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed italic">
          &ldquo;{report.summary}&rdquo;
        </p>
      </div>

      {/* Main grid — responsive */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScoresOverview report={report} />
          <KeyInsights report={report} />
        </div>
      </ErrorBoundary>

      {/* Section detail */}
      <ErrorBoundary>
        <div>
          <h3 className="section-title">Section-by-section Feedback</h3>
          <SectionCards sections={report.sections} />
        </div>
      </ErrorBoundary>
    </div>
  );
}
