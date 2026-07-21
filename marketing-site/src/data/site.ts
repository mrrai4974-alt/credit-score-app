export const SITE = {
  name: 'Doorstep Bike Service',
  tagline: "India's Trusted Doorstep Bike Service",
  phone: '+91 80000 00000',
  email: 'care@doorstepbike.example',
  gstNote: 'All prices exclude 18% GST unless stated.',
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const stats = [
  { value: '100K+', label: 'Riders served' },
  { value: '500+', label: 'Expert mechanics' },
  { value: '60 min', label: 'Avg. turnaround' },
  { value: '50+', label: 'Cities' },
];

export type CategoryKey = 'ev' | 'general' | 'premium' | 'royal-enfield' | 'special';

export interface Category {
  key: CategoryKey;
  name: string;
  emoji: string;
  blurb: string;
}

export const categories: Category[] = [
  { key: 'general', name: 'General Service', emoji: '🛠️', blurb: 'Periodic service for petrol commuter bikes & scooters, by engine CC.' },
  { key: 'ev', name: 'EV Service', emoji: '⚡', blurb: 'Battery, motor and diagnostics care for electric two-wheelers.' },
  { key: 'premium', name: 'Premium & Performance', emoji: '🏁', blurb: 'Specialist service for 300cc+ performance motorcycles.' },
  { key: 'royal-enfield', name: 'Royal Enfield Special', emoji: '🏍️', blurb: 'Brand-spec service for the 350cc–650cc Royal Enfield platform.' },
  { key: 'special', name: 'Special Services', emoji: '🚨', blurb: 'On-demand: battery jump-start, wiring diagnosis, towing, inspection.' },
];

export interface Service {
  name: string;
  category: CategoryKey;
  price: number | null; // INR excl. GST
  durationMin: number;
  points: number;
  summary: string;
}

export const services: Service[] = [
  { name: 'Electric Bike/Scooter Inspection', category: 'ev', price: 599, durationMin: 30, points: 20, summary: 'Diagnostic health check for your electric two-wheeler.' },
  { name: 'Electric Bike Basic Service', category: 'ev', price: 999, durationMin: 45, points: 25, summary: 'Essential maintenance for daily EV commuters.' },
  { name: 'Electric Scooter Advanced Service', category: 'ev', price: 1299, durationMin: 60, points: 30, summary: 'Comprehensive service for electric scooters.' },
  { name: 'EV Belt Replacement Service', category: 'ev', price: 1599, durationMin: 45, points: 15, summary: 'Drive belt replacement with genuine parts.' },
  { name: 'General Service (up to 110cc)', category: 'general', price: 999, durationMin: 60, points: 40, summary: 'Complete periodic service for commuter bikes & scooters.' },
  { name: 'General Service (up to 125cc)', category: 'general', price: 1225, durationMin: 60, points: 40, summary: 'Periodic service tuned for 125cc engines.' },
  { name: 'General Service (up to 150cc)', category: 'general', price: 1499, durationMin: 60, points: 45, summary: 'Full service for 150cc motorcycles.' },
  { name: 'General Service (up to 200cc)', category: 'general', price: 1999, durationMin: 60, points: 50, summary: 'Comprehensive service for 200cc bikes.' },
  { name: 'Premium Performance Service (300–400cc)', category: 'premium', price: 4999, durationMin: 120, points: 90, summary: 'Specialist care for performance motorcycles.' },
  { name: 'Super Premium Service (450cc+)', category: 'premium', price: null, durationMin: 120, points: 120, summary: 'Bespoke service for super-premium machines.' },
  { name: 'Royal Enfield Special (350–400cc)', category: 'royal-enfield', price: 2999, durationMin: 90, points: 60, summary: 'Brand-spec service for Royal Enfield 350–400cc.' },
  { name: 'Royal Enfield Special (400–450cc)', category: 'royal-enfield', price: 3999, durationMin: 90, points: 70, summary: 'Service for the 400–450cc Royal Enfield range.' },
  { name: 'Royal Enfield Special (650cc Twin)', category: 'royal-enfield', price: 4999, durationMin: 120, points: 80, summary: 'Specialist service for the 650 Twin platform.' },
  { name: 'Battery Jump Start / Replacement', category: 'special', price: 499, durationMin: 30, points: 5, summary: 'On-demand battery help at your doorstep.' },
  { name: 'Wiring Check & Diagnosis', category: 'special', price: 399, durationMin: 45, points: 10, summary: 'Electrical fault diagnosis and wiring inspection.' },
  { name: 'Towing (up to 20 km)', category: 'special', price: null, durationMin: 60, points: 0, summary: 'Doorstep pickup and towing to the nearest hub.' },
  { name: 'Old Vehicle Inspection (pre-purchase)', category: 'special', price: 1199, durationMin: 30, points: 50, summary: 'Independent pre-purchase inspection report.' },
];

export const excludedServices = ['Puncture repair', 'Tyre replacement', 'Tube replacement', 'Wheel alignment'];

export interface Brand {
  name: string;
  type: 'Petrol' | 'EV' | 'Both';
  models: string[];
  popular?: boolean;
}

export const brands: Brand[] = [
  { name: 'Honda', type: 'Petrol', models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125', 'Dio'], popular: true },
  { name: 'Hero', type: 'Petrol', models: ['Splendor Plus', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'HF Deluxe'], popular: true },
  { name: 'TVS', type: 'Both', models: ['Jupiter', 'Apache RTR 160', 'Raider 125', 'iQube', 'Ntorq 125'], popular: true },
  { name: 'Bajaj', type: 'Petrol', models: ['Pulsar 150', 'Pulsar N160', 'Platina', 'Avenger 220', 'CT 100'], popular: true },
  { name: 'Royal Enfield', type: 'Petrol', models: ['Classic 350', 'Hunter 350', 'Meteor 350', 'Interceptor 650', 'Bullet 350'], popular: true },
  { name: 'Yamaha', type: 'Petrol', models: ['FZ-S', 'R15 V4', 'MT-15', 'Fascino', 'Ray ZR'] },
  { name: 'Ather', type: 'EV', models: ['450X', '450S', 'Rizta'], popular: true },
  { name: 'Ola Electric', type: 'EV', models: ['S1 Pro', 'S1 Air', 'S1 X'], popular: true },
  { name: 'Suzuki', type: 'Petrol', models: ['Access 125', 'Gixxer', 'Burgman Street', 'Avenis'] },
  { name: 'KTM', type: 'Petrol', models: ['Duke 200', 'Duke 390', 'RC 200'] },
];

export interface City {
  name: string;
  areas: string[];
  hubs: number;
}

export const cities: City[] = [
  { name: 'Bengaluru', areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Marathahalli'], hubs: 5 },
  { name: 'Mumbai', areas: ['Andheri', 'Bandra', 'Powai', 'Thane', 'Borivali', 'Chembur'], hubs: 4 },
  { name: 'Delhi NCR', areas: ['Gurgaon', 'Noida', 'Dwarka', 'Rohini', 'Saket', 'Faridabad'], hubs: 6 },
  { name: 'Hyderabad', areas: ['Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally'], hubs: 3 },
  { name: 'Pune', areas: ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner'], hubs: 2 },
  { name: 'Chennai', areas: ['Adyar', 'Velachery', 'T. Nagar', 'OMR'], hubs: 3 },
];

export interface Plan {
  name: string;
  price: number;
  tagline: string;
  perks: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  { name: 'Basic', price: 499, tagline: 'For the occasional rider', perks: ['5% off all services', 'Free pickup & drop', 'Priority callback'] },
  { name: 'Care+', price: 1299, tagline: 'Best value for daily commuters', perks: ['12% off all services', '2 free basic services / year', 'Priority slots', 'Extended 15-day warranty'], highlighted: true },
  { name: 'Pro', price: 2499, tagline: 'For premium & multi-bike owners', perks: ['18% off all services', '4 free services / year', 'Dedicated advisor', 'Covers up to 3 vehicles'] },
];

export const steps = [
  { n: 1, title: 'Book online', body: 'Pick your bike, service, date and time on the app or website.' },
  { n: 2, title: 'Doorstep visit', body: 'A certified mechanic arrives at your home or office.' },
  { n: 3, title: 'Expert service', body: 'Tiered inspection and service performed on the spot.' },
  { n: 4, title: 'Approve extras', body: 'Any extra issue is quoted — nothing proceeds without your approval.' },
  { n: 5, title: 'Pay & invoice', body: 'Pay online or on completion; get a GST invoice instantly.' },
  { n: 6, title: 'Rate & warranty', body: 'Rate your mechanic; your workmanship warranty begins.' },
];

export const comparison = {
  columns: ['Local garage', 'Authorised centre', 'Doorstep Bike Service'],
  rows: [
    { feature: 'Doorstep pickup & service', values: [false, false, true] },
    { feature: 'Upfront transparent pricing', values: [false, true, true] },
    { feature: 'Certified & verified mechanics', values: [false, true, true] },
    { feature: 'Workmanship warranty', values: [false, true, true] },
    { feature: '~60-minute turnaround', values: [true, false, true] },
    { feature: 'Genuine spares', values: [false, true, true] },
    { feature: 'Multi-brand (petrol + EV)', values: [true, false, true] },
  ],
};

export interface Testimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  { name: 'Anjali M.', city: 'Bengaluru', text: 'Mechanic arrived on time and serviced my Activa in under an hour at home. Fully transparent pricing.', rating: 5 },
  { name: 'Rahul N.', city: 'Bengaluru', text: 'Finally a service that understands EVs. Detailed diagnostics on my Ather and no upselling.', rating: 5 },
  { name: 'Vikram S.', city: 'Mumbai', text: 'Royal Enfield specialist knew exactly what my Classic 350 needed. Warranty gave me peace of mind.', rating: 4 },
  { name: 'Priya D.', city: 'Delhi NCR', text: 'Booked a wiring diagnosis at 9pm, sorted by morning. Super convenient.', rating: 5 },
];

export interface FAQ {
  q: string;
  a: string;
}

export const faqs: FAQ[] = [
  { q: 'How long does a doorstep service take?', a: 'Most services complete in about 60 minutes. Premium and brand-specific packages can take up to 120 minutes.' },
  { q: 'Is there a workmanship warranty?', a: 'Yes — every service carries a workmanship warranty; Care+ and Pro members get an extended 15-day warranty.' },
  { q: 'Are the prices final?', a: 'Published prices are upfront and exclude 18% GST. Any additional repair found is quoted and needs your explicit approval before work proceeds.' },
  { q: 'Which services are not offered at the doorstep?', a: 'Puncture repair, tyre/tube replacement and wheel alignment are excluded to protect service quality and turnaround.' },
  { q: 'Do you service electric two-wheelers?', a: 'Yes — we service 45+ brands across petrol and EV, from commuter scooters to premium motorcycles.' },
  { q: 'How do I pay?', a: 'Pay online (UPI, cards, wallets) or on completion. A GST-compliant digital invoice is issued every time.' },
];

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  tag: string;
}

export const blog: BlogPost[] = [
  {
    slug: 'when-to-service-your-bike',
    title: 'How often should you service your two-wheeler?',
    date: '10 Jul 2026',
    tag: 'Maintenance',
    excerpt: 'A simple guide to service intervals for commuter bikes, scooters and EVs.',
    body: [
      'Most commuter bikes benefit from a service every 3,000–5,000 km or every 3 months, whichever comes first.',
      'Electric two-wheelers need less frequent mechanical work but regular battery and brake checks matter.',
      'Riding in stop-go city traffic or monsoon conditions? Shorten the interval and get a quick health check.',
    ],
  },
  {
    slug: 'ev-service-signs',
    title: '5 signs your electric scooter needs a service',
    date: '2 Jul 2026',
    tag: 'EV',
    excerpt: 'Reduced range, slow charging and odd noises — what they mean and when to act.',
    body: [
      'Sudden drops in range are the most common early warning sign of a battery or BMS issue.',
      'Slow or interrupted charging can point to a charger, port or cable fault worth diagnosing early.',
      'Unusual motor noise, soft brakes or warning lights should never be ignored on an EV.',
    ],
  },
  {
    slug: 'transparent-pricing',
    title: 'Why transparent pricing matters in bike servicing',
    date: '24 Jun 2026',
    tag: 'Trust',
    excerpt: 'How upfront pricing and mandatory approval protect you from surprise bills.',
    body: [
      'Every service on our platform has a published, upfront price that includes a clear GST breakdown.',
      'If a mechanic finds an additional issue, you receive an itemised quote — and nothing proceeds without your approval.',
      'This "no hidden charges" model is the core of the doorstep experience.',
    ],
  },
];

export const media = [
  { outlet: 'TechCircle', date: 'Jun 2026', title: 'Doorstep Bike Service raises Series A to expand doorstep two-wheeler care' },
  { outlet: 'YourStory', date: 'May 2026', title: 'How a doorstep model is organising India’s two-wheeler after-market' },
  { outlet: 'Inc42', date: 'Apr 2026', title: 'The mechanics-on-demand playbook: inside a 50-city rollout' },
];
