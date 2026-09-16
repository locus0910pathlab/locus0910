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
  existingTests?: LabTest[];
}

const initialForm: TestFormData = {
  code: '',
  name: '',
  category: 'Hematology',
  description: '',
  price: '',
  turnaround_hours: 24,
  is_active: true,
  is_b2b: false,
  b2b_price: '',
  b2b_name: '',
};

export const AddTestModal: React.FC<AddTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  testToEdit,
  existingTests = [],
}) => {
  const [formData, setFormData] = useState<TestFormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (testToEdit) {
      setFormData({
        code: (testToEdit.code || '').toUpperCase(),
        name: testToEdit.name,
        category: testToEdit.category || '',
        description: testToEdit.description || '',
        price: String(testToEdit.price),
        turnaround_hours: testToEdit.turnaround_hours || 24,
        is_active: testToEdit.is_active ?? true,
        is_b2b: Boolean(testToEdit.is_b2b),
        b2b_price: testToEdit.b2b_price != null ? String(testToEdit.b2b_price) : '',
        b2b_name: testToEdit.b2b_name || '',
      });
      setIsEditing(false);
    } else {
      setFormData(initialForm);
      setIsEditing(true);
    }
    setError(null);
  }, [testToEdit, isOpen]);

  const isReadOnly = Boolean(testToEdit && !isEditing);

  const trimmedCode = (formData.code || '').trim().toUpperCase();
  const isDuplicateCode = Boolean(
    trimmedCode &&
    existingTests.some(
      (t) => t.code?.trim().toUpperCase() === trimmedCode && t.id !== testToEdit?.id
    )
  );

  const selfCharges = parseFloat(String(formData.price)) || 0;
  const b2bCharges = parseFloat(String(formData.b2b_price)) || 0;
  const profit = selfCharges - b2bCharges;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const isFormValid = Boolean(
    !isDuplicateCode &&
    formData.code?.trim() &&
    formData.name?.trim() &&
    formData.price !== '' &&
    formData.price !== undefined &&
    !isNaN(Number(formData.price)) &&
    Number(formData.price) >= 0 &&
    (!formData.is_b2b || (
      formData.b2b_name?.trim() &&
      formData.b2b_price !== '' &&
      formData.b2b_price !== undefined &&
      !isNaN(Number(formData.b2b_price)) &&
      Number(formData.b2b_price) >= 0
    ))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      return;
    }
    if (!formData.code || !formData.name || formData.price === '') {
      setError('Please fill in required fields: code, name, and price.');
      return;
    }
    if (isDuplicateCode) {
      setError(`A test with code '${trimmedCode}' already exists. Test codes must be unique.`);
      return;
    }
    if (formData.is_b2b) {
      if (!formData.b2b_name || !formData.b2b_name.trim()) {
        setError('Please enter the B2B partner name.');
        return;
      }
      if (formData.b2b_price === '' || formData.b2b_price === undefined) {
        setError('Please enter B2B charges for this B2B test.');
        return;
      }
    }
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({
        ...formData,
        code: trimmedCode,
      });
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
            error={isDuplicateCode ? `Test code '${trimmedCode}' already exists` : undefined}
            style={{ textTransform: 'uppercase' }}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
            }
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

        {/* B2B Test Toggle */}
        <div className={styles.b2bToggleSection}>
          <label className={styles.b2bCheckboxLabel}>
            <input
              type="checkbox"
              checked={Boolean(formData.is_b2b)}
              disabled={isReadOnly}
              onChange={(e) => {
                const checked = e.target.checked;
                setFormData({
                  ...formData,
                  is_b2b: checked,
                  b2b_price: checked ? (formData.b2b_price || '') : '',
                  b2b_name: checked ? (formData.b2b_name || '') : '',
                });
              }}
              className={styles.b2bCheckbox}
            />
            <div className={styles.b2bLabelInfo}>
              <span className={styles.b2bLabelTitle}>
                B2B Test <span className={styles.b2bTag}>Outsourced / Partner</span>
              </span>
              <span className={styles.b2bLabelDesc}>
                Check if this test is outsourced to a B2B partner lab with partner charges
              </span>
            </div>
          </label>
        </div>

        {formData.is_b2b ? (
          <div className={styles.b2bDetailsCard}>
            <Input
              label="B2B Name"
              required={!isReadOnly}
              placeholder="e.g. Metropolis, Thyrocare, Dr. Lal PathLabs..."
              disabled={isReadOnly}
              value={formData.b2b_name ?? ''}
              onChange={(e) => setFormData({ ...formData, b2b_name: e.target.value })}
            />

            <div className={styles.row}>
              <Input
                label="Self Charges (Retail Price ₹)"
                required={!isReadOnly}
                disabled={isReadOnly}
                type="number"
                step="0.01"
                placeholder="e.g. 500.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Input
                label="B2B Charges (Partner Cost ₹)"
                required={!isReadOnly}
                disabled={isReadOnly}
                type="number"
                step="0.01"
                placeholder="e.g. 200.00"
                value={formData.b2b_price ?? ''}
                onChange={(e) => setFormData({ ...formData, b2b_price: e.target.value })}
              />
            </div>

            {/* Live B2B vs Self & Profit Breakdown */}
            <div className={styles.b2bCalculationBox}>
              <div className={styles.calcRow}>
                <span className={styles.calcLabel}>Self Charges (Patient Price):</span>
                <span className={styles.calcSelfVal}>₹{selfCharges.toFixed(2)}</span>
              </div>
              <div className={styles.calcRow}>
                <span className={styles.calcLabel}>
                  B2B Charges {formData.b2b_name?.trim() ? `(${formData.b2b_name.trim()})` : '(Outsourced Cost)'}:
                </span>
                <span className={styles.calcB2bVal}>- ₹{b2bCharges.toFixed(2)}</span>
              </div>
              <div className={styles.calcDivider} />
              <div className={styles.calcRowTotal}>
                <span className={styles.calcTotalLabel}>Lab's Profit (Self - B2B):</span>
                <span className={profit >= 0 ? styles.calcProfitVal : styles.calcLossVal}>
                  {profit >= 0 ? `+ ₹${profit.toFixed(2)}` : `- ₹${Math.abs(profit).toFixed(2)} (Loss)`}
                </span>
              </div>
            </div>

            <Input
              label="Turnaround Time (Hours)"
              disabled={isReadOnly}
              type="number"
              placeholder="e.g. 24"
              value={formData.turnaround_hours}
              onChange={(e) => setFormData({ ...formData, turnaround_hours: e.target.value })}
            />
          </div>
        ) : (
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
        )}

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
              disabled={!isFormValid || isLoading}
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
