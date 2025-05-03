# @traque/react

React SDK for error tracking and monitoring. This package provides React-specific components and hooks for integrating with the Traque error tracking service.

## Installation

```bash
npm install @traque/react
# or
yarn add @traque/react
# or
pnpm install @traque/react
```

## Quick Start

Initialize the Traque client and wrap your app with the `TraqueProvider`:

```tsx
import { Traque } from '@traque/core';
import { TraqueProvider } from '@traque/react';

// Initialize the Traque client
const traque = new Traque({
  serviceUrl: 'https://your-service-url.com',
  apiKey: 'your-api-key',
  environment: 'PRODUCTION',
});

function App() {
  return (
    <TraqueProvider traque={traque}>
      <YourApp />
    </TraqueProvider>
  );
}
```

## Error Boundary

Use the `ErrorBoundary` component to catch and report React errors:

```tsx
import { ErrorBoundary } from '@traque/react';

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.log('Error caught:', error);
        console.log('Component stack:', errorInfo.componentStack);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Manual Error Reporting

Use the `useTraque` hook to manually report errors:

```tsx
import { useTraque } from '@traque/react';

function MyComponent() {
  const { captureException } = useTraque();

  const handleClick = async () => {
    try {
      // Your code that might throw
      await someAsyncOperation();
    } catch (error) {
      captureException({
        name: error.name,
        message: error.message,
        // Add any additional context
        httpContext: {
          url: window.location.href,
          method: 'GET',
        },
      });
    }
  };

  return <button onClick={handleClick}>Do Something</button>;
}
```

## API Reference

### TraqueProvider

The provider component that provides the Traque instance to your app.

```tsx
<TraqueProvider traque={Traque}>{children}</TraqueProvider>
```

### ErrorBoundary

A React error boundary component that catches and reports errors.

```tsx
<ErrorBoundary
  fallback?: ReactNode | ((error: Error) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
>
  {children}
</ErrorBoundary>
```

### useTraque

A hook that provides access to the Traque instance and error reporting functions.

```tsx
const { traque, captureException } = useTraque();
```

## TypeScript Support

This package is fully typed and provides TypeScript definitions for all components and functions.
