import React, { useEffect, useState, useCallback } from 'react';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import { TestTable } from './components/TestTable/TestTable';
import { TestCard } from './components/TestCard/TestCard';
import { TestSearch } from './components/TestSearch/TestSearch';
import { AddTestModal } from './components/AddTestModal/AddTestModal';
import { Button } from '../../components/Button/Button';
import testListService from './services/testList.service';
import { LabTest } from '../../types/common.types';
import { TestFormData } from './types/testList.types';
import styles from './TestList.module.css';

export const TestList: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await testListService.getTests(categoryFilter || undefined);
      setTests(data || []);
    } catch (err) {
      console.error('Failed to fetch tests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleSaveTest = async (data: TestFormData) => {
    if (editingTest) {
      await testListService.updateTest(editingTest.id, data);
    } else {
      await testListService.createTest(data);
    }
    await fetchTests();
  };

  const handleViewTest = (test: LabTest) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTest(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await testListService.deleteTest(id);
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Could not delete test. It might be referenced in existing visits.');
    }
  };

  const hasActiveFilters = Boolean(search.trim() || categoryFilter);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('');
  };

  const categories = Array.from(
    new Set(tests.map((t) => t.category).filter(Boolean) as string[])
  );

  const filteredTests = tests.filter((t) => {
    if (categoryFilter && t.category !== categoryFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matches =
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.searchRow}>
          <TestSearch value={search} onChange={setSearch} />
          <select
            className={styles.select}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`${styles.clearBtn} ${hasActiveFilters ? styles.clearBtnActive : ''}`}
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            title="Reset search and filters"
          >
            Clear
          </button>
        </div>

        <div className={styles.actionsRow}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'cards' ? styles.active : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <Button
            className={styles.addTestBtn}
            leftIcon={<PlusCircle size={17} />}
            onClick={handleOpenCreateModal}
          >
            Add Test
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading laboratory catalog...</div>
      ) : viewMode === 'table' ? (
        <TestTable tests={filteredTests} onView={handleViewTest} onDelete={handleDelete} />
      ) : (
        <div className={styles.grid}>
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} onView={handleViewTest} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AddTestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTest(null);
        }}
        onSubmit={handleSaveTest}
        testToEdit={editingTest}
      />
    </div>
  );
};

export default TestList;
