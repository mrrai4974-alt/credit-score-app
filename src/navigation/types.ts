import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tabs — the five primary sections of the app. */
export type MainTabParamList = {
  Home: undefined;
  Report: undefined;
  Loans: undefined;
  Pay: undefined;
  More: undefined;
};

/** Root stack: onboarding, the tab shell, and pushed detail screens. */
export type RootStackParamList = {
  // Onboarding (shown when signed out)
  Welcome: undefined;
  Login: undefined;
  Otp: {
    mobile: string;
    fullName: string;
    pan?: string;
    /** Demo only: the OTP we "sent", so the screen can prefill it. */
    demoCode?: string;
  };

  // Signed-in shell
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // Detail / modal screens reachable from any tab
  Notifications: undefined;
  ImprovementPlan: undefined;
  Disputes: undefined;
  FileDispute: { subjectLabel?: string } | undefined;
  Consultation: undefined;
  Chat: undefined;
  SavingsCalculator: undefined;
};
