import api from '../../../services/api';
import { Patient, LabTest, Visit } from '../../../types/common.types';
import { DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [patients, tests, visits] = await Promise.all([
        api.get<Patient[]>('/patients/', { limit: 10 }).catch(() => []),
        api.get<LabTest[]>('/tests/', { limit: 50 }).catch(() => []),
        api.get<Visit[]>('/visits/', { limit: 20 }).catch(() => []),
      ]);

      const totalPatients = patients.length;
      const activeTests = tests.filter((t) => t.is_active).length;
      const totalVisits = visits.length;

      let pendingResults = 0;
      let revenue = 0;

      visits.forEach((v) => {
        revenue += v.total_amount || 0;
        if (v.tests_ordered) {
          v.tests_ordered.forEach((t) => {
            if (t.status === 'PENDING' || t.status === 'SAMPLE_COLLECTED' || t.status === 'IN_PROGRESS') {
              pendingResults++;
            }
          });
        }
      });

      return {
        stats: {
          totalPatients,
          activeTests,
          totalVisits,
          pendingResults,
          revenue,
        },
        recentPatients: patients.slice(0, 5),
        recentVisits: visits.slice(0, 5),
        popularTests: tests.slice(0, 5),
      };
    } catch (err) {
      console.warn('Using default dashboard metrics due to API connection state:', err);
      return {
        stats: {
          totalPatients: 0,
          activeTests: 0,
          totalVisits: 0,
          pendingResults: 0,
          revenue: 0,
        },
        recentPatients: [],
        recentVisits: [],
        popularTests: [],
      };
    }
  },
};

export default dashboardService;
