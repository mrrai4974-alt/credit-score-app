import React from 'react';

import { JobStatus } from '../types';
import { Badge } from './ui';

const LABELS: Record<JobStatus, { label: string; tone: any }> = {
  available: { label: 'New request', tone: 'brand' },
  accepted: { label: 'Accepted', tone: 'info' },
  en_route: { label: 'En route', tone: 'info' },
  arrived: { label: 'Arrived', tone: 'info' },
  in_progress: { label: 'In service', tone: 'warning' },
  awaiting_approval: { label: 'Awaiting approval', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  declined: { label: 'Declined', tone: 'danger' },
};

export const JobStatusPill: React.FC<{ status: JobStatus }> = ({ status }) => {
  const s = LABELS[status];
  return <Badge label={s.label} tone={s.tone} />;
};
