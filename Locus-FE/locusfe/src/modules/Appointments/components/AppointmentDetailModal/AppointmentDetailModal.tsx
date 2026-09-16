import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Pencil,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Visit } from '../../../../types/common.types';
import appointmentsService from '../../services/appointments.service';
import styles from './AppointmentDetailModal.module.css';

export interface AppointmentDetailModalProps {
  visit: Visit | null;
  onClose: () => void;
  onEdit?: (visit: Visit) => void;
  onUpdated?: (updatedVisit: Visit) => void;
  initialIsCompleting?: boolean;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  visit,
  onClose,
  onEdit,
  onUpdated,
  initialIsCompleting = false,
}) => {
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(visit);
  const [isCompleting, setIsCompleting] = useState<boolean>(initialIsCompleting);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<string>('0');

  // Calculate diagnostic test subtotal
  const subtotal = useMemo(() => {
    if (!currentVisit) return 0;
    if (currentVisit.tests_ordered && currentVisit.tests_ordered.length > 0) {
      return currentVisit.tests_ordered.reduce(
        (acc, vt) => acc + Number(vt.test?.price || 0),
        0
      );
    }
    return Number(currentVisit.total_amount) || 0;
  }, [currentVisit]);

  const parseExistingDiscount = (v: Visit, sub: number) => {
    if (v.notes) {
      const match = v.notes.match(/Discount:\s*(?:₹|Rs\.?)?\s*([\d.]+)(%)?/i);
      if (match) {
        const isPercent = Boolean(match[2]);
        const val = parseFloat(match[1]);
        if (!isNaN(val) && val > 0) {
          const amt = isPercent && sub ? (sub * val) / 100 : val;
          return {
            type: isPercent ? ('percent' as const) : ('fixed' as const),
            value: match[1],
            amount: amt,
            label: isPercent ? `${match[1]}%` : `₹${match[1]}`,
          };
        }
      }
    }
    if (sub > Number(v.total_amount)) {
      const diff = Math.round((sub - Number(v.total_amount)) * 100) / 100;
      if (diff > 0) {
        return {
          type: 'fixed' as const,
          value: String(diff),
          amount: diff,
          label: `₹${diff}`,
        };
      }
    }
    return {
      type: 'percent' as const,
      value: '0',
      amount: 0,
      label: '',
    };
  };

  // Synchronize with incoming visit prop and initialize discount
  useEffect(() => {
    if (!visit) return;
    setCurrentVisit(visit);
    setIsCompleting(initialIsCompleting);
    setErrorMessage('');
    setSuccessMessage('');

    const sub = (visit.tests_ordered || []).reduce(
      (acc, t) => acc + (Number(t.test?.price) || 0),
      0
    );
    const existing = parseExistingDiscount(visit, sub);
    setDiscountType(existing.type);
    setDiscountValue(existing.value);
  }, [visit, initialIsCompleting]);

  if (!currentVisit) return null;

  const patient = currentVisit.patient;
  const initials = patient
    ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase()
    : 'PT';

  const dateObj = new Date(currentVisit.visit_date);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const formattedTime = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  // Calculate discount and final payable amount
  const parsedDiscountNum = parseFloat(discountValue) || 0;
  const discountAmount =
    parsedDiscountNum <= 0
      ? 0
      : discountType === 'percent'
      ? (subtotal * parsedDiscountNum) / 100
      : parsedDiscountNum;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleConfirmComplete = async () => {
    if (!currentVisit) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Build updated notes string preserving other notes while updating discount
      let updatedNotes = currentVisit.notes || '';
      const discountStr =
        parsedDiscountNum > 0
          ? `Discount: ${discountType === 'percent' ? `${parsedDiscountNum}%` : `₹${parsedDiscountNum}`}`
          : '';

      const discountRegexWithPrefixPipe = /\s*\|\s*Discount:\s*([^\s|]+)/i;
      const discountRegexWithSuffixPipe = /Discount:\s*([^\s|]+)\s*\|\s*/i;
      const discountRegexAlone = /Discount:\s*([^\s|]+)/i;

      if (discountRegexWithPrefixPipe.test(updatedNotes)) {
        updatedNotes = discountStr
          ? updatedNotes.replace(discountRegexWithPrefixPipe, ` | ${discountStr}`)
          : updatedNotes.replace(discountRegexWithPrefixPipe, '');
      } else if (discountRegexWithSuffixPipe.test(updatedNotes)) {
        updatedNotes = discountStr
          ? updatedNotes.replace(discountRegexWithSuffixPipe, `${discountStr} | `)
          : updatedNotes.replace(discountRegexWithSuffixPipe, '');
      } else if (discountRegexAlone.test(updatedNotes)) {
        updatedNotes = discountStr
          ? updatedNotes.replace(discountRegexAlone, discountStr)
          : updatedNotes.replace(discountRegexAlone, '');
      } else if (discountStr) {
        updatedNotes = updatedNotes ? `${updatedNotes} | ${discountStr}` : discountStr;
      }

      const updated = await appointmentsService.completeAppointment(currentVisit.id, {
        total_amount: Math.round(finalTotal * 100) / 100,
        notes: updatedNotes.trim(),
      });

      setCurrentVisit(updated);
      setIsCompleting(false);
      setSuccessMessage('Appointment marked as COMPLETED successfully!');
      onUpdated?.(updated);
    } catch (err: any) {
      console.error('Failed to complete appointment:', err);
      setErrorMessage(err.message || 'Failed to complete appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            {isCompleting ? (
              <>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <span>Complete Appointment #{currentVisit.id}</span>
              </>
            ) : (
              <>
                <Calendar size={18} color="var(--primary-600)" />
                <span>Appointment #{currentVisit.id}</span>
              </>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {successMessage && (
            <div className={styles.successBanner}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* If user is on the completion step */}
          {isCompleting ? (
            <>
              {/* Patient and Appointment Quick Recap */}
              <div className={styles.patientCard}>
                <div className={styles.avatar}>{initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    {patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${currentVisit.patient_id}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ID: #{currentVisit.patient_id} • {formattedDate} at {formattedTime}
                  </div>
                </div>
              </div>

              {/* Ordered Tests Recap */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  Ordered Tests ({(currentVisit.tests_ordered || []).length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(currentVisit.tests_ordered || []).map((vt) => (
                    <div key={vt.id} className={styles.testItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={styles.testCode}>{vt.test?.code || `TEST-${vt.test_id}`}</span>
                        <span className={styles.testName}>{vt.test?.name || 'Diagnostic Test'}</span>
                      </div>
                      <span className={styles.testPrice}>
                        ₹{Number(vt.test?.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Entry Section */}
              <div className={styles.discountSection}>
                <div className={styles.discountTitleRow}>
                  <div>
                    <div className={styles.discountTitle}>Any discount given?</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Confirm or adjust the final discount applied before completion
                    </div>
                  </div>

                  <div className={styles.discountInputWrapper}>
                    <input
                      type="number"
                      min="0"
                      max={discountType === 'percent' ? 100 : subtotal}
                      step="any"
                      placeholder="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.select();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className={styles.discountInput}
                      autoFocus
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

                {/* Calculation Breakdown Card */}
                <div className={styles.calcCard}>
                  <div className={styles.calcRow}>
                    <span>Tests Subtotal</span>
                    <span style={{ textDecoration: discountAmount > 0 ? 'line-through' : 'none', color: discountAmount > 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className={styles.calcRow}>
                      <span className={styles.calcDiscountText}>
                        Discount ({discountType === 'percent' ? `${parsedDiscountNum}%` : `Flat ₹${parsedDiscountNum}`})
                      </span>
                      <span className={styles.calcDiscountText}>
                        - ₹{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className={styles.calcFinalRow}>
                    <span>Final Total to Collect</span>
                    <span className={styles.calcFinalAmount}>
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Normal Appointment View */
            <>
              {/* Patient Details */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Patient Information</div>
                <div className={styles.patientCard}>
                  <div className={styles.avatar}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>
                      {patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${currentVisit.patient_id}`}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      ID: #{currentVisit.patient_id} • Gender: {patient?.gender || '—'} • Phone: {patient?.phone || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing & Status Grid */}
              <div className={styles.grid2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoLabel}>Scheduled Date</div>
                  <div className={styles.infoValue}>{formattedDate}</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoLabel}>Scheduled Time</div>
                  <div className={styles.infoValue}>{formattedTime}</div>
                </div>
              </div>

              {/* Status & Price */}
              <div className={styles.grid2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoLabel}>Status</div>
                  <div
                    className={styles.infoValue}
                    style={{
                      color:
                        currentVisit.status === 'COMPLETED'
                          ? 'var(--accent-emerald)'
                          : currentVisit.status === 'SCHEDULED'
                          ? 'var(--primary-600)'
                          : 'var(--text-primary)',
                    }}
                  >
                    {currentVisit.status}
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoLabel}>Total Price</div>
                  <div className={styles.infoValue} style={{ color: 'var(--accent-emerald)' }}>
                    ₹{Number(currentVisit.total_amount).toFixed(2)}
                  </div>
                  {parseExistingDiscount(currentVisit, subtotal).amount > 0 && (
                    <div className={styles.discountSubtext}>
                      Discount: {parseExistingDiscount(currentVisit, subtotal).label}
                    </div>
                  )}
                </div>
              </div>



              {/* Prescribed Tests */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  Ordered Diagnostic Tests ({(currentVisit.tests_ordered || []).length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(currentVisit.tests_ordered || []).map((vt) => (
                    <div key={vt.id} className={styles.testItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={styles.testCode}>{vt.test?.code || `TEST-${vt.test_id}`}</span>
                        <span className={styles.testName}>{vt.test?.name || 'Diagnostic Panel'}</span>
                      </div>
                      <span className={styles.testPrice}>
                        ₹{Number(vt.test?.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {parseExistingDiscount(currentVisit, subtotal).amount > 0 && (
                  <div className={styles.financialSummary}>
                    <div className={styles.financialRow}>
                      <span>Tests Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.financialRow} ${styles.financialRowDiscount}`}>
                      <span>Discount Given ({parseExistingDiscount(currentVisit, subtotal).label})</span>
                      <span>-₹{parseExistingDiscount(currentVisit, subtotal).amount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className={styles.totalBar}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    Total Order Amount
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent-emerald)' }}>
                    ₹{Number(currentVisit.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          {isCompleting ? (
            <div className={styles.completingFooterActions}>
              <button
                type="button"
                className={styles.completingBackBtn}
                onClick={() => setIsCompleting(false)}
                disabled={isSubmitting}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                className={styles.completingConfirmBtn}
                onClick={handleConfirmComplete}
                disabled={isSubmitting}
              >
                <CheckCircle2 size={16} />
                <span>{isSubmitting ? 'Completing...' : 'Confirm & Mark Completed'}</span>
              </button>
            </div>
          ) : (
            <div className={styles.normalFooterActions}>
              <div className={styles.topActionRow}>
                <button
                  type="button"
                  className={styles.cancelApptBtn}
                  onClick={onClose}
                >
                  {currentVisit.status === 'COMPLETED' ? 'Close' : 'Cancel'}
                </button>
                {onEdit && currentVisit.status === 'SCHEDULED' && (
                  <button
                    type="button"
                    className={styles.editApptBtn}
                    onClick={() => onEdit(currentVisit)}
                  >
                    <Pencil size={15} />
                    <span>Edit Appointment</span>
                  </button>
                )}
              </div>
              {currentVisit.status === 'SCHEDULED' && (
                <button
                  type="button"
                  className={styles.fullWidthCompleteBtn}
                  onClick={() => {
                    const existing = parseExistingDiscount(currentVisit, subtotal);
                    setDiscountType(existing.type);
                    setDiscountValue(existing.value);
                    setIsCompleting(true);
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Complete Appointment</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
