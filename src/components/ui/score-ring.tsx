"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

function scoreHex(score: number) {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function ScoreRing({ score, size = 120, label, sublabel }: ScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreHex(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 60 60)"
            className="score-ring-animate"
            style={{ "--target-offset": offset } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-semibold leading-none" style={{ fontSize: size < 100 ? 20 : 26, color }}>
            {score}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] mt-0.5">/100</span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <div className="score-label-sm">{label}</div>
          {sublabel && <div className="score-sublabel">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
