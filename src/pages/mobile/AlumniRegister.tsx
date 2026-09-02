import { useState, useEffect, type FormEvent } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Copy,
  User,
  UserPlus,
  GraduationCap
} from 'lucide-react';
import type { AlumniRegistration, AlumniRegistrationData } from '../../types/Registration';
import { submitRegistration } from '../../services/registrationService';

interface AlumniRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (registration: AlumniRegistration) => void;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: '' | 'Male' | 'Female' | 'Other';
  studentId: string;
  course: string;
  department: string;
  expectedGraduationYear: string;
}

const initialFormData: RegisterFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  studentId: '',
  course: '',
  department: '',
  expectedGraduationYear: ''
};

// Options mirror the departments/courses already tracked in alumniData.
const COURSE_OPTIONS = [
  'BS Accountancy',
  'BS Architecture',
  'BS Business Administration',
  'BS Civil Engineering',
  'BS Computer Engineering',
  'BS Computer Science',
  'BS Electrical Engineering',
  'BS Information Technology',
  'BS Mechanical Engineering',
  'BS Nursing',
  'BS Psychology',
  'BS Tourism Management'
];

const DEPARTMENT_OPTIONS = [
  'College of Architecture',
  'College of Arts and Sciences',
  'College of Business',
  'College of Computer Studies',
  'College of Engineering',
  'College of Health Sciences',
  'College of Management'
];

const CURRENT_YEAR = new Date().getFullYear();

const REQUIRED_FIELDS: (keyof RegisterFormData)[] = [
  'fullName',
  'email',
  'phone',
  'dateOfBirth',
  'gender',
  'studentId',
  'course',
  'department',
  'expectedGraduationYear'
];

