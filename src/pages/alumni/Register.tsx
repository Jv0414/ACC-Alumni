import { useState, type FormEvent } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  FileSearch,
  GraduationCap,
  User,
  UserPlus
} from 'lucide-react';
import type { AlumniRegistration, AlumniRegistrationData } from '../../types/Registration';
import type { EducationLevel } from '../../types/Alumni';
import { submitRegistration } from '../../services/registrationService';
import {
  COLLEGE_COURSE_DEPARTMENTS,
  COLLEGE_COURSE_OPTIONS as COURSE_OPTIONS,
  SENIOR_HIGH_STRAND_OPTIONS as STRAND_OPTIONS
} from '../../data/collegePrograms';
import type { AlumniPortalContext } from '../../layouts/AlumniSystemLayout';
import { formatDate, formatFullName, getAge } from '../../utils/formatters';

interface RegisterFormData {
  fullName: string;
  suffix: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: '' | 'Male' | 'Female' | 'Other';
  course: string;
  department: string;
  expectedGraduationYear: string;
}

const initialFormData: RegisterFormData = {
  fullName: '',
  suffix: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  course: '',
  department: '',
  expectedGraduationYear: ''
};

// Course and department options come from the shared official college
// program list (see src/data/collegePrograms.ts).

const CURRENT_YEAR = new Date().getFullYear();

const REQUIRED_FIELDS: (keyof RegisterFormData)[] = [
  'fullName',
  'email',
  'phone',
  'dateOfBirth',
  'gender',
  'expectedGraduationYear'
];

// The selected level decides which academic fields the form shows and how the
// course/department values are derived on submit.
const LEVEL_TABS: { id: EducationLevel; label: string }[] = [
  { id: 'College', label: 'College' },
  { id: 'Senior High School', label: 'Senior High School' },
  { id: 'Elementary', label: 'Elementary' }
];

