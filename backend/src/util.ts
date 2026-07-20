import { customAlphabet } from 'nanoid';

export const GST_RATE = 0.18;
export const withGst = (base: number) => Math.round(base * (1 + GST_RATE));
export const gstAmount = (base: number) => Math.round(base * GST_RATE);

const idAlphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nid = customAlphabet(idAlphabet, 10);
export const genId = (prefix: string) => `${prefix}-${nid()}`;

const codeNums = customAlphabet('0123456789', 5);
export const genBookingCode = () => `DBS-${codeNums()}`;

export const nowIso = () => new Date().toISOString();

/** Human-friendly "time ago" for audit/log display. */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
