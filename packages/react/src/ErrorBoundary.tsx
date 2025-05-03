import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { Exception } from '@traque/core';
import { useTraque } from './TraqueProvider';

type Props = {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundaryBase extends Component<
  Props & { captureException: (exception: Exception) => void },
  State
> {
  constructor(
    props: Props & { captureException: (exception: Exception) => void },
  ) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { captureException, onError } = this.props;

    captureException({
      name: error.name,
      message: error.message,
    });

    onError?.(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback(error);
      }
      return fallback || <div>Something went wrong.</div>;
    }

    return children;
  }
}

export function ErrorBoundary(props: Props) {
  const { captureException } = useTraque();

  return <ErrorBoundaryBase {...props} captureException={captureException} />;
}
