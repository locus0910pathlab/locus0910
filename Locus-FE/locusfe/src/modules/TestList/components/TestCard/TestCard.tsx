import React from 'react';
import { Clock, Eye, Trash2 } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestCard.module.css';

export interface TestCardProps {
  test: LabTest;
  onEdit?: (test: LabTest) => void;
  onView?: (test: LabTest) => void;
  onDelete?: (id: number) => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, onEdit, onView, onDelete }) => {
  const handleView = onView || onEdit;

  return (
    <div className={styles.card}>
      <div>
        <div className={styles.header}>
          <div>
            <span className={styles.codeBadge}>{test.code}</span>
            <h4 className={styles.name}>{test.name}</h4>
          </div>
          <span className={styles.categoryTag}>{test.category || 'General'}</span>
        </div>

        {test.description && (
          <p className={styles.description}>{test.description}</p>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.priceMeta}>
          <div className={styles.price}>₹{Number(test.price).toFixed(2)}</div>
          <div className={styles.meta}>
            <Clock size={13} color="#f8bc25" />
            <span>{test.turnaround_hours || 24}h turnaround</span>
          </div>
        </div>

        <div className={styles.cardActions}>
          {handleView && (
            <button
              className={styles.viewBtn}
              title="View Test Details"
              onClick={() => handleView(test)}
            >
              <Eye size={14} />
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteBtn}
              title="Delete Test"
              onClick={() => {
                if (window.confirm(`Delete lab test "${test.name}"?`)) {
                  onDelete(test.id);
                }
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCard;
