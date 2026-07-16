import Constants from 'expo-constants';
import type { BureauProvider } from '../services/bureau/types';

/**
 * Runtime configuration.
 *
 * Values come from `app.json` -> `expo.extra`, which in turn can be fed from
 * environment variables at build time (see `.env.example` and README).
 * This keeps secrets (API keys, base URLs) out of the component tree and out
 * of source control.
 */

type Extra = {
  bureauProvider?: string;
  bureauBaseUrl?: string;
  bureauApiKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function normaliseProvider(value: string | undefined): BureauProvider {
  switch ((value ?? '').toLowerCase()) {
    case 'cibil':
      return 'CIBIL';
    case 'experian':
      return 'Experian';
    case 'equifax':
      return 'Equifax';
    case 'crif':
      return 'CRIF';
    default:
      return 'Mock';
  }
}

export const env = {
  /** Which bureau the app talks to. Defaults to the built-in mock. */
  bureauProvider: normaliseProvider(extra.bureauProvider),
  /** Base URL of the bureau (or your backend proxy in front of it). */
  bureauBaseUrl: extra.bureauBaseUrl ?? '',
  /**
   * API key for the bureau. In production you should NOT ship a bureau key in
   * the app bundle — proxy the call through your own backend and leave this
   * empty. It exists here to make local prototyping against a sandbox easy.
   */
  bureauApiKey: extra.bureauApiKey ?? '',
} as const;

/** True when no real bureau is configured, so we fall back to mock data. */
export const usingMockData = env.bureauProvider === 'Mock';
