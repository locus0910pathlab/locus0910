import api from '../../../services/api';
import { Patient, LabTest, Visit } from '../../../types/common.types';
import { AppointmentFormData } from '../types/createAppointment.types';

export const createAppointmentService = {
  async searchPatients(query?: string): Promise<Patient[]> {
    const params: Record<string, any> = { limit: 50 };
    if (query && query.trim()) {
      params.search = query.trim();
    }
    return api.get<Patient[]>('/patients/', params);
  },

  async getAvailableTests(): Promise<LabTest[]> {
    return api.get<LabTest[]>('/tests/', { active_only: true });
  },

  async submitAppointment(data: AppointmentFormData): Promise<Visit> {
    if (!data.patient_id) {
      throw new Error('Please select a valid patient.');
    }

    // Combine date and time into ISO timestamp
    const dateTimeStr = data.appointment_date && data.appointment_time
      ? `${data.appointment_date}T${data.appointment_time}:00`
      : data.appointment_date
      ? `${data.appointment_date}T09:00:00`
      : new Date().toISOString();

    const formattedNotes = [
      `Type: ${data.appointment_type}`,
      data.referring_doctor ? `Referring Doctor: ${data.referring_doctor}` : null,
      data.notes ? `Instructions: ${data.notes}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    return api.post<Visit>('/visits/', {
      patient_id: data.patient_id,
      test_ids: data.selectedTestIds,
      visit_date: dateTimeStr,
      notes: formattedNotes,
    });
  },
};

export default createAppointmentService;
