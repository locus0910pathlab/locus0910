import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PatientTable } from './components/PatientTable/PatientTable';
import { PatientSearch } from './components/PatientSearch/PatientSearch';
import { PatientFilters } from './components/PatientFilters/PatientFilters';
import { Button } from '../../components/Button/Button';
import patientsService from './services/patients.service';
import { Patient } from '../../types/common.types';
import { PatientSortOption } from './types/patients.types';
import styles from './Patients.module.css';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortBy, setSortBy] = useState<PatientSortOption>('date_added_desc');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await patientsService.getPatients(search);
      setPatients(data || []);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchPatients]);

  const handleDelete = async (id: number) => {
    try {
      await patientsService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete patient. Ensure there are no related active visits.');
    }
  };

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    if (genderFilter && patient.gender !== genderFilter) {
      return false;
    }
    return true;
  });

  // Sort patients based on selected option
  const sortedPatients = [...filteredPatients].sort((a, b) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.controls}>
          <PatientSearch value={search} onChange={setSearch} />
          <PatientFilters
            gender={genderFilter}
            onGenderChange={setGenderFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
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
        <PatientTable patients={sortedPatients} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Patients;
