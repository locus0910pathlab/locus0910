import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PatientTable } from './components/PatientTable/PatientTable';
import { PatientSearch } from './components/PatientSearch/PatientSearch';
import { PatientFilters } from './components/PatientFilters/PatientFilters';
import { Button } from '../../components/Button/Button';
import patientsService from './services/patients.service';
import { Patient } from '../../types/common.types';
import styles from './Patients.module.css';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
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

  const filteredPatients = patients.filter((patient) => {
    if (genderFilter && patient.gender !== genderFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.controls}>
          <PatientSearch value={search} onChange={setSearch} />
          <PatientFilters gender={genderFilter} onGenderChange={setGenderFilter} />
        </div>
        <Button
          leftIcon={<UserPlus size={18} />}
          onClick={() => navigate('/patients/new')}
        >
          Add New Patient
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading clinical patient records...</div>
      ) : (
        <PatientTable patients={filteredPatients} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Patients;
