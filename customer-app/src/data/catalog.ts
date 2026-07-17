import {
  Booking,
  Brand,
  MembershipPlan,
  Service,
  Vehicle,
} from '../types';

/**
 * Service catalog mirrors Appendix A of the BRD (prices INR, excl. 18% GST).
 */
export const services: Service[] = [
  // EV
  {
    id: 's-ev-1',
    name: 'Electric Bike/Scooter Inspection',
    category: 'EV',
    price: 599,
    durationMin: 30,
    inspectionPoints: 20,
    description: 'Diagnostic health check for your electric two-wheeler.',
    highlights: ['Battery & BMS check', 'Motor diagnostics', 'Charging test'],
  },
  {
    id: 's-ev-2',
    name: 'Electric Bike Basic Service',
    category: 'EV',
    price: 999,
    durationMin: 45,
    inspectionPoints: 25,
    description: 'Essential maintenance for daily EV commuters.',
    highlights: ['Brake service', 'Firmware check', 'Wiring inspection'],
  },
  {
    id: 's-ev-3',
    name: 'Electric Scooter Advanced Service',
    category: 'EV',
    price: 1299,
    durationMin: 60,
    inspectionPoints: 30,
    description: 'Comprehensive service for electric scooters.',
    highlights: ['Full diagnostics', 'Suspension check', 'Road test'],
  },
  {
    id: 's-ev-4',
    name: 'EV Belt Replacement Service',
    category: 'EV',
    price: 1599,
    durationMin: 45,
    inspectionPoints: 15,
    description: 'Drive belt replacement with genuine parts.',
    highlights: ['Genuine belt', 'Tension setup', 'Performance test'],
  },
  // General
  {
    id: 's-gen-1',
    name: 'General Service (up to 110cc)',
    category: 'General',
    price: 999,
    durationMin: 60,
    inspectionPoints: 40,
    description: 'Complete periodic service for commuter bikes & scooters.',
    highlights: ['Engine oil', 'Brake tuning', 'Chain lube', '40-point check'],
  },
  {
    id: 's-gen-2',
    name: 'General Service (up to 125cc)',
    category: 'General',
    price: 1225,
    durationMin: 60,
    inspectionPoints: 40,
    description: 'Periodic service tuned for 125cc engines.',
    highlights: ['Engine oil', 'Carburettor/FI clean', '40-point check'],
  },
  {
    id: 's-gen-3',
    name: 'General Service (up to 150cc)',
    category: 'General',
    price: 1499,
    durationMin: 60,
    inspectionPoints: 45,
    description: 'Full service for 150cc motorcycles.',
    highlights: ['Engine oil', 'Brake service', '45-point check'],
  },
  {
    id: 's-gen-4',
    name: 'General Service (up to 200cc)',
    category: 'General',
    price: 1999,
    durationMin: 60,
    inspectionPoints: 50,
    description: 'Comprehensive service for 200cc bikes.',
    highlights: ['Engine oil', 'Full diagnostics', '50-point check'],
  },
  // Premium
  {
    id: 's-prem-1',
    name: 'Premium Performance Service (300–400cc)',
    category: 'Premium',
    price: 4999,
    durationMin: 120,
    inspectionPoints: 90,
    description: 'Specialist care for performance motorcycles.',
    highlights: ['Synthetic oil', '90-point check', 'Dyno-style road test'],
  },
  {
    id: 's-prem-2',
    name: 'Super Premium Service (450cc+)',
    category: 'Premium',
    price: null,
    durationMin: 120,
    inspectionPoints: 120,
    description: 'Bespoke service for super-premium machines. Get a quote.',
    highlights: ['Custom scope', '120-point check', 'Specialist mechanic'],
  },
  // Brand-specific
  {
    id: 's-re-1',
    name: 'Royal Enfield Special (350–400cc)',
    category: 'Brand-specific',
    price: 2999,
    durationMin: 90,
    inspectionPoints: 60,
    description: 'Brand-spec service for Royal Enfield 350–400cc.',
    highlights: ['RE-spec oil', 'Tappet adjustment', '60-point check'],
  },
  {
    id: 's-re-2',
    name: 'Royal Enfield Special (650cc Twin)',
    category: 'Brand-specific',
    price: 4999,
    durationMin: 120,
    inspectionPoints: 80,
    description: 'Specialist service for the 650 Twin platform.',
    highlights: ['Twin-cylinder tune', 'Chain & sprocket', '80-point check'],
  },
  // Special Services
  {
    id: 's-sp-1',
    name: 'Battery Jump Start / Replacement',
    category: 'Special Services',
    price: 499,
    durationMin: 30,
    inspectionPoints: 5,
    description: 'On-demand battery help at your doorstep.',
    highlights: ['Jump start', 'Battery test', 'Replacement option'],
  },
  {
    id: 's-sp-2',
    name: 'Wiring Check & Diagnosis',
    category: 'Special Services',
    price: 399,
    durationMin: 45,
    inspectionPoints: 10,
    description: 'Electrical fault diagnosis and wiring inspection.',
    highlights: ['Fault trace', 'Fuse check', 'Report shared'],
  },
  {
    id: 's-sp-3',
    name: 'Towing (up to 20 km)',
    category: 'Special Services',
    price: null,
    durationMin: 60,
    inspectionPoints: 0,
    description: 'Doorstep pickup and towing to the nearest hub.',
    highlights: ['Up to 20 km', 'Safe handling', 'Get a quote'],
  },
  {
    id: 's-sp-4',
    name: 'Old Vehicle Inspection (pre-purchase)',
    category: 'Special Services',
    price: 1199,
    durationMin: 30,
    inspectionPoints: 50,
    description: 'Independent pre-purchase inspection report.',
    highlights: ['50-point report', 'Engine health', 'Buy/skip advice'],
  },
];

