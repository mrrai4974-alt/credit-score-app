/**
 * Domain types for the Doorstep customer app (BRD section 7.1, FR-01 … FR-16).
 */

export type ServiceCategory =
  | 'EV'
  | 'General'
  | 'Premium'
  | 'Brand-specific'
  | 'Special Services';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number | null; // INR excluding GST; null => custom quote
  durationMin: number;
  inspectionPoints: number;
  description: string;
  highlights: string[];
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  registration: string;
  type: 'Petrol' | 'EV';
}

export type BookingStatus =
  | 'booked'
  | 'assigned'
  | 'en_route'
  | 'in_service'
  | 'awaiting_approval'
  | 'completed'
  | 'cancelled';

export interface ExtraItem {
  id: string;
  title: string;
  price: number;
}

export interface Booking {
  id: string;
  code: string;
  service: Service;
  vehicle: Vehicle;
  slot: string;
  address: string;
  status: BookingStatus;
  mechanicName?: string;
  mechanicRating?: number;
  paymentMethod: 'online' | 'cod';
  paid: boolean;
  promoCode?: string;
  discount: number;
  extras: ExtraItem[]; // approved add-ons
  pendingExtras: ExtraItem[]; // awaiting customer approval
  rating?: number;
  warrantyDays: number;
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // per year, INR
  tagline: string;
  perks: string[];
  highlighted?: boolean;
}

export interface Brand {
  name: string;
  type: 'Petrol' | 'EV' | 'Both';
  models: string[];
}
