export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type VisitStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TestStatus = 'PENDING' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  residential_address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  clinical_notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface LabTest {
  id: number;
  code: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price: number;
  turnaround_hours?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitTest {
  id: number;
  visit_id: number;
  test_id: number;
  status: TestStatus;
  result_value?: string | null;
  notes?: string | null;
  created_at: string;
  test?: LabTest | null;
}

export interface Visit {
  id: number;
  patient_id: number;
  visit_date: string;
  status: VisitStatus;
  notes?: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  patient?: Patient | null;
  tests_ordered?: VisitTest[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  search?: string;
}
