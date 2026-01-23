"use client";

import { RoastReport } from "@/types";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";

interface ScoresOverviewProps { report: RoastReport; }

export function ScoresOverview({ report }: ScoresOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top score rings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6 flex justify-center">
          <ScoreRing score={report.overallScore} size={120} label="Overall Score" sublabel="General quality" />
        </div>
        <div className="card p-6 flex justify-center">
          <ScoreRing score={report.atsScore} size={120} label="ATS Score" sublabel="Applicant tracking" />
        </div>
      </div>

      {/* Section breakdown */}
      <div className="card p-6">
        <h3 className="subsection-heading">Section Breakdown</h3>
        <div className="flex flex-col gap-3.5">
          {report.sections.map((section, i) => (
            <ScoreBar key={section.title} score={section.score} label={section.title} delay={i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
}
