import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowLeft, Clock, Search } from 'lucide-react';
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

// Full-screen mobile sheet for looking a registration up by its reference
// number. Submitted information is shown read-only: while a registration is
// Pending it cannot be changed.
const RegistrationStatus = ({ isOpen, onClose }: RegistrationStatusProps) => {
  const [referenceInput, setReferenceInput] = useState('');
  const [result, setResult] = useState<AlumniRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Start from a clean lookup every time the sheet is opened.
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
    <div className="mobile-register-sheet" role="dialog" aria-modal="true" aria-label="Check registration status">
      {/* Sheet header */}
      <header className="mobile-register-header">
        <button className="mobile-register-back" onClick={onClose} aria-label="Close registration status">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>Check Status</h2>
          <p>Use your reference number</p>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="mobile-register-body">
        <form className="mobile-status-lookup" onSubmit={handleCheck} noValidate>
          <label className="mobile-status-label" htmlFor="status-reference">
            Reference Number
          </label>
          <input
            id="status-reference"
            type="text"
            className="mobile-input"
            placeholder="e.g. ACC-2026-00125"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
          />
          <button type="submit" className="mobile-register-submit" disabled={searching}>
            {searching ? (
              <span className="loading-btn">
                <span className="btn-spinner" aria-hidden="true"></span>
                Checking…
              </span>
            ) : (
              <>
                <Search size={18} />
                Check Status
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mobile-register-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mobile-status-result">
            <div className="mobile-status-result-header">
              <span className={`mobile-status-badge is-${result.status.toLowerCase()}`}>
                {result.status === 'Pending' && <Clock size={14} />}
                {result.status}
              </span>
              <span className="mobile-status-reference">{result.referenceNumber}</span>
            </div>

            <dl className="mobile-status-details">
              <div className="mobile-status-row">
                <dt>Full Name</dt>
                <dd>{result.fullName}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Email</dt>
                <dd>{result.email}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Phone</dt>
                <dd>{result.phone}</dd>
              </div>
              {result.address && (
                <div className="mobile-status-row">
                  <dt>Address</dt>
                  <dd>{result.address}</dd>
                </div>
              )}
              <div className="mobile-status-row">
                <dt>Date of Birth</dt>
                <dd>
                  {formatDate(result.dateOfBirth)} ({getAge(result.dateOfBirth)} yrs)
                </dd>
              </div>
              <div className="mobile-status-row">
                <dt>Gender</dt>
                <dd>{result.gender}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Student ID</dt>
                <dd>{result.studentId}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Course</dt>
                <dd>{result.course}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Department</dt>
                <dd>{result.department}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Expected Graduation Year</dt>
                <dd>{result.expectedGraduationYear}</dd>
              </div>
              <div className="mobile-status-row">
                <dt>Submitted</dt>
                <dd>{formatDate(result.submittedAt)}</dd>
              </div>
            </dl>

            {result.status === 'Pending' && (
              <p className="mobile-status-locked">
                Your registration is currently pending verification by the alumni office.
                Submitted information cannot be changed while it is pending.
              </p>
            )}

            <button type="button" className="mobile-status-again" onClick={handleCheckAnother}>
              Check another reference number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationStatus;