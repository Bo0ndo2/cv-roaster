"use client";

import { useState } from "react";
import { RoastSection } from "@/types";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { ChevronDown } from "lucide-react";

function scoreColor(score: number) {
  if (score >= 75) return "text-[var(--success)]";
  if (score >= 50) return "text-[var(--warning)]";
  return "text-[var(--danger)]";
}

function SectionCard({ section }: { section: RoastSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-[18px] flex items-center gap-3 bg-transparent border-0 cursor-pointer text-left font-sans"
      >
        {/* Score circle */}
        <div className={`w-[42px] h-[42px] rounded-full bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0 text-[13px] font-semibold ${scoreColor(section.score)}`}>
          {section.score}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-[var(--text-primary)]">
            {section.title}
          </div>
          <div className="text-[12px] text-[var(--text-muted)] mt-0.5 truncate">
            {section.feedback}
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <SeverityBadge severity={section.severity} />
          <ChevronDown
            size={16}
            color="var(--text-muted)"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-[var(--border)]">
          <p className="text-[14px] text-[var(--text-secondary)] leading-[1.65] mb-4">
            {section.feedback}
          </p>
          <h4 className="subsection-heading">Actionable Tips</h4>
          <ul className="insight-list">
            {section.tips.map((tip, i) => (
              <li key={i} className="tip-item">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SectionCards({ sections }: { sections: RoastSection[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {sections.map((section) => (
        <SectionCard key={section.title} section={section} />
      ))}
    </div>
  );
}
