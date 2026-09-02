import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, Clock, Search, X } from 'lucide-react';
import type { AlumniRegistration } from '../../types/Registration';
import {
  findRegistrationByReference,
  isValidReferenceNumberFormat,
  normalizeReferenceNumber
} from '../../services/registrationService';
import { formatDate, getAge } from '../../utils/formatters';

interface RegistrationStatusProps {
  isOpen: boolean;
  onClose: () => void;
}

// Desktop modal for looking a registration up by its reference number.
// No account is needed - the reference number handed out at submission time
// is the lookup key. Submitted information is shown read-only: while a
// registration is Pending it cannot be changed.
const RegistrationStatus = ({ isOpen, onClose }: RegistrationStatusProps) => {
  const [referenceInput, setReferenceInput] = useState('');
  const [result, setResult] = useState<AlumniRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Start from a clean lookup every time the modal is opened.
  useEffect(() => {
    if (!isOpen) return;

    setReferenceInput('');
    setResult(null);
    setError(null);
    setSearching(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheck = async (e: FormEvent) => {
    e.preventDefault();

    const normalized = normalizeReferenceNumber(referenceInput);
    if (!normalized) {
      setError('Please enter your reference number.');
      setResult(null);
      return;
    }

    if (!isValidReferenceNumberFormat(normalized)) {
      setError('Reference numbers look like ACC-2026-00125. Please check and try again.');
      setResult(null);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      // Mimics a network lookup - swapped for the real backend API later.
      await new Promise((resolve) => setTimeout(resolve, 700));

      const found = findRegistrationByReference(normalized);
      if (!found) {
        setError(
          `No registration was found for ${normalized}. Please double-check your reference number.`
        );
        setResult(null);
        return;
      }

      setResult(found);
    } finally {
      setSearching(false);
    }
  };

  const handleCheckAnother = () => {
    setResult(null);
    setError(null);
    setReferenceInput('');
  };

  return (
    <div className="alumni-modal-overlay" role="dialog" aria-modal="true" aria-label="Check registration status">
      <div className="alumni-modal">
        <header className="alumni-modal-header">
          <div>
            <h2>Check Registration Status</h2>
            <p>No account needed - just your reference number</p>
          </div>
          <button className="alumni-modal-close" onClick={onClose} aria-label="Close registration status">
            <X size={20} />
          </button>
        </header>

        <div className="alumni-modal-body">
          <form className="alumni-status-lookup" onSubmit={handleCheck} noValidate>
            <input
              type="text"
              className="alumni-input"
              placeholder="e.g. ACC-2026-00125"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              aria-label="Reference number"
            />
            <button type="submit" className="btn btn-primary alumni-status-check" disabled={searching}>
              {searching ? (
                <span className="loading-btn">
                  <span className="btn-spinner" aria-hidden="true"></span>
                  Checking…
                </span>
              ) : (
                <>
                  <Search size={16} />
                  Check Status
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="alumni-form-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="alumni-status-result">
              <div className="alumni-status-result-header">
                <span className={`alumni-status-badge is-${result.status.toLowerCase()}`}>
                  {result.status === 'Pending' && <Clock size={14} />}
                  {result.status}
                </span>
                <span className="alumni-status-reference">{result.referenceNumber}</span>
              </div>

              <dl className="alumni-status-details">
                <div className="alumni-status-row">
                  <dt>Full Name</dt>
                  <dd>{result.fullName}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Email</dt>
                  <dd>{result.email}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Phone</dt>
                  <dd>{result.phone}</dd>
                </div>
                {result.address && (
                  <div className="alumni-status-row">
                    <dt>Address</dt>
                    <dd>{result.address}</dd>
                  </div>
                )}
                <div className="alumni-status-row">
                  <dt>Date of Birth</dt>
                  <dd>
                    {formatDate(result.dateOfBirth)} ({getAge(result.dateOfBirth)} yrs)
                  </dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Gender</dt>
                  <dd>{result.gender}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Student ID</dt>
                  <dd>{result.studentId}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Course</dt>
                  <dd>{result.course}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Department</dt>
                  <dd>{result.department}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Expected Graduation Year</dt>
                  <dd>{result.expectedGraduationYear}</dd>
                </div>
                <div className="alumni-status-row">
                  <dt>Submitted</dt>
                  <dd>{formatDate(result.submittedAt)}</dd>
                </div>
              </dl>

              {result.status === 'Pending' && (
                <p className="alumni-status-locked">
                  Your registration is currently pending verification by the alumni office.
                  Submitted information cannot be changed while it is pending.
                </p>
              )}

              <button type="button" className="alumni-status-again" onClick={handleCheckAnother}>
                Check another reference number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStatus;