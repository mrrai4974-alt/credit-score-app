import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { EarningsScreen } from '../screens/earnings/EarningsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TrainingScreen } from '../screens/training/TrainingScreen';
import { colors, font } from '../theme/theme';
import { JobsStack } from './JobsStack';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Jobs: '🧰',
  Earnings: '₹',
  Training: '🎓',
  Profile: '👤',
};

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({
  name,
  focused,
}) => (
  <Text style={[styles.icon, { opacity: focused ? 1 : 0.4 }]}>
    {ICONS[name]}
  </Text>
);

export const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.label,
      tabBarStyle: styles.bar,
      tabBarIcon: ({ focused }) => (
        <TabIcon name={route.name} focused={focused} />
      ),
    })}
  >
    <Tab.Screen name="Jobs" component={JobsStack} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
    <Tab.Screen name="Training" component={TrainingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
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
