import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { LabTest } from '../../../../types/common.types';
import styles from './TestSummary.module.css';

export interface TestSummaryProps {
  tests: LabTest[];
}

export const TestSummary: React.FC<TestSummaryProps> = ({ tests }) => {
  const [search, setSearch] = useState('');

  const filteredTests = tests.filter((test) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase().trim();
    const nameMatch = test.name?.toLowerCase().includes(query);
    const codeMatch = test.code?.toLowerCase().includes(query);
    const catMatch = test.category?.toLowerCase().includes(query);
    return Boolean(nameMatch || codeMatch || catMatch);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Laboratory Test Catalog</h3>
        <Link to="/tests" className={styles.viewAll}>
          <span>Detail of tests</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchContainer}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tests by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={`${styles.clearBtn} ${search ? styles.clearBtnActive : ''}`}
          onClick={() => setSearch('')}
          disabled={!search}
          title="Clear search"
          aria-label="Clear search"
        >
          Clear
        </button>
      </div>

      {filteredTests.length === 0 ? (
        <div className={styles.empty}>
          {tests.length === 0 ? (
            'No tests configured yet.'
          ) : (
            <div className={styles.noResults}>
              <span>No tests found matching "{search}"</span>
              <button
                type="button"
                className={styles.clearFilterBtn}
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {filteredTests.map((test) => (
            <div key={test.id} className={styles.item}>
              <div>
                <span className={styles.testCode}>{test.code}</span>
                <div className={styles.testName}>{test.name}</div>
              </div>
              <div className={styles.testPrice}>
                ₹{Number(test.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestSummary;
