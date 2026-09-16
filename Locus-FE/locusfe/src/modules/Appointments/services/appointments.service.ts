import api from '../../../services/api';
import { Visit } from '../../../types/common.types';

export const appointmentsService = {
  async getAppointments(status?: string, patientId?: number): Promise<Visit[]> {
    const params: Record<string, any> = { limit: 100 };
    if (status && status !== 'ALL') {
      params.status = status;
    }
    if (patientId) {
      params.patient_id = patientId;
    }
    return api.get<Visit[]>('/visits/', params);
  },

  async getAppointmentById(id: number): Promise<Visit> {
    return api.get<Visit>(`/visits/${id}`);
  },

  async deleteAppointment(id: number): Promise<void> {
    return api.delete(`/visits/${id}`);
  },

  async updateAppointmentStatus(id: number, status: string): Promise<Visit> {
    const res = await api.put<Visit>(`/visits/${id}`, { status });
    if (typeof window !== 'undefined' && status === 'COMPLETED') {
      window.dispatchEvent(new CustomEvent('appointment-completed', { detail: res }));
    }
    return res;
  },

  async completeAppointment(
    id: number,
    data: { total_amount: number; notes: string }
  ): Promise<Visit> {
    const res = await api.put<Visit>(`/visits/${id}`, {
      status: 'COMPLETED',
      total_amount: data.total_amount,
      notes: data.notes,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('appointment-completed', { detail: res }));
    }
    return res;
  },
};

export default appointmentsService;
