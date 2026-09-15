import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  User,
  CheckCircle2,
  Clock,
  PlusCircle,
  X,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import createAppointmentService from './services/createAppointment.service';
import { AppointmentFormData } from './types/createAppointment.types';
import { Patient, LabTest, Visit } from '../../types/common.types';
import styles from './CreateAppointment.module.css';

export const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: null,
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    appointment_type: 'Lab Visit',
    selectedTestIds: [],
    referring_doctor: '',
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

  // Load available tests
  useEffect(() => {
    createAppointmentService
      .getAvailableTests()
      .then((tests) => setAvailableTests(tests || []))
      .catch(() => setAvailableTests([]))
      .finally(() => setIsLoadingTests(false));
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      setError('Please search and select a patient for this appointment.');
      return;
    }
    if (formData.selectedTestIds.length === 0) {
      setError('Please select at least one laboratory diagnostic test.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const visit = await createAppointmentService.submitAppointment(formData);
      setCreatedVisit(visit);
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment.');
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
                  Appointment Successfully Scheduled!
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Order #{createdVisit.id} created for {selectedPatient?.first_name}{' '}
                  {selectedPatient?.last_name}.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreatedVisit(null);
                  setSelectedPatient(null);
                  setFormData({
                    patient_id: null,
                    appointment_date: new Date().toISOString().split('T')[0],
                    appointment_time: '10:00',
                    appointment_type: 'Lab Visit',
                    selectedTestIds: [],
                    referring_doctor: '',
                    notes: '',
                  });
                }}
              >
                Book Another
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/appointments')}
              >
                View Appointments
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/patients/${selectedPatient?.id}`)}
              >
                View Patient Record
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>Create Laboratory Appointment</h2>
              <p className={styles.subtitle}>
                Schedule diagnostic sample collection visits and assign laboratory panels.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft size={15} />}
                onClick={() => navigate('/appointments')}
              >
                Back to Appointments
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<PlusCircle size={15} />}
                onClick={() => navigate('/patients/new')}
              >
                New Patient Intake
              </Button>
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
              <span>1. Select Patient</span>
            </h3>

            {selectedPatient ? (
              <div className={styles.selectedPatientBadge}>
                <div className={styles.selectedPatientInfo}>
                  <div className={styles.avatar}>
                    {selectedPatient.first_name[0]}
                    {selectedPatient.last_name[0]}
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
                    fontWeight: 600,
                  }}
                >
                  <X size={16} />
                  <span>Change</span>
                </button>
              </div>
            ) : (
              <div className={styles.patientSearchWrapper}>
                <Input
                  placeholder="Search by patient name, phone number, or ID..."
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
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>
                            {p.first_name} {p.last_name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            ID: #{p.id} • {p.phone || 'No phone'} • {p.gender || 'Gender: N/A'}
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

            <div className={styles.grid3}>
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
            </div>

            <div className={styles.grid2}>
              <Input
                label="Referring Physician / Clinic"
                placeholder="Dr. Smith, City Hospital..."
                value={formData.referring_doctor}
                onChange={(e) =>
                  setFormData({ ...formData, referring_doctor: e.target.value })
                }
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Preparation & Clinical Instructions</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Fasting required (12h), morning first urine, avoid medication..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
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
                <span>3. Prescribe Laboratory Panels</span>
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
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formData.selectedTestIds.length}{' '}
                  {formData.selectedTestIds.length === 1 ? 'test' : 'tests'} selected
                </span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  Total: ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/appointments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CalendarCheck size={17} />}
            >
              Confirm & Book Appointment
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateAppointment;
