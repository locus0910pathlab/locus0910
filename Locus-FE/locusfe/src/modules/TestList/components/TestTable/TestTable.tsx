import React from 'react';
import { Trash2, Clock, Eye } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestTable.module.css';

export interface TestTableProps {
  tests: LabTest[];
  onEdit?: (test: LabTest) => void;
  onView?: (test: LabTest) => void;
  onDelete?: (id: number) => void;
}

export const TestTable: React.FC<TestTableProps> = ({ tests, onEdit, onView, onDelete }) => {
  const handleView = onView || onEdit;

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
            <th className={styles.desktopOnly}>Name & Description</th>
            <th className={styles.desktopOnly}>Category</th>
            <th className={styles.desktopOnly}>Turnaround</th>
            <th>Price</th>
            <th className={styles.desktopOnly}>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>
                <span className={styles.codeBadge}>{test.code}</span>
              </td>
              <td className={styles.desktopOnly}>
                <div style={{ fontWeight: 600 }}>{test.name}</div>
                {test.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {test.description}
                  </div>
                )}
              </td>
              <td className={styles.desktopOnly}>
                <span className={styles.categoryTag}>{test.category || 'General'}</span>
              </td>
              <td className={styles.desktopOnly}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={14} color="#f8bc25ff" />
                  <span>{test.turnaround_hours || 24}h</span>
                </div>
              </td>
              <td>
                <span className={styles.price}>₹{Number(test.price).toFixed(2)}</span>
              </td>
              <td className={styles.desktopOnly}>
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
                  {handleView && (
                    <button
                      className={styles.viewBtn}
                      title="View Test Details"
                      onClick={() => handleView(test)}
                    >
                      <Eye size={14} />
                      <span className={styles.actionText}>View</span>
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
                      <Trash2 size={15} />
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
