import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../components/Input/Input';
import styles from './PatientSearch.module.css';

export interface PatientSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by patient name, phone, or email...',
}) => {
  return (
    <div className={styles.searchContainer}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search size={17} />}
      />
    </div>
  );
};

export default PatientSearch;
