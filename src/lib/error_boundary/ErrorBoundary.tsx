"use client";
import { Component, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  renderFallback: (props: FallbackProps) => ReactNode;
}

export interface FallbackProps {
  error: Error;
  reset: VoidFunction;
}

interface SuccessErrorBoundaryState {
  hasError: true;
  error: Error;
}

interface FailureErrorBoundaryState {
  hasError: false;
  error: null;
}

export type ErrorBoundaryStates =
  | SuccessErrorBoundaryState
  | FailureErrorBoundaryState;

export default class ErrorBoundary
  extends Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  resetErrorBoundary(): void {
    const { error } = this.state;

    if (error !== null) {
      this.setState({ error: null, hasError: false });
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryStates {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      const props = {
        error: this.state.error,
        reset: this.resetErrorBoundary.bind(this),
      } satisfies FallbackProps;

      return this.props.renderFallback(props);
    }

    return this.props.children;
  }
}
