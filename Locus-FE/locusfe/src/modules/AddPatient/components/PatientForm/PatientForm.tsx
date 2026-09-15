import React from 'react';
import { Input } from '../../../../components/Input/Input';
import { PatientFormData, PatientFormErrors } from '../../types/addPatient.types';
import styles from './PatientForm.module.css';

export interface PatientFormProps {
  formData: PatientFormData;
  errors: PatientFormErrors;
  onChange: (field: keyof PatientFormData, value: any) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className={styles.formGrid}>
      <Input
        label="First Name"
        required
        value={formData.first_name}
        onChange={(e) => onChange('first_name', e.target.value)}
        error={errors.first_name}
        placeholder="e.g. John"
      />
      <Input
        label="Last Name"
        required
        value={formData.last_name}
        onChange={(e) => onChange('last_name', e.target.value)}
        error={errors.last_name}
        placeholder="e.g. Doe"
      />

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
        placeholder="john.doe@example.com"
      />
      <Input
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="+91 90000 00000"
      />

      <Input
        label="Date of Birth"
        type="date"
        value={formData.date_of_birth}
        onChange={(e) => onChange('date_of_birth', e.target.value)}
      />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Gender</label>
        <select
          className={styles.select}
          value={formData.gender}
          onChange={(e) => onChange('gender', e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div className={styles.fullSpan}>
        <Input
          label="Residential Address"
          value={formData.residential_address}
          onChange={(e) => onChange('residential_address', e.target.value)}
          placeholder="House No, Street, City, State"
        />
      </div>

      <Input
        label="Emergency Contact Name"
        value={formData.emergency_contact_name}
        onChange={(e) => onChange('emergency_contact_name', e.target.value)}
        placeholder="e.g. Jane Doe"
      />

      <Input
        label="Emergency Contact Phone"
        value={formData.emergency_contact_phone}
        onChange={(e) => onChange('emergency_contact_phone', e.target.value)}
        placeholder="+91 80000 00000"
      />

      <div className={styles.fullSpan}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Clinical Notes / Symptoms</label>
          <textarea
            className={styles.textarea}
            value={formData.clinical_notes}
            onChange={(e) => onChange('clinical_notes', e.target.value)}
            placeholder="Preliminary clinical findings, referring physician, observations..."
          />
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
