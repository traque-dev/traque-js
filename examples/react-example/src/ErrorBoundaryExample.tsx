import { ErrorBoundary } from '@traque/react';

export function ErrorBoundaryExample() {
  return (
    <ErrorBoundary fallback={<div>ErrorBoundaryExample Fallback 🎉</div>}>
      <ErrorComponent />
    </ErrorBoundary>
  );
}

function ErrorComponent() {
  throw new Error('ErrorComponent');

  return null;
}
