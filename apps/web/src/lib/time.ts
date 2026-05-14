import { Temporal } from '@js-temporal/polyfill';

export function formatdate(date: string) {
  const plain = Temporal.PlainDate.from(date);
  return plain.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDuration(seconds: number | null) {
  if (seconds === null || seconds < 0) return null;

  const duration = Temporal.Duration.from({ seconds }).round({
    largestUnit: 'hours',
    smallestUnit: 'minutes',
    roundingIncrement: 30,
  });
  const hours = duration.hours;
  const minutes = duration.minutes;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
