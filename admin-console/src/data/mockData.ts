import {
  BrandModel,
  CatalogService,
  ContentPage,
  Coupon,
  Dispute,
  FranchiseLead,
  Hub,
  Mechanic,
  Order,
  Plan,
} from '../types';

export const cities = ['All cities', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];

/* ------------------------------------------------------------- Analytics */

export const kpis = [
  { label: 'Bookings (30d)', value: '4,812', delta: 12.4, up: true, foot: 'vs previous 30 days' },
  { label: 'Revenue (30d)', value: '₹58.6L', delta: 9.1, up: true, foot: 'incl. GST & extras' },
  { label: 'Avg. rating', value: '4.6', delta: 0.2, up: true, foot: 'across 4,120 rated jobs' },
  { label: 'Avg. turnaround', value: '57 min', delta: 3.0, up: true, foot: 'target ≤ 60 min' },
];

// 14-day revenue trend (₹ lakh)
export const revenueTrend = [
  16.2, 15.1, 17.8, 18.4, 16.9, 21.2, 22.6, 19.4, 18.1, 20.5, 21.9, 23.4, 22.1, 24.8,
];

export const bookingsByCity = [
  { label: 'Bengaluru', value: 1840 },
  { label: 'Mumbai', value: 1120 },
  { label: 'Delhi NCR', value: 890 },
  { label: 'Hyderabad', value: 560 },
  { label: 'Pune', value: 402 },
];

export const bookingsByCategory = [
  { label: 'General', value: 2410 },
  { label: 'EV', value: 980 },
  { label: 'Special Services', value: 720 },
  { label: 'Brand-specific', value: 452 },
  { label: 'Premium', value: 250 },
];

export const utilizationTrend = [62, 64, 63, 66, 68, 67, 70, 71, 69, 72, 73, 71, 74, 72];

/* --------------------------------------------------------------- Orders */

export const orders: Order[] = [
  { id: 'o1', code: 'DBS-48213', customer: 'Anjali Mehta', service: 'General Service (125cc)', city: 'Bengaluru', vehicle: 'Honda Activa 6G', slot: 'Today 11:00', status: 'unassigned', amount: 1446, slaMinsLeft: 18, paid: false },
  { id: 'o2', code: 'DBS-48227', customer: 'Rahul Nair', service: 'EV Advanced Service', city: 'Bengaluru', vehicle: 'Ather 450X', slot: 'Today 13:30', status: 'assigned', mechanic: 'Ravi Kumar', amount: 1533, slaMinsLeft: 42, paid: true },
  { id: 'o3', code: 'DBS-48190', customer: 'Vikram Singh', service: 'Royal Enfield Special', city: 'Bengaluru', vehicle: 'RE Classic 350', slot: 'Today 15:00', status: 'in_service', mechanic: 'Suresh P', amount: 3539, slaMinsLeft: 9, paid: false },
  { id: 'o4', code: 'DBS-48155', customer: 'Priya Das', service: 'Wiring Check & Diagnosis', city: 'Mumbai', vehicle: 'TVS Jupiter', slot: 'Today 12:00', status: 'en_route', mechanic: 'Imran S', amount: 471, slaMinsLeft: -6, paid: false },
  { id: 'o5', code: 'DBS-48101', customer: 'Karan Gupta', service: 'General Service (110cc)', city: 'Delhi NCR', vehicle: 'Hero Splendor+', slot: 'Today 10:30', status: 'completed', mechanic: 'Deepak R', amount: 1179, slaMinsLeft: 0, paid: true },
  { id: 'o6', code: 'DBS-48099', customer: 'Sneha Rao', service: 'Battery Jump Start', city: 'Hyderabad', vehicle: 'Ola S1 Pro', slot: 'Today 09:45', status: 'completed', mechanic: 'Naveen T', amount: 589, slaMinsLeft: 0, paid: true },
  { id: 'o7', code: 'DBS-48240', customer: 'Arjun Menon', service: 'General Service (150cc)', city: 'Pune', vehicle: 'Bajaj Pulsar 150', slot: 'Today 16:00', status: 'unassigned', amount: 1769, slaMinsLeft: 55, paid: false },
];

export const mechanicsForDispatch = ['Ravi Kumar', 'Suresh P', 'Imran S', 'Deepak R', 'Naveen T', 'Farhan A'];

/* ------------------------------------------------------------- Mechanics */

