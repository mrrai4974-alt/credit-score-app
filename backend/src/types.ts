/** Canonical domain types — the single source of truth for the API contract. */

export type Role = 'customer' | 'mechanic' | 'admin';

export type ServiceCategory =
  | 'EV'
  | 'General'
  | 'Premium'
  | 'Brand-specific'
  | 'Special Services';

export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'suspended';

/**
 * Unified booking lifecycle shared by the customer app, mechanic app and admin
 * console. A single Booking entity flows across all three clients.
 */
export type BookingStatus =
  | 'booked' // created by customer, not yet assigned
  | 'assigned' // a mechanic is assigned (by dispatch or self-accept)
  | 'en_route'
  | 'in_service'
  | 'awaiting_approval' // mechanic proposed extra work, waiting on customer
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  role: Role;
  name: string;
  phone?: string;
  email?: string;
  password?: string; // admins only (demo)
  city: string;
  createdAt: string;
}

export interface Mechanic {
  id: string;
  userId: string;
  name: string;
  phone: string;
  city: string;
  verification: VerificationStatus;
  skills: ServiceCategory[];
  rating: number;
  jobsCompleted: number;
  utilization: number;
  trainingComplete: number;
  kycComplete: boolean;
  serviceRadiusKm: number;
  online: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number | null; // INR excl. 18% GST; null => custom quote
  durationMin: number;
  inspectionPoints: number;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  type: 'Petrol' | 'EV' | 'Both';
  models: string[];
}

export interface Vehicle {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  registration: string;
  type: 'Petrol' | 'EV';
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ExtraItem {
  id: string;
  title: string;
  price: number; // INR excl. GST
  approved: 'pending' | 'approved' | 'rejected';
}

export interface Booking {
  id: string;
  code: string;
  status: BookingStatus;
  customerId: string;
  customerName: string;
  mechanicId: string | null;
  mechanicName: string | null;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  basePrice: number;
  inspectionPoints: number;
  estimatedDurationMin: number;
  vehicle: string;
  city: string;
  address: string;
  slot: string;
  checklist: ChecklistItem[];
  extras: ExtraItem[];
  beforePhoto: boolean;
  afterPhoto: boolean;
  paymentMethod: 'online' | 'cod';
  paid: boolean;
  promoCode?: string;
  discount: number;
  rating?: number;
  warrantyDays: number;
  createdAt: string;
  updatedAt: string;
}

export type DisputeType = 'refund' | 'warranty' | 'quality';
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

export interface AuditEntry {
  time: string;
  actor: string;
  action: string;
}

export interface Dispute {
  id: string;
  bookingCode: string;
  customer: string;
  type: DisputeType;
  status: DisputeStatus;
  amount: number;
  opened: string;
  summary: string;
  audit: AuditEntry[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  discountPct: number;
  freeServices: number;
  warrantyDays: number;
  vehicles: number;
  perks: string[];
  subscribers: number;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  cap?: number;
  uses: number;
  limit: number;
  expiry: string;
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  type: 'Franchise' | 'Mechanic Partner' | 'Vendor' | 'Callback';
  detail: string;
  stage: 'new' | 'qualified' | 'onboarding' | 'live' | 'rejected';
  submittedAt: string;
}

export interface ContentPage {
  id: string;
  title: string;
  type: 'Service' | 'Brand' | 'City' | 'Blog' | 'Media';
  slug: string;
  status: 'published' | 'draft';
  updated: string;
}

export interface DB {
  users: User[];
  mechanics: Mechanic[];
  services: Service[];
  brands: Brand[];
  vehicles: Vehicle[];
  bookings: Booking[];
  disputes: Dispute[];
  plans: Plan[];
  coupons: Coupon[];
  leads: Lead[];
  content: ContentPage[];
  memberships: { customerId: string; planId: string }[];
}
