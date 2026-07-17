/**
 * Domain types for the Bike Mistri (mechanic/partner) app.
 * These mirror the Mechanic/Partner requirements (FR-17 … FR-24) in the BRD.
 */

export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'rejected';

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  city: string;
  rating: number;
  jobsCompleted: number;
  verification: VerificationStatus;
  skills: string[];
  serviceRadiusKm: number;
  online: boolean;
  avatarInitials: string;
}

export type ServiceCategory =
  | 'EV'
  | 'General'
  | 'Premium'
  | 'Brand-specific'
  | 'Special Services';

export type JobStatus =
  | 'available' // offered to the mechanic, not yet accepted
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'awaiting_approval' // extra work proposed, waiting on customer
  | 'completed'
  | 'declined';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface AdditionalIssue {
  id: string;
  title: string;
  price: number; // in INR, excluding GST
  approved: 'pending' | 'approved' | 'rejected';
}

export interface Job {
  id: string;
  code: string; // human friendly order code
  status: JobStatus;
  serviceName: string;
  category: ServiceCategory;
  basePrice: number; // INR excluding GST
  inspectionPoints: number;
  estimatedDurationMin: number;
  scheduledSlot: string;
  customerName: string;
  vehicle: string;
  address: string;
  distanceKm: number;
  checklist: ChecklistItem[];
  additionalIssues: AdditionalIssue[];
  beforePhotoTaken: boolean;
  afterPhotoTaken: boolean;
  customerConfirmed: boolean;
}

export interface EarningEntry {
  id: string;
  jobCode: string;
  service: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  progress: number; // 0..100
  certified: boolean;
  expiresOn?: string;
}
