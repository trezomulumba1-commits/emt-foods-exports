import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';

type RuntimeErrorBoundaryProps = {
  children: ReactNode;
};

type RuntimeErrorBoundaryState = {
  error: Error | null;
  componentStack: string;
};

function RuntimeErrorPanel({ message }: { message: string }) {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        top: 12,
        zIndex: 20000,
        background: 'rgba(0, 0, 0, 0.88)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 13,
        whiteSpace: 'pre-wrap',
        maxHeight: '40vh',
        overflow: 'auto',
      }}
    >
      <strong>Runtime Error Detected</strong>
      <div style={{ marginTop: 8 }}>{message}</div>
    </div>
  );
}

/** Displays errors thrown while React is rendering the application. */
export class RuntimeErrorBoundary extends Component<RuntimeErrorBoundaryProps, RuntimeErrorBoundaryState> {
  state: RuntimeErrorBoundaryState = { error: null, componentStack: '' };

  static getDerivedStateFromError(error: Error): RuntimeErrorBoundaryState {
    return { error, componentStack: '' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, componentStack: info.componentStack });
  }

  render() {
    const { error, componentStack } = this.state;
    if (error) {
      return (
        <RuntimeErrorPanel
          message={`Error: ${error.message}${error.stack ? `\n\n${error.stack}` : ''}${componentStack ? `\n\nComponent stack:${componentStack}` : ''}`}
        />
      );
    }

    return this.props.children;
  }
}

export default function RuntimeErrorOverlay() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (ev: ErrorEvent) => {
      try {
        const details = ev.error instanceof Error && ev.error.stack ? `\n${ev.error.stack}` : '';
        setError((prev) => `${prev ? `${prev}\n\n` : ''}Error: ${ev.message} at ${ev.filename}:${ev.lineno}:${ev.colno}${details}`);
      } catch {}
    };
    const onUnhandled = (ev: PromiseRejectionEvent) => {
      try {
        const reason = ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason);
        setError((prev) => `${prev ? prev + '\n\n' : ''}UnhandledRejection: ${reason}`);
      } catch {}
    };

    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onUnhandled as any);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onUnhandled as any);
    };
  }, []);

  if (!error) return null;

  return <RuntimeErrorPanel message={error} />;
}
