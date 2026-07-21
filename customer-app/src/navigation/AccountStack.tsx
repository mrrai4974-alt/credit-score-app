import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AccountScreen } from '../screens/account/AccountScreen';
import { GarageScreen } from '../screens/account/GarageScreen';
import { ReferralScreen } from '../screens/account/ReferralScreen';
import { SupportScreen } from '../screens/account/SupportScreen';

export type AccountStackParams = {
  AccountHome: undefined;
  Garage: undefined;
  Referral: undefined;
  Support: undefined;
};

const Stack = createNativeStackNavigator<AccountStackParams>();

export const AccountStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountHome">
      {({ navigation }) => (
        <AccountScreen
          onNavigate={(route) => {
            if (route === 'garage') navigation.navigate('Garage');
            if (route === 'referral') navigation.navigate('Referral');
            if (route === 'support') navigation.navigate('Support');
          }}
          onOpenMembership={() =>
            navigation.getParent()?.navigate('Membership')
          }
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Garage">
      {({ navigation }) => <GarageScreen onBack={() => navigation.goBack()} />}
    </Stack.Screen>
    <Stack.Screen name="Referral">
      {({ navigation }) => <ReferralScreen onBack={() => navigation.goBack()} />}
    </Stack.Screen>
    <Stack.Screen name="Support">
      {({ navigation }) => <SupportScreen onBack={() => navigation.goBack()} />}
    </Stack.Screen>
  </Stack.Navigator>
);
