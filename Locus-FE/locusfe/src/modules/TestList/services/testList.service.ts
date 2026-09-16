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
      is_b2b: Boolean(data.is_b2b),
      b2b_price: data.is_b2b && data.b2b_price !== '' && data.b2b_price !== undefined ? Number(data.b2b_price) : null,
      b2b_name: data.is_b2b && data.b2b_name ? data.b2b_name.trim() : null,
    };
    return api.post<LabTest>('/tests/', payload);
  },

  async updateTest(id: number, data: Partial<TestFormData>): Promise<LabTest> {
    const payload: any = { ...data };
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.turnaround_hours !== undefined) payload.turnaround_hours = Number(payload.turnaround_hours);
    if (payload.is_b2b !== undefined) payload.is_b2b = Boolean(payload.is_b2b);
    if (payload.b2b_price !== undefined) {
      payload.b2b_price = payload.is_b2b && payload.b2b_price !== '' && payload.b2b_price !== null ? Number(payload.b2b_price) : null;
    }
    if (payload.b2b_name !== undefined) {
      payload.b2b_name = payload.is_b2b && payload.b2b_name ? payload.b2b_name.trim() : null;
    }
    return api.put<LabTest>(`/tests/${id}`, payload);
  },

  async deleteTest(id: number): Promise<void> {
    return api.delete<void>(`/tests/${id}`);
  },
};

export default testListService;
