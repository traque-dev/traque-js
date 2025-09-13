import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { Traque } from '@traque/core';
import { useTraque } from './TraqueProvider';

type BaseProps = {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  traque: Traque;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundaryBase extends Component<BaseProps, State> {
  constructor(props: BaseProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { traque, onError } = this.props;

    traque.captureException(error);

    onError?.(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error && fallback) {
      if (typeof fallback === 'function') {
        return fallback(error);
      }
      return fallback;
    }

    return children;
  }
}

type ErrorBoundaryProps = Omit<BaseProps, 'traque'>;

export function ErrorBoundary(props: ErrorBoundaryProps) {
  const traque = useTraque();

  return <ErrorBoundaryBase {...props} traque={traque} />;
}
