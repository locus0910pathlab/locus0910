import React from 'react';
import { Pencil } from 'lucide-react';
import { Patient } from '../../../../types/common.types';
import styles from './PatientInfo.module.css';

export interface PatientInfoProps {
  patient: Patient;
  onEdit?: () => void;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient, onEdit }) => {
  const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.patientMeta}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h2 className={styles.name}>
              {patient.first_name} {patient.last_name}
            </h2>
            <span className={styles.idBadge}>Patient ID: #{patient.id}</span>
          </div>
        </div>

        {onEdit && (
          <button className={styles.editBtn} onClick={onEdit} type="button">
            <Pencil size={15} />
            <span>Edit Patient</span>
          </button>
        )}
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
          <span className={styles.label}>Age</span>
          <span className={styles.value}>
            {patient.date_of_birth ? (() => {
              const birthDate = new Date(patient.date_of_birth);
              if (isNaN(birthDate.getTime())) return '—';
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
              return `${age} years`;
            })() : '—'}
          </span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Residential Address</span>
          <span className={styles.value}>{patient.residential_address || '—'}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
