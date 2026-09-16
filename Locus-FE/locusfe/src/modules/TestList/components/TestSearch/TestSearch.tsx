import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../components/Input/Input';
import styles from './TestSearch.module.css';

export interface TestSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const TestSearch: React.FC<TestSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by test name, code, or description...',
}) => {
  return (
    <div className={styles.container}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search size={16} />}
        className={styles.searchInput}
      />
    </div>
  );
};

export default TestSearch;
