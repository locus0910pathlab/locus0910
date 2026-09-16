import React from 'react';
import { Eye, Trash2, Phone } from 'lucide-react';
import { Visit } from '../../../../types/common.types';
import styles from './AppointmentTable.module.css';

export interface AppointmentTableProps {
  appointments: Visit[];
  onView: (visit: Visit) => void;
  onDelete?: (id: number) => void;
  onScheduleClick?: () => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onView,
  onDelete,
  onScheduleClick,
}) => {
  if (appointments.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No Appointments Scheduled</div>
          <div className={styles.emptySub}>
            There are currently no appointments matching your filter criteria. Click "Create Appointment" on top to schedule a new visit.
          </div>
          {onScheduleClick && (
            <button
              onClick={onScheduleClick}
              style={{
                marginTop: '10px',
                padding: '8px 18px',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              + Create Appointment
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className={`${styles.statusBadge} ${styles.statusScheduled}`}>
            <span className={styles.statusDot} />
            Scheduled
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className={`${styles.statusBadge} ${styles.statusInProgress}`}>
            <span className={styles.statusDot} />
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            <span className={styles.statusDot} />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>
            <span className={styles.statusDot} />
            Cancelled
          </span>
        );
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.apptCol} ${styles.desktopOnly}`}>Appt #</th>
            <th className={styles.patientCol}>Patient</th>
            <th className={`${styles.dateCol} ${styles.centerTh} ${styles.desktopOnly}`}>Date & Time</th>
            <th className={`${styles.statusCol} ${styles.centerTh}`}>Status</th>
            <th className={`${styles.amountCol} ${styles.centerTh} ${styles.desktopOnly}`}>Amount</th>
            <th className={`${styles.actionsCol} ${styles.centerTh}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => {
            const patient = apt.patient;
            const initials = patient
              ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase()
              : 'PT';

            const dateObj = new Date(apt.visit_date);
            const formattedDate = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—';

            const formattedTime = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '10:00 AM';

            return (
              <tr key={apt.id} className={styles.row}>
                {/* 1. Appt # (Desktop only) */}
                <td className={`${styles.apptCol} ${styles.desktopOnly}`}>
                  <span className={styles.aptIdBadge}>#{apt.id}</span>
                </td>

                {/* 2. Patient */}
                <td className={styles.patientCol}>
                  <div className={styles.patientCell}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <div className={styles.patientName}>
                        {patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${apt.patient_id}`}
                      </div>
                      <div className={styles.subMeta}>
                        {patient?.phone ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={11} /> {patient.phone}
                          </span>
                        ) : (
                          `ID: #${apt.patient_id}`
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 3. Date & Time (Centered, Desktop only) */}
                <td className={`${styles.dateCol} ${styles.centerTd} ${styles.desktopOnly}`}>
                  <div className={styles.dateTimeCell}>
                    <div className={styles.dateText}>{formattedDate}</div>
                    <div className={styles.timeText}>{formattedTime}</div>
                  </div>
                </td>

                {/* 4. Status (Centered) */}
                <td className={`${styles.statusCol} ${styles.centerTd}`}>
                  {renderStatusBadge(apt.status)}
                </td>

                {/* 5. Amount (Centered, Desktop only) */}
                <td className={`${styles.amountCol} ${styles.centerTd} ${styles.desktopOnly}`}>
                  <span className={styles.amount}>₹{Number(apt.total_amount).toFixed(2)}</span>
                </td>

                {/* 6. Actions (Centered on desktop, right-aligned on mobile) */}
                <td className={`${styles.actionsCol} ${styles.centerTd}`}>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewBtn}
                      title="View Appointment Details"
                      onClick={() => onView(apt)}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {onDelete && (
                      <button
                        className={styles.deleteBtn}
                        title="Delete / Cancel Appointment"
                        onClick={() => onDelete(apt.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
