import React from 'react';
import { X, Calendar, Pencil } from 'lucide-react';
import { Visit } from '../../../../types/common.types';
import { Button } from '../../../../components/Button/Button';
import styles from './AppointmentDetailModal.module.css';

export interface AppointmentDetailModalProps {
  visit: Visit | null;
  onClose: () => void;
  onEdit?: (visit: Visit) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  visit,
  onClose,
  onEdit,
}) => {
  if (!visit) return null;

  const patient = visit.patient;
  const initials = patient
    ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase()
    : 'PT';

  const dateObj = new Date(visit.visit_date);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const formattedTime = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Calendar size={18} color="var(--primary-600)" />
            <span>Appointment #{visit.id}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Patient Details */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Patient Information</div>
            <div className={styles.patientCard}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>
                  {patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${visit.patient_id}`}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ID: #{visit.patient_id} • Gender: {patient?.gender || '—'} • Phone: {patient?.phone || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Status Grid */}
          <div className={styles.grid2}>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Scheduled Date</div>
              <div className={styles.infoValue}>{formattedDate}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Scheduled Time</div>
              <div className={styles.infoValue}>{formattedTime}</div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className={styles.grid2}>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Status</div>
              <div className={styles.infoValue}>{visit.status}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Total Price</div>
              <div className={styles.infoValue} style={{ color: 'var(--accent-emerald)' }}>
                ₹{Number(visit.total_amount).toFixed(2)}
              </div>
            </div>
          </div>

          {visit.notes && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Clinical & Dispatch Instructions</div>
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {visit.notes}
              </div>
            </div>
          )}

          {/* Prescribed Tests */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              Ordered Diagnostic Tests ({(visit.tests_ordered || []).length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(visit.tests_ordered || []).map((vt) => (
                <div key={vt.id} className={styles.testItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.testCode}>{vt.test?.code || `TEST-${vt.test_id}`}</span>
                    <span className={styles.testName}>{vt.test?.name || 'Diagnostic Panel'}</span>
                  </div>
                  <span className={styles.testPrice}>
                    ₹{Number(vt.test?.price || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.totalBar}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                Total Order Amount
              </span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent-emerald)' }}>
                ₹{Number(visit.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="cancel" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {onEdit && visit.status === 'SCHEDULED' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Pencil size={14} />}
              onClick={() => onEdit(visit)}
            >
              Edit Appointment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
