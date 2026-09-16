import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { PatientInfo } from './components/PatientInfo/PatientInfo';
import { VisitHistory } from './components/VisitHistory/VisitHistory';
import { Modal } from '../../components/Modal/Modal';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import patientDetailsService from './services/patientDetails.service';
import addPatientService from '../AddPatient/services/addPatient.service';
import { Patient, Visit, LabTest } from '../../types/common.types';
import styles from './PatientDetails.module.css';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal for ordering new test
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [availableTests, setAvailableTests] = useState<LabTest[]>([]);
  const [selectedOrderTests, setSelectedOrderTests] = useState<number[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await patientDetailsService.getPatientDetails(id);
      setPatient(data.patient);
      setVisits(data.visits || []);
    } catch (err) {
      console.error('Failed to fetch patient data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenOrderModal = async () => {
    try {
      const tests = await addPatientService.getAvailableTests();
      setAvailableTests(tests || []);
      setSelectedOrderTests([]);
      setOrderNotes('');
      setIsOrderModalOpen(true);
    } catch (err) {
      alert('Could not fetch lab tests catalog');
    }
  };

  const handleCreateOrder = async () => {
    if (!patient || selectedOrderTests.length === 0) return;
    setIsOrdering(true);
    try {
      await patientDetailsService.createVisitOrder(patient.id, selectedOrderTests, orderNotes);
      setIsOrderModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create visit order');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading medical record...</div>;
  }

  if (!patient) {
    return (
      <div className={styles.loading}>
        <p>Patient record not found.</p>
        <Button variant="secondary" onClick={() => navigate('/patients')}>
          Return to Patients Directory
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <button className={styles.backBtn} onClick={() => navigate('/patients')}>
          <ArrowLeft size={16} />
          <span>Back to Patients</span>
        </button>

        <Button
          leftIcon={<PlusCircle size={17} />}
          onClick={handleOpenOrderModal}
        >
          New Lab Order
        </Button>
      </div>

      <div className={styles.grid}>
        <PatientInfo patient={patient} />
        <VisitHistory visits={visits} />
      </div>

      {/* New Lab Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Create New Laboratory Order"
      >
        <div className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Select Tests to Order</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableTests.map((t) => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedOrderTests.includes(t.id)}
                    onChange={() => {
                      setSelectedOrderTests((prev) =>
                        prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                      );
                    }}
                  />
                  <span>{t.name} ({t.code}) - ₹{Number(t.price).toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Order Notes"
            placeholder="Special instructions or referring physician..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
          />

          <div className={styles.modalActions}>
            <Button
              variant="cancel"
              onClick={() => setIsOrderModalOpen(false)}
              disabled={isOrdering}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateOrder}
              disabled={selectedOrderTests.length === 0}
              isLoading={isOrdering}
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDetails;
