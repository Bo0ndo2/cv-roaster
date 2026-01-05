"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RoastReport } from "@/types";

interface RoastContextType {
  report: RoastReport | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  setReport: (report: RoastReport, fileName: string) => void;
  clearReport: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const RoastContext = createContext<RoastContextType | undefined>(undefined);

export function RoastProvider({ children }: { children: ReactNode }) {
  const [report, setReportState] = useState<RoastReport | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const setReport = (report: RoastReport, fileName: string) => {
    setReportState(report);
    setFileName(fileName);
    setIsLoading(false);
    setErrorState(null);
  };

  const clearReport = () => {
    setReportState(null);
    setFileName(null);
    setIsLoading(false);
    setErrorState(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) setErrorState(null);
  };

  const setError = (error: string | null) => {
    setErrorState(error);
    setIsLoading(false);
  };

  return (
    <RoastContext.Provider
      value={{ report, fileName, isLoading, error, setReport, clearReport, setLoading, setError }}
    >
      {children}
    </RoastContext.Provider>
  );
}

export function useRoast() {
  const ctx = useContext(RoastContext);
  if (!ctx) throw new Error("useRoast must be used within RoastProvider");
  return ctx;
}
