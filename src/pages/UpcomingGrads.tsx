import { useState } from 'react';
import { Check, Clock, GraduationCap, RotateCcw, Trash2, X } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import type { AlumniRegistration } from '../types/Registration';
import {
  deleteRegistration,
  getAllRegistrations,
  updateRegistrationStatus
} from '../services/registrationService';
import { formatFullName, getInitials, formatDate } from '../utils/formatters';

// Which list is shown: new submissions awaiting a decision, or the trash bin
// holding declined registrations.
type GradView = 'pending' | 'trash';

const UpcomingGrads = () => {
  const [registrations, setRegistrations] = useState<AlumniRegistration[]>(getAllRegistrations);
  const [toast, setToast] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [view, setView] = useState<GradView>('pending');

  // Only the newest submissions need a decision from the alumni office.
  const pendingRegistrations = registrations.filter((r) => r.status === 'Pending');

  // Declined registrations are kept in the trash bin until they are either
  // restored to pending or permanently deleted.
  const trashRegistrations = registrations.filter((r) => r.status === 'Rejected');

  const showToast = (type: 'success' | 'danger', message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleDecision = (registration: AlumniRegistration, status: 'Approved' | 'Rejected') => {
    updateRegistrationStatus(registration.referenceNumber, status);
    setRegistrations(getAllRegistrations());
    const displayName = formatFullName(registration.fullName, registration.suffix);
    showToast(
      status === 'Approved' ? 'success' : 'danger',
      status === 'Approved'
        ? `${displayName}'s registration was approved.`
        : `${displayName}'s registration was declined and moved to the trash bin.`
    );
  };

  // Puts a declined registration back into the pending queue.
  const handleRestore = (registration: AlumniRegistration) => {
    updateRegistrationStatus(registration.referenceNumber, 'Pending');
    setRegistrations(getAllRegistrations());
    showToast('success', `${formatFullName(registration.fullName, registration.suffix)}'s registration was restored to pending.`);
  };

  // Permanently removes a declined registration. This cannot be undone.
  const handleDelete = (registration: AlumniRegistration) => {
    deleteRegistration(registration.referenceNumber);
    setRegistrations(getAllRegistrations());
    showToast('danger', `${formatFullName(registration.fullName, registration.suffix)}'s registration was permanently deleted.`);
  };

  const infoColumns: Column<AlumniRegistration>[] = [
    {
      key: 'fullName',
      header: 'Applicant',
      render: (r) => (
        <div className="alumni-name-cell">
          <div className="avatar" style={{ backgroundColor: 'var(--primary)' }}>
            {getInitials(r.fullName)}
          </div>
          <div>
            <div className="alumni-name">{formatFullName(r.fullName, r.suffix)}</div>
            <div className="alumni-email">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'studentId',
      header: 'Student ID',
      render: (r) => <span>{r.studentId || '—'}</span>
    },
    {
      key: 'course',
      header: 'Course',
      render: (r) => <span>{r.course || '—'}</span>
    },
    {
      key: 'expectedGraduationYear',
      header: 'Expected Graduation',
      render: (r) => <span>{r.expectedGraduationYear}</span>
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (r) => <span>{formatDate(r.submittedAt)}</span>
    },
  ];

  const pendingColumns: Column<AlumniRegistration>[] = [
    ...infoColumns,
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="action-buttons">
          <button
            type="button"
            className="action-btn action-approve"
            title="Accept registration"
            onClick={(e) => {
              e.stopPropagation();
              handleDecision(r, 'Approved');
            }}
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            className="action-btn action-delete"
            title="Decline registration"
            onClick={(e) => {
              e.stopPropagation();
              handleDecision(r, 'Rejected');
            }}
          >
            <X size={16} />
          </button>
        </div>
      )
    }
  ];

  const trashColumns: Column<AlumniRegistration>[] = [
    ...infoColumns,
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="action-buttons">
          <button
            type="button"
            className="action-btn action-approve"
            title="Restore to pending"
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(r);
            }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            className="action-btn action-delete"
            title="Delete permanently"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(r);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Upcoming Graduates</h1>
        <p>Review and verify newly registered alumni</p>
      </div>

      {toast && (
        <div className={`toast-message ${toast.type === 'success' ? 'toast-success' : 'toast-danger'}`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="level-tabs" role="tablist" aria-label="Registration views">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'pending'}
          className={`level-tab${view === 'pending' ? ' active' : ''}`}
          onClick={() => setView('pending')}
        >
          <Clock size={16} />
          Pending
          <span className="level-tab-count">{pendingRegistrations.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'trash'}
          className={`level-tab${view === 'trash' ? ' active' : ''}`}
          onClick={() => setView('trash')}
        >
          <Trash2 size={16} />
          Trash Bin
          <span className="level-tab-count">{trashRegistrations.length}</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header card-header-actions">
          <h3>
            {view === 'pending' ? <Clock size={16} /> : <Trash2 size={16} />}
            {view === 'pending' ? 'Pending Registrations' : 'Trash Bin'}
          </h3>
          <span className="alumni-card-tag">
            {view === 'pending' ? `${pendingRegistrations.length} waiting` : `${trashRegistrations.length} declined`}
          </span>
        </div>

        {view === 'pending' ? (
          pendingRegistrations.length === 0 ? (
            <EmptyState
              title="No pending registrations"
              description="New alumni registrations will appear here for verification once submitted."
              icon={<GraduationCap size={48} />}
            />
          ) : (
            <DataTable columns={pendingColumns} data={pendingRegistrations} />
          )
        ) : trashRegistrations.length === 0 ? (
          <EmptyState
            title="Trash bin is empty"
            description="Declined registrations will appear here. Restore them to pending or delete them permanently."
            icon={<Trash2 size={48} />}
          />
        ) : (
          <DataTable columns={trashColumns} data={trashRegistrations} />
        )}
      </div>
    </div>
  );
};

export default UpcomingGrads;