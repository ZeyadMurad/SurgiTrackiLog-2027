import React, { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * ErrorBoundary — isolates render crashes so a single view's exception does not
 * blank the whole app. Place it around the view switch (and around any lazily
 * loaded subtree). On error it renders a recoverable fallback with a "retry"
 * button that resets component state (re-mounting the failed subtree).
 *
 * Note: error boundaries catch errors in render/lifecycle of children. They do
 * NOT catch errors in event handlers, async code, or setTimeout — those must be
 * handled with try/catch (see DataContext error handling).
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Called when an error is caught (e.g. for logging to Sentry). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console for now; wire to Sentry/observability when configured.
    console.error('[SurgiTrack ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }
      return <DefaultFallback error={error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

const DefaultFallback: React.FC<{ error: Error; onReset: () => void }> = ({ error, onReset }) => {
  return (
    <div
      role="alert"
      dir="ltr"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
    >
      <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
      <p className="max-w-md text-sm text-red-600">
        An unexpected error occurred while rendering this section. You can try again — your data
        is safe.
      </p>
      <pre className="max-w-md overflow-x-auto rounded bg-white/70 px-3 py-2 text-left text-xs text-red-500">
        {String(error?.message || error)}
      </pre>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorBoundary;
