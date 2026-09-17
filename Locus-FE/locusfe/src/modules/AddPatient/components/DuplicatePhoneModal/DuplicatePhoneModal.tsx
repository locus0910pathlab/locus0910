import React from 'react';
import { AlertTriangle, MapPin, UserPlus, ExternalLink } from 'lucide-react';
import { Modal } from '../../../../components/Modal/Modal';
import { Patient } from '../../../../types/common.types';
import styles from './DuplicatePhoneModal.module.css';

export interface DuplicatePhoneModalProps {
  isOpen: boolean;
  phone: string;
  existingPatients: Patient[];
  onClose: () => void;
  onConfirmAdd: () => void;
}

export const extractCity = (address?: string | null): string => {
  if (!address || !address.trim()) return 'City not specified';
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    // e.g. ["House No. 1", "Demo Street", "Pune", "Maharashtra"] -> "Pune"
    return parts[parts.length - 2];
  }
  if (parts.length === 2) {
    // e.g. ["Street Name", "Pune"] -> "Pune"
    return parts[1];
  }
  return parts[0];
};

export const DuplicatePhoneModal: React.FC<DuplicatePhoneModalProps> = ({
  isOpen,
  phone,
  existingPatients,
  onClose,
  onConfirmAdd,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Existing Patients with this Phone"
      maxWidth="680px"
    >
      <div className={styles.container}>
        <div className={styles.alertBanner}>
          <div className={styles.alertIconWrapper}>
            <AlertTriangle size={20} />
          </div>
          <div className={styles.alertText}>
            The phone number <span className={styles.phoneHighlight}>{phone}</span> is already
            associated with <strong>{existingPatients.length} existing patient{existingPatients.length > 1 ? 's' : ''}</strong>.
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>
            Registered Patient{existingPatients.length > 1 ? 's' : ''} with this Number ({existingPatients.length})
          </div>

          <div className={styles.patientsList}>
            {existingPatients.map((patient) => {
              const city = extractCity(patient.residential_address);

              return (
                <div key={patient.id} className={styles.patientCard}>
                  <div className={styles.patientInfo}>
                    <span className={styles.patientName}>
                      {patient.first_name} {patient.last_name}
                    </span>
                    <span className={styles.patientId}>#PAT-{patient.id}</span>
                    <span className={styles.cityBadge}>
                      <MapPin size={12} />
                      {city}
                    </span>
                  </div>

                  <a
                    href={`/patients/${patient.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                    title="Open patient profile in a new tab"
                  >
                    View <ExternalLink size={12} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel & Edit
          </button>
          <button
            type="button"
            className={styles.addAnywayBtn}
            onClick={onConfirmAdd}
          >
            <UserPlus size={16} />
            Add Patient with this Number
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DuplicatePhoneModal;
