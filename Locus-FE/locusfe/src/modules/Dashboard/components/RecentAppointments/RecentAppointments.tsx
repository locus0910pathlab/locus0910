import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { CalendarIcon } from '../../../../components/CalendarIcon/CalendarIcon';
import { Visit } from '../../../../types/common.types';
import { AppointmentDetailModal } from '../../../Appointments/components/AppointmentDetailModal/AppointmentDetailModal';
import styles from './RecentAppointments.module.css';

export interface RecentAppointmentsProps {
  appointments: Visit[];
}

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Calendar size={18} color="var(--primary-600)" />
          <span>Latest Appointments</span>
        </h3>
        <Link to="/appointments" className={styles.viewAll}>
          <span>View All</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className={styles.empty}>
          <span>No scheduled appointments yet.</span>
          <Link
            to="/appointments/new"
            style={{
              color: 'var(--primary-600)',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              marginTop: '4px',
            }}
          >
            + Create First Appointment
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {appointments.map((apt) => {
            const patient = apt.patient;
            const initials = patient?.first_name
              ? patient.first_name[0].toUpperCase()
              : 'P';

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
              <div
                key={apt.id}
                className={styles.item}
              >
                {/* 1. Patient Avatar, 1st Name & Patient ID */}
                <div className={styles.patientMeta}>
                  <div className={styles.avatar}>{initials}</div>
                  <div>
                    <div className={styles.name}>
                      {patient ? patient.first_name : `Patient #${apt.patient_id}`}
                    </div>
                    <div className={styles.patientId}>
                      Patient ID: #{apt.patient_id}
                    </div>
                  </div>
                </div>

                {/* 2. Appointment Date & Time */}
                <div className={styles.dateSection}>
                  <div className={styles.date}>
                    <CalendarIcon size={14} />
                    <span>{formattedDate}</span>
                  </div>
                  <div className={styles.time}>
                    <Clock size={11} color="#f8bc25" />
                    <span>{formattedTime}</span>
                  </div>
                </div>

                {/* 3. Status Badge above Price & View Action */}
                <div className={styles.rightMeta}>
                  <div className={styles.statusAndAmount}>
                    {renderStatusBadge(apt.status)}
                    <div className={styles.amount}>
                      ₹{Number(apt.total_amount).toFixed(2)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    title="View Appointment Details"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVisit(apt);
                    }}
                  >
                    <Eye size={14} />
                    <span className={styles.actionText}>View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedVisit && (
        <AppointmentDetailModal
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
          onEdit={(visit) => {
            setSelectedVisit(null);
            navigate(`/appointments/edit/${visit.id}`);
          }}
        />
      )}
    </div>
  );
};

export default RecentAppointments;
