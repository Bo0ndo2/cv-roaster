import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { RoastProvider } from "@/context/roast-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Roaster — Honest CV Analysis",
  description:
    "Upload your CV and get a brutally honest, AI-powered analysis with ATS score, strengths, weaknesses, and actionable tips.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <RoastProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1a1a2e",
                  color: "#e2e8f0",
                  border: "1px solid #2d3748",
                  borderRadius: "10px",
                  fontSize: "14px",
                },
              }}
            />
          </RoastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
