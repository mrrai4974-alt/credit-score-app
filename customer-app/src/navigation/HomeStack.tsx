import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { services } from '../data/catalog';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { BookingScreen } from '../screens/home/BookingScreen';
import { BookingConfirmedScreen } from '../screens/home/BookingConfirmedScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ServiceDetailScreen } from '../screens/home/ServiceDetailScreen';
import { ServiceListScreen } from '../screens/home/ServiceListScreen';

export type HomeStackParams = {
  Home: undefined;
  ServiceList: { category: ServiceCategory };
  ServiceDetail: { serviceId: string };
  Booking: { serviceId: string };
  BookingConfirmed: { bookingId: string };
};

const Stack = createNativeStackNavigator<HomeStackParams>();

const findService = (id: string) => services.find((s) => s.id === id)!;

export const HomeStack: React.FC = () => {
  const { bookings } = useApp();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            onOpenCategory={(category) =>
              navigation.navigate('ServiceList', { category })
            }
            onOpenService={(service) =>
              navigation.navigate('ServiceDetail', { serviceId: service.id })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ServiceList">
        {({ navigation, route }) => (
          <ServiceListScreen
            category={route.params.category}
            onBack={() => navigation.goBack()}
            onOpenService={(service) =>
              navigation.navigate('ServiceDetail', { serviceId: service.id })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ServiceDetail">
        {({ navigation, route }) => (
          <ServiceDetailScreen
            service={findService(route.params.serviceId)}
            onBack={() => navigation.goBack()}
            onBook={(service) =>
              navigation.navigate('Booking', { serviceId: service.id })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Booking">
        {({ navigation, route }) => (
          <BookingScreen
            service={findService(route.params.serviceId)}
            onBack={() => navigation.goBack()}
            onConfirmed={(booking) =>
              navigation.navigate('BookingConfirmed', { bookingId: booking.id })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BookingConfirmed">
        {({ navigation, route }) => {
          const booking = bookings.find((b) => b.id === route.params.bookingId)!;
          return (
            <BookingConfirmedScreen
              booking={booking}
              onTrack={() =>
                navigation.getParent()?.navigate('Bookings', {
                  screen: 'Tracking',
                  params: { bookingId: booking.id },
                })
              }
              onHome={() => navigation.popToTop()}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
