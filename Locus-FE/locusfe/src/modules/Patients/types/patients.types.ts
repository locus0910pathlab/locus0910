import { Patient } from '../../../types/common.types';

export interface PatientFiltersState {
  search: string;
  gender: string;
}

export interface PatientsState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  filters: PatientFiltersState;
}
