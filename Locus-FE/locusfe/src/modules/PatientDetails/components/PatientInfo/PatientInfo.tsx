import React from 'react';
import { Patient } from '../../../../types/common.types';
import styles from './PatientInfo.module.css';

export interface PatientInfoProps {
  patient: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div>
          <h2 className={styles.name}>
            {patient.first_name} {patient.last_name}
          </h2>
          <span className={styles.idBadge}>Patient ID: #{patient.id}</span>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.field}>
          <span className={styles.label}>Email Address</span>
          <span className={styles.value}>{patient.email || '—'}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Phone Number</span>
          <span className={styles.value}>{patient.phone || '—'}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Gender</span>
          <span className={styles.value}>{patient.gender || '—'}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Date of Birth</span>
          <span className={styles.value}>{patient.date_of_birth || '—'}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Emergency Contact</span>
          <span className={styles.value}>{patient.emergency_contact || '—'}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Residential Address</span>
          <span className={styles.value}>{patient.address || '—'}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
