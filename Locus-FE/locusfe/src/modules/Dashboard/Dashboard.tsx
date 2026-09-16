import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FlaskConical, CalendarCheck, TrendingUp, PlusCircle, CalendarPlus } from 'lucide-react';
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

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    dashboardService.getDashboardData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();

    const handleAppointmentCompleted = () => {
      loadData();
    };

    window.addEventListener('appointment-completed', handleAppointmentCompleted);
    return () => {
      window.removeEventListener('appointment-completed', handleAppointmentCompleted);
    };
  }, [loadData]);

  const currentMonthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date()).toUpperCase();

  return (
    <div className={styles.dashboard}>
      <div className={styles.quickActions}>
        <div className={styles.quickActionText}>
          <div className={styles.servicePill}>ALL TYPES OF BLOOD & URINE TESTS DONE HERE</div>
          <h2>Clinical Laboratory Command Center</h2>
          <p>Precision in Diagnosis, Excellence in Care • Register incoming patients, order diagnostic panels, and track reports.</p>
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
          title="Total Profit / Month"
          icon={<TrendingUp size={20} />}
          color="emerald"
          badge={currentMonthShort}
        >
          {isLoading ? (
            <div className={styles.profitLoading}>Calculating metrics...</div>
          ) : (
            <div className={styles.profitBreakdown}>
              <div className={styles.breakdownRow}>
                <span className={styles.patientIncomeLabel} title="Total Patient Income">
                  Total:
                </span>
                <span className={styles.patientIncomeValue}>
                  ₹
                  {(data?.stats.profitStats?.patientIncome ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.outsourcedLabel} title="B2B Cost Paid to Lab Partners">
                  - Outsourced share:
                </span>
                <span className={styles.outsourcedValue}>
                  - ₹
                  {(data?.stats.profitStats?.outsourcedShare ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.discountLabel} title="Total Discounts Given">
                  - Discount given:
                </span>
                <span className={styles.discountValue}>
                  - ₹
                  {(data?.stats.profitStats?.discountGiven ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className={styles.profitDivider} />
              <div className={styles.profitResultRow}>
                <span className={styles.profitResultLabel}>Profit:</span>
                <span className={styles.profitResultValue}>
                  ₹
                  {(data?.stats.profitStats?.totalProfit ?? 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </StatsCard>
      </div>

      <div className={styles.contentGrid}>
        <RecentAppointments
          appointments={data?.recentVisits || []}
          onRefresh={loadData}
        />
        <TestSummary tests={data?.popularTests || []} />
      </div>
    </div>
  );
};

export default Dashboard;
