import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { Patient } from '../../../../types/common.types';
import styles from './EditPatientModal.module.css';

export interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSave: (updatedData: Partial<Patient>) => Promise<void>;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient && isOpen) {
      setFirstName(patient.first_name || '');
      setLastName(patient.last_name || '');
      setEmail(patient.email || '');
      setPhone(patient.phone || '');
      setDateOfBirth(patient.date_of_birth || '');
      setGender(patient.gender || '');
      setResidentialAddress(patient.residential_address || '');
      setErrors({});

      if (patient.date_of_birth) {
        const birthDate = new Date(patient.date_of_birth);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          setAge(String(calculatedAge));
        } else {
          setAge('');
        }
      } else {
        setAge('');
      }
    }
  }, [patient, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!gender) errs.gender = 'Gender is required';
    if (!residentialAddress.trim()) errs.residentialAddress = 'Residential address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        gender,
        date_of_birth: dateOfBirth || undefined,
        residential_address: residentialAddress.trim(),
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update patient details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Patient Details" maxWidth="620px">
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <Input
            label="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            placeholder="e.g. John"
          />
          <Input
            label="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            placeholder="e.g. Doe"
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="+91 90000 00000"
          />

          <Input
            label="Age (Years)"
            type="number"
            min="0"
            max="130"
            value={age}
            onChange={(e) => {
              const val = e.target.value;
              setAge(val);
              if (val && !isNaN(Number(val))) {
                const ageNum = parseInt(val, 10);
                const calculatedYear = new Date().getFullYear() - ageNum;
                setDateOfBirth(`${calculatedYear}-01-01`);
              } else {
                setDateOfBirth('');
              }
            }}
            placeholder="e.g. 28"
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Gender <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.select} ${errors.gender ? styles.selectError : ''}`}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
          </div>

          <div className={styles.fullWidth}>
            <Input
              label="Residential Address"
              required
              value={residentialAddress}
              onChange={(e) => setResidentialAddress(e.target.value)}
              error={errors.residentialAddress}
              placeholder="e.g. 123 Health Ave, Apt 4B, New York, NY"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="cancel" onClick={onClose} disabled={isSubmitting} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPatientModal;
