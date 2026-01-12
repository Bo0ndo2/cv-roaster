"use client";
import { useRoast } from "@/context/roast-context";
import { UploadForm } from "@/components/roast/upload-form";
import { RoastResults } from "@/components/roast/roast-results";
import { AnalysisSkeleton } from "@/components/roast/analysis-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import { FileSearch, Zap, BarChart3, Target } from "lucide-react";

const FEATURES = [
  { icon: <BarChart3 size={14} />, label: "ATS compatibility score" },
  { icon: <Target size={14} />, label: "Section-by-section score" },
  { icon: <Zap size={14} />, label: "Quick wins & critical fixes" },
  { icon: <FileSearch size={14} />, label: "Job description match" },
];

export default function HomePage() {
  const { report, isLoading } = useRoast();

  return (
    <main className="relative z-[1] min-h-screen">
      <div className="flex min-h-screen flex-col">

        {/* Nav */}
        <nav className="sticky top-0 z-10 border-b border-[var(--border)] bg-[rgba(247,246,243,0.85)] backdrop-blur-md">
          <div className="app-inner flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--text-primary)]">
                <FileSearch size={15} color="white" />
              </div>
              <span className="font-display text-[17px] font-bold text-[var(--text-primary)]">
                CV Roaster
              </span>
            </div>
          </div>
        </nav>

        {/* Page body */}
        <div className="app-inner flex-1 py-10 pb-20">
          <ErrorBoundary>
            {isLoading ? (
              <AnalysisSkeleton />
            ) : report ? (
              <RoastResults />
            ) : (
              /* على شاشة صغيرة: column واحد + form في المنتصف
                 على شاشة كبيرة: column تنين جنب بعض */
              <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">

                {/* Left: copy */}
                <div className="pt-2">
                  <div className="pill-badge mb-5 border border-blue-200 bg-[var(--accent-light)] text-[var(--accent)]">
                    <Zap size={12} />
                    AI-powered · Free · No signup
                  </div>

                  <h1 className="font-display mb-5 text-[28px] leading-[1.1] text-[var(--text-primary)] sm:text-[36px] lg:text-[48px]">
                    Get your CV
                    <br />
                    <span className="text-[var(--accent)]">brutally honest</span>
                    <br />
                    feedback.
                  </h1>

                  <p className="mb-9 max-w-[480px] text-base leading-relaxed text-[var(--text-secondary)]">
                    Upload your CV, paste the job description, and get a detailed
                    report with ATS score, section-by-section analysis, and
                    actionable tips to land more interviews.
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {FEATURES.map((f) => (
                      <div key={f.label} className="feature-chip">
                        {f.icon}
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: form — على موبايل يبقى max-width محدود ومتمركز */}
                <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
                  <div className="card-lg p-6 pb-8">
                    <h2 className="mb-1 text-[18px] font-semibold text-[var(--text-primary)]">
                      Analyze your CV
                    </h2>
                    <p className="mb-7 text-[13px] text-[var(--text-muted)]">
                      Takes 15–30 seconds. No data is stored.
                    </p>
                    <UploadForm />
                  </div>
                </div>

              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <footer className="border-t border-[var(--border)]">
          <div className="app-inner py-5 text-center text-[12px] text-[var(--text-muted)]">
            CV Roaster — AI-powered analysis. No data stored. Built with Next.js & Gemini API.
          </div>
        </footer>

      </div>
    </main>
  );
}