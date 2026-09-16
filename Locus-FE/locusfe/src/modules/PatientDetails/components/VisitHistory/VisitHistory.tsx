import React from 'react';
import { CalendarIcon } from '../../../../components/CalendarIcon/CalendarIcon';
import { Visit } from '../../../../types/common.types';
import styles from './VisitHistory.module.css';

export interface VisitHistoryProps {
  visits: Visit[];
}

export const VisitHistory: React.FC<VisitHistoryProps> = ({ visits }) => {
  const sortedVisits = [...visits].sort((a, b) => {
    const getPriority = (status: string) => {
      if (status === 'SCHEDULED') return 0;
      if (status === 'IN_PROGRESS') return 1;
      if (status === 'COMPLETED') return 2;
      if (status === 'CANCELLED') return 3;
      return 4;
    };
    const diff = getPriority(a.status) - getPriority(b.status);
    if (diff !== 0) return diff;

    // For completed visits, sort by completion timestamp (updated_at) or id desc
    if (a.status === 'COMPLETED' && b.status === 'COMPLETED') {
      const timeA = new Date(a.updated_at || a.created_at || a.visit_date).getTime() || 0;
      const timeB = new Date(b.updated_at || b.created_at || b.visit_date).getTime() || 0;
      if (timeB !== timeA) return timeB - timeA;
      return b.id - a.id;
    }

    const timeA = new Date(a.visit_date || a.created_at).getTime() || 0;
    const timeB = new Date(b.visit_date || b.created_at).getTime() || 0;
    if (timeB !== timeA) return timeB - timeA;
    return b.id - a.id;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Visit & Order History</h3>
      </div>

      {sortedVisits.length === 0 ? (
        <div className={styles.empty}>No clinical visits recorded for this patient yet.</div>
      ) : (
        <div className={styles.timeline}>
          {sortedVisits.map((visit) => {
            const statusClass = `badge-${visit.status.toLowerCase()}`;
            const subtotal = (visit.tests_ordered || []).reduce(
              (acc, t) => acc + Number(t.test?.price || 0),
              0
            );

            // Extract discount info from notes or price difference
            let discountAmount = 0;
            let discountLabel = '';
            if (visit.notes) {
              const match = visit.notes.match(/Discount:\s*(?:₹|Rs\.?)?\s*([\d.]+)(%)?/i);
              if (match) {
                const isPercent = Boolean(match[2]);
                const val = parseFloat(match[1]);
                if (!isNaN(val) && val > 0) {
                  discountLabel = isPercent ? `${val}%` : `₹${val}`;
                  discountAmount = isPercent && subtotal ? (subtotal * val) / 100 : val;
                }
              }
            }
            if (!discountAmount && subtotal > Number(visit.total_amount)) {
              discountAmount = subtotal - Number(visit.total_amount);
              discountLabel = `₹${discountAmount.toFixed(2)}`;
            }

            return (
              <div key={visit.id} className={styles.visitCard}>
                <div className={styles.visitHeader}>
                  <div className={styles.visitMeta}>
                    <span className={styles.visitId}>Order #{visit.id}</span>
                    <span className={`badge ${statusClass}`}>{visit.status}</span>
                    <div className={styles.visitDateWrapper}>
                      <CalendarIcon size={14} />
                      <span className={styles.visitDate}>
                        {new Date(visit.visit_date || visit.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.amountContainer}>
                    <div className={styles.amount}>
                      ₹{Number(visit.total_amount || 0).toFixed(2)}
                    </div>
                    {discountAmount > 0 && (
                      <span className={styles.discountBadge}>
                        Discount: {discountLabel}
                      </span>
                    )}
                  </div>
                </div>

                {visit.notes && <div className={styles.notes}>{visit.notes}</div>}

                {visit.tests_ordered && visit.tests_ordered.length > 0 && (
                  <div className={styles.innerTableContainer}>
                    <table className={styles.innerTable}>
                      <thead>
                        <tr>
                          <th className={styles.colTestCode}>Test Code</th>
                          <th>Test Name</th>
                          <th style={{ textAlign: 'right' }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visit.tests_ordered.map((vt) => (
                          <tr key={vt.id}>
                            <td className={styles.colTestCode}>
                              <span className={styles.testCode}>
                                {vt.test?.code || `TEST-${vt.test_id}`}
                              </span>
                            </td>
                            <td className={styles.testName}>
                              {vt.test?.name || 'Diagnostic Panel'}
                            </td>
                            <td className={styles.testPrice}>
                              ₹{Number(vt.test?.price || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {discountAmount > 0 && (
                      <div className={styles.innerTableSummary}>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Subtotal:</span>
                          <span className={styles.summaryVal}>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.summaryItem} ${styles.summaryDiscount}`}>
                          <span className={styles.summaryLabel}>Discount ({discountLabel}):</span>
                          <span className={styles.summaryVal}>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.summaryItem} ${styles.summaryTotal}`}>
                          <span className={styles.summaryLabel}>Final Total:</span>
                          <span className={styles.summaryVal}>₹{Number(visit.total_amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisitHistory;
