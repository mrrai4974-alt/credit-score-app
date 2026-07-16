# GoodCredit — project guide

React Native (Expo SDK 57) + TypeScript credit-score app. See `README.md` for
the full feature list, architecture, and bureau-integration guide.

## Conventions
- **Design tokens** live in `src/theme/` — never hardcode colours/spacing; import
  `colors`, `spacing`, `radius`, `typography`.
- **Screens** wrap content in `src/components/Screen.tsx`. Tab screens use the
  default top inset; screens shown under a stack header pass `topInset={false}`.
- **Data access** goes through contexts (`useAuth`, `useCredit`, `useDisputes`)
  and the bureau factory `getBureauClient()` — screens never import a concrete
  bureau client.
- **Bureau model** is defined in `src/services/bureau/types.ts`. Every provider
  maps its payload onto these types.

## Working notes
- Expo is version-sensitive. Check the versioned docs at
  https://docs.expo.dev/versions/v57.0.0/ before changing native config.
- Type-check with `npx tsc --noEmit`. Validate a build with
  `npx expo export --platform ios` (bundles without native tooling).
