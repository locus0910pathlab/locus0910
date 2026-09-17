import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from './components/PatientForm/PatientForm';
import { TestSelector } from './components/TestSelector/TestSelector';
import { PatientFormActions } from './components/PatientFormActions/PatientFormActions';
import { DuplicatePhoneModal } from './components/DuplicatePhoneModal/DuplicatePhoneModal';
import addPatientService from './services/addPatient.service';
import { PatientFormData, PatientFormErrors } from './types/addPatient.types';
import { LabTest, Patient } from '../../types/common.types';
import styles from './AddPatient.module.css';

const initialFormData: PatientFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  age: '',
  date_of_birth: '',
  gender: '',
  residential_address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  clinical_notes: '',
  selectedTestIds: [],
  notes: '',
};

export const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [availableTests, setAvailableTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicatePatients, setDuplicatePatients] = useState<Patient[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [confirmedDuplicatePhone, setConfirmedDuplicatePhone] = useState<string | null>(null);

  useEffect(() => {
    addPatientService.getAvailableTests().then((tests) => {
      setAvailableTests(tests || []);
    }).catch(() => {
      setAvailableTests([]);
    });
  }, []);

  const handleChange = (field: keyof PatientFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'phone') {
      setConfirmedDuplicatePhone(null);
    }
    if (errors[field as keyof PatientFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleTest = (testId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedTestIds.includes(testId);
      return {
        ...prev,
        selectedTestIds: exists
          ? prev.selectedTestIds.filter((id) => id !== testId)
          : [...prev.selectedTestIds, testId],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: PatientFormErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.residential_address || !formData.residential_address.trim()) {
      newErrors.residential_address = 'Residential address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // Check for phone duplicate if phone is entered and not yet confirmed
    const phoneInput = formData.phone ? formData.phone.trim() : '';
    if (phoneInput && phoneInput.length >= 5 && confirmedDuplicatePhone !== phoneInput) {
      setIsLoading(true);
      try {
        const duplicates = await addPatientService.checkPhoneDuplicates(phoneInput);
        if (duplicates && duplicates.length > 0) {
          setDuplicatePatients(duplicates);
          setShowDuplicateModal(true);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Error checking duplicate phone, proceeding:', err);
      } finally {
        setIsLoading(false);
      }
    }

    await executeRegistration();
  };

  const handleConfirmDuplicateAdd = async () => {
    setShowDuplicateModal(false);
    setConfirmedDuplicatePhone(formData.phone?.trim() || null);
    await executeRegistration();
  };

  const executeRegistration = async () => {
    setIsLoading(true);
    try {
      const result = await addPatientService.registerPatientWithVisit(formData);
      navigate(`/patients/${result.patient.id}`);
    } catch (err: any) {
      alert(err.message || 'Error occurred while registering patient.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Patient Intake</h2>
          <p className={styles.subtitle}>Enter patient personal demographics and prescribe initial laboratory diagnostic panels.</p>
        </div>

        <PatientForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        {availableTests.length > 0 && (
          <>
            <div className={styles.divider} />
            <TestSelector
              tests={availableTests}
              selectedTestIds={formData.selectedTestIds}
              onToggleTest={handleToggleTest}
            />
          </>
        )}

        <PatientFormActions
          isLoading={isLoading}
          onCancel={() => navigate('/patients')}
          onSubmit={handleSubmit}
        />
      </div>

      <DuplicatePhoneModal
        isOpen={showDuplicateModal}
        phone={formData.phone || ''}
        existingPatients={duplicatePatients}
        onClose={() => setShowDuplicateModal(false)}
        onConfirmAdd={handleConfirmDuplicateAdd}
      />
    </div>
  );
};

export default AddPatient;
