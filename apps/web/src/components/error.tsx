import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      {error.message}
      <button
        onClick={() => {
          // Invalidate the route to reload the loader, and reset any router error boundaries
          void router.invalidate();
        }}
      >
        Retry
      </button>
    </div>
  );
}
