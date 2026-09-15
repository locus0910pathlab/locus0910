import { LabTest } from '../../../types/common.types';

export interface TestFormData {
  code: string;
  name: string;
  category: string;
  description: string;
  price: number | string;
  turnaround_hours: number | string;
  is_active: boolean;
}

export interface TestListFilters {
  search: string;
  category: string;
  viewMode: 'table' | 'cards';
}
