export interface PatientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age?: string;
  date_of_birth: string;
  gender: string;
  residential_address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  clinical_notes: string;
  selectedTestIds: number[];
  notes: string;
}

export interface PatientFormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  residential_address?: string;
}
