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
        required
        value={formData.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        error={errors.phone}
        placeholder="+91 90000 00000"
      />

      <Input
        label="Age (Years)"
        type="number"
        min="0"
        max="130"
        value={formData.age !== undefined && formData.age !== null ? formData.age : ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange('age', val);
          if (val && !isNaN(Number(val))) {
            const ageNum = parseInt(val, 10);
            const currentYear = new Date().getFullYear();
            const calculatedYear = currentYear - ageNum;
            onChange('date_of_birth', `${calculatedYear}-01-01`);
          } else {
            onChange('date_of_birth', '');
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
          value={formData.gender}
          onChange={(e) => onChange('gender', e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        {errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
      </div>

      <div className={styles.fullSpan}>
        <Input
          label="Residential Address"
          required
          value={formData.residential_address}
          onChange={(e) => onChange('residential_address', e.target.value)}
          error={errors.residential_address}
          placeholder="House No, Street, City, State"
        />
      </div>


    </div>
  );
};

export default PatientForm;
