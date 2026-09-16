import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, Search } from 'lucide-react';
import { AppointmentTable } from './components/AppointmentTable/AppointmentTable';
import { AppointmentFilters } from './components/AppointmentFilters/AppointmentFilters';
import { AppointmentDetailModal } from './components/AppointmentDetailModal/AppointmentDetailModal';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import appointmentsService from './services/appointments.service';
import { Visit } from '../../types/common.types';
import { AppointmentSortOption, AppointmentStatusFilter } from './types/appointments.types';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Appointments.module.css';

export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Visit[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<AppointmentSortOption>('date_desc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isCompletingDirectly, setIsCompletingDirectly] = useState(false);

  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await appointmentsService.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(`Are you sure you want to delete appointment #${id}?`);
    if (!confirmed) return;

    try {
      await appointmentsService.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedVisit?.id === id) {
        setSelectedVisit(null);
      }
    } catch (err) {
      alert('Failed to delete appointment.');
    }
  };

  // Filter appointments based on status and debounced search
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) {
      return false;
    }

    if (!debouncedSearch.trim()) return true;

    const query = debouncedSearch.toLowerCase().trim();
    const patientName = apt.patient
      ? `${apt.patient.first_name} ${apt.patient.last_name}`.toLowerCase()
      : '';
    const phone = apt.patient?.phone?.toLowerCase() || '';
    const aptId = `#${apt.id}`.toLowerCase();
    const notes = apt.notes?.toLowerCase() || '';
    const tests = (apt.tests_ordered || [])
      .map((t) => `${t.test?.code || ''} ${t.test?.name || ''}`.toLowerCase())
      .join(' ');

    return (
      patientName.includes(query) ||
      phone.includes(query) ||
      aptId.includes(query) ||
      notes.includes(query) ||
      tests.includes(query)
    );
  });

  // Sort appointments: Scheduled on top, completed below, and then by selected sort
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const getPriority = (status: string) => {
      if (status === 'SCHEDULED') return 0;
      if (status === 'IN_PROGRESS') return 1;
      if (status === 'COMPLETED') return 2;
      if (status === 'CANCELLED') return 3;
      return 4;
    };
    const diff = getPriority(a.status) - getPriority(b.status);
    if (diff !== 0) return diff;

    // For completed appointments on default date_desc, sort by completion time (updated_at) or id
    if (sortBy === 'date_desc' && a.status === 'COMPLETED' && b.status === 'COMPLETED') {
      const timeA = new Date(a.updated_at || a.created_at || a.visit_date).getTime() || 0;
      const timeB = new Date(b.updated_at || b.created_at || b.visit_date).getTime() || 0;
      if (timeB !== timeA) return timeB - timeA;
      return b.id - a.id;
    }

    switch (sortBy) {
      case 'date_desc': {
        const timeA = new Date(a.visit_date || a.created_at).getTime() || 0;
        const timeB = new Date(b.visit_date || b.created_at).getTime() || 0;
        if (timeB !== timeA) return timeB - timeA;
        return b.id - a.id;
      }
      case 'date_asc': {
        const timeA = new Date(a.visit_date || a.created_at).getTime() || 0;
        const timeB = new Date(b.visit_date || b.created_at).getTime() || 0;
        return timeA - timeB;
      }
      case 'patient_asc': {
        const nameA = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '';
        const nameB = b.patient ? `${b.patient.first_name} ${b.patient.last_name}` : '';
        return nameA.localeCompare(nameB);
      }
      case 'patient_desc': {
        const nameA = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '';
        const nameB = b.patient ? `${b.patient.first_name} ${b.patient.last_name}` : '';
        return nameB.localeCompare(nameA);
      }
      case 'amount_desc':
        return Number(b.total_amount) - Number(a.total_amount);
      case 'amount_asc':
        return Number(a.total_amount) - Number(b.total_amount);
      default: {
        const timeA = new Date(a.visit_date || a.created_at).getTime() || 0;
        const timeB = new Date(b.visit_date || b.created_at).getTime() || 0;
        return timeB - timeA;
      }
    }
  });

  const hasActiveFilters = Boolean(search.trim()) || statusFilter !== 'ALL' || sortBy !== 'date_desc';

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setSortBy('date_desc');
  };

  return (
    <div className={styles.container}>
      {/* Top Bar with Search, Filters, and Create Action */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, phone, appt #, or test..."
            leftIcon={<Search size={16} />}
          />
        </div>
        <AppointmentFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <Button
          leftIcon={<CalendarPlus size={18} />}
          onClick={() => navigate('/appointments/new')}
          className={styles.createApptBtn}
        >
          Create Appointment
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading scheduled laboratory appointments...</div>
      ) : (
        <AppointmentTable
          appointments={sortedAppointments}
          onView={(visit) => {
            setSelectedVisit(visit);
            setIsCompletingDirectly(false);
          }}
          onComplete={(visit) => {
            setSelectedVisit(visit);
            setIsCompletingDirectly(true);
          }}
          onDelete={handleDelete}
          onScheduleClick={() => navigate('/appointments/new')}
        />
      )}

      {/* Appointment Detail Modal */}
      {selectedVisit && (
        <AppointmentDetailModal
          visit={selectedVisit}
          initialIsCompleting={isCompletingDirectly}
          onClose={() => {
            setSelectedVisit(null);
            setIsCompletingDirectly(false);
          }}
          onEdit={(visit) => {
            setSelectedVisit(null);
            navigate(`/appointments/edit/${visit.id}`);
          }}
          onUpdated={fetchAppointments}
        />
      )}
    </div>
  );
};

export default Appointments;
