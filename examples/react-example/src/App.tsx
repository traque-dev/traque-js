import { useTraque } from '@traque/react';
import { useState } from 'react';
import './App.css';

const apiCallThatThrowsError = async () => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('API call failed')), 1000),
  );
};

function App() {
  const { captureException } = useTraque();

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const throwAnError = async () => {
    try {
      setMessage(null);
      setLoading(true);
      await apiCallThatThrowsError();
    } catch (error: unknown) {
      captureException(error);
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Traque + React</h1>
      <div className="card">
        <button onClick={() => throwAnError()} disabled={loading}>
          {loading ? 'Loading...' : 'Throw an error'}
        </button>
        {message && <div className="error">{message}</div>}
      </div>
    </>
  );
}

export default App;
