import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Calendar, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Patient } from '../../../../types/common.types';
import styles from './PatientTable.module.css';

export interface PatientTableProps {
  patients: Patient[];
  onDelete?: (id: number) => void;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: string;
  onPageChange?: (newPage: number) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onDelete,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
}) => {
  const navigate = useNavigate();

  if (patients.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>No patients found matching the criteria.</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th className={`${styles.centerTh} ${styles.desktopOnly}`}>Gender</th>
            <th className={`${styles.centerTh} ${styles.desktopOnly}`}>Mobile Number</th>
            <th className={`${styles.centerTh} ${styles.desktopOnly}`}>Registration Date</th>
            <th className={styles.centerTh}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();
            const formattedDate = patient.created_at
              ? new Date(patient.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '—';

            return (
              <tr key={patient.id} className={styles.row}>
                {/* 1. Name */}
                <td>
                  <div className={styles.patientNameCell}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <div className={styles.name}>
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className={styles.subMeta}>
                        ID: #{patient.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Gender (Centered, Desktop only) */}
                <td className={`${styles.centerTd} ${styles.desktopOnly}`}>
                  <span style={{ fontWeight: 500 }}>{patient.gender || '—'}</span>
                </td>

                {/* 3. Mobile Number (Centered, Desktop only) */}
                <td className={`${styles.centerTd} ${styles.desktopOnly}`}>
                  <div className={styles.phoneCell}>
                    <Phone size={14} color="var(--text-muted)" />
                    <span>{patient.phone || '—'}</span>
                  </div>
                </td>

                {/* 4. Registration Date (Centered, Desktop only) */}
                <td className={`${styles.centerTd} ${styles.desktopOnly}`}>
                  <div className={styles.regDateCell}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* 5. Actions (Centered on desktop, right-aligned on mobile) */}
                <td className={styles.centerTd}>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewBtn}
                      title="View Full Patient Details"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {onDelete && (
                      <button
                        className={styles.deleteBtn}
                        title="Delete Patient"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`
                            )
                          ) {
                            onDelete(patient.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalCount !== undefined && totalCount > 0 && (
        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            {pageSize === 'all'
              ? `Showing all ${totalCount} patient records`
              : `Showing ${Math.min((currentPage! - 1) * parseInt(pageSize!, 10) + 1, totalCount)}–${Math.min(
                  currentPage! * parseInt(pageSize!, 10),
                  totalCount
                )} of ${totalCount} patients`}
          </div>

          {pageSize !== 'all' && totalPages! > 1 && (
            <div className={styles.paginationControls}>
              <button
                className={styles.pageBtn}
                onClick={() => onPageChange && onPageChange(currentPage! - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span className={styles.pageIndicator}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={styles.pageBtn}
                onClick={() => onPageChange && onPageChange(currentPage! + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                title="Next Page"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientTable;
