import { Patient } from '../../../types/common.types';

export type PatientSortOption =
  | 'default'
  | 'name_asc'
  | 'name_desc'
  | 'date_added_desc'
  | 'date_added_asc'
  | 'date_modified';

export interface PatientFiltersState {
  search: string;
  gender: string;
  sortBy: PatientSortOption;
}

export interface PatientsState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  filters: PatientFiltersState;
}