const AlumniSystemRegister = () => {
  const { registration, setRegistration } = useOutletContext<AlumniPortalContext>();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedRegistration, setSavedRegistration] = useState<AlumniRegistration | null>(null);
  const [copied, setCopied] = useState(false);
  const [level, setLevel] = useState<EducationLevel>('College');
  // Holds the validated answers while the registrant reviews them on the
  // confirmation step. Null means the form is still being filled in.
  const [pendingData, setPendingData] = useState<AlumniRegistrationData | null>(null);

  // Switching level clears the academic fields since College, Senior High
  // School and Elementary each collect different program information.
  const handleLevelChange = (next: EducationLevel) => {
    if (next === level) return;
    setLevel(next);
    setFormData((prev) => ({ ...prev, course: '', department: '' }));
    setErrorFields((prev) => prev.filter((f) => f !== 'course'));
  };

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

    // Elementary has no course/strand; College and Senior High School must pick one.
    if (level !== 'Elementary' && !formData.course.trim()) {
      errors.add('course');
    }

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

  // First submit does not send anything - it validates the answers and opens
  // the confirmation step below.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorFields(errors);
      return;
    }

    // The department follows from the level and program. Elementary
    // registrants have no course/strand at all.
    const department =
      level === 'College'
        ? COLLEGE_COURSE_DEPARTMENTS[formData.course] ?? ''
        : level === 'Senior High School'
          ? 'Senior High School Department'
          : 'Elementary Department';

    setPendingData({
      fullName: formData.fullName.trim(),
      // Optional - saved empty when the registrant has no suffix, so the
      // registration can still be sent without it.
      suffix: formData.suffix.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      dateOfBirth: formData.dateOfBirth,
      // Validation guarantees gender is selected before submission.
      gender: formData.gender as AlumniRegistrationData['gender'],
      course: level === 'Elementary' ? '' : formData.course,
      department,
      educationLevel: level,
      expectedGraduationYear: Number(formData.expectedGraduationYear)
    });
  };

  // Runs only after the registrant confirms the review step.
  const handleConfirm = async () => {
    if (!pendingData) return;

    setLoading(true);
    try {
      // Persist the submission. The registration service assigns the
      // reference number and the initial Pending status; this call is later
      // swapped for the real backend API without changing the UI.
      const result = await submitRegistration(pendingData);
      setRegistration(result);
      setSavedRegistration(result);
      setSubmitted(true);
      setPendingData(null);
    } finally {
      setLoading(false);
    }
  };

  // Back to the form so every answer can be re-edited.
  const handleEdit = () => {
    setPendingData(null);
  };

  const inputClass = (field: keyof RegisterFormData) =>
    `alumni-input${errorFields.includes(field) ? ' is-invalid' : ''}`;

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

  // Confirmation step - the registrant reviews everything they entered and
  // chooses to submit or go back and re-edit before anything is saved.
  if (pendingData && !submitted) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Review Your Registration</h1>
          <p>Confirm your information before submitting</p>
        </div>

        <div className="alumni-card">
          <div className="alumni-card-body">
            <dl className="alumni-status-details">
              <div className="alumni-status-row">
                <dt>Full Name</dt>
                <dd>{formatFullName(pendingData.fullName, pendingData.suffix)}</dd>
              </div>
              <div className="alumni-status-row">
                <dt>Email</dt>
                <dd>{pendingData.email}</dd>
              </div>
              <div className="alumni-status-row">
                <dt>Phone Number</dt>
                <dd>{pendingData.phone}</dd>
              </div>
              {pendingData.address && (
                <div className="alumni-status-row">
                  <dt>Address</dt>
                  <dd>{pendingData.address}</dd>
                </div>
              )}
              <div className="alumni-status-row">
                <dt>Date of Birth</dt>
                <dd>
                  {formatDate(pendingData.dateOfBirth)} ({getAge(pendingData.dateOfBirth)} yrs)
                </dd>
              </div>
              <div className="alumni-status-row">
                <dt>Gender</dt>
                <dd>{pendingData.gender}</dd>
              </div>
              {pendingData.educationLevel && (
                <div className="alumni-status-row">
                  <dt>Education Level</dt>
                  <dd>{pendingData.educationLevel}</dd>
                </div>
              )}
              {pendingData.course && (
                <div className="alumni-status-row">
                  <dt>{pendingData.educationLevel === 'Senior High School' ? 'Strand' : 'Course'}</dt>
                  <dd>{pendingData.course}</dd>
                </div>
              )}
              <div className="alumni-status-row">
                <dt>Department</dt>
                <dd>{pendingData.department}</dd>
              </div>
              <div className="alumni-status-row">
                <dt>Expected Graduation Year</dt>
                <dd>{pendingData.expectedGraduationYear}</dd>
              </div>
            </dl>

            <div className="alumni-review-ask">
              <strong>Is the information you entered correct?</strong>
              <p>
                If something is not right you can go back and re-edit your answers. Once
                confirmed, your registration will be submitted for verification.
              </p>
            </div>

            <div className="alumni-actions-row">
              <button type="button" className="btn btn-secondary" onClick={handleEdit} disabled={loading}>
                No, Re-edit My Answers
              </button>
              <button type="button" className="btn btn-primary btn-flat" onClick={handleConfirm} disabled={loading}>
                {loading ? (
                  <span className="loading-btn">
                    <span className="btn-spinner" aria-hidden="true"></span>
                    Submitting…
                  </span>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Yes, Submit Registration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Already registered -> summarize instead of showing the form again.
  if (registration && !submitted) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Alumni Registration</h1>
          <p>Join the alumni community</p>
        </div>

        <div className="alumni-card">
          <div className="alumni-card-body">
            <div className="alumni-reg-status is-done">
              <div>
                <CheckCircle2 size={18} />
                <div>
                  <strong>Registration already submitted</strong>
                  <p>
                    Reference number <strong>{registration.referenceNumber}</strong> · submitted{' '}
                    {formatDate(registration.submittedAt)} · currently{' '}
                    <strong>{registration.status}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="alumni-actions-row">
              <Link to="/alumni/status" className="btn btn-primary btn-flat">
                <FileSearch size={16} />
                Check Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success view right after a fresh submission.
  if (submitted && savedRegistration) {
    const firstName = savedRegistration.fullName.trim().split(' ')[0] || 'Alumni';

    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Alumni Registration</h1>
          <p>Join the alumni community</p>
        </div>

        <div className="alumni-card">
          <div className="alumni-modal-success">
            <span className="alumni-modal-success-icon">
              <CheckCircle2 size={32} />
            </span>
            <h2>Registration Submitted!</h2>
            <p>
              Thank you, {firstName}! Your registration is currently <strong>Pending</strong> and
              will be reviewed by the alumni office.
            </p>

            <div className="alumni-reference-box">
              <span className="alumni-reference-label">Reference Number</span>
              <div className="alumni-reference-row">
                <span className="alumni-reference-number">{savedRegistration.referenceNumber}</span>
                <button type="button" className="alumni-reference-copy" onClick={handleCopyReference}>
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <p>Please keep your reference number so you can check your registration status anytime.</p>

            <div className="alumni-actions-row">
              <Link to="/alumni/status" className="btn btn-primary btn-flat">
                <FileSearch size={16} />
                Check Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Alumni Registration</h1>
        <p>Join the alumni community - fill out the form below</p>
      </div>

      <div className="level-tabs" role="tablist" aria-label="Registration level">
        {LEVEL_TABS.map((lvl) => (
          <button
            key={lvl.id}
            type="button"
            role="tab"
            aria-selected={level === lvl.id}
            className={`level-tab${level === lvl.id ? ' active' : ''}`}
            onClick={() => handleLevelChange(lvl.id)}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="alumni-card">
          <div className="alumni-card-body">
            {errorFields.length > 0 && (
              <div className="alumni-form-error">
                <AlertCircle size={18} />
                <span>Please review the highlighted fields and try again.</span>
              </div>
            )}

            <section className="alumni-form-section">
              <h3><User size={16} /> Personal Information</h3>

              <div className="alumni-form-grid">
                <div className="alumni-form-group">
                  <label htmlFor="reg-fullname">Full Name *</label>
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="First Middle Last"
                    className={inputClass('fullName')}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>

                <div className="alumni-form-group">
                  <label htmlFor="reg-suffix">Suffix (Optional)</label>
                  <select
                    id="reg-suffix"
                    className={inputClass('suffix')}
                    value={formData.suffix}
                    onChange={(e) => handleChange('suffix', e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                  </select>
                </div>

                <div className="alumni-form-group">
                  <label htmlFor="reg-email">Email Address *</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass('email')}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div className="alumni-form-group">
                  <label htmlFor="reg-phone">Phone Number *</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+63 912 345 6789"
                    className={inputClass('phone')}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                <div className="alumni-form-group">
                  <label htmlFor="reg-dob">Date of Birth *</label>
                  <input
                    id="reg-dob"
                    type="date"
                    className={inputClass('dateOfBirth')}
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="alumni-form-group">
                  <label htmlFor="reg-gender">Gender *</label>
                  <select
                    id="reg-gender"
                    className={inputClass('gender')}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="alumni-form-group full">
                  <label htmlFor="reg-address">Address</label>
                  <textarea
                    id="reg-address"
                    rows={2}
                    placeholder="Street, City, Province"
                    className={inputClass('address')}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="alumni-form-section">
              <h3><GraduationCap size={16} /> Academic Background</h3>

              <div className="alumni-form-grid">
                {level !== 'Elementary' && (
                  <div className="alumni-form-group">
                    <label htmlFor="reg-course">
                      {level === 'Senior High School' ? 'Strand *' : 'Course *'}
                    </label>
                    <select
                      id="reg-course"
                      className={inputClass('course')}
                      value={formData.course}
                      onChange={(e) => handleChange('course', e.target.value)}
                    >
                      <option value="">
                        {level === 'Senior High School' ? 'Select strand' : 'Select course'}
                      </option>
                      {(level === 'Senior High School' ? STRAND_OPTIONS : COURSE_OPTIONS).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="alumni-form-group">
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
              </div>
            </section>

            <div className="alumni-form-footer">
              <p className="alumni-form-note">
                Your information will be reviewed and verified by the alumni office before your
                account becomes active.
              </p>
              <button type="submit" className="btn btn-primary alumni-submit" disabled={loading}>
                {loading ? (
                  <span className="loading-btn">
                    <span className="btn-spinner" aria-hidden="true"></span>
                    Submitting…
                  </span>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Submit Registration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AlumniSystemRegister;