import { Patient, LabTest, Visit } from '../../../types/common.types';

export interface DashboardStats {
  totalPatients: number;
  activeTests: number;
  totalVisits: number;
  pendingResults: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentPatients: Patient[];
  recentVisits: Visit[];
  popularTests: LabTest[];
}
