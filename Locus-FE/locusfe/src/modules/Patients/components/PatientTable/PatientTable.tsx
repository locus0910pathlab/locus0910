import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Calendar, Phone } from 'lucide-react';
import { Patient } from '../../../../types/common.types';
import styles from './PatientTable.module.css';

export interface PatientTableProps {
  patients: Patient[];
  onDelete?: (id: number) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onDelete,
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
    </div>
  );
};

export default PatientTable;
