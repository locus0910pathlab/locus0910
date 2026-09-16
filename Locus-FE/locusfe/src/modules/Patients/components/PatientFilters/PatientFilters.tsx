import React from 'react';
import { PatientSortOption } from '../../types/patients.types';
import styles from './PatientFilters.module.css';

export interface PatientFiltersProps {
  sortBy: PatientSortOption;
  onSortChange: (val: PatientSortOption) => void;
  pageSize: string;
  onPageSizeChange: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
  onClearFilters,
  hasActiveFilters = false,
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

      {/* Rows Per Page Dropdown */}
      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          aria-label="Rows per page"
          title="Rows per page"
        >
          <option value="10">10 rows/page</option>
          <option value="20">20 rows/page</option>
          <option value="50">50 rows/page</option>
          <option value="all">All rows</option>
        </select>
      </div>

      {/* Clear Filter Button */}
      <button
        type="button"
        className={`${styles.clearBtn} ${hasActiveFilters ? styles.clearBtnActive : ''}`}
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        title="Reset search and filters to default"
      >
        Clear Filter
      </button>
    </div>
  );
};

export default PatientFilters;
