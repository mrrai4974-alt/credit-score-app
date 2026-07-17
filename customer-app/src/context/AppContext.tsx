import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  membershipPlans,
  promoCodes,
  seedBookings,
  seedVehicles,
} from '../data/catalog';
import {
  Booking,
  ExtraItem,
  Service,
  Vehicle,
} from '../types';

interface BookingDraft {
  service: Service;
  vehicle: Vehicle;
  slot: string;
  address: string;
  paymentMethod: 'online' | 'cod';
  promoCode?: string;
  discount: number;
}

interface AppState {
  authenticated: boolean;
  name: string;
  city: string;
  vehicles: Vehicle[];
  bookings: Booking[];
  membershipId: string | null;

  login: (name?: string) => void;
  logout: () => void;
  setCity: (city: string) => void;

  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;

  applyPromo: (code: string) => number | null;
  createBooking: (draft: BookingDraft) => Booking;
  advanceBooking: (id: string) => void;
  proposePendingExtra: (id: string, item: Omit<ExtraItem, 'id'>) => void;
  decideExtra: (bookingId: string, extraId: string, approve: boolean) => void;
  payBooking: (id: string) => void;
  rateBooking: (id: string, rating: number) => void;
  subscribe: (planId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

let idc = 100;
const nextId = (p: string) => `${p}-${++idc}`;

const STATUS_FLOW: Booking['status'][] = [
  'booked',
  'assigned',
  'en_route',
  'in_service',
  'completed',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState('Rider');
  const [city, setCity] = useState('Bengaluru');
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [membershipId, setMembershipId] = useState<string | null>(null);

  const login = useCallback((n?: string) => {
    if (n && n.trim()) setName(n.trim());
    setAuthenticated(true);
  }, []);
  const logout = useCallback(() => setAuthenticated(false), []);

  const addVehicle = useCallback((v: Omit<Vehicle, 'id'>) => {
    setVehicles((prev) => [...prev, { ...v, id: nextId('v') }]);
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const applyPromo = useCallback((code: string): number | null => {
    const key = code.trim().toUpperCase();
    return key in promoCodes ? promoCodes[key] : null;
  }, []);

  const patch = useCallback(
    (id: string, updater: (b: Booking) => Booking) =>
      setBookings((prev) => prev.map((b) => (b.id === id ? updater(b) : b))),
    [],
  );

  const createBooking = useCallback(
    (draft: BookingDraft): Booking => {
      const plan = membershipPlans.find((p) => p.id === membershipId);
      const booking: Booking = {
        id: nextId('b'),
        code: `DBS-${47200 + idc}`,
        service: draft.service,
        vehicle: draft.vehicle,
        slot: draft.slot,
        address: draft.address,
        status: 'booked',
        paymentMethod: draft.paymentMethod,
        paid: false,
        promoCode: draft.promoCode,
        discount: draft.discount,
        extras: [],
        pendingExtras: [],
        warrantyDays: plan?.id === 'p-plus' || plan?.id === 'p-pro' ? 15 : 10,
        createdAt: 'Today',
      };
      setBookings((prev) => [booking, ...prev]);
      return booking;
    },
    [membershipId],
  );

  const advanceBooking = useCallback(
    (id: string) =>
      patch(id, (b) => {
        if (b.status === 'awaiting_approval') return b;
        const i = STATUS_FLOW.indexOf(b.status);
        if (i < 0 || i >= STATUS_FLOW.length - 1) return b;
        const next = STATUS_FLOW[i + 1];
        return {
          ...b,
          status: next,
          mechanicName: next === 'assigned' ? 'Ravi Kumar' : b.mechanicName,
          mechanicRating: next === 'assigned' ? 4.7 : b.mechanicRating,
        };
      }),
    [patch],
  );

  const proposePendingExtra = useCallback(
    (id: string, item: Omit<ExtraItem, 'id'>) =>
      patch(id, (b) => ({
        ...b,
        status: 'awaiting_approval',
        pendingExtras: [...b.pendingExtras, { ...item, id: nextId('x') }],
      })),
    [patch],
  );

  const decideExtra = useCallback(
    (bookingId: string, extraId: string, approve: boolean) =>
      patch(bookingId, (b) => {
        const item = b.pendingExtras.find((e) => e.id === extraId);
        const pendingExtras = b.pendingExtras.filter((e) => e.id !== extraId);
        return {
          ...b,
          pendingExtras,
          extras: approve && item ? [...b.extras, item] : b.extras,
          status: pendingExtras.length === 0 ? 'in_service' : 'awaiting_approval',
        };
      }),
    [patch],
  );

  const payBooking = useCallback(
    (id: string) => patch(id, (b) => ({ ...b, paid: true })),
    [patch],
  );

  const rateBooking = useCallback(
    (id: string, rating: number) => patch(id, (b) => ({ ...b, rating })),
    [patch],
  );

  const subscribe = useCallback((planId: string) => setMembershipId(planId), []);

  const value = useMemo<AppState>(
    () => ({
      authenticated,
      name,
      city,
      vehicles,
      bookings,
      membershipId,
      login,
      logout,
      setCity,
      addVehicle,
      removeVehicle,
      applyPromo,
      createBooking,
      advanceBooking,
      proposePendingExtra,
      decideExtra,
      payBooking,
      rateBooking,
      subscribe,
    }),
    [
      authenticated,
      name,
      city,
      vehicles,
      bookings,
      membershipId,
      login,
      logout,
      addVehicle,
      removeVehicle,
      applyPromo,
      createBooking,
      advanceBooking,
      proposePendingExtra,
      decideExtra,
      payBooking,
      rateBooking,
      subscribe,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