export const mechanics: Mechanic[] = [
  { id: 'm1', name: 'Ravi Kumar', city: 'Bengaluru', phone: '+91 98765 43210', status: 'verified', skills: ['General', 'EV', 'Brand-specific'], rating: 4.7, jobs: 312, utilization: 74, trainingComplete: 100, kycComplete: true },
  { id: 'm2', name: 'Suresh P', city: 'Bengaluru', phone: '+91 98220 11234', status: 'verified', skills: ['General', 'Premium'], rating: 4.5, jobs: 208, utilization: 69, trainingComplete: 80, kycComplete: true },
  { id: 'm3', name: 'Imran S', city: 'Mumbai', phone: '+91 99300 55678', status: 'verified', skills: ['General', 'Special Services'], rating: 4.8, jobs: 176, utilization: 71, trainingComplete: 100, kycComplete: true },
  { id: 'm4', name: 'Farhan A', city: 'Mumbai', phone: '+91 90040 33221', status: 'in_review', skills: ['EV', 'General'], rating: 0, jobs: 0, utilization: 0, trainingComplete: 40, kycComplete: false },
  { id: 'm5', name: 'Deepak R', city: 'Delhi NCR', phone: '+91 98110 78654', status: 'verified', skills: ['General'], rating: 4.4, jobs: 143, utilization: 66, trainingComplete: 60, kycComplete: true },
  { id: 'm6', name: 'Naveen T', city: 'Hyderabad', phone: '+91 90000 12312', status: 'verified', skills: ['EV', 'Special Services'], rating: 4.6, jobs: 121, utilization: 72, trainingComplete: 100, kycComplete: true },
  { id: 'm7', name: 'Manoj B', city: 'Pune', phone: '+91 91234 00099', status: 'pending', skills: ['General'], rating: 0, jobs: 0, utilization: 0, trainingComplete: 0, kycComplete: false },
];

/* --------------------------------------------------------------- Catalog */

export const catalog: CatalogService[] = [
  { id: 's1', name: 'Electric Bike/Scooter Inspection', category: 'EV', price: 599, durationMin: 30, inspectionPoints: 20, active: true },
  { id: 's2', name: 'Electric Scooter Advanced Service', category: 'EV', price: 1299, durationMin: 60, inspectionPoints: 30, active: true },
  { id: 's3', name: 'General Service (up to 110cc)', category: 'General', price: 999, durationMin: 60, inspectionPoints: 40, active: true },
  { id: 's4', name: 'General Service (up to 125cc)', category: 'General', price: 1225, durationMin: 60, inspectionPoints: 40, active: true },
  { id: 's5', name: 'General Service (up to 150cc)', category: 'General', price: 1499, durationMin: 60, inspectionPoints: 45, active: true },
  { id: 's6', name: 'Premium Performance Service (300–400cc)', category: 'Premium', price: 4999, durationMin: 120, inspectionPoints: 90, active: true },
  { id: 's7', name: 'Super Premium Service (450cc+)', category: 'Premium', price: null, durationMin: 120, inspectionPoints: 120, active: true },
  { id: 's8', name: 'Royal Enfield Special (350–400cc)', category: 'Brand-specific', price: 2999, durationMin: 90, inspectionPoints: 60, active: true },
  { id: 's9', name: 'Wiring Check & Diagnosis', category: 'Special Services', price: 399, durationMin: 45, inspectionPoints: 10, active: true },
  { id: 's10', name: 'Towing (up to 20 km)', category: 'Special Services', price: null, durationMin: 60, inspectionPoints: 0, active: false },
];

