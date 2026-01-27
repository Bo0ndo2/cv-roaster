import { SeverityLevel } from "@/types";

interface BadgeConfig {
  label: string;
  classes: string;
  dotClass: string;
}

const config: Record<SeverityLevel, BadgeConfig> = {
  good:     { label: "Good",       classes: "bg-[var(--success-light)] text-[var(--success)]", dotClass: "bg-[#16a34a]" },
  warning:  { label: "Needs Work", classes: "bg-[var(--warning-light)] text-[var(--warning)]", dotClass: "bg-[#d97706]" },
  critical: { label: "Critical",   classes: "bg-[var(--danger-light)]  text-[var(--danger)]",  dotClass: "bg-[#dc2626]" },
};

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const c = config[severity];
  return (
    <span className={`pill-badge ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dotClass}`} />
      {c.label}
    </span>
  );
}
