import React from 'react';

/**
 * Real React error boundary: only a crash while *rendering* replaces the page.
 * Stray async errors (an aborted view transition, a blocked analytics script, a failed fetch)
 * are logged but never take the whole site down.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.onAsyncError = (event) => {
      console.error('Unhandled async error (page kept alive):', event.reason ?? event.error ?? event);
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Render error caught by boundary:', error, info?.componentStack);
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.onAsyncError);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.onAsyncError);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-ink">
        <div className="max-w-md border-t border-ink/15 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Error</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em]">
            Something broke <em className="font-serif font-normal italic text-brand">on my end.</em>
          </h1>
          <p className="mt-4 text-ink-muted">A refresh usually fixes it. If it doesn&apos;t, email mdazharuddin02@gmail.com.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 min-h-[48px] rounded-full bg-ink px-6 text-sm font-medium text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
