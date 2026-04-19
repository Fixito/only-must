import { Temporal } from '@js-temporal/polyfill';

export function formatdate(date: string) {
  const plain = Temporal.PlainDate.from(date);
  return plain.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
