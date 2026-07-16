// Dynamic Expo config. This extends the static app.json and injects the credit
// bureau configuration from environment variables at build/start time, so the
// app can point at a real bureau (or your backend proxy) without code changes.
//
// Usage (see .env.example):
//   BUREAU_PROVIDER=experian BUREAU_BASE_URL=https://api.yourbackend.com npx expo start
//
// Leave BUREAU_PROVIDER unset (or "mock") to use the built-in demo data.

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    bureauProvider: process.env.BUREAU_PROVIDER ?? config.extra?.bureauProvider ?? 'mock',
    bureauBaseUrl: process.env.BUREAU_BASE_URL ?? config.extra?.bureauBaseUrl ?? '',
    // NOTE: prefer proxying bureau calls through your own backend so the API
    // key never ships in the app bundle. This is here only for local sandboxes.
    bureauApiKey: process.env.BUREAU_API_KEY ?? config.extra?.bureauApiKey ?? '',
  },
});
