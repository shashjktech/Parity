import type { Worker } from '../types/worker';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "12 Sep 2025" (manual, so Hermes/ICU never prints "Sept"). */
export function formatDay(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export const fullName = (w: Worker) => `${w.workerFirstName} ${w.workerLastName}`.trim();

export const initials = (w: Worker) =>
  `${w.workerFirstName.charAt(0)}${w.workerLastName.charAt(0)}`.toUpperCase() || '?';