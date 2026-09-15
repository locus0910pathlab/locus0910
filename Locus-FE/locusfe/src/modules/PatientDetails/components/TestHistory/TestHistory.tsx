import React from 'react';
import { VisitTest, TestStatus } from '../../../../types/common.types';
import styles from './TestHistory.module.css';

export interface FlatTestRecord {
  visitId: number;
  visitDate: string;
  testRecord: VisitTest;
}

export interface TestHistoryProps {
  testRecords: FlatTestRecord[];
  onUpdateResult: (visitId: number, testId: number, status: TestStatus, currentVal?: string) => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({
  testRecords,
  onUpdateResult,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Prescribed Diagnostic Tests & Results</h3>
      </div>

      {testRecords.length === 0 ? (
        <div className={styles.empty}>No laboratory tests have been ordered for this patient yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order / Visit</th>
              <th>Test Code</th>
              <th>Test Name</th>
              <th>Status</th>
              <th>Result Value</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testRecords.map(({ visitId, testRecord }) => {
              const test = testRecord.test;
              const statusClass = `badge-${testRecord.status.toLowerCase()}`;
              return (
                <tr key={testRecord.id}>
                  <td>Order #{visitId}</td>
                  <td>
                    <strong>{test?.code || '—'}</strong>
                  </td>
                  <td>{test?.name || 'Diagnostic test'}</td>
                  <td>
                    <span className={`badge ${statusClass}`}>{testRecord.status}</span>
                  </td>
                  <td>
                    <span className={styles.resultValue}>
                      {testRecord.result_value || 'Pending analysis'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={styles.editBtn}
                      onClick={() =>
                        onUpdateResult(
                          visitId,
                          testRecord.id,
                          testRecord.status,
                          testRecord.result_value || ''
                        )
                      }
                    >
                      Update Result
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestHistory;
