import api from '../../../services/api';
import { Patient } from '../../../types/common.types';

export const patientsService = {
  async getPatients(search?: string): Promise<Patient[]> {
    const params: Record<string, any> = { limit: 100 };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    return api.get<Patient[]>('/patients/', params);
  },

  async getPatientById(id: number | string): Promise<Patient> {
    return api.get<Patient>(`/patients/${id}`);
  },

  async deletePatient(id: number | string): Promise<void> {
    return api.delete<void>(`/patients/${id}`);
  },
};

export default patientsService;
