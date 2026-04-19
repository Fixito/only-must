import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Error from '@/components/error.tsx';
import { gamesQueryOptions } from '@/features/games/use-games.ts';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/')({
  loader: () => queryClient.ensureQueryData(gamesQueryOptions()),
  component: App,
  errorComponent: Error,
});

function App() {
  const { data } = useSuspenseQuery(gamesQueryOptions());

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((game) => (
        <div key={game.id}>
          <img src={game.image || undefined} alt={game.title || 'Game image'} />
          <h3>{game.title}</h3>
          <p>{game.metaScore}</p>
        </div>
      ))}
    </div>
  );
}
