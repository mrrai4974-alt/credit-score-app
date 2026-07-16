/**
 * Domain model for credit data.
 *
 * These types are deliberately bureau-agnostic: every concrete client
 * (mock, CIBIL, Experian, Equifax, CRIF) maps its raw payload onto these
 * shapes so the rest of the app never depends on a specific provider.
 */

export type ScoreBandLabel =
  | 'Poor'
  | 'Fair'
  | 'Good'
  | 'Very Good'
  | 'Excellent';

/** A single point in the user's score history. */
export interface ScorePoint {
  /** ISO date (YYYY-MM-DD) the score was pulled. */
  date: string;
  score: number;
}

export interface CreditScore {
  /** Current score, typically 300–900 for Indian bureaus. */
  value: number;
  /** Which bureau produced this score. */
  provider: BureauProvider;
  /** ISO timestamp the score was last refreshed. */
  lastUpdated: string;
  /** Change vs the previous pull (can be negative). */
  change: number;
  history: ScorePoint[];
}

/**
 * The weighted factors that move a score. `impact` is how heavily this
 * factor is weighted; `status` is how the user is currently doing on it.
 */
export interface ScoreFactor {
  id: string;
  name: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'excellent' | 'good' | 'fair' | 'poor';
  /** 0–100 normalised score for this factor, for the progress bar. */
  value: number;
  /** Human readable value, e.g. "28%" for utilisation. */
  displayValue: string;
}

export type AccountType =
  | 'Credit Card'
  | 'Personal Loan'
  | 'Home Loan'
  | 'Auto Loan'
  | 'Consumer Loan'
  | 'Education Loan';

export type AccountStatus = 'Active' | 'Closed' | 'Overdue';

export interface CreditAccount {
  id: string;
  lender: string;
  type: AccountType;
  status: AccountStatus;
  /** Sanctioned limit (cards) or original amount (loans), in rupees. */
  limit: number;
  /** Current outstanding balance, in rupees. */
  balance: number;
  /** ISO date the account was opened. */
  openedOn: string;
  /** On-time payment ratio 0–1 over the reported history. */
  onTimeRatio: number;
  /** Monthly EMI in rupees (loans only). */
  emiAmount?: number;
  /** ISO date the next EMI / card bill is due. */
  nextDueDate?: string;
  /** Whether an autopay mandate is active for this account. */
  autopay?: boolean;
  /**
   * FR-5: set when the account looks wrong to us (unknown lender, possible
   * duplicate, or an enquiry the user didn't make) so the UI can prompt a
   * dispute. `undefined` means the account looks legitimate.
   */
  suspected?: 'unrecognised' | 'duplicate' | 'possible-fraud';
}

export interface CreditEnquiry {
  id: string;
  lender: string;
  type: AccountType;
  /** ISO date of the hard enquiry. */
  date: string;
  purpose: string;
}

export interface Offer {
  id: string;
  title: string;
  provider: string;
  type: 'Credit Card' | 'Personal Loan' | 'Home Loan' | 'Balance Transfer';
  highlight: string;
  /** Minimum score the user needs to be eligible. */
  minScore: number;
  interestRate?: string;
  fee?: string;
}

/** The full report returned by a bureau pull. */
export interface CreditReport {
  score: CreditScore;
  factors: ScoreFactor[];
  accounts: CreditAccount[];
  enquiries: CreditEnquiry[];
  /** Aggregate credit utilisation across all revolving accounts, 0–1. */
  totalUtilisation: number;
  /** Personalised, ordered steps to improve the score (FR-7). */
  improvementPlan: ImprovementStep[];
}

// ---- Advisory & support (FR-7 to FR-10) -----------------------------------

/** One actionable step in the personalised improvement plan (FR-7). */
export interface ImprovementStep {
  id: string;
  title: string;
  detail: string;
  /** Estimated score uplift if the user completes this step. */
  estimatedGain: number;
  /** Rough effort/time horizon for the user. */
  effort: 'Quick win' | 'This month' | 'Long term';
  done: boolean;
}

export type DisputeStatus = 'Submitted' | 'Under Review' | 'Resolved' | 'Rejected';

/** A filed dispute against a report entry, with status tracking (FR-10). */
export interface Dispute {
  id: string;
  /** The account/enquiry the dispute is about. */
  subjectLabel: string;
  reason: string;
  status: DisputeStatus;
  /** ISO date filed. */
  filedOn: string;
  updatedOn: string;
}

// ---- Loan management (FR-12 to FR-16) --------------------------------------

/** A single upcoming EMI / bill reminder derived from the accounts (FR-12). */
export interface Reminder {
  id: string;
  accountId: string;
  lender: string;
  label: string;
  amount: number;
  dueDate: string;
  autopay: boolean;
  overdue: boolean;
}

// ---- Bill pay & rewards (FR-17 to FR-19) -----------------------------------

export type BillCategory =
  | 'Electricity'
  | 'Water'
  | 'Broadband'
  | 'Mobile Postpaid'
  | 'DTH'
  | 'Gas'
  | 'Credit Card';

/** A BBPS-style biller the user has saved. */
export interface Biller {
  id: string;
  category: BillCategory;
  name: string;
  /** Masked account/consumer number. */
  account: string;
  amountDue: number;
  dueDate: string;
}

/** A completed payment/recharge, used for history and rewards (FR-19). */
export interface RewardTransaction {
  id: string;
  label: string;
  category: BillCategory | 'Recharge';
  amount: number;
  cashback: number;
  date: string;
}

// ---- Notifications (FR-21 to FR-23) ----------------------------------------

export type NotificationKind = 'score' | 'payment' | 'offer' | 'enquiry' | 'dispute';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

// ---- Consent (6.1) ---------------------------------------------------------

/** Explicit, revocable consent for a bureau data pull. */
export interface ConsentRecord {
  granted: boolean;
  /** ISO timestamp consent was granted or withdrawn. */
  timestamp: string;
  bureau: BureauProvider;
}

export type BureauProvider = 'Mock' | 'CIBIL' | 'Experian' | 'Equifax' | 'CRIF';

/** The consumer identity a bureau pull is keyed on (KYC). */
export interface BureauSubject {
  fullName: string;
  mobile: string;
  /** Permanent Account Number — India's tax id, required for bureau pulls. */
  pan?: string;
  dateOfBirth?: string;
}

/**
 * The contract every bureau client implements. Adding a new bureau means
 * writing one class against this interface — no screen changes required.
 */
export interface BureauClient {
  readonly provider: BureauProvider;
  /** Pull the latest full credit report for a subject. */
  fetchReport(subject: BureauSubject): Promise<CreditReport>;
}
