/** Formatting helpers, centralised so currency/date style stays consistent. */

/** Indian-style rupee formatting, e.g. 1234567 -> "₹12,34,567". */
export function formatRupees(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  if (digits.length <= 3) return `${sign}₹${digits}`;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign}₹${withCommas},${last3}`;
}

/** Compact rupees for tight spaces, e.g. 4200000 -> "₹42L", 1500 -> "₹1.5K". */
export function formatRupeesShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(abs % 10000000 ? 1 : 0)}Cr`;
  if (abs >= 100000) return `₹${(value / 100000).toFixed(abs % 100000 ? 1 : 0)}L`;
  if (abs >= 1000) return `₹${(value / 1000).toFixed(abs % 1000 ? 1 : 0)}K`;
  return `₹${Math.round(value)}`;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "2026-07-16" -> "16 Jul 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-07-16" -> "16 Jul". */
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** Human relative due text, e.g. "Due in 3 days", "Overdue by 2 days". */
export function dueLabel(iso: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days > 1) return `Due in ${days} days`;
  if (days === -1) return 'Overdue by 1 day';
  return `Overdue by ${Math.abs(days)} days`;
}

/** Relative "time ago" for notifications, e.g. "2d ago". */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
