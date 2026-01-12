"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--danger-light)] flex items-center justify-center mb-5">
            <AlertTriangle size={26} color="var(--danger)" />
          </div>
          <h2 className="font-display text-[22px] text-[var(--text-primary)] mb-2.5">
            Something went wrong
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] max-w-[360px] leading-relaxed mb-7">
            An unexpected error occurred. Try refreshing the page or starting over.
          </p>
          {this.state.error && (
            <pre className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-4 py-3 max-w-[480px] overflow-auto mb-6 text-left">
              {this.state.error.message}
            </pre>
          )}
          <button onClick={this.handleReset} className="btn-primary">
            <RotateCcw size={15} />
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
