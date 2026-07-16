import type {
  BureauClient,
  BureauProvider,
  BureauSubject,
  CreditReport,
} from './types';

/**
 * Integration point for a REAL credit bureau.
 *
 * This client talks to an HTTP endpoint that returns a credit report. In
 * production you should point `baseUrl` at YOUR OWN backend, which in turn
 * holds the bureau credentials and calls CIBIL / Experian / Equifax / CRIF
 * server-to-server. Never ship raw bureau API keys inside the mobile bundle.
 *
 * To go live:
 *   1. Stand up a backend endpoint, e.g. `POST /credit/report`, that accepts a
 *      KYC subject and returns the bureau's response.
 *   2. Map the bureau's raw payload onto our `CreditReport` shape inside
 *      `mapResponse` below (each bureau's JSON differs; this is the only place
 *      that needs to know about their format).
 *   3. Set BUREAU_PROVIDER / BUREAU_BASE_URL in your environment (see README).
 */
export class HttpBureauClient implements BureauClient {
  constructor(
    readonly provider: BureauProvider,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async fetchReport(subject: BureauSubject): Promise<CreditReport> {
    if (!this.baseUrl) {
      throw new Error(
        `[${this.provider}] No bureauBaseUrl configured. Set BUREAU_BASE_URL ` +
          `or switch BUREAU_PROVIDER back to "mock". See README.`,
      );
    }

    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/credit/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        'X-Bureau-Provider': this.provider,
      },
      body: JSON.stringify({
        fullName: subject.fullName,
        mobile: subject.mobile,
        pan: subject.pan,
        dateOfBirth: subject.dateOfBirth,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `[${this.provider}] Bureau request failed (${res.status}). ${text}`,
      );
    }

    const raw = (await res.json()) as unknown;
    return this.mapResponse(raw);
  }

  /**
   * Translate the bureau/backend payload into our domain model.
   *
   * The default implementation assumes your backend already returns data in
   * the app's `CreditReport` shape (recommended — do the bureau-specific
   * mapping server-side). If instead you return a bureau's raw JSON, replace
   * the body here with the field-by-field mapping for that provider.
   */
  private mapResponse(raw: unknown): CreditReport {
    return raw as CreditReport;
  }
}
