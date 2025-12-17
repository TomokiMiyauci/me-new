"use client";
import { Component, type ReactNode } from "react";
import { isNotFoundErrorLike } from "./utils.ts";

export type ErrorBoundaryState = Uncatched | Catched;

export interface Uncatched {
  didCatch: false;
  error: null;
}

export interface Catched {
  didCatch: true;
  error: unknown;
}

export interface NotFoundBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default class NotFoundBoundary
  extends Component<NotFoundBoundaryProps, ErrorBoundaryState> {
  override state = { didCatch: false, error: null };

  static getDerivedStateFromError(error: unknown): Catched {
    return { didCatch: true, error };
  }

  override render(): ReactNode {
    if (this.state.didCatch) {
      const { error } = this.state;
      if (isNotFoundErrorLike(error)) {
        return this.props.fallback;
      }

      throw error;
    }

    return this.props.children;
  }
}
