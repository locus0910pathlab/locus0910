import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FlaskConical, CalendarCheck, Clock, PlusCircle, CalendarPlus } from 'lucide-react';
import { StatsCard } from './components/StatsCard/StatsCard';
import { RecentAppointments } from './components/RecentAppointments/RecentAppointments';
import { TestSummary } from './components/TestSummary/TestSummary';
import { Button } from '../../components/Button/Button';
import dashboardService from './services/dashboard.service';
import { DashboardData } from './types/dashboard.types';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dashboardService.getDashboardData().then((res) => {
      if (mounted) {
        setData(res);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currentMonthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date()).toUpperCase();

  return (
    <div className={styles.dashboard}>
      <div className={styles.quickActions}>
        <div className={styles.quickActionText}>
          <h2>Clinical Laboratory Command Center</h2>
          <p>Register new incoming patients, order diagnostic panels, and track test progress in real-time.</p>
        </div>
        <div className={styles.actionButtons}>
          <Button
            variant="secondary"
            leftIcon={<PlusCircle size={17} />}
            onClick={() => navigate('/patients/new')}
          >
            Register Patient
          </Button>
          <Button
            variant="primary"
            leftIcon={<CalendarPlus size={17} />}
            onClick={() => navigate('/appointments/new')}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Patients"
          value={isLoading ? '...' : (data?.stats.totalPatients ?? 0)}
          subtext="Registered in records"
          icon={<Users size={22} />}
          color="blue"
        />
        <StatsCard
          title="Active Lab Tests"
          value={isLoading ? '...' : (data?.stats.activeTests ?? 0)}
          subtext="Available for ordering"
          icon={<FlaskConical size={22} />}
          color="emerald"
        />
        <StatsCard
          title="Total Visits / Month"
          value={isLoading ? '...' : (data?.stats.totalVisits ?? 0)}
          subtext="Clinical orders logged"
          icon={<CalendarCheck size={22} />}
          color="violet"
          badge={currentMonthShort}
        />
        <StatsCard
          title="Pending Diagnostics"
          value={isLoading ? '...' : (data?.stats.pendingResults ?? 0)}
          subtext="Specimens being processed"
          icon={<Clock size={22} />}
          color="amber"
        />
      </div>

      <div className={styles.contentGrid}>
        <RecentAppointments appointments={data?.recentVisits || []} />
        <TestSummary tests={data?.popularTests || []} />
      </div>
    </div>
  );
};

export default Dashboard;