/** Explicitly excluded doorstep services (BRD scope exclusions). */
export const excludedServices = [
  'Puncture repair',
  'Tyre replacement',
  'Tube replacement',
  'Wheel alignment',
];

export const categoryMeta: {
  key: Service['category'];
  label: string;
  emoji: string;
}[] = [
  { key: 'General', label: 'General', emoji: '🛠️' },
  { key: 'EV', label: 'EV', emoji: '⚡' },
  { key: 'Premium', label: 'Premium', emoji: '🏁' },
  { key: 'Brand-specific', label: 'Royal Enfield', emoji: '🏍️' },
  { key: 'Special Services', label: 'Special', emoji: '🚨' },
];

export const brands: Brand[] = [
  { name: 'Honda', type: 'Petrol', models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125'] },
  { name: 'Hero', type: 'Petrol', models: ['Splendor Plus', 'Passion Pro', 'Glamour', 'Xtreme 160R'] },
  { name: 'TVS', type: 'Both', models: ['Jupiter', 'Apache RTR 160', 'Raider 125', 'iQube (EV)'] },
  { name: 'Bajaj', type: 'Petrol', models: ['Pulsar 150', 'Pulsar N160', 'Platina', 'Avenger 220'] },
  { name: 'Royal Enfield', type: 'Petrol', models: ['Classic 350', 'Hunter 350', 'Meteor 350', 'Interceptor 650'] },
  { name: 'Yamaha', type: 'Petrol', models: ['FZ-S', 'R15 V4', 'MT-15', 'Fascino'] },
  { name: 'Ather', type: 'EV', models: ['450X', '450S', 'Rizta'] },
  { name: 'Ola Electric', type: 'EV', models: ['S1 Pro', 'S1 Air', 'S1 X'] },
  { name: 'Suzuki', type: 'Petrol', models: ['Access 125', 'Gixxer', 'Burgman Street'] },
];

export const cities = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
];

export const neighborhoodsByCity: Record<string, string[]> = {
  Bengaluru: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar'],
  Mumbai: ['Andheri', 'Bandra', 'Powai', 'Thane', 'Borivali'],
  'Delhi NCR': ['Gurgaon', 'Noida', 'Dwarka', 'Rohini', 'Saket'],
  Hyderabad: ['Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally'],
  Pune: ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner'],
  Chennai: ['Adyar', 'Velachery', 'T. Nagar', 'OMR'],
  Kolkata: ['Salt Lake', 'New Town', 'Ballygunge'],
  Ahmedabad: ['Satellite', 'Bopal', 'Maninagar'],
};

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'p-basic',
    name: 'Basic',
    price: 499,
    tagline: 'For the occasional rider',
    perks: ['5% off all services', 'Free pickup & drop', 'Priority callback'],
  },
  {
    id: 'p-plus',
    name: 'Care+',
    price: 1299,
    tagline: 'Best value for daily commuters',
    perks: [
      '12% off all services',
      '2 free basic services / year',
      'Priority slots',
      'Extended 15-day warranty',
    ],
    highlighted: true,
  },
  {
    id: 'p-pro',
    name: 'Pro',
    price: 2499,
    tagline: 'For premium & multi-bike owners',
    perks: [
      '18% off all services',
      '4 free services / year',
      'Dedicated advisor',
      'Cover up to 3 vehicles',
    ],
  },
];

export const promoCodes: Record<string, number> = {
  FIRST100: 100,
  DOORSTEP15: 150,
  RIDER50: 50,
};

export const seedVehicles: Vehicle[] = [
  {
    id: 'v-1',
    brand: 'Honda',
    model: 'Activa 6G',
    registration: 'KA-01-HJ-4521',
    type: 'Petrol',
  },
];

export const seedBookings: Booking[] = [
  {
    id: 'b-1',
    code: 'DBS-47120',
    service: services.find((s) => s.id === 's-gen-1')!,
    vehicle: seedVehicles[0],
    slot: 'Sat, 12 Jul · 10:00 AM',
    address: 'Koramangala 4th Block, Bengaluru',
    status: 'completed',
    mechanicName: 'Ravi Kumar',
    mechanicRating: 4.7,
    paymentMethod: 'online',
    paid: true,
    discount: 0,
    extras: [{ id: 'x1', title: 'Brake pad replacement', price: 450 }],
    pendingExtras: [],
    rating: 5,
    warrantyDays: 10,
    createdAt: '12 Jul 2026',
  },
];
