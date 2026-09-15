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
            <th>Patient Name</th>
            <th>Gender</th>
            <th>Contact Details</th>
            <th>Date of Birth</th>
            <th>Registered Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();
            return (
              <tr key={patient.id} className={styles.row}>
                <td>
                  <div className={styles.patientNameCell}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <div className={styles.name}>
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className={styles.email}>{patient.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td>{patient.gender || '—'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--text-muted)" />
                    <span>{patient.phone || '—'}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span>{patient.date_of_birth || '—'}</span>
                  </div>
                </td>
                <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                    <button
                      className={styles.actionBtn}
                      title="View Patient Record"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <Eye size={17} />
                    </button>
                    {onDelete && (
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete Patient"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`)) {
                            onDelete(patient.id);
                          }
                        }}
                      >
                        <Trash2 size={17} />
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
