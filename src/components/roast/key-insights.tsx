import { RoastReport } from "@/types";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { ReactNode } from "react";

interface InsightGroupProps {
  title: string;
  items: string[];
  icon: ReactNode;
  colorClass: string;          // text color class
  bgClass: string;             // background color class
  borderClass: string;         // border color class
}

function InsightGroup({ title, items, icon, colorClass, bgClass, borderClass }: InsightGroupProps) {
  return (
    <div className={`rounded-xl p-5 border ${bgClass} ${borderClass}`}>
      <div className="flex items-center gap-2 mb-3.5">
        {icon}
        <h3 className={`text-[14px] font-semibold ${colorClass}`}>{title}</h3>
      </div>
      <ul className="insight-list">
        {items.map((item, i) => (
          <li key={i} className="tip-item">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function KeyInsights({ report }: { report: RoastReport }) {
  return (
    <div className="flex flex-col gap-4">
      <InsightGroup
        title="Top Strengths"
        items={report.topStrengths}
        icon={<CheckCircle2 size={16} color="var(--success)" />}
        colorClass="text-[var(--success)]"
        bgClass="bg-[var(--success-light)]"
        borderClass="border-green-200"
      />
      <InsightGroup
        title="Critical Fixes"
        items={report.criticalFixes}
        icon={<AlertCircle size={16} color="var(--danger)" />}
        colorClass="text-[var(--danger)]"
        bgClass="bg-[var(--danger-light)]"
        borderClass="border-red-200"
      />
      <InsightGroup
        title="Quick Wins"
        items={report.quickWins}
        icon={<Zap size={16} color="var(--warning)" />}
        colorClass="text-[var(--warning)]"
        bgClass="bg-[var(--warning-light)]"
        borderClass="border-yellow-200"
      />
    </div>
  );
}
