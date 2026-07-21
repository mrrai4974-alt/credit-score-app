import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BookingsScreen } from '../screens/bookings/BookingsScreen';
import { TrackingScreen } from '../screens/bookings/TrackingScreen';

export type BookingsStackParams = {
  BookingsList: undefined;
  Tracking: { bookingId: string };
};

const Stack = createNativeStackNavigator<BookingsStackParams>();

export const BookingsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BookingsList">
      {({ navigation }) => (
        <BookingsScreen
          onOpen={(bookingId) => navigation.navigate('Tracking', { bookingId })}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Tracking">
      {({ navigation, route }) => (
        <TrackingScreen
          bookingId={route.params.bookingId}
          onBack={() => navigation.goBack()}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);
