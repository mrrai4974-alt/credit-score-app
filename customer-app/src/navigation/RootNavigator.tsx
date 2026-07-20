import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { useApp } from '../context/AppContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { MainTabs } from './MainTabs';

export const RootNavigator: React.FC = () => {
  const { authenticated, guest, enterGuest } = useApp();

  // Guest browsing is allowed (FR-01); booking actions prompt login via Account.
  const showApp = authenticated || guest;

  return (
    <NavigationContainer>
      {showApp ? <MainTabs /> : <LoginScreen onGuest={enterGuest} />}
    </NavigationContainer>
  );
};
