import { alumniData } from '../../data/alumniData';
import type { Alumni } from '../../types/Alumni';
import type { AlumniRegistration } from '../../types/Registration';
import { getInitials, formatDate, formatShortDate, getAge } from '../../utils/formatters';
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  CreditCard,
  Award,
  Calendar,
  Clock,
  Hash,
  LogOut,
  ChevronRight,
  CircleUserRound,
  UserPlus
} from 'lucide-react';

interface AlumniProfileProps {
  user: { name: string; email: string; role: string } | null;
  registration: AlumniRegistration | null;
  onStartRegistration: () => void;
  onLogout: () => void;
}

const AlumniProfile = ({ user, registration, onStartRegistration, onLogout }: AlumniProfileProps) => {
  // The alumni record is only available once the registration form has been
  // completed and submitted.
  if (!registration) {
    return (
      <div className="mobile-tab-header">
        <div className="mobile-tab-title">
          <h2>My Profile</h2>
          <p>Your alumni record</p>
        </div>

        <div className="mobile-profile-gate">
          <span className="mobile-profile-gate-icon">
            <UserPlus size={28} />
          </span>
          <h3>No profile yet</h3>
          <p>
            You need to complete and submit the registration form first before your alumni
            profile can be shown.
          </p>
          <button className="mobile-register-submit" onClick={onStartRegistration}>
            <UserPlus size={18} />
            Fill Registration Form
          </button>
        </div>
      </div>
    );
  }

  const base = alumniData.find((a) => a.fullName === user?.name) || alumniData[0];

  // Show the details the user submitted during registration, falling back to
  // the existing record for fields the form does not collect (employment).
  const alumni: Alumni = {
    ...base,
    fullName: registration.fullName,
    email: registration.email,
    phone: registration.phone,
    address: registration.address || base.address,
    dateOfBirth: registration.dateOfBirth,
    gender: registration.gender,
    studentId: registration.studentId,
    course: registration.course,
    department: registration.department,
    graduationYear: registration.expectedGraduationYear
  };

  return (
    <div className="mobile-tab-header">
      <div className="mobile-tab-title">
        <h2>My Profile</h2>
        <p>Your alumni record</p>
      </div>

      <div className="mobile-profile-card">
        <span className="mobile-profile-avatar" style={{ backgroundColor: alumni.avatarColor }}>
          {getInitials(alumni.fullName)}
        </span>
        <h3>{alumni.fullName}</h3>
        <p>{alumni.course} · Class of {alumni.graduationYear}</p>
        <span className="mobile-job-status-chip">{alumni.employmentStatus}</span>
      </div>

      <div className="mobile-profile-stats">
        <div>
          <strong>{alumni.yearsOfExperience}+</strong>
          <span>Years exp.</span>
        </div>
        <div>
          <strong>{alumni.gender}</strong>
          <span>Gender</span>
        </div>
        <div>
          <strong>{alumni.honors || '—'}</strong>
          <span>Honors</span>
        </div>
      </div>

      <div className="mobile-profile-section">
        <h4>Contact Information</h4>
        <div className="mobile-profile-rows">
          <span><Mail size={16} /> {alumni.email}</span>
          <span><Phone size={16} /> {alumni.phone}</span>
          <span><MapPin size={16} /> {alumni.address}</span>
        </div>
      </div>

      <div className="mobile-profile-section">
        <h4>Employment</h4>
        <div className="mobile-profile-rows">
          <span><Briefcase size={16} /> {alumni.position} at {alumni.company}</span>
          <span><Building2 size={16} /> {alumni.industry} · {alumni.location}</span>
        </div>
      </div>

      <div className="mobile-profile-section">
        <h4>Academic Record</h4>
        <div className="mobile-profile-rows">
          <span><GraduationCap size={16} /> {alumni.department}</span>
          <span><CreditCard size={16} /> Student ID: {alumni.studentId}</span>
          {alumni.honors !== 'None' && <span><Award size={16} /> {alumni.honors}</span>}
          <span><Calendar size={16} /> Born {formatDate(alumni.dateOfBirth)} ({getAge(alumni.dateOfBirth)} yrs)</span>
        </div>
      </div>

      <div className="mobile-profile-section">
        <h4>Registration</h4>
        <div className="mobile-profile-rows">
          <span><Hash size={16} /> Reference: {registration.referenceNumber}</span>
          <span><UserPlus size={16} /> Submitted {formatDate(registration.submittedAt)}</span>
          <span>
            <Clock size={16} /> Status: {registration.status}
            {registration.status === 'Pending' ? ' - for verification by the alumni office' : ''}
          </span>
        </div>
      </div>

      <div className="mobile-profile-section">
        <h4>Account</h4>
        <div className="mobile-profile-actions">
          <button className="mobile-profile-action" onClick={onLogout}>
            <LogOut size={18} />
            Log out
            <ChevronRight size={16} />
          </button>
        </div>
        <p className="mobile-profile-version">
          <CircleUserRound size={14} /> Registered {formatShortDate(alumni.registeredAt)}
        </p>
      </div>
    </div>
  );
};

export default AlumniProfile;