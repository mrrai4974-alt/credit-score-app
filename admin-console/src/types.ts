export type ServiceCategory =
  | 'EV'
  | 'General'
  | 'Premium'
  | 'Brand-specific'
  | 'Special Services';

export interface CatalogService {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number | null;
  durationMin: number;
  inspectionPoints: number;
  active: boolean;
}

export interface BrandModel {
  brand: string;
  type: 'Petrol' | 'EV' | 'Both';
  models: string[];
}

export interface Hub {
  id: string;
  city: string;
  name: string;
  neighborhoods: number;
  mechanics: number;
  status: 'live' | 'coming_soon';
  areaRequests: number;
}

export type MechanicStatus = 'pending' | 'in_review' | 'verified' | 'suspended';

export interface Mechanic {
  id: string;
  name: string;
  city: string;
  phone: string;
  status: MechanicStatus;
  skills: ServiceCategory[];
  rating: number;
  jobs: number;
  utilization: number; // %
  trainingComplete: number; // %
  kycComplete: boolean;
}

export type OrderStatus =
  | 'unassigned'
  | 'assigned'
  | 'en_route'
  | 'in_service'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  code: string;
  customer: string;
  service: string;
  city: string;
  vehicle: string;
  slot: string;
  status: OrderStatus;
  mechanic?: string;
  amount: number;
  slaMinsLeft: number; // negative => breached
  paid: boolean;
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
  orderCode: string;
  customer: string;
  type: DisputeType;
  status: DisputeStatus;
  amount: number;
  opened: string;
  summary: string;
  audit: AuditEntry[];
}

export interface FranchiseLead {
  id: string;
  name: string;
  city: string;
  phone: string;
  investment: string;
  stage: 'new' | 'qualified' | 'onboarding' | 'live' | 'rejected';
  submitted: string;
  type: 'Franchise' | 'Mechanic Partner' | 'Vendor';
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  discountPct: number;
  freeServices: number;
  warrantyDays: number;
  vehicles: number;
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

export interface ContentPage {
  id: string;
  title: string;
  type: 'Service' | 'Brand' | 'City' | 'Blog' | 'Media';
  slug: string;
  status: 'published' | 'draft';
  updated: string;
}
