import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    /* Part 2 forwards this to the error reporter. Never console.* in prod. */
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="empty-wrap">
        <div className="empty-emoji">🍽</div>
        <p className="empty-title">Something went wrong</p>
        <p className="empty-sub">Reload the page and we&apos;ll pick up where you left off.</p>
        <button
          onClick={() => window.location.reload()}
          className="pill btn-primary press mt-5 justify-center"
        >
          Reload
        </button>
      </div>
    );
  }
}
