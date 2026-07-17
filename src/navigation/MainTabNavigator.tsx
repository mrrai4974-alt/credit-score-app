import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoansScreen } from '../screens/LoansScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { PayScreen } from '../screens/PayScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { colors } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Home: { on: 'home', off: 'home-outline' },
  Report: { on: 'document-text', off: 'document-text-outline' },
  Loans: { on: 'wallet', off: 'wallet-outline' },
  Pay: { on: 'card', off: 'card-outline' },
  More: { on: 'grid', off: 'grid-outline' },
};

export function MainTabNavigator() {
  // Add the device's bottom inset so the tab bar sits above the system
  // navigation bar / gesture area instead of being hidden behind it.
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + bottomInset,
          paddingBottom: 6 + bottomInset,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name];
          return <Ionicons name={focused ? set.on : set.off} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Loans" component={LoansScreen} />
      <Tab.Screen name="Pay" component={PayScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
