import type {
  AppNotification,
  Biller,
  CreditAccount,
  Reminder,
  RewardTransaction,
} from './bureau/types';

/**
 * App-level (non-bureau) data: BBPS billers, reward history and
 * notifications. These would come from your payments aggregator and
 * notification service; here they are static fixtures so the modules are
 * fully navigable in the demo.
 */

export const BILLERS: Biller[] = [
  {
    id: 'bill-1',
    category: 'Electricity',
    name: 'Tata Power',
    account: 'xxxx 4821',
    amountDue: 2140,
    dueDate: daysFromNow(5),
  },
  {
    id: 'bill-2',
    category: 'Broadband',
    name: 'ACT Fibernet',
    account: 'xxxx 9032',
    amountDue: 1180,
    dueDate: daysFromNow(2),
  },
  {
    id: 'bill-3',
    category: 'Mobile Postpaid',
    name: 'Airtel',
    account: 'xxxx 7788',
    amountDue: 799,
    dueDate: daysFromNow(9),
  },
  {
    id: 'bill-4',
    category: 'Water',
    name: 'City Water Board',
    account: 'xxxx 1123',
    amountDue: 430,
    dueDate: daysFromNow(12),
  },
];

export const RECENT_TRANSACTIONS: RewardTransaction[] = [
  {
    id: 'txn-1',
    label: 'Airtel Postpaid',
    category: 'Mobile Postpaid',
    amount: 799,
    cashback: 24,
    date: daysAgo(8),
  },
  {
    id: 'txn-2',
    label: 'Jio Recharge',
    category: 'Recharge',
    amount: 299,
    cashback: 15,
    date: daysAgo(21),
  },
  {
    id: 'txn-3',
    label: 'Tata Power',
    category: 'Electricity',
    amount: 2050,
    cashback: 30,
    date: daysAgo(34),
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf-1',
    kind: 'enquiry',
    title: 'New enquiry detected',
    body: 'A ₹50,000 loan enquiry from QuickCash Fintech appeared. If this wasn’t you, raise a dispute.',
    date: daysAgo(1),
    read: false,
  },
  {
    id: 'ntf-2',
    kind: 'payment',
    title: 'EMI overdue',
    body: 'Your Bajaj Finserv EMI of ₹9,800 is overdue. Pay now to protect your score.',
    date: daysAgo(1),
    read: false,
  },
  {
    id: 'ntf-3',
    kind: 'score',
    title: 'Your score went up',
    body: 'Your credit score increased this month. Keep up the on-time payments!',
    date: daysAgo(3),
    read: true,
  },
  {
    id: 'ntf-4',
    kind: 'offer',
    title: 'You’re pre-approved',
    body: 'A pre-approved personal loan up to ₹15L is available for your profile.',
    date: daysAgo(6),
    read: true,
  },
];

/**
 * FR-12: turn the accounts with upcoming/overdue dues into a flat,
 * date-sorted reminder list for the loans dashboard.
 */
export function deriveReminders(accounts: CreditAccount[]): Reminder[] {
  const today = startOfDay(new Date());
  return accounts
    .filter((a) => a.nextDueDate && a.status !== 'Closed')
    .map((a) => {
      const due = startOfDay(new Date(a.nextDueDate as string));
      const amount =
        a.type === 'Credit Card' ? minCardPayment(a.balance) : a.emiAmount ?? 0;
      return {
        id: `rem-${a.id}`,
        accountId: a.id,
        lender: a.lender,
        label: a.type === 'Credit Card' ? 'Card bill' : 'EMI',
        amount,
        dueDate: a.nextDueDate as string,
        autopay: a.autopay ?? false,
        overdue: due.getTime() < today.getTime(),
      };
    })
    .sort((x, y) => new Date(x.dueDate).getTime() - new Date(y.dueDate).getTime());
}

/** Credit cards report a 5% minimum due; good enough for a reminder amount. */
function minCardPayment(balance: number): number {
  return Math.max(500, Math.round((balance * 0.05) / 10) * 10);
}

// ---- date helpers ----------------------------------------------------------

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  return daysFromNow(-n);
}
