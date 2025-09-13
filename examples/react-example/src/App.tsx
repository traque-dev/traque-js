import { useTraque } from '@traque/react';
import './App.css';
import { useMutation } from '@tanstack/react-query';
import { ErrorBoundaryExample } from './ErrorBoundaryExample';
import { ApiError } from './ApiError';

export function App() {
  const traque = useTraque();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new ApiError('API call failed');
    },
    onError: (error) => {
      traque.captureException(error);
    },
  });

  return (
    <>
      <h1>
        <a target="_blank" href="https://traque.dev/">
          Traque
        </a>{' '}
        +{' '}
        <a target="_blank" href="https://react.dev/">
          React
        </a>
      </h1>
      <div className="card">
        <button onClick={() => traque.captureEvent('click', { name: 'anon' })}>
          Track event
        </button>
        <button onClick={() => mutate()} disabled={isPending}>
          {isPending ? 'Loading...' : 'Throw an error'}
        </button>
        {error && <div className="error">{error.message}</div>}
      </div>

      <ErrorBoundaryExample />
    </>
  );
}
