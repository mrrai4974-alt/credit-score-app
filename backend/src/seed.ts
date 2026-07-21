import {
  Booking,
  Brand,
  ChecklistItem,
  Coupon,
  DB,
  Dispute,
  Mechanic,
  Plan,
  Service,
  User,
} from './types';

const now = () => new Date().toISOString();

const generalChecklist = (): ChecklistItem[] =>
  [
    'Engine oil level & quality check',
    'Air filter cleaning / inspection',
    'Spark plug inspection',
    'Brake shoe / pad check (front & rear)',
    'Clutch & accelerator play adjustment',
    'Chain lubrication & tension',
    'Battery terminals & voltage',
    'Headlight / indicator / horn test',
    'Tyre pressure & tread check',
    'Final road test',
  ].map((label, i) => ({ id: `c${i + 1}`, label, done: false }));

const evChecklist = (): ChecklistItem[] =>
  [
    'Battery health & state of charge',
    'Motor & controller diagnostics',
    'Charging port & cable inspection',
    'Brake system check',
    'Firmware / BMS status',
    'Wiring harness inspection',
    'Tyre & suspension check',
    'Final road test',
  ].map((label, i) => ({ id: `c${i + 1}`, label, done: false }));

export function checklistFor(category: Service['category']): ChecklistItem[] {
  return category === 'EV' ? evChecklist() : generalChecklist();
}

const services: Service[] = [
  { id: 's-ev-1', name: 'Electric Bike/Scooter Inspection', category: 'EV', price: 599, durationMin: 30, inspectionPoints: 20, active: true },
  { id: 's-ev-2', name: 'Electric Bike Basic Service', category: 'EV', price: 999, durationMin: 45, inspectionPoints: 25, active: true },
  { id: 's-ev-3', name: 'Electric Scooter Advanced Service', category: 'EV', price: 1299, durationMin: 60, inspectionPoints: 30, active: true },
  { id: 's-ev-4', name: 'EV Belt Replacement Service', category: 'EV', price: 1599, durationMin: 45, inspectionPoints: 15, active: true },
  { id: 's-gen-1', name: 'General Service (up to 110cc)', category: 'General', price: 999, durationMin: 60, inspectionPoints: 40, active: true },
  { id: 's-gen-2', name: 'General Service (up to 125cc)', category: 'General', price: 1225, durationMin: 60, inspectionPoints: 40, active: true },
  { id: 's-gen-3', name: 'General Service (up to 150cc)', category: 'General', price: 1499, durationMin: 60, inspectionPoints: 45, active: true },
  { id: 's-gen-4', name: 'General Service (up to 200cc)', category: 'General', price: 1999, durationMin: 60, inspectionPoints: 50, active: true },
  { id: 's-prem-1', name: 'Premium Performance Service (300–400cc)', category: 'Premium', price: 4999, durationMin: 120, inspectionPoints: 90, active: true },
  { id: 's-prem-2', name: 'Super Premium Service (450cc+)', category: 'Premium', price: null, durationMin: 120, inspectionPoints: 120, active: true },
  { id: 's-re-1', name: 'Royal Enfield Special (350–400cc)', category: 'Brand-specific', price: 2999, durationMin: 90, inspectionPoints: 60, active: true },
  { id: 's-re-2', name: 'Royal Enfield Special (650cc Twin)', category: 'Brand-specific', price: 4999, durationMin: 120, inspectionPoints: 80, active: true },
  { id: 's-sp-1', name: 'Battery Jump Start / Replacement', category: 'Special Services', price: 499, durationMin: 30, inspectionPoints: 5, active: true },
  { id: 's-sp-2', name: 'Wiring Check & Diagnosis', category: 'Special Services', price: 399, durationMin: 45, inspectionPoints: 10, active: true },
  { id: 's-sp-3', name: 'Towing (up to 20 km)', category: 'Special Services', price: null, durationMin: 60, inspectionPoints: 0, active: true },
  { id: 's-sp-4', name: 'Old Vehicle Inspection (pre-purchase)', category: 'Special Services', price: 1199, durationMin: 30, inspectionPoints: 50, active: true },
];

