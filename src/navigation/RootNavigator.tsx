import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';

import { useApp } from '../context/AppContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { VerificationPendingScreen } from '../screens/auth/VerificationPendingScreen';
import { MainTabs } from './MainTabs';

export const RootNavigator: React.FC = () => {
  const { authenticated, mechanic } = useApp();
  const [showRegister, setShowRegister] = useState(false);

  let content: React.ReactNode;

  if (!authenticated) {
    content = showRegister ? (
      <RegisterScreen onBack={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onRegister={() => setShowRegister(true)} />
    );
  } else if (
    mechanic.verification === 'in_review' ||
    mechanic.verification === 'pending'
  ) {
    // Verified-mechanic gate (FR-17): no jobs until operations approves.
    content = <VerificationPendingScreen />;
  } else {
    content = <MainTabs />;
  }

  return <NavigationContainer>{content}</NavigationContainer>;
};
