import { Patient, LabTest, Visit } from '../../../types/common.types';

export interface MonthProfitStats {
  patientIncome: number;
  outsourcedShare: number;
  discountGiven: number;
  totalProfit: number;
}

export interface DashboardStats {
  totalPatients: number;
  activeTests: number;
  totalVisits: number;
  pendingResults: number;
  revenue: number;
  profitStats?: MonthProfitStats;
}

export interface DashboardData {
  stats: DashboardStats;
  recentPatients: Patient[];
  recentVisits: Visit[];
  popularTests: LabTest[];
}

