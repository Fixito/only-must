export function getPaginationItems(
  page: number,
  totalPages: number,
  delta: number = 1,
): Array<number | 'ellipsis'> {
  const range: Array<number> = [];

  for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
    range.push(i);
  }

  const items: Array<number | 'ellipsis'> = [1];

  if (range[0] !== undefined && range[0] > 2) items.push('ellipsis');

  items.push(...range);

  if (
    range.length > 0 &&
    typeof range[range.length - 1] === 'number' &&
    range[range.length - 1]! < totalPages - 1
  ) {
    items.push('ellipsis');
  }

  if (totalPages > 1) items.push(totalPages);

  return items;
}
