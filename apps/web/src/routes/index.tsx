import { GamesQuerySchema } from '@only-must/shared';
import { createFileRoute } from '@tanstack/react-router';

import Error from '@/components/error.tsx';
import { gamesQueryOptions } from '@/features/games/use-games.ts';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/')({
  validateSearch: (search) => GamesQuerySchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => queryClient.ensureQueryData(gamesQueryOptions(deps)),
  component: App,
  errorComponent: Error,
});

function App() {
  const data = Route.useLoaderData();

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
