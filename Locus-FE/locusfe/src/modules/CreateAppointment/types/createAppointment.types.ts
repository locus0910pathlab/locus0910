export interface AppointmentFormData {
  patient_id: number | null;
  appointment_date: string;
  appointment_time: string;
  appointment_type: 'Lab Visit' | 'Home Sample Collection' | 'Priority Diagnostic';
  selectedTestIds: number[];
  referring_doctor?: string;
  notes?: string;
  discount_type?: 'percent' | 'fixed';
  discount_value?: number;
  total_amount?: number;
}

export interface AppointmentFormErrors {
  patient_id?: string;
  appointment_date?: string;
  selectedTestIds?: string;
}
