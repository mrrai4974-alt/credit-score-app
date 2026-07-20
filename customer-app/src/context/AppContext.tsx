import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { api, setToken } from '../api';
import { services as catalogServices } from '../data/catalog';
import { Booking, Service, Vehicle } from '../types';

/* ------------------------------------------------- API response shapes */

interface ApiExtra {
  id: string;
  title: string;
  price: number;
  approved: 'pending' | 'approved' | 'rejected';
}
interface ApiBooking {
  id: string;
  code: string;
  status: Booking['status'];
  serviceId: string;
  serviceName: string;
  category: Service['category'];
  basePrice: number;
  inspectionPoints: number;
  estimatedDurationMin: number;
  vehicle: string;
  address: string;
  slot: string;
  extras: ApiExtra[];
  mechanicName: string | null;
  paymentMethod: 'online' | 'cod';
  paid: boolean;
  promoCode?: string;
  discount: number;
  rating?: number;
  warrantyDays: number;
  createdAt: string;
}

/** Map a backend booking into the app's existing Booking shape. */
function fromApi(b: ApiBooking): Booking {
  const svc: Service =
    catalogServices.find((s) => s.id === b.serviceId) ?? {
      id: b.serviceId,
      name: b.serviceName,
      category: b.category,
      price: b.basePrice,
      durationMin: b.estimatedDurationMin,
      inspectionPoints: b.inspectionPoints,
      description: '',
      highlights: [],
    };
  const [brand, ...rest] = (b.vehicle || '').split(' ');
  const vehicle: Vehicle = {
    id: '',
    brand: brand || b.vehicle,
    model: rest.join(' '),
    registration: '',
    type: b.category === 'EV' ? 'EV' : 'Petrol',
  };
  return {
    id: b.id,
    code: b.code,
    service: svc,
    vehicle,
    slot: b.slot,
    address: b.address,
    status: b.status,
    mechanicName: b.mechanicName ?? undefined,
    mechanicRating: b.mechanicName ? 4.7 : undefined,
    paymentMethod: b.paymentMethod,
    paid: b.paid,
    promoCode: b.promoCode,
    discount: b.discount,
    extras: b.extras.filter((e) => e.approved === 'approved').map((e) => ({ id: e.id, title: e.title, price: e.price })),
    pendingExtras: b.extras.filter((e) => e.approved === 'pending').map((e) => ({ id: e.id, title: e.title, price: e.price })),
    rating: b.rating,
    warrantyDays: b.warrantyDays,
    createdAt: b.createdAt,
  };
}

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
  guest: boolean;
  name: string;
  city: string;
  vehicles: Vehicle[];
  bookings: Booking[];
  membershipId: string | null;

  requestOtp: (phone: string) => Promise<string>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<void>;
  enterGuest: () => void;
  exitGuest: () => void;
  logout: () => void;
  setCity: (city: string) => void;

  addVehicle: (v: Omit<Vehicle, 'id'>) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;

  applyPromo: (code: string, base: number) => Promise<number | null>;
  createBooking: (draft: BookingDraft) => Promise<Booking>;
  refreshBookings: () => Promise<void>;
  decideExtra: (bookingId: string, extraId: string, approve: boolean) => Promise<void>;
  payBooking: (id: string) => Promise<void>;
  rateBooking: (id: string, rating: number) => Promise<void>;
  subscribe: (planId: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [guest, setGuest] = useState(false);
  const [name, setName] = useState('Rider');
  const [city, setCity] = useState('Bengaluru');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membershipId, setMembershipId] = useState<string | null>(null);

  const refreshBookings = useCallback(async () => {
    const list = await api.get<ApiBooking[]>('/bookings');
    setBookings(list.map(fromApi));
  }, []);

  const loadAll = useCallback(async () => {
    const [veh] = await Promise.all([
      api.get<Vehicle[]>('/vehicles'),
      refreshBookings(),
    ]);
    setVehicles(veh);
    try {
      const m = await api.get<{ planId: string | null }>('/memberships/me');
      setMembershipId(m.planId);
    } catch {
      /* ignore */
    }
  }, [refreshBookings]);

  const requestOtp = useCallback(async (phone: string) => {
    const r = await api.post<{ devOtp: string }>('/auth/otp/request', { phone });
    return r.devOtp;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string, n?: string) => {
      const r = await api.post<{ token: string; user: { name: string; city: string } }>(
        '/auth/otp/verify',
        { phone, otp, role: 'customer', name: n, city },
      );
      setToken(r.token);
      setName(r.user.name);
      if (r.user.city) setCity(r.user.city);
      setAuthenticated(true);
      setGuest(false);
      await loadAll();
    },
    [city, loadAll],
  );

  const enterGuest = useCallback(() => setGuest(true), []);
  const exitGuest = useCallback(() => setGuest(false), []);
  const logout = useCallback(() => {
    setToken(null);
    setAuthenticated(false);
    setGuest(false);
    setVehicles([]);
    setBookings([]);
    setMembershipId(null);
  }, []);

  const addVehicle = useCallback(async (v: Omit<Vehicle, 'id'>) => {
    const created = await api.post<Vehicle>('/vehicles', v);
    setVehicles((prev) => [...prev, created]);
  }, []);

  const removeVehicle = useCallback(async (id: string) => {
    await api.del(`/vehicles/${id}`);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const applyPromo = useCallback(async (code: string, base: number): Promise<number | null> => {
    try {
      const r = await api.post<{ type: 'flat' | 'percent'; value: number; cap?: number }>(
        '/promos/validate',
        { code },
      );
      if (r.type === 'flat') return r.value;
      const raw = Math.round((base * r.value) / 100);
      return r.cap ? Math.min(r.cap, raw) : raw;
    } catch {
      return null;
    }
  }, []);

  const createBooking = useCallback(async (draft: BookingDraft): Promise<Booking> => {
    const created = await api.post<ApiBooking>('/bookings', {
      serviceId: draft.service.id,
      vehicleId: draft.vehicle.id,
      slot: draft.slot,
      address: draft.address,
      paymentMethod: draft.paymentMethod,
      promoCode: draft.promoCode,
      discount: draft.discount,
    });
    const mapped = fromApi(created);
    setBookings((prev) => [mapped, ...prev]);
    return mapped;
  }, []);

  const applyResult = useCallback((b: ApiBooking) => {
    const mapped = fromApi(b);
    setBookings((prev) => prev.map((x) => (x.id === mapped.id ? mapped : x)));
  }, []);

  const decideExtra = useCallback(
    async (bookingId: string, extraId: string, approve: boolean) => {
      const b = await api.post<ApiBooking>(`/bookings/${bookingId}/extras/${extraId}/decision`, { approve });
      applyResult(b);
    },
    [applyResult],
  );

  const payBooking = useCallback(
    async (id: string) => {
      const b = await api.post<ApiBooking>(`/bookings/${id}/pay`);
      applyResult(b);
    },
    [applyResult],
  );

  const rateBooking = useCallback(
    async (id: string, rating: number) => {
      const b = await api.post<ApiBooking>(`/bookings/${id}/rate`, { rating });
      applyResult(b);
    },
    [applyResult],
  );

  const subscribe = useCallback(async (planId: string) => {
    await api.post(`/plans/${planId}/subscribe`);
    setMembershipId(planId);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      authenticated,
      guest,
      name,
      city,
      vehicles,
      bookings,
      membershipId,
      requestOtp,
      verifyOtp,
      enterGuest,
      exitGuest,
      logout,
      setCity,
      addVehicle,
      removeVehicle,
      applyPromo,
      createBooking,
      refreshBookings,
      decideExtra,
      payBooking,
      rateBooking,
      subscribe,
    }),
    [
      authenticated, guest, name, city, vehicles, bookings, membershipId,
      requestOtp, verifyOtp, enterGuest, exitGuest, logout,
      addVehicle, removeVehicle, applyPromo, createBooking, refreshBookings,
      decideExtra, payBooking, rateBooking, subscribe,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
