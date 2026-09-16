import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Modal } from '../../../../components/Modal/Modal';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { LabTest } from '../../../../types/common.types';
import { TestFormData } from '../../types/testList.types';
import styles from './AddTestModal.module.css';

export interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TestFormData) => Promise<void>;
  testToEdit?: LabTest | null;
}

const initialForm: TestFormData = {
  code: '',
  name: '',
  category: 'Hematology',
  description: '',
  price: '',
  turnaround_hours: 24,
  is_active: true,
};

export const AddTestModal: React.FC<AddTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  testToEdit,
}) => {
  const [formData, setFormData] = useState<TestFormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (testToEdit) {
      setFormData({
        code: testToEdit.code,
        name: testToEdit.name,
        category: testToEdit.category || '',
        description: testToEdit.description || '',
        price: String(testToEdit.price),
        turnaround_hours: testToEdit.turnaround_hours || 24,
        is_active: testToEdit.is_active ?? true,
      });
      setIsEditing(false);
    } else {
      setFormData(initialForm);
      setIsEditing(true);
    }
    setError(null);
  }, [testToEdit, isOpen]);

  const isReadOnly = Boolean(testToEdit && !isEditing);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      return;
    }
    if (!formData.code || !formData.name || !formData.price) {
      setError('Please fill in required fields: code, name, and price.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      setFormData(initialForm);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save laboratory test');
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = testToEdit
    ? isEditing
      ? 'Edit Laboratory Test'
      : 'Laboratory Test Details'
    : 'Add New Laboratory Test';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div style={{ color: 'var(--accent-rose)', fontSize: '13px' }}>{error}</div>}

        <div className={styles.row}>
          <Input
            label="Test Code"
            required={!isReadOnly}
            disabled={isReadOnly}
            placeholder="e.g. CBC, LIPID, TSH"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />
          <Input
            label="Category"
            disabled={isReadOnly}
            placeholder="e.g. Biochemistry, Hematology"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <Input
          label="Test Name"
          required={!isReadOnly}
          disabled={isReadOnly}
          placeholder="e.g. Complete Blood Count with Differential"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className={styles.row}>
          <Input
            label="Price (₹ INR)"
            required={!isReadOnly}
            disabled={isReadOnly}
            type="number"
            step="0.01"
            placeholder="e.g. 45.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <Input
            label="Turnaround Time (Hours)"
            disabled={isReadOnly}
            type="number"
            placeholder="e.g. 24"
            value={formData.turnaround_hours}
            onChange={(e) => setFormData({ ...formData, turnaround_hours: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Clinical Description</label>
          <textarea
            className={styles.textarea}
            disabled={isReadOnly}
            placeholder="Diagnostic purpose, specimen tube requirements, reference values..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          {isReadOnly ? (
            <Button
              key="btn-edit"
              type="button"
              variant="primary"
              leftIcon={<Pencil size={15} />}
              onClick={handleEditClick}
            >
              Edit Test
            </Button>
          ) : (
            <Button
              key="btn-save"
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {testToEdit ? 'Save Changes' : 'Create Test'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AddTestModal;
