export type SeverityLevel = "critical" | "warning" | "good";

export interface RoastSection {
  title: string;
  score: number; // 0–100
  feedback: string;
  tips: string[];
  severity: SeverityLevel;
}

export interface RoastReport {
  atsScore: number;
  overallScore: number;
  summary: string;
  sections: RoastSection[];
  topStrengths: string[];
  criticalFixes: string[];
  quickWins: string[];
}

export interface UploadFormValues {
  jobTitle: string;
  jobDescription: string;
}
