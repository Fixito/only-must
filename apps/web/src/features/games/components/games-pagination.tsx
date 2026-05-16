import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useIsGamesFetching } from '@/features/games/hooks/use-is-games-fetching.ts';
import { getPaginationItems } from '@/lib/pagination';

interface Props {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function GamesPagination({ page, totalPages, hasNext, hasPrev }: Props) {
  const isFetching = useIsGamesFetching();

  if (totalPages <= 1) return null;

  return (
    <div className="mbs-8">
      <Pagination>
        <PaginationContent>
          {hasPrev && (
            <PaginationItem>
              <PaginationPrevious
                to="."
                search={(prev) => ({ ...prev, page: (prev.page ?? 1) - 1 })}
                preload="intent"
                disabled={isFetching}
              />
            </PaginationItem>
          )}

          {getPaginationItems(page, totalPages).map((item, i) =>
            item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  to="."
                  search={(prev) => ({ ...prev, page: item })}
                  isActive={page === item}
                  preload="intent"
                  disabled={isFetching}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {hasNext && (
            <PaginationItem>
              <PaginationNext
                to="."
                search={(prev) => ({ ...prev, page: (prev.page ?? 1) + 1 })}
                preload="intent"
                disabled={isFetching}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
