import React from 'react';
import { AppointmentSortOption, AppointmentStatusFilter } from '../../types/appointments.types';
import styles from './AppointmentFilters.module.css';

export interface AppointmentFiltersProps {
  status: AppointmentStatusFilter;
  onStatusChange: (val: AppointmentStatusFilter) => void;
  sortBy: AppointmentSortOption;
  onSortChange: (val: AppointmentSortOption) => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  status,
  onStatusChange,
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
          onChange={(e) => onSortChange(e.target.value as AppointmentSortOption)}
          aria-label="Sort appointments"
          title="Sort by"
        >
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
          <option value="patient_asc">Patient: A - Z</option>
          <option value="patient_desc">Patient: Z - A</option>
          <option value="amount_desc">Amount: High to Low</option>
          <option value="amount_asc">Amount: Low to High</option>
        </select>
      </div>

      {/* Status Filter Dropdown */}
      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as AppointmentStatusFilter)}
          aria-label="Filter by appointment status"
          title="Status filter"
        >
          <option value="ALL">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default AppointmentFilters;
