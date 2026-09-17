import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { Patient } from '../../../../types/common.types';
import styles from './RecentPatients.module.css';

export interface RecentPatientsProps {
  patients: Patient[];
}

export const RecentPatients: React.FC<RecentPatientsProps> = ({ patients }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Registered Patients</h3>
        <Link to="/patients" className={styles.viewAll}>
          <span>View All</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className={styles.empty}>No registered patients yet.</div>
      ) : (
        <div className={styles.list}>
          {patients.map((patient) => {
            const initials = `${patient.first_name?.[0] || ''}${patient.last_name?.[0] || ''}`.toUpperCase() || 'PT';
            return (
              <Link
                to={`/patients/${patient.id}`}
                key={patient.id}
                className={styles.item}
              >
                <div className={styles.patientMeta}>
                  <div className={styles.avatar}>{initials}</div>
                  <div>
                    <div className={styles.name}>
                      {patient.first_name} {patient.last_name}
                    </div>
                    <div className={styles.phone}>
                      {patient.phone || patient.email || 'No contact provided'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentPatients;
