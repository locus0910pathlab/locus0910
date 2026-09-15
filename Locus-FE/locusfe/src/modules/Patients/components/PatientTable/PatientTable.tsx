import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Calendar, Phone, MapPin, ShieldAlert, FileText } from 'lucide-react';
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
        <div className={styles.emptyState}>No patients found in database matching the criteria.</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Patient Details</th>
            <th>Gender & Age</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Emergency Contact</th>
            <th>Clinical Notes</th>
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
                      <div className={styles.email}>
                        ID: #{patient.id} • {patient.email || 'No email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{patient.gender || '—'}</div>
                  {patient.date_of_birth && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      <span>{patient.date_of_birth}</span>
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} color="var(--text-muted)" />
                    <span>{patient.phone || '—'}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', maxWidth: '200px' }}>
                    <MapPin size={13} color="var(--text-muted)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {patient.residential_address || '—'}
                    </span>
                  </div>
                </td>
                <td>
                  {patient.emergency_contact_name || patient.emergency_contact_phone ? (
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={12} color="var(--accent-amber)" />
                        <span>{patient.emergency_contact_name || 'Contact'}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {patient.emergency_contact_phone || ''}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td>
                  {patient.clinical_notes ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', maxWidth: '180px' }}>
                      <FileText size={13} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {patient.clinical_notes}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
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
