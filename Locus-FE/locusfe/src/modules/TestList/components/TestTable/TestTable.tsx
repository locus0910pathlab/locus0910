import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestTable.module.css';

export interface TestTableProps {
  tests: LabTest[];
  onDelete?: (id: number) => void;
}

export const TestTable: React.FC<TestTableProps> = ({ tests, onDelete }) => {
  if (tests.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.empty}>No laboratory tests found.</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Test Code</th>
            <th>Name & Description</th>
            <th>Category</th>
            <th>Turnaround</th>
            <th>Price</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>
                <span className={styles.codeBadge}>{test.code}</span>
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>{test.name}</div>
                {test.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {test.description}
                  </div>
                )}
              </td>
              <td>
                <span className={styles.categoryTag}>{test.category || 'General'}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={14} color="var(--text-muted)" />
                  <span>{test.turnaround_hours || 24}h</span>
                </div>
              </td>
              <td>
                <span className={styles.price}>${Number(test.price).toFixed(2)}</span>
              </td>
              <td>
                <span className={styles.activeStatus}>
                  <span
                    className={
                      test.is_active ? styles.statusDotActive : styles.statusDotInactive
                    }
                  />
                  <span>{test.is_active ? 'Active' : 'Inactive'}</span>
                </span>
              </td>
              <td>
                <div className={styles.actions}>
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
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
