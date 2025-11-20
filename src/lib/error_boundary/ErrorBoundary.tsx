"use client";
import { Component, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  component: (props: ErrorBoundaryStates) => ReactNode;
}

interface ErrorBoundaryStates {
  error?: unknown;
  hasError: boolean;
}

export default class ErrorBoundary
  extends Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryStates {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.component(this.state);
    }

    return this.props.children;
  }
}
