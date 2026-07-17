import {
  EarningEntry,
  Job,
  Mechanic,
  TrainingModule,
} from '../types';

/**
 * Seed data so the app is fully explorable without a backend.
 * Prices are INR excluding 18% GST, matching the reference catalog in the BRD.
 */

export const GST_RATE = 0.18;

export const currentMechanic: Mechanic = {
  id: 'm-1001',
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  city: 'Bengaluru',
  rating: 4.7,
  jobsCompleted: 312,
  verification: 'verified',
  skills: ['General', 'EV', 'Royal Enfield'],
  serviceRadiusKm: 8,
  online: true,
  avatarInitials: 'RK',
};

const generalChecklist = () => [
  { id: 'c1', label: 'Engine oil level & quality check', done: false },
  { id: 'c2', label: 'Air filter cleaning / inspection', done: false },
  { id: 'c3', label: 'Spark plug inspection', done: false },
  { id: 'c4', label: 'Brake shoe / pad check (front & rear)', done: false },
  { id: 'c5', label: 'Clutch & accelerator play adjustment', done: false },
  { id: 'c6', label: 'Chain lubrication & tension', done: false },
  { id: 'c7', label: 'Battery terminals & voltage', done: false },
  { id: 'c8', label: 'Headlight / indicator / horn test', done: false },
  { id: 'c9', label: 'Tyre pressure & tread check', done: false },
  { id: 'c10', label: 'Final road test', done: false },
];

const evChecklist = () => [
  { id: 'c1', label: 'Battery health & state of charge', done: false },
  { id: 'c2', label: 'Motor & controller diagnostics', done: false },
  { id: 'c3', label: 'Charging port & cable inspection', done: false },
  { id: 'c4', label: 'Brake system check', done: false },
  { id: 'c5', label: 'Firmware / BMS status', done: false },
  { id: 'c6', label: 'Wiring harness inspection', done: false },
  { id: 'c7', label: 'Tyre & suspension check', done: false },
  { id: 'c8', label: 'Final road test', done: false },
];

export const initialJobs: Job[] = [
  {
    id: 'j-1',
    code: 'DBS-48213',
    status: 'available',
    serviceName: 'General Service (up to 125cc)',
    category: 'General',
    basePrice: 1225,
    inspectionPoints: 40,
    estimatedDurationMin: 60,
    scheduledSlot: 'Today, 11:00 AM – 12:00 PM',
    customerName: 'Anjali Mehta',
    vehicle: 'Honda Activa 6G',
    address: '4th Block, Koramangala, Bengaluru',
    distanceKm: 2.4,
    checklist: generalChecklist(),
    additionalIssues: [],
    beforePhotoTaken: false,
    afterPhotoTaken: false,
    customerConfirmed: false,
  },
  {
    id: 'j-2',
    code: 'DBS-48227',
    status: 'available',
    serviceName: 'Electric Scooter Advanced Service',
    category: 'EV',
    basePrice: 1299,
    inspectionPoints: 25,
    estimatedDurationMin: 60,
    scheduledSlot: 'Today, 1:30 PM – 2:30 PM',
    customerName: 'Rahul Nair',
    vehicle: 'Ather 450X',
    address: 'HSR Layout Sector 2, Bengaluru',
    distanceKm: 5.1,
    checklist: evChecklist(),
    additionalIssues: [],
    beforePhotoTaken: false,
    afterPhotoTaken: false,
    customerConfirmed: false,
  },
  {
    id: 'j-3',
    code: 'DBS-48190',
    status: 'accepted',
    serviceName: 'Royal Enfield Special (350–400cc)',
    category: 'Brand-specific',
    basePrice: 2999,
    inspectionPoints: 60,
    estimatedDurationMin: 90,
    scheduledSlot: 'Today, 3:00 PM – 4:30 PM',
    customerName: 'Vikram Singh',
    vehicle: 'Royal Enfield Classic 350',
    address: 'Indiranagar 100ft Road, Bengaluru',
    distanceKm: 3.8,
    checklist: generalChecklist(),
    additionalIssues: [],
    beforePhotoTaken: false,
    afterPhotoTaken: false,
    customerConfirmed: false,
  },
];

export const earnings: EarningEntry[] = [
  { id: 'e1', jobCode: 'DBS-48041', service: 'General Service (up to 110cc)', amount: 640, date: '16 Jul 2026', status: 'paid' },
  { id: 'e2', jobCode: 'DBS-48067', service: 'Wiring Check & Diagnosis', amount: 255, date: '16 Jul 2026', status: 'paid' },
  { id: 'e3', jobCode: 'DBS-48102', service: 'Electric Bike Basic Service', amount: 640, date: '15 Jul 2026', status: 'paid' },
  { id: 'e4', jobCode: 'DBS-48155', service: 'Royal Enfield Special (350–400cc)', amount: 1920, date: '15 Jul 2026', status: 'pending' },
  { id: 'e5', jobCode: 'DBS-48168', service: 'Battery Jump Start / Replacement', amount: 320, date: '14 Jul 2026', status: 'pending' },
];

export const trainingModules: TrainingModule[] = [
  {
    id: 't1',
    title: 'Doorstep Service Standards',
    description: 'Grooming, customer etiquette and the 60-minute turnaround playbook.',
    durationMin: 25,
    progress: 100,
    certified: true,
    expiresOn: '12 Feb 2027',
  },
  {
    id: 't2',
    title: 'EV Safety & High-Voltage Handling',
    description: 'Battery, BMS and motor diagnostics for electric two-wheelers.',
    durationMin: 40,
    progress: 60,
    certified: false,
  },
  {
    id: 't3',
    title: 'Transparent Pricing & Upsell Approval',
    description: 'How to log extra issues and get customer approval before billing.',
    durationMin: 15,
    progress: 100,
    certified: true,
    expiresOn: '30 Sep 2026',
  },
  {
    id: 't4',
    title: 'Royal Enfield Specialist Certification',
    description: 'Servicing the 350cc–650cc twin platform to brand spec.',
    durationMin: 55,
    progress: 20,
    certified: false,
  },
];

/** Suggestions surfaced when a mechanic logs an extra issue found on inspection. */
export const commonExtraIssues: { title: string; price: number }[] = [
  { title: 'Brake pad replacement (pair)', price: 450 },
  { title: 'Clutch cable replacement', price: 250 },
  { title: 'Chain sprocket kit', price: 1200 },
  { title: 'Battery replacement', price: 1800 },
  { title: 'Front fork oil seal', price: 600 },
  { title: 'Air filter replacement', price: 350 },
];
