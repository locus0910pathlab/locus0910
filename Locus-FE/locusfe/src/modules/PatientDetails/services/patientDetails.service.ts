import api from '../../../services/api';
import { Patient, Visit, VisitTest } from '../../../types/common.types';
import { UpdateTestStatusPayload } from '../types/patientDetails.types';

export const patientDetailsService = {
  async getPatientDetails(patientId: number | string): Promise<{ patient: Patient; visits: Visit[] }> {
    const [patient, visits] = await Promise.all([
      api.get<Patient>(`/patients/${patientId}`),
      api.get<Visit[]>(`/patients/${patientId}/visits`).catch(() =>
        api.get<Visit[]>('/visits/', { patient_id: patientId }).catch(() => [])
      ),
    ]);

    return { patient, visits };
  },

  async updateTestResult(
    visitId: number,
    visitTestId: number,
    payload: UpdateTestStatusPayload
  ): Promise<VisitTest> {
    return api.put<VisitTest>(`/visits/${visitId}/tests/${visitTestId}`, payload);
  },

  async createVisitOrder(patientId: number, testIds: number[], notes?: string): Promise<Visit> {
    return api.post<Visit>('/visits/', {
      patient_id: patientId,
      test_ids: testIds,
      notes: notes || 'Follow-up laboratory panel order',
    });
  },
};

export default patientDetailsService;
