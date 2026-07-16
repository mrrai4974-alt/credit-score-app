import type {
  BureauClient,
  BureauSubject,
  CreditAccount,
  CreditReport,
  ImprovementStep,
  ScoreFactor,
  ScorePoint,
} from './types';

/**
 * A fully working in-memory bureau. It produces realistic, *deterministic*
 * data derived from the subject's mobile number, so the same demo user always
 * sees the same score and history. This lets the whole app run with no
 * backend, and doubles as the fixture other clients are validated against.
 */
export class MockBureauClient implements BureauClient {
  readonly provider = 'Mock' as const;

  async fetchReport(subject: BureauSubject): Promise<CreditReport> {
    // Simulate network latency so loading states are exercised in the demo.
    await delay(700);

    const seed = seedFrom(subject.mobile || subject.fullName || 'demo');
    const rng = mulberry32(seed);

    const currentScore = 640 + Math.floor(rng() * 220); // 640–859
    const history = buildHistory(currentScore, rng);
    const change =
      history.length >= 2
        ? currentScore - history[history.length - 2].score
        : 0;

    const accounts = buildAccounts(rng);
    const totalUtilisation = computeUtilisation(accounts);
    const factors = buildFactors(rng, totalUtilisation, accounts);

    return {
      score: {
        value: currentScore,
        provider: 'Mock',
        lastUpdated: new Date().toISOString(),
        change,
        history,
      },
      factors,
      accounts,
      totalUtilisation,
      improvementPlan: buildImprovementPlan(totalUtilisation),
      enquiries: [
        {
          id: 'enq-1',
          lender: 'HDFC Bank',
          type: 'Credit Card',
          date: monthsAgo(2),
          purpose: 'New credit card application',
        },
        {
          id: 'enq-2',
          lender: 'Bajaj Finserv',
          type: 'Consumer Loan',
          date: monthsAgo(5),
          purpose: 'Consumer durable EMI',
        },
      ],
    };
  }
}

function buildHistory(current: number, rng: () => number): ScorePoint[] {
  const points: ScorePoint[] = [];
  let value = current - 40 - Math.floor(rng() * 30);
  for (let i = 11; i >= 0; i--) {
    // Trend gently upward toward `current` with small monthly noise.
    const drift = (current - value) / (i + 1);
    value = Math.round(value + drift + (rng() - 0.5) * 14);
    value = Math.max(300, Math.min(900, value));
    points.push({ date: monthsAgo(i), score: value });
  }
  points[points.length - 1] = { date: monthsAgo(0), score: current };
  return points;
}

function buildAccounts(rng: () => number): CreditAccount[] {
  return [
    {
      id: 'acc-1',
      lender: 'HDFC Bank',
      type: 'Credit Card',
      status: 'Active',
      limit: 250000,
      balance: 40000 + Math.floor(rng() * 45000),
      openedOn: yearsAgo(4),
      onTimeRatio: 0.98,
      nextDueDate: daysFromNow(6),
      autopay: true,
    },
    {
      id: 'acc-2',
      lender: 'ICICI Bank',
      type: 'Credit Card',
      status: 'Active',
      limit: 150000,
      balance: 15000 + Math.floor(rng() * 25000),
      openedOn: yearsAgo(2),
      onTimeRatio: 1,
      nextDueDate: daysFromNow(14),
      autopay: false,
    },
    {
      id: 'acc-3',
      lender: 'SBI',
      type: 'Home Loan',
      status: 'Active',
      limit: 4200000,
      balance: 3350000,
      openedOn: yearsAgo(3),
      onTimeRatio: 1,
      emiAmount: 34200,
      nextDueDate: daysFromNow(3),
      autopay: true,
    },
    {
      id: 'acc-4',
      lender: 'Bajaj Finserv',
      type: 'Personal Loan',
      status: 'Overdue',
      limit: 300000,
      balance: 78000,
      openedOn: yearsAgo(1),
      onTimeRatio: 0.82,
      emiAmount: 9800,
      nextDueDate: daysFromNow(-4),
      autopay: false,
    },
    {
      // FR-5: an account the user is unlikely to recognise — surfaced for dispute.
      id: 'acc-5',
      lender: 'QuickCash Fintech',
      type: 'Personal Loan',
      status: 'Active',
      limit: 50000,
      balance: 50000,
      openedOn: monthsAgo(2),
      onTimeRatio: 1,
      emiAmount: 4500,
      nextDueDate: daysFromNow(9),
      autopay: false,
      suspected: 'possible-fraud',
    },
  ];
}

