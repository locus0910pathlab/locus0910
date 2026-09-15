import React from 'react';
import { Button } from '../../../../components/Button/Button';
import styles from './PatientFormActions.module.css';

export interface PatientFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const PatientFormActions: React.FC<PatientFormActionsProps> = ({
  isLoading,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className={styles.actions}>
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Register Patient
      </Button>
    </div>
  );
};

export default PatientFormActions;
