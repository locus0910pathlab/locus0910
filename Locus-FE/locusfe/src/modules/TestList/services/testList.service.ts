import api from '../../../services/api';
import { LabTest } from '../../../types/common.types';
import { TestFormData } from '../types/testList.types';

export const testListService = {
  async getTests(category?: string): Promise<LabTest[]> {
    const params: Record<string, any> = { limit: 100 };
    if (category) {
      params.category = category;
    }
    return api.get<LabTest[]>('/tests/', params);
  },

  async createTest(data: TestFormData): Promise<LabTest> {
    const payload = {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      category: data.category.trim() || null,
      description: data.description.trim() || null,
      price: Number(data.price) || 0,
      turnaround_hours: Number(data.turnaround_hours) || 24,
      is_active: data.is_active,
    };
    return api.post<LabTest>('/tests/', payload);
  },

  async updateTest(id: number, data: Partial<TestFormData>): Promise<LabTest> {
    const payload: any = { ...data };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.turnaround_hours !== undefined) payload.turnaround_hours = Number(payload.turnaround_hours);
    return api.put<LabTest>(`/tests/${id}`, payload);
  },

  async deleteTest(id: number): Promise<void> {
    return api.delete<void>(`/tests/${id}`);
  },
};

export default testListService;
