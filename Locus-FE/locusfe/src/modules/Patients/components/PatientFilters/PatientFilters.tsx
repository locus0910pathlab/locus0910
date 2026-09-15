import React from 'react';
import { PatientSortOption } from '../../types/patients.types';
import styles from './PatientFilters.module.css';

export interface PatientFiltersProps {
  gender: string;
  onGenderChange: (val: string) => void;
  sortBy: PatientSortOption;
  onSortChange: (val: PatientSortOption) => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  gender,
  onGenderChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className={styles.filters}>
      {/* Sort By Dropdown */}
      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as PatientSortOption)}
          aria-label="Sort patients"
          title="Sort by"
        >
          <option value="date_added_desc">Date Added (Newest)</option>
          <option value="date_added_asc">Date Added (Oldest)</option>
          <option value="name_asc">Name: A - Z</option>
          <option value="name_desc">Name: Z - A</option>
          <option value="date_modified">Date Modified</option>
        </select>
      </div>

      {/* Gender Filter Dropdown */}
      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          aria-label="Filter by gender"
          title="Filter by gender"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
    </div>
  );
};

export default PatientFilters;