const brands: Brand[] = [
  { id: 'b1', name: 'Honda', type: 'Petrol', models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125', 'Dio'] },
  { id: 'b2', name: 'Hero', type: 'Petrol', models: ['Splendor Plus', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'HF Deluxe'] },
  { id: 'b3', name: 'TVS', type: 'Both', models: ['Jupiter', 'Apache RTR 160', 'Raider 125', 'iQube', 'Ntorq 125'] },
  { id: 'b4', name: 'Bajaj', type: 'Petrol', models: ['Pulsar 150', 'Pulsar N160', 'Platina', 'Avenger 220', 'CT 100'] },
  { id: 'b5', name: 'Royal Enfield', type: 'Petrol', models: ['Classic 350', 'Hunter 350', 'Meteor 350', 'Interceptor 650', 'Bullet 350'] },
  { id: 'b6', name: 'Yamaha', type: 'Petrol', models: ['FZ-S', 'R15 V4', 'MT-15', 'Fascino', 'Ray ZR'] },
  { id: 'b7', name: 'Ather', type: 'EV', models: ['450X', '450S', 'Rizta'] },
  { id: 'b8', name: 'Ola Electric', type: 'EV', models: ['S1 Pro', 'S1 Air', 'S1 X'] },
  { id: 'b9', name: 'Suzuki', type: 'Petrol', models: ['Access 125', 'Gixxer', 'Burgman Street', 'Avenis'] },
];

const users: User[] = [
  { id: 'u-admin', role: 'admin', name: 'Ops Admin', email: 'admin@doorstepbike.example', password: 'admin123', city: 'Bengaluru', createdAt: now() },
  { id: 'u-cust-1', role: 'customer', name: 'Anjali Mehta', phone: '9800000001', city: 'Bengaluru', createdAt: now() },
  { id: 'u-mech-1', role: 'mechanic', name: 'Ravi Kumar', phone: '9876543210', city: 'Bengaluru', createdAt: now() },
  { id: 'u-mech-2', role: 'mechanic', name: 'Suresh P', phone: '9822011234', city: 'Bengaluru', createdAt: now() },
  { id: 'u-mech-3', role: 'mechanic', name: 'Imran S', phone: '9930055678', city: 'Mumbai', createdAt: now() },
];

const mechanics: Mechanic[] = [
  { id: 'm-1', userId: 'u-mech-1', name: 'Ravi Kumar', phone: '9876543210', city: 'Bengaluru', verification: 'verified', skills: ['General', 'EV', 'Brand-specific'], rating: 4.7, jobsCompleted: 312, utilization: 74, trainingComplete: 100, kycComplete: true, serviceRadiusKm: 8, online: true },
  { id: 'm-2', userId: 'u-mech-2', name: 'Suresh P', phone: '9822011234', city: 'Bengaluru', verification: 'verified', skills: ['General', 'Premium'], rating: 4.5, jobsCompleted: 208, utilization: 69, trainingComplete: 80, kycComplete: true, serviceRadiusKm: 6, online: true },
  { id: 'm-3', userId: 'u-mech-3', name: 'Imran S', phone: '9930055678', city: 'Mumbai', verification: 'verified', skills: ['General', 'Special Services'], rating: 4.8, jobsCompleted: 176, utilization: 71, trainingComplete: 100, kycComplete: true, serviceRadiusKm: 7, online: true },
  { id: 'm-4', userId: 'u-mech-4', name: 'Farhan A', phone: '9004033221', city: 'Mumbai', verification: 'in_review', skills: ['EV', 'General'], rating: 0, jobsCompleted: 0, utilization: 0, trainingComplete: 40, kycComplete: false, serviceRadiusKm: 6, online: false },
];

const plans: Plan[] = [
  { id: 'p1', name: 'Basic', price: 499, discountPct: 5, freeServices: 0, warrantyDays: 10, vehicles: 1, perks: ['5% off all services', 'Free pickup & drop', 'Priority callback'], subscribers: 1840, active: true },
  { id: 'p2', name: 'Care+', price: 1299, discountPct: 12, freeServices: 2, warrantyDays: 15, vehicles: 1, perks: ['12% off all services', '2 free basic services / year', 'Priority slots', 'Extended 15-day warranty'], subscribers: 3120, active: true },
  { id: 'p3', name: 'Pro', price: 2499, discountPct: 18, freeServices: 4, warrantyDays: 15, vehicles: 3, perks: ['18% off all services', '4 free services / year', 'Dedicated advisor', 'Covers up to 3 vehicles'], subscribers: 640, active: true },
];

const coupons: Coupon[] = [
  { id: 'c1', code: 'FIRST100', type: 'flat', value: 100, uses: 3421, limit: 10000, expiry: '31 Dec 2026', active: true },
  { id: 'c2', code: 'DOORSTEP15', type: 'percent', value: 15, cap: 300, uses: 1204, limit: 5000, expiry: '30 Sep 2026', active: true },
  { id: 'c3', code: 'RIDER50', type: 'flat', value: 50, uses: 890, limit: 2000, expiry: '15 Aug 2026', active: true },
];

const disputes: Dispute[] = [
  { id: 'd1', bookingCode: 'DBS-47980', customer: 'Meera Iyer', type: 'refund', status: 'open', amount: 1225, opened: '2h ago', summary: 'Service slot missed; mechanic did not arrive within SLA window.', audit: [{ time: '2h ago', actor: 'System', action: 'Dispute auto-created from SLA breach' }] },
  { id: 'd2', bookingCode: 'DBS-47890', customer: 'Sanjay Rao', type: 'warranty', status: 'investigating', amount: 0, opened: '1d ago', summary: 'Brake noise returned within 10-day workmanship warranty period.', audit: [{ time: '1d ago', actor: 'Customer', action: 'Raised warranty claim' }] },
];

export function seed(): DB {
  const t = now();
  const bookings: Booking[] = [
    {
      id: 'bk-seed-1', code: 'DBS-48213', status: 'booked', customerId: 'u-cust-1', customerName: 'Anjali Mehta',
      mechanicId: null, mechanicName: null, serviceId: 's-gen-2', serviceName: 'General Service (up to 125cc)',
      category: 'General', basePrice: 1225, inspectionPoints: 40, estimatedDurationMin: 60, vehicle: 'Honda Activa 6G',
      city: 'Bengaluru', address: '4th Block, Koramangala, Bengaluru', slot: 'Today, 11:00 AM – 12:00 PM',
      checklist: checklistFor('General'), extras: [], beforePhoto: false, afterPhoto: false,
      paymentMethod: 'online', paid: true, discount: 0, warrantyDays: 10, createdAt: t, updatedAt: t,
    },
    {
      id: 'bk-seed-2', code: 'DBS-48190', status: 'assigned', customerId: 'u-cust-1', customerName: 'Vikram Singh',
      mechanicId: 'm-1', mechanicName: 'Ravi Kumar', serviceId: 's-re-1', serviceName: 'Royal Enfield Special (350–400cc)',
      category: 'Brand-specific', basePrice: 2999, inspectionPoints: 60, estimatedDurationMin: 90, vehicle: 'Royal Enfield Classic 350',
      city: 'Bengaluru', address: 'Indiranagar 100ft Road, Bengaluru', slot: 'Today, 3:00 PM – 4:30 PM',
      checklist: checklistFor('General'), extras: [], beforePhoto: false, afterPhoto: false,
      paymentMethod: 'cod', paid: false, discount: 0, warrantyDays: 10, createdAt: t, updatedAt: t,
    },
  ];

  return {
    users,
    mechanics,
    services,
    brands,
    vehicles: [
      { id: 'v-1', customerId: 'u-cust-1', brand: 'Honda', model: 'Activa 6G', registration: 'KA-01-HJ-4521', type: 'Petrol' },
    ],
    bookings,
    disputes,
    plans,
    coupons,
    leads: [],
    content: [
      { id: 'cp1', title: 'General Bike Service', type: 'Service', slug: '/services/general', status: 'published', updated: '3d ago' },
      { id: 'cp2', title: 'Royal Enfield Service in Bengaluru', type: 'City', slug: '/bengaluru/royal-enfield', status: 'published', updated: '1d ago' },
      { id: 'cp3', title: '5 signs your EV needs a service', type: 'Blog', slug: '/blog/ev-service-signs', status: 'draft', updated: 'Today' },
    ],
    memberships: [],
  };
}