export const brands: BrandModel[] = [
  { brand: 'Honda', type: 'Petrol', models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125'] },
  { brand: 'Hero', type: 'Petrol', models: ['Splendor Plus', 'Passion Pro', 'Glamour', 'Xtreme 160R'] },
  { brand: 'TVS', type: 'Both', models: ['Jupiter', 'Apache RTR 160', 'Raider 125', 'iQube'] },
  { brand: 'Bajaj', type: 'Petrol', models: ['Pulsar 150', 'Pulsar N160', 'Platina', 'Avenger 220'] },
  { brand: 'Royal Enfield', type: 'Petrol', models: ['Classic 350', 'Hunter 350', 'Meteor 350', 'Interceptor 650'] },
  { brand: 'Ather', type: 'EV', models: ['450X', '450S', 'Rizta'] },
  { brand: 'Ola Electric', type: 'EV', models: ['S1 Pro', 'S1 Air', 'S1 X'] },
];

export const hubs: Hub[] = [
  { id: 'h1', city: 'Bengaluru', name: 'Koramangala Hub', neighborhoods: 42, mechanics: 68, status: 'live', areaRequests: 0 },
  { id: 'h2', city: 'Bengaluru', name: 'Whitefield Hub', neighborhoods: 28, mechanics: 34, status: 'live', areaRequests: 0 },
  { id: 'h3', city: 'Mumbai', name: 'Andheri Hub', neighborhoods: 35, mechanics: 41, status: 'live', areaRequests: 0 },
  { id: 'h4', city: 'Delhi NCR', name: 'Gurgaon Hub', neighborhoods: 30, mechanics: 29, status: 'live', areaRequests: 0 },
  { id: 'h5', city: 'Pune', name: 'Hinjewadi Hub', neighborhoods: 18, mechanics: 16, status: 'live', areaRequests: 0 },
  { id: 'h6', city: 'Chennai', name: 'OMR Hub', neighborhoods: 0, mechanics: 0, status: 'coming_soon', areaRequests: 214 },
  { id: 'h7', city: 'Kolkata', name: 'Salt Lake Hub', neighborhoods: 0, mechanics: 0, status: 'coming_soon', areaRequests: 156 },
];

/* --------------------------------------------------------------- Disputes */

export const disputes: Dispute[] = [
  {
    id: 'd1',
    orderCode: 'DBS-47980',
    customer: 'Meera Iyer',
    type: 'refund',
    status: 'open',
    amount: 1225,
    opened: '2h ago',
    summary: 'Service slot missed; mechanic did not arrive within SLA window.',
    audit: [
      { time: '2h ago', actor: 'System', action: 'Dispute auto-created from SLA breach' },
      { time: '1h ago', actor: 'Support · Neha', action: 'Contacted customer, apology issued' },
    ],
  },
  {
    id: 'd2',
    orderCode: 'DBS-47890',
    customer: 'Sanjay Rao',
    type: 'warranty',
    status: 'investigating',
    amount: 0,
    opened: '1d ago',
    summary: 'Brake noise returned within 10-day workmanship warranty period.',
    audit: [
      { time: '1d ago', actor: 'Customer', action: 'Raised warranty claim' },
      { time: '20h ago', actor: 'Ops · Rakesh', action: 'Assigned re-inspection to mechanic' },
    ],
  },
  {
    id: 'd3',
    orderCode: 'DBS-47712',
    customer: 'Divya S',
    type: 'quality',
    status: 'resolved',
    amount: 300,
    opened: '3d ago',
    summary: 'Customer unhappy with chain lubrication; partial credit issued.',
    audit: [
      { time: '3d ago', actor: 'Customer', action: 'Raised quality complaint' },
      { time: '2d ago', actor: 'Ops · Rakesh', action: 'Approved ₹300 goodwill credit' },
      { time: '2d ago', actor: 'System', action: 'Refund processed to source' },
    ],
  },
];

/* --------------------------------------------------------------- Leads */

export const franchiseLeads: FranchiseLead[] = [
  { id: 'l1', name: 'Ashok Reddy', city: 'Coimbatore', phone: '+91 90000 11111', investment: '₹15–20L', stage: 'new', submitted: 'Today', type: 'Franchise' },
  { id: 'l2', name: 'Nikhil Jain', city: 'Jaipur', phone: '+91 90000 22222', investment: '₹20–25L', stage: 'qualified', submitted: '2d ago', type: 'Franchise' },
  { id: 'l3', name: 'GearUp Spares', city: 'Mumbai', phone: '+91 90000 33333', investment: '—', stage: 'onboarding', submitted: '4d ago', type: 'Vendor' },
  { id: 'l4', name: 'Rohit Kulkarni', city: 'Nagpur', phone: '+91 90000 44444', investment: '₹10–15L', stage: 'new', submitted: '5d ago', type: 'Franchise' },
  { id: 'l5', name: 'Sana Sheikh', city: 'Mumbai', phone: '+91 90000 55555', investment: '—', stage: 'live', submitted: '3w ago', type: 'Mechanic Partner' },
];

/* --------------------------------------------------------------- Plans */

export const plans: Plan[] = [
  { id: 'p1', name: 'Basic', price: 499, discountPct: 5, freeServices: 0, warrantyDays: 10, vehicles: 1, subscribers: 1840, active: true },
  { id: 'p2', name: 'Care+', price: 1299, discountPct: 12, freeServices: 2, warrantyDays: 15, vehicles: 1, subscribers: 3120, active: true },
  { id: 'p3', name: 'Pro', price: 2499, discountPct: 18, freeServices: 4, warrantyDays: 15, vehicles: 3, subscribers: 640, active: true },
];

export const coupons: Coupon[] = [
  { id: 'c1', code: 'FIRST100', type: 'flat', value: 100, uses: 3421, limit: 10000, expiry: '31 Dec 2026', active: true },
  { id: 'c2', code: 'DOORSTEP15', type: 'percent', value: 15, cap: 300, uses: 1204, limit: 5000, expiry: '30 Sep 2026', active: true },
  { id: 'c3', code: 'RIDER50', type: 'flat', value: 50, uses: 890, limit: 2000, expiry: '15 Aug 2026', active: true },
  { id: 'c4', code: 'MONSOON20', type: 'percent', value: 20, cap: 400, uses: 2000, limit: 2000, expiry: '31 Jul 2026', active: false },
];

/* --------------------------------------------------------------- Content */

export const contentPages: ContentPage[] = [
  { id: 'cp1', title: 'General Bike Service', type: 'Service', slug: '/services/general', status: 'published', updated: '3d ago' },
  { id: 'cp2', title: 'Royal Enfield Service in Bengaluru', type: 'City', slug: '/bengaluru/royal-enfield', status: 'published', updated: '1d ago' },
  { id: 'cp3', title: 'Honda Activa 6G Service & Price', type: 'Brand', slug: '/honda/activa-6g', status: 'published', updated: '5d ago' },
  { id: 'cp4', title: '5 signs your EV needs a service', type: 'Blog', slug: '/blog/ev-service-signs', status: 'draft', updated: 'Today' },
  { id: 'cp5', title: 'Doorstep Bike Service raises Series A', type: 'Media', slug: '/media/series-a', status: 'published', updated: '2w ago' },
];
