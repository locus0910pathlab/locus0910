import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestSummary.module.css';

export interface TestSummaryProps {
  tests: LabTest[];
}

export const TestSummary: React.FC<TestSummaryProps> = ({ tests }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Laboratory Test Catalog</h3>
        <Link to="/tests" className={styles.viewAll}>
          <span>View All Tests</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className={styles.empty}>No tests configured yet.</div>
      ) : (
        <div className={styles.list}>
          {tests.map((test) => (
            <div key={test.id} className={styles.item}>
              <div>
                <span className={styles.testCode}>{test.code}</span>
                <div className={styles.testName}>{test.name}</div>
              </div>
              <div className={styles.testPrice}>
                ${Number(test.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestSummary;
