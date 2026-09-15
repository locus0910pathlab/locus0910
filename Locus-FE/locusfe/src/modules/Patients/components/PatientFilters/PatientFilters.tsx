import React from 'react';
import styles from './PatientFilters.module.css';

export interface PatientFiltersProps {
  gender: string;
  onGenderChange: (val: string) => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  gender,
  onGenderChange,
}) => {
  return (
    <div className={styles.filters}>
      <select
        className={styles.select}
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        aria-label="Filter by gender"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default PatientFilters;
