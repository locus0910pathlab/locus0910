import api from '../../../services/api';
import { Patient, LabTest, Visit } from '../../../types/common.types';
import { PatientFormData } from '../types/addPatient.types';

export const addPatientService = {
  async getAvailableTests(): Promise<LabTest[]> {
    return api.get<LabTest[]>('/tests/', { active_only: true });
  },

  async registerPatientWithVisit(formData: PatientFormData): Promise<{ patient: Patient; visit?: Visit }> {
    const patientPayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email || null,
      phone: formData.phone || null,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      residential_address: formData.residential_address || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      clinical_notes: formData.clinical_notes || null,
    };

    const patient = await api.post<Patient>('/patients/', patientPayload);

    let visit: Visit | undefined;
    if (formData.selectedTestIds && formData.selectedTestIds.length > 0) {
      try {
        visit = await api.post<Visit>('/visits/', {
          patient_id: patient.id,
          test_ids: formData.selectedTestIds,
          notes: formData.notes || 'Initial registration test order',
        });
      } catch (err) {
        console.warn('Patient created successfully, but error creating initial visit:', err);
      }
    }

    return { patient, visit };
  },
};

export default addPatientService;
