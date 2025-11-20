"use client";
import { Component, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

export interface ErrorBoundaryStates {
  hasError: boolean;
}

export default class ErrorBoundary
  extends Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryStates {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
