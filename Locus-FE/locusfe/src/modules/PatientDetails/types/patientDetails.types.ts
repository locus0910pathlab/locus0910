import { Patient, Visit } from '../../../types/common.types';

export interface PatientDetailsData {
  patient: Patient;
  visits: Visit[];
}

export interface UpdateTestStatusPayload {
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  result_value?: string;
  notes?: string;
}
