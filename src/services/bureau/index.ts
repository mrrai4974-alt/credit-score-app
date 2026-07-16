import { env, usingMockData } from '../../config/env';
import { HttpBureauClient } from './HttpBureauClient';
import { MockBureauClient } from './MockBureauClient';
import type { BureauClient, Offer } from './types';

export * from './types';

/**
 * Factory that returns the configured bureau client. The rest of the app only
 * ever imports `getBureauClient()` — it never names a concrete provider, so
 * switching from mock to a live bureau is purely a config change.
 */
let cached: BureauClient | null = null;

export function getBureauClient(): BureauClient {
  if (cached) return cached;
  cached = usingMockData
    ? new MockBureauClient()
    : new HttpBureauClient(env.bureauProvider, env.bureauBaseUrl, env.bureauApiKey);
  return cached;
}

/** Marketplace offers. Static for the demo; would come from a partner API. */
export const OFFERS: Offer[] = [
  {
    id: 'offer-1',
    title: 'Millennia Credit Card',
    provider: 'HDFC Bank',
    type: 'Credit Card',
    highlight: '5% cashback on online spends',
    minScore: 750,
    fee: '₹1,000/yr (waived on ₹1L spend)',
  },
  {
    id: 'offer-2',
    title: 'Pre-approved Personal Loan',
    provider: 'ICICI Bank',
    type: 'Personal Loan',
    highlight: 'Up to ₹15L, instant disbursal',
    minScore: 720,
    interestRate: '10.5% p.a. onwards',
  },
  {
    id: 'offer-3',
    title: 'Home Loan Balance Transfer',
    provider: 'SBI',
    type: 'Balance Transfer',
    highlight: 'Save on EMIs with lower rates',
    minScore: 700,
    interestRate: '8.4% p.a. onwards',
  },
  {
    id: 'offer-4',
    title: 'SimplyCLICK Credit Card',
    provider: 'SBI Card',
    type: 'Credit Card',
    highlight: '10X rewards on online shopping',
    minScore: 650,
    fee: '₹499/yr',
  },
];
