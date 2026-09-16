import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PatientTable } from './components/PatientTable/PatientTable';
import { PatientSearch } from './components/PatientSearch/PatientSearch';
import { PatientFilters } from './components/PatientFilters/PatientFilters';
import { Button } from '../../components/Button/Button';
import patientsService from './services/patients.service';
import { Patient } from '../../types/common.types';
import { PatientSortOption } from './types/patients.types';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Patients.module.css';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<PatientSortOption>('date_added_desc');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patients only on mount and when debouncedSearch changes (500ms after user stops typing)
  useEffect(() => {
    let active = true;
    const loadPatients = async () => {
      setIsLoading(true);
      try {
        const data = await patientsService.getPatients(debouncedSearch);
        if (active) {
          setPatients(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadPatients();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const handleDelete = async (id: number) => {
    try {
      await patientsService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete patient. Ensure there are no related active visits.');
    }
  };

  // Sort patients based on selected option
  const sortedPatients = [...patients].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc': {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      case 'name_desc': {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameB.localeCompare(nameA);
      }
      case 'date_added_asc': {
        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;
        return dateA - dateB;
      }
      case 'date_added_desc': {
        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;
        return dateB - dateA;
      }
      case 'date_modified': {
        const dateA = new Date(a.updated_at || a.created_at).getTime() || 0;
        const dateB = new Date(b.updated_at || b.created_at).getTime() || 0;
        return dateB - dateA;
      }
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalCount = sortedPatients.length;
  const isAll = pageSize === 'all';
  const limit = isAll ? totalCount : parseInt(pageSize, 10);
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalCount / limit));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = isAll ? 0 : (validPage - 1) * limit;
  const paginatedPatients = isAll ? sortedPatients : sortedPatients.slice(startIndex, startIndex + limit);

  const handlePageSizeChange = (val: string) => {
    setPageSize(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: PatientSortOption) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search.trim()) || sortBy !== 'date_added_desc' || pageSize !== '10';

  const handleClearFilters = () => {
    setSearch('');
    setSortBy('date_added_desc');
    setPageSize('10');
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.controls}>
          <PatientSearch
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
          />
          <PatientFilters
            sortBy={sortBy}
            onSortChange={handleSortChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
        <Button
          leftIcon={<UserPlus size={18} />}
          onClick={() => navigate('/patients/new')}
          className={styles.addPatientBtn}
        >
          Add Patient
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading clinical patient records...</div>
      ) : (
        <PatientTable
          patients={paginatedPatients}
          onDelete={handleDelete}
          totalCount={totalCount}
          currentPage={validPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Patients;
