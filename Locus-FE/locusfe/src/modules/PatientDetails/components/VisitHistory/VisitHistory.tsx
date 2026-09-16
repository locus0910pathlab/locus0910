import React from 'react';
import { CalendarIcon } from '../../../../components/CalendarIcon/CalendarIcon';
import { Visit } from '../../../../types/common.types';
import styles from './VisitHistory.module.css';

export interface VisitHistoryProps {
  visits: Visit[];
}

export const VisitHistory: React.FC<VisitHistoryProps> = ({ visits }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Visit & Order History</h3>
      </div>

      {visits.length === 0 ? (
        <div className={styles.empty}>No clinical visits recorded for this patient yet.</div>
      ) : (
        <div className={styles.timeline}>
          {visits.map((visit) => {
            const statusClass = `badge-${visit.status.toLowerCase()}`;
            return (
              <div key={visit.id} className={styles.visitCard}>
                <div className={styles.visitHeader}>
                  <div className={styles.visitMeta}>
                    <span className={styles.visitId}>Order #{visit.id}</span>
                    <span className={`badge ${statusClass}`}>{visit.status}</span>
                  </div>
                  <div className={styles.amount}>
                    ₹{Number(visit.total_amount || 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <CalendarIcon size={14} />
                  <span className={styles.visitDate}>
                    {new Date(visit.visit_date || visit.created_at).toLocaleString()}
                  </span>
                </div>

                {visit.notes && <div className={styles.notes}>{visit.notes}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisitHistory;
