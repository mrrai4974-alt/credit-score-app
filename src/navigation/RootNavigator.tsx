import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ChatScreen } from '../screens/ChatScreen';
import { ConsultationScreen } from '../screens/ConsultationScreen';
import { DisputesScreen } from '../screens/DisputesScreen';
import { FileDisputeScreen } from '../screens/FileDisputeScreen';
import { ImprovementPlanScreen } from '../screens/ImprovementPlanScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SavingsCalculatorScreen } from '../screens/SavingsCalculatorScreen';
import { colors, typography } from '../theme';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const detailHeader = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { ...typography.h3 },
  headerBackTitle: '',
} as const;

export function RootNavigator() {
  const { user, initialising } = useAuth();

  if (initialising) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={MainTabNavigator} />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ ...detailHeader, title: 'Notifications' }}
          />
          <Stack.Screen
            name="ImprovementPlan"
            component={ImprovementPlanScreen}
            options={{ ...detailHeader, title: 'Improve your score' }}
          />
          <Stack.Screen
            name="Disputes"
            component={DisputesScreen}
            options={{ ...detailHeader, title: 'My disputes' }}
          />
          <Stack.Screen
            name="FileDispute"
            component={FileDisputeScreen}
            options={{ ...detailHeader, title: 'Raise a dispute', presentation: 'modal' }}
          />
          <Stack.Screen
            name="Consultation"
            component={ConsultationScreen}
            options={{ ...detailHeader, title: 'Talk to an expert' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ ...detailHeader, title: 'Chat support' }}
          />
          <Stack.Screen
            name="SavingsCalculator"
            component={SavingsCalculatorScreen}
            options={{ ...detailHeader, title: 'Savings calculator' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