const AlumniRegister = ({ isOpen, onClose, onRegistered }: AlumniRegisterProps) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedRegistration, setSavedRegistration] = useState<AlumniRegistration | null>(null);
  const [copied, setCopied] = useState(false);

  // Lock background scrolling while the full-screen sheet is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Start from a clean form every time the sheet is opened.
  useEffect(() => {
    if (!isOpen) return;

    setFormData(initialFormData);
    setErrorFields([]);
    setLoading(false);
    setSubmitted(false);
    setSavedRegistration(null);
    setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the invalid highlight as soon as the user edits the field.
    setErrorFields((prev) => prev.filter((f) => f !== field));
  };

  const validateForm = (): string[] => {
    const errors = new Set<string>();

    REQUIRED_FIELDS.forEach((field) => {
      if (!String(formData[field]).trim()) errors.add(field);
    });

    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.add('email');
    }

    // Expected graduation year may be up to 10 years ahead for current students.
    const expectedGraduationYear = Number(formData.expectedGraduationYear);
    if (
      formData.expectedGraduationYear &&
      (!Number.isInteger(expectedGraduationYear) ||
        expectedGraduationYear < 1950 ||
        expectedGraduationYear > CURRENT_YEAR + 10)
    ) {
      errors.add('expectedGraduationYear');
    }

    return Array.from(errors);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorFields(errors);
      return;
    }

    setLoading(true);
    try {
      // Persist the submission. The registration service assigns the
      // reference number and the initial Pending status; this call is later
      // swapped for the real backend API without changing the UI.
      const registration = await submitRegistration({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        dateOfBirth: formData.dateOfBirth,
        // Validation guarantees gender is selected before submission.
        gender: formData.gender as AlumniRegistrationData['gender'],
        studentId: formData.studentId.trim(),
        course: formData.course,
        department: formData.department,
        expectedGraduationYear: Number(formData.expectedGraduationYear)
      });

      onRegistered?.(registration);

      setSavedRegistration(registration);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof RegisterFormData) =>
    `mobile-input${errorFields.includes(field) ? ' is-invalid' : ''}`;

  const handleCopyReference = async () => {
    if (!savedRegistration) return;

    try {
      await navigator.clipboard.writeText(savedRegistration.referenceNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available - the number stays visible so it can be
      // copied or written down manually.
    }
  };

  if (submitted && savedRegistration) {
    const firstName = formData.fullName.trim().split(' ')[0] || 'Alumni';

    return (
      <div className="mobile-register-sheet" role="dialog" aria-modal="true" aria-label="Registration submitted">
        <div className="mobile-register-success">
          <span className="mobile-register-success-icon">
            <CheckCircle2 size={42} />
          </span>
          <h2>Registration Submitted!</h2>
          <p>
            Thank you, {firstName}! Registration submitted successfully. Your registration is
            currently <strong>Pending</strong>.
          </p>

          <div className="mobile-reference-box">
            <span className="mobile-reference-label">Reference Number</span>
            <div className="mobile-reference-row">
              <span className="mobile-reference-number">{savedRegistration.referenceNumber}</span>
              <button type="button" className="mobile-reference-copy" onClick={handleCopyReference}>
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <p>
            Please keep your reference number to check your registration status. You can use it
            anytime through <strong>Check registration status</strong> on the Home page.
          </p>

          <button className="mobile-register-submit" onClick={onClose}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-register-sheet" role="dialog" aria-modal="true" aria-label="Alumni registration">
      {/* Sheet header */}
      <header className="mobile-register-header">
        <button className="mobile-register-back" onClick={onClose} aria-label="Close registration form">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>Alumni Registration</h2>
          <p>Join the alumni community</p>
        </div>
      </header>

      {/* Scrollable form */}
      <form className="mobile-register-body" onSubmit={handleSubmit} noValidate>
        {errorFields.length > 0 && (
          <div className="mobile-register-error">
            <AlertCircle size={18} />
            <span>Please complete the highlighted required fields.</span>
          </div>
        )}

        <section className="mobile-register-section">
          <h3><User size={16} /> Personal Information</h3>

          <div className="mobile-form-group">
            <label htmlFor="reg-fullname">Full Name *</label>
            <input
              id="reg-fullname"
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              autoComplete="name"
              className={inputClass('fullName')}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass('email')}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-phone">Phone Number *</label>
            <input
              id="reg-phone"
              type="tel"
              placeholder="+63 912 345 6789"
              autoComplete="tel"
              className={inputClass('phone')}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-birthdate">Date of Birth *</label>
            <input
              id="reg-birthdate"
              type="date"
              className={inputClass('dateOfBirth')}
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-gender">Gender *</label>
            <select
              id="reg-gender"
              className={inputClass('gender')}
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value as RegisterFormData['gender'])}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-address">Address</label>
            <textarea
              id="reg-address"
              placeholder="Street, City, Province"
              rows={2}
              className="mobile-input"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </section>

        <section className="mobile-register-section">
          <h3><GraduationCap size={16} /> Academic Background</h3>

          <div className="mobile-form-group">
            <label htmlFor="reg-studentid">Student ID *</label>
            <input
              id="reg-studentid"
              type="text"
              placeholder="e.g. AL-2018-001"
              className={inputClass('studentId')}
              value={formData.studentId}
              onChange={(e) => handleChange('studentId', e.target.value)}
            />
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-course">Course *</label>
            <select
              id="reg-course"
              className={inputClass('course')}
              value={formData.course}
              onChange={(e) => handleChange('course', e.target.value)}
            >
              <option value="">Select course</option>
              {COURSE_OPTIONS.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-department">Department *</label>
            <select
              id="reg-department"
              className={inputClass('department')}
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">Select department</option>
              {DEPARTMENT_OPTIONS.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>

          <div className="mobile-form-group">
            <label htmlFor="reg-year">Expected Graduation Year * (1950–{CURRENT_YEAR + 10})</label>
            <input
              id="reg-year"
              type="number"
              inputMode="numeric"
              min={1950}
              max={CURRENT_YEAR + 10}
              placeholder="e.g. 2026"
              className={inputClass('expectedGraduationYear')}
              value={formData.expectedGraduationYear}
              onChange={(e) => handleChange('expectedGraduationYear', e.target.value)}
            />
          </div>
        </section>

        <button type="submit" className="mobile-register-submit" disabled={loading}>
          {loading ? (
            <span className="loading-btn">
              <span className="btn-spinner" aria-hidden="true"></span>
              Submitting…
            </span>
          ) : (
            <>
              <UserPlus size={18} />
              Submit Registration
            </>
          )}
        </button>

        <p className="mobile-register-note">
          Your information will be reviewed and verified by the alumni office before your account becomes active.
        </p>
      </form>
    </div>
  );
};

export default AlumniRegister;