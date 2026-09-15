export interface PatientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact: string;
  selectedTestIds: number[];
  notes: string;
}

export interface PatientFormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}
