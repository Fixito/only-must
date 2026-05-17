import { Button } from '@/components/ui/button.tsx';
import { useGamesNavigate } from '@/features/games/hooks/use-games-search.ts';

export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const navigate = useGamesNavigate();

  return (
    <div className="my-6">
      <p className="text-muted-foreground text-lg">
        {hasFilters ? 'No games match your filters.' : 'No games found'}
      </p>

      {hasFilters && (
        <Button
          variant="link"
          className="px-0 text-sm"
          onClick={() =>
            navigate({
              search: {},
            })
          }
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
