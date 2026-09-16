import api from '../../../services/api';
import { Patient, LabTest, Visit } from '../../../types/common.types';
import { DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [patients, tests, visits] = await Promise.all([
        api.get<Patient[]>('/patients/', { limit: 100 }).catch(() => []),
        api.get<LabTest[]>('/tests/', { limit: 100 }).catch(() => []),
        api.get<Visit[]>('/visits/', { limit: 500 }).catch(() => []),
      ]);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Only count visits belonging to current month (refreshes on 1st date of each month)
      const currentMonthVisits = visits.filter((v) => {
        const rawDate = v.visit_date || v.created_at;
        if (!rawDate) return false;
        const d = new Date(rawDate);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });

      const totalPatients = patients.length;
      const activeTests = tests.filter((t) => t.is_active).length;
      const totalVisits = currentMonthVisits.length;

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
        popularTests: tests,
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
