import type { ErrorComponentProps } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button.tsx';

export default function Error({ error }: ErrorComponentProps) {
  const router = useRouter();

  let message = 'Something went wrong';

  if (isAxiosError(error)) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      <p className="text-muted-foreground mt-2 text-sm">{message}</p>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => router.invalidate()}>Retry</Button>

        <Button variant="outline" onClick={() => router.navigate({ to: '/' })}>
          Back to games
        </Button>
      </div>
    </div>
  );
}
