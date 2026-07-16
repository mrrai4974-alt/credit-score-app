import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CreditProvider } from './src/context/CreditContext';
import { DisputeProvider } from './src/context/DisputeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

/**
 * App entry point. Providers are nested outside the navigator so every screen
 * can read auth state, the credit report and disputes. `CreditProvider` sits
 * inside `AuthProvider` because it fetches the report keyed on the signed-in
 * user.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CreditProvider>
          <DisputeProvider>
            <NavigationContainer
              theme={{
                dark: false,
                colors: {
                  primary: colors.primary,
                  background: colors.background,
                  card: colors.surface,
                  text: colors.textPrimary,
                  border: colors.border,
                  notification: colors.danger,
                },
                // React Navigation v7 requires a `fonts` entry in the theme.
                fonts: {
                  regular: { fontFamily: 'System', fontWeight: '400' },
                  medium: { fontFamily: 'System', fontWeight: '500' },
                  bold: { fontFamily: 'System', fontWeight: '700' },
                  heavy: { fontFamily: 'System', fontWeight: '800' },
                },
              }}
            >
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </DisputeProvider>
        </CreditProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
