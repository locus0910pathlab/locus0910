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

      const isCurrentMonth = (dateStr?: string | null) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      };

      // Only count visits belonging to current month (refreshes on 1st date of each month)
      const currentMonthVisits = visits.filter((v) => {
        return (
          isCurrentMonth(v.visit_date) ||
          isCurrentMonth(v.created_at) ||
          (v.status === 'COMPLETED' && isCurrentMonth(v.updated_at))
        );
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

      // Test lookup map in case vt.test is not populated on tests_ordered
      const testMap = new Map<number, LabTest>();
      tests.forEach((t) => testMap.set(t.id, t));

      // Calculate Total Profit / Month metrics for COMPLETED appointments
      let patientIncome = 0;
      let outsourcedShare = 0;
      let discountGiven = 0;

      currentMonthVisits.forEach((v) => {
        if (v.status !== 'COMPLETED') return;

        let visitSubtotal = 0;
        let visitOutsourced = 0;

        if (v.tests_ordered && v.tests_ordered.length > 0) {
          v.tests_ordered.forEach((vt) => {
            const testObj = vt.test || (vt.test_id ? testMap.get(vt.test_id) : null);
            const price = Number(testObj?.price || 0);
            visitSubtotal += price;

            const b2b = Number(testObj?.b2b_price || 0);
            if ((testObj?.is_b2b || b2b > 0) && b2b > 0) {
              visitOutsourced += b2b;
            }
          });
        }

        if (visitSubtotal === 0) {
          visitSubtotal = Number(v.total_amount || 0);
        }

        let visitDiscount = 0;
        if (v.notes) {
          const match = v.notes.match(/Discount:\s*(?:₹|Rs\.?)?\s*([\d.]+)(%)?/i);
          if (match) {
            const isPercent = Boolean(match[2]);
            const val = parseFloat(match[1]);
            if (!isNaN(val) && val > 0) {
              visitDiscount = isPercent && visitSubtotal ? (visitSubtotal * val) / 100 : val;
            }
          }
        }
        if (!visitDiscount && visitSubtotal > Number(v.total_amount)) {
          visitDiscount = visitSubtotal - Number(v.total_amount);
        }

        patientIncome += visitSubtotal;
        outsourcedShare += visitOutsourced;
        discountGiven += visitDiscount;
      });

      const totalProfit = patientIncome - outsourcedShare - discountGiven;

      return {
        stats: {
          totalPatients,
          activeTests,
          totalVisits,
          pendingResults,
          revenue,
          profitStats: {
            patientIncome,
            outsourcedShare,
            discountGiven,
            totalProfit,
          },
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
          profitStats: {
            patientIncome: 0,
            outsourcedShare: 0,
            discountGiven: 0,
            totalProfit: 0,
          },
        },
        recentPatients: [],
        recentVisits: [],
        popularTests: [],
      };
    }
  },
};

export default dashboardService;
