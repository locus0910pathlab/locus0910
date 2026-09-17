import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  User,
  CheckCircle2,
  Clock,
  X,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import createAppointmentService from './services/createAppointment.service';
import { AppointmentFormData } from './types/createAppointment.types';
import { Patient, LabTest, Visit } from '../../types/common.types';
import styles from './CreateAppointment.module.css';

export const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const visitId = id ? parseInt(id, 10) : null;
  const isEditMode = Boolean(visitId);

  // Form State
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: null,
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    appointment_type: 'Lab Visit',
    selectedTestIds: [],
    referring_doctor: 'Self',
    notes: '',
  });

  // Search & Patient state
  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Tests & Submitting state
  const [availableTests, setAvailableTests] = useState<LabTest[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdVisit, setCreatedVisit] = useState<Visit | null>(null);

  // Test Search & Debouncer state
  const [testSearch, setTestSearch] = useState('');
  const [debouncedTestSearch, setDebouncedTestSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Discount state (% or direct fixed ₹)
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<string>('');

  // Load available tests
  useEffect(() => {
    createAppointmentService
      .getAvailableTests()
      .then((tests) => setAvailableTests(tests || []))
      .catch(() => setAvailableTests([]))
      .finally(() => setIsLoadingTests(false));
  }, []);

  // Load appointment details if editing an existing visit
  useEffect(() => {
    if (visitId) {
      createAppointmentService
        .getVisitById(visitId)
        .then((visit) => {
          if (!visit) return;
          if (visit.status !== 'SCHEDULED') {
            setError(
              `Only appointments with "SCHEDULED" status can be edited. This appointment is currently ${visit.status}.`
            );
            return;
          }
          if (visit.patient) {
            setSelectedPatient(visit.patient);
            setPatientSearch(`${visit.patient.first_name} ${visit.patient.last_name}`);
          }
          const datePart = visit.visit_date && visit.visit_date.includes('T')
            ? visit.visit_date.split('T')[0]
            : (visit.visit_date || new Date().toISOString().split('T')[0]);
          const timePart = visit.visit_date && visit.visit_date.includes('T')
            ? visit.visit_date.split('T')[1].substring(0, 5)
            : '10:00';

          let apptType: 'Lab Visit' | 'Home Sample Collection' | 'Priority Diagnostic' = 'Lab Visit';
          let refDoc = 'Self';
          let instructions = '';

          if (visit.notes) {
            const typeMatch = visit.notes.match(/Type:\s*([^|]+)/i);
            const doctorMatch = visit.notes.match(/Referring Doctor:\s*([^|]+)/i);
            const instrMatch = visit.notes.match(/Instructions:\s*(.+)/i);

            if (typeMatch) {
              const matched = typeMatch[1].trim();
              if (
                matched === 'Lab Visit' ||
                matched === 'Home Sample Collection' ||
                matched === 'Priority Diagnostic'
              ) {
                apptType = matched;
              }
            }
            if (doctorMatch) refDoc = doctorMatch[1].trim();
            if (instrMatch) instructions = instrMatch[1].trim();
            else if (!typeMatch && !doctorMatch) instructions = visit.notes;

            const discountMatch = visit.notes.match(/Discount:\s*([^\s|]+)/i);
            if (discountMatch) {
              const matchedStr = discountMatch[1].trim();
              if (matchedStr.includes('%')) {
                setDiscountType('percent');
                setDiscountValue(matchedStr.replace('%', '').trim());
              } else {
                setDiscountType('fixed');
                setDiscountValue(matchedStr.replace('₹', '').trim());
              }
            }
          }

          setFormData({
            patient_id: visit.patient_id,
            appointment_date: datePart,
            appointment_time: timePart,
            appointment_type: apptType,
            selectedTestIds: (visit.tests_ordered || []).map((t) => t.test_id),
            referring_doctor: refDoc,
            notes: instructions,
          });
        })
        .catch((err) => {
          console.error('Failed to load visit for editing:', err);
          setError('Could not load appointment details for editing.');
        });
    }
  }, [visitId]);

  // Debounce test search input for responsive control
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTestSearch(testSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [testSearch]);

  // Derived categories and filtered tests list
  const testCategories = [
    'All',
    ...Array.from(
      new Set(
        availableTests
          .map((t) => t.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredTests = availableTests.filter((test) => {
    const matchesCategory =
      selectedCategory === 'All' || test.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!debouncedTestSearch.trim()) return true;

    const query = debouncedTestSearch.toLowerCase().trim();
    const nameMatch = test.name.toLowerCase().includes(query);
    const codeMatch = test.code.toLowerCase().includes(query);
    const descMatch = test.description
      ? test.description.toLowerCase().includes(query)
      : false;
    const categoryMatch = test.category
      ? test.category.toLowerCase().includes(query)
      : false;

    return nameMatch || codeMatch || descMatch || categoryMatch;
  });

  // Search patients on typing
  useEffect(() => {
    if (!patientSearch.trim()) {
      setPatientResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await createAppointmentService.searchPatients(patientSearch);
        setPatientResults(results || []);
        setShowDropdown(true);
      } catch {
        setPatientResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [patientSearch]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patient_id: patient.id }));
    setPatientSearch('');
    setShowDropdown(false);
    setError(null);
  };

  const handleClearPatient = () => {
    if (isEditMode) return;
    setSelectedPatient(null);
    setFormData((prev) => ({ ...prev, patient_id: null }));
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

  const selectedTests = availableTests.filter((t) =>
    formData.selectedTestIds.includes(t.id)
  );
  const totalPrice = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);

  // Discount calculations
  const parsedDiscount = parseFloat(discountValue) || 0;
  let discountAmount = 0;
  if (parsedDiscount > 0 && totalPrice > 0) {
    if (discountType === 'percent') {
      const clampedPercent = Math.min(100, Math.max(0, parsedDiscount));
      discountAmount = (totalPrice * clampedPercent) / 100;
    } else {
      discountAmount = Math.min(totalPrice, Math.max(0, parsedDiscount));
    }
  }
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const isFormValid = Boolean(
    formData.patient_id &&
    formData.appointment_date &&
    formData.appointment_date.trim() &&
    formData.selectedTestIds.length > 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      setError('Please search and select a patient for this appointment.');
      return;
    }
    if (!formData.appointment_date || !formData.appointment_date.trim()) {
      setError('Please select an appointment date.');
      return;
    }
    if (formData.selectedTestIds.length === 0) {
      setError('Please select at least one laboratory diagnostic test.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: AppointmentFormData = {
      ...formData,
      discount_type: parsedDiscount > 0 ? discountType : undefined,
      discount_value: parsedDiscount > 0 ? parsedDiscount : undefined,
      total_amount: finalPrice,
    };

    try {
      if (isEditMode && visitId) {
        const visit = await createAppointmentService.updateAppointment(visitId, payload);
        setCreatedVisit(visit);
      } else {
        const visit = await createAppointmentService.submitAppointment(payload);
        setCreatedVisit(visit);
      }
    } catch (err: any) {
      setError(
        err.message ||
          (isEditMode ? 'Failed to update appointment.' : 'Failed to create appointment.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {createdVisit ? (
        <div className={styles.card}>
          <div className={styles.successBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CheckCircle2 size={36} color="var(--accent-emerald)" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isEditMode ? 'Appointment Successfully Updated!' : 'Appointment Successfully Scheduled!'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Appointment #{createdVisit.id} {isEditMode ? 'updated' : 'created'} for{' '}
                  {selectedPatient?.first_name} {selectedPatient?.last_name}.
                </p>
              </div>
            </div>

            <div>
              <Button
                variant="primary"
                onClick={() => navigate('/appointments')}
              >
                Go to All Appointments
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>
                {isEditMode ? 'Edit Laboratory Appointment' : 'Create Laboratory Appointment'}
              </h2>
              <p className={styles.subtitle}>
                {isEditMode
                  ? 'Update diagnostic sample collection visit details and assigned laboratory panels.'
                  : 'Schedule diagnostic sample collection visits and assign laboratory panels.'}
              </p>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--accent-rose-light)',
                color: 'var(--accent-rose)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Section 1: Patient Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={18} color="var(--primary-600)" />
              <span>
                {isEditMode ? '1. Patient Details' : '1. Select Patient'}{' '}
                <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </span>
            </h3>

            {selectedPatient ? (
              <div className={styles.selectedPatientBadge}>
                <div className={styles.selectedPatientInfo}>
                  <div className={styles.avatar}>
                    {`${selectedPatient.first_name?.[0] || ''}${selectedPatient.last_name?.[0] || ''}`.toUpperCase() || 'PT'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      ID: #{selectedPatient.id} • Phone: {selectedPatient.phone || '—'} • {selectedPatient.gender}
                    </div>
                  </div>
                </div>

                {!isEditMode && (
                  <button
                    type="button"
                    onClick={handleClearPatient}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.patientSearchWrapper}>
                <Input
                  label="Search Patient by Name, Mobile Number, or ID"
                  placeholder="e.g. Rushikesh, 9876543210..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  leftIcon={<Search size={16} />}
                  helperText={isSearching ? 'Searching patient directory...' : undefined}
                />

                {showDropdown && patientResults.length > 0 && (
                  <div className={styles.patientDropdown}>
                    {patientResults.map((p) => (
                      <div
                        key={p.id}
                        className={styles.patientOption}
                        onClick={() => handleSelectPatient(p)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className={styles.avatar}>
                            {`${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase() || 'PT'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>
                              {p.first_name} {p.last_name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              ID: #{p.id} • {p.phone || 'No phone'} • {p.gender || 'Gender: N/A'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Appointment Timing & Type */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Clock size={18} color="var(--primary-600)" />
              <span>2. Schedule & Service Details</span>
            </h3>

            <div className={styles.grid2}>
              <Input
                label="Appointment Date"
                type="date"
                required
                value={formData.appointment_date}
                onChange={(e) =>
                  setFormData({ ...formData, appointment_date: e.target.value })
                }
              />

              <Input
                label="Preferred Time"
                type="time"
                value={formData.appointment_time}
                onChange={(e) =>
                  setFormData({ ...formData, appointment_time: e.target.value })
                }
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Collection Mode</label>
                <select
                  className={styles.select}
                  value={formData.appointment_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointment_type: e.target.value as any,
                    })
                  }
                >
                  <option value="Lab Visit">Laboratory Visit (Walk-in)</option>
                  <option value="Home Sample Collection">Home Specimen Collection</option>
                  <option value="Priority Diagnostic">Priority Diagnostic / STAT</option>
                </select>
              </div>

              <Input
                label="Referring Physician / Clinic"
                placeholder="Dr. Smith, City Hospital..."
                value={formData.referring_doctor}
                onChange={(e) =>
                  setFormData({ ...formData, referring_doctor: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 3: Diagnostic Tests Panel Selection */}
          <div className={styles.section}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                <Stethoscope size={18} color="var(--primary-600)" />
                <span>
                  3. Prescribe Laboratory Panels{' '}
                  <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </span>
              </h3>
              {availableTests.length > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Showing {filteredTests.length} of {availableTests.length} tests
                </span>
              )}
            </div>

            {/* Test Search & Filter Toolbar with Debouncer */}
            <div className={styles.testControls}>
              <div className={styles.testSearchInputWrapper}>
                <Input
                  placeholder="Search tests by name, code (e.g. CBC, LIPID), or category..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  leftIcon={<Search size={16} />}
                />
                {testSearch && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setTestSearch('')}
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {testCategories.length > 1 && (
                <div className={styles.categoryChips}>
                  {testCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`${styles.chip} ${
                        selectedCategory === cat ? styles.chipActive : ''
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoadingTests ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>
                Loading test catalog...
              </div>
            ) : filteredTests.length === 0 ? (
              <div className={styles.emptyFilterState}>
                <Search size={24} color="var(--text-muted)" />
                <div>
                  No tests found matching "<strong>{debouncedTestSearch || selectedCategory}</strong>"
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestSearch('');
                    setSelectedCategory('All');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className={styles.testsGrid}>
                {filteredTests.map((t) => {
                  const isSelected = formData.selectedTestIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      className={`${styles.testItem} ${
                        isSelected ? styles.testSelected : ''
                      }`}
                      onClick={() => handleToggleTest(t.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ marginTop: '3px', accentColor: 'var(--primary-600)' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={styles.testCode}>{t.code}</span>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.name}</span>
                        </div>
                        <div className={styles.testPrice}>₹{Number(t.price).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {formData.selectedTestIds.length > 0 && (
              <div className={styles.summaryBar}>
                <div className={styles.summaryLeft}>
                  <span className={styles.summaryCount}>
                    {formData.selectedTestIds.length}{' '}
                    {formData.selectedTestIds.length === 1 ? 'test' : 'tests'} selected
                  </span>

                  <div className={styles.discountRow}>
                    <span className={styles.discountLabel}>Discount:</span>
                    <div className={styles.discountInputWrapper}>
                      <input
                        type="number"
                        min="0"
                        max={discountType === 'percent' ? 100 : totalPrice}
                        step="any"
                        placeholder="0"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className={styles.discountInput}
                      />
                      <div className={styles.discountToggleGroup}>
                        <button
                          type="button"
                          className={`${styles.discountToggleBtn} ${
                            discountType === 'percent' ? styles.discountToggleActive : ''
                          }`}
                          onClick={() => setDiscountType('percent')}
                          title="Percentage discount (%)"
                        >
                          %
                        </button>
                        <button
                          type="button"
                          className={`${styles.discountToggleBtn} ${
                            discountType === 'fixed' ? styles.discountToggleActive : ''
                          }`}
                          onClick={() => setDiscountType('fixed')}
                          title="Direct price reduction (₹)"
                        >
                          ₹
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.summaryRight}>
                  {discountAmount > 0 ? (
                    <>
                      <div className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>Subtotal:</span>
                        <span className={styles.breakdownSubtotal}>₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>
                          Discount {discountType === 'percent' ? `(${parsedDiscount}%)` : ''}:
                        </span>
                        <span className={styles.breakdownDiscount}>
                          -₹{discountAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalValue}>₹{finalPrice.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total:</span>
                      <span className={styles.totalValue}>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="cancel"
              onClick={() => navigate('/appointments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
              leftIcon={<CalendarCheck size={17} />}
            >
              {isEditMode ? 'Confirm & Save Changes' : 'Confirm & Book Appointment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateAppointment;
