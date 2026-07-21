import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { MembershipScreen } from '../screens/membership/MembershipScreen';
import { colors, font } from '../theme/theme';
import { AccountStack } from './AccountStack';
import { BookingsStack } from './BookingsStack';
import { HomeStack } from './HomeStack';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Home: '🏠',
  Bookings: '🗓️',
  Membership: '⭐',
  Account: '👤',
};

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => (
  <Text style={[styles.icon, { opacity: focused ? 1 : 0.4 }]}>{ICONS[name]}</Text>
);

export const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.label,
      tabBarStyle: styles.bar,
      tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Bookings" component={BookingsStack} />
    <Tab.Screen name="Membership" component={MembershipScreen} />
    <Tab.Screen name="Account" component={AccountStack} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  bar: {
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  label: { fontSize: font.tiny, fontWeight: '700' },
  icon: { fontSize: 20 },
});
