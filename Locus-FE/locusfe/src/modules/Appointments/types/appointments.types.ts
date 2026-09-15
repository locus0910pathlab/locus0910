export type AppointmentSortOption =
  | 'date_desc'
  | 'date_asc'
  | 'patient_asc'
  | 'patient_desc'
  | 'amount_desc'
  | 'amount_asc';

export type AppointmentStatusFilter = 'ALL' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