function buildImprovementPlan(utilisation: number): ImprovementStep[] {
  const utilPct = Math.round(utilisation * 100);
  return [
    {
      id: 'plan-1',
      title: 'Report the unrecognised QuickCash loan',
      detail:
        'We found a ₹50,000 personal loan you may not have taken. Raise a dispute — removing a fraudulent account can lift your score fast.',
      estimatedGain: 35,
      effort: 'Quick win',
      done: false,
    },
    {
      id: 'plan-2',
      title: 'Clear the overdue Bajaj Finserv EMI',
      detail:
        'One EMI is 4 days overdue. Pay it now to stop further damage to your payment history — the biggest driver of your score.',
      estimatedGain: 25,
      effort: 'Quick win',
      done: false,
    },
    {
      id: 'plan-3',
      title: `Bring credit utilisation below 30% (now ${utilPct}%)`,
      detail:
        'Pay down your card balances or ask for a limit increase. Lower utilisation is one of the fastest levers on your score.',
      estimatedGain: 20,
      effort: 'This month',
      done: false,
    },
    {
      id: 'plan-4',
      title: 'Set up autopay on all EMIs',
      detail:
        'Enable autopay so you never miss a due date. Consistent on-time payments compound over time.',
      estimatedGain: 15,
      effort: 'This month',
      done: false,
    },
    {
      id: 'plan-5',
      title: 'Keep your oldest card active',
      detail:
        'Avoid closing your 4-year-old HDFC card. A longer average credit age steadily helps your score.',
      estimatedGain: 10,
      effort: 'Long term',
      done: false,
    },
  ];
}

function computeUtilisation(accounts: CreditAccount[]): number {
  const revolving = accounts.filter((a) => a.type === 'Credit Card');
  const limit = revolving.reduce((s, a) => s + a.limit, 0);
  const balance = revolving.reduce((s, a) => s + a.balance, 0);
  return limit === 0 ? 0 : balance / limit;
}

function buildFactors(
  rng: () => number,
  utilisation: number,
  accounts: CreditAccount[],
): ScoreFactor[] {
  const utilPct = Math.round(utilisation * 100);
  const utilStatus =
    utilPct < 30 ? 'excellent' : utilPct < 50 ? 'good' : utilPct < 75 ? 'fair' : 'poor';

  const oldest = accounts.reduce(
    (min, a) => Math.min(min, new Date(a.openedOn).getTime()),
    Date.now(),
  );
  const ageYears = (Date.now() - oldest) / (1000 * 60 * 60 * 24 * 365);

  return [
    {
      id: 'payment-history',
      name: 'Payment History',
      description: 'Whether you pay your bills and EMIs on time. The single biggest factor.',
      impact: 'High',
      status: 'excellent',
      value: 96,
      displayValue: '98% on-time',
    },
    {
      id: 'credit-utilisation',
      name: 'Credit Utilisation',
      description: 'How much of your available credit limit you are using. Keep it under 30%.',
      impact: 'High',
      status: utilStatus,
      value: Math.max(0, 100 - utilPct),
      displayValue: `${utilPct}% used`,
    },
    {
      id: 'credit-age',
      name: 'Age of Credit',
      description: 'The average age of your accounts. Older accounts help your score.',
      impact: 'Medium',
      status: ageYears > 3 ? 'good' : 'fair',
      value: Math.min(100, Math.round((ageYears / 7) * 100)),
      displayValue: `${ageYears.toFixed(1)} yrs`,
    },
    {
      id: 'credit-mix',
      name: 'Credit Mix',
      description: 'A healthy mix of secured (loans) and unsecured (cards) credit.',
      impact: 'Low',
      status: 'good',
      value: 78,
      displayValue: 'Cards + Loans',
    },
    {
      id: 'enquiries',
      name: 'Recent Enquiries',
      description: 'Hard enquiries from applying for new credit. Too many can hurt.',
      impact: 'Low',
      status: 'good',
      value: 82,
      displayValue: '2 in 12 mo',
    },
  ];
}

// ---- deterministic helpers -------------------------------------------------

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function seedFrom(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small, fast, seedable PRNG so demo data is stable per user. */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
