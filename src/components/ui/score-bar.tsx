"use client";

interface ScoreBarProps {
  score: number;
  label: string;
  delay?: number;
}

function scoreColorClass(score: number) {
  if (score >= 75) return "text-[#16a34a]";
  if (score >= 50) return "text-[#d97706]";
  return "text-[#dc2626]";
}

function scoreHex(score: number) {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function ScoreBar({ score, label, delay = 0 }: ScoreBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
        <span className={`text-[13px] font-semibold ${scoreColorClass(score)}`}>{score}/100</span>
      </div>
      <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
        <div
          className="progress-animate h-full rounded-full"
          style={{
            background: scoreHex(score),
            "--target-width": `${score}%`,
            animationDelay: `${delay}ms`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
