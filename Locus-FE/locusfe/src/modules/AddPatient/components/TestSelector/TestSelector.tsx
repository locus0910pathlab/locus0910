import React from 'react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestSelector.module.css';

export interface TestSelectorProps {
  tests: LabTest[];
  selectedTestIds: number[];
  onToggleTest: (testId: number) => void;
}

export const TestSelector: React.FC<TestSelectorProps> = ({
  tests,
  selectedTestIds,
  onToggleTest,
}) => {
  const selectedTests = tests.filter((t) => selectedTestIds.includes(t.id));
  const totalPrice = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);

  return (
    <div className={styles.container}>
      <div>
        <h4 className={styles.title}>Order Lab Tests (Optional)</h4>
        <p className={styles.subtitle}>Select tests to immediately create an order visit for this patient.</p>
      </div>

      <div className={styles.testGrid}>
        {tests.map((test) => {
          const isSelected = selectedTestIds.includes(test.id);
          return (
            <div
              key={test.id}
              className={`${styles.testItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => onToggleTest(test.id)}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isSelected}
                onChange={() => {}} // Handled by container click
              />
              <div className={styles.testInfo}>
                <span className={styles.testName}>{test.name}</span>
                <div className={styles.testMeta}>
                  <span>{test.code}</span>
                  <span className={styles.price}>₹{Number(test.price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTestIds.length > 0 && (
        <div className={styles.summary}>
          <span className={styles.summaryCount}>
            {selectedTestIds.length} {selectedTestIds.length === 1 ? 'test' : 'tests'} selected
          </span>
          <span className={styles.summaryTotal}>
            Total: ₹{totalPrice.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TestSelector;
