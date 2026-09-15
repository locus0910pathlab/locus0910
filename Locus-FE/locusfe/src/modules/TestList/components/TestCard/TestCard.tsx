import React from 'react';
import { Clock } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestCard.module.css';

export interface TestCardProps {
  test: LabTest;
}

export const TestCard: React.FC<TestCardProps> = ({ test }) => {
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
        <div className={styles.price}>₹{Number(test.price).toFixed(2)}</div>
        <div className={styles.meta}>
          <Clock size={13} />
          <span>{test.turnaround_hours || 24}h turnaround</span>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
