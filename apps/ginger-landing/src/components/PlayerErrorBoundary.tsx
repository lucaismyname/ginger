import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = { hasError: boolean };

export class PlayerErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ginger-landing] player error boundary", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p className="rounded-lg border border-zinc-300 bg-zinc-100/80 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300">
            The audio example could not be loaded. Refresh the page or try another browser.
          </p>
        )
      );
    }
    return this.props.children;
  }
}
