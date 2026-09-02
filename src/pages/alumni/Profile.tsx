import { Link, useOutletContext } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Phone,
  UserPlus
} from 'lucide-react';
import type { AlumniPortalContext } from '../../layouts/AlumniSystemLayout';
import type { Alumni } from '../../types/Alumni';
import { alumniData } from '../../data/alumniData';
import { getInitials, formatDate, getAge } from '../../utils/formatters';

const AlumniSystemProfile = () => {
  const { user, registration } = useOutletContext<AlumniPortalContext>();

  // The alumni record is only available once the registration form has been
  // completed and submitted.
  if (!registration) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Your alumni record</p>
        </div>

        <div className="alumni-gate">
          <span className="alumni-gate-icon">
            <UserPlus size={26} />
          </span>
          <h3>No profile yet</h3>
          <p>
            You need to complete and submit the registration form first before your alumni
            profile can be shown.
          </p>
          <Link to="/alumni/registration" className="btn btn-primary alumni-submit">
            <UserPlus size={16} />
            Fill Registration Form
          </Link>
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
    <div className="page-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Your alumni record</p>
      </div>

      <div className="alumni-profile-header">
        <span className="alumni-profile-avatar" style={{ backgroundColor: alumni.avatarColor }}>
          {getInitials(alumni.fullName)}
        </span>
        <div className="alumni-profile-id">
          <h2>{alumni.fullName}</h2>
          <p>{alumni.course} · Class of {alumni.graduationYear}</p>
          <span className="alumni-status-chip">{alumni.employmentStatus}</span>
        </div>
        <span className={`alumni-status-badge is-${registration.status.toLowerCase()}`}>
          {registration.status === 'Pending' && <Clock size={14} />}
          {registration.status}
        </span>
      </div>

      <div className="alumni-profile-stats">
        <div>
          <strong>{alumni.yearsOfExperience}+</strong>
          <span>Years experience</span>
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

      <div className="alumni-profile-grid">
        <div className="alumni-card alumni-info-card">
          <h4>Contact Information</h4>
          <div className="alumni-info-rows">
            <span><Mail size={16} /> {alumni.email}</span>
            <span><Phone size={16} /> {alumni.phone}</span>
            <span><MapPin size={16} /> {alumni.address}</span>
          </div>
        </div>

        <div className="alumni-card alumni-info-card">
          <h4>Employment</h4>
          <div className="alumni-info-rows">
            <span><Briefcase size={16} /> {alumni.position} at {alumni.company}</span>
            <span><Building2 size={16} /> {alumni.industry} · {alumni.location}</span>
          </div>
        </div>

        <div className="alumni-card alumni-info-card">
          <h4>Academic Record</h4>
          <div className="alumni-info-rows">
            <span><GraduationCap size={16} /> {alumni.department}</span>
            <span><CreditCard size={16} /> Student ID: {alumni.studentId}</span>
            {alumni.honors !== 'None' && <span><Award size={16} /> {alumni.honors}</span>}
            <span><Calendar size={16} /> Born {formatDate(alumni.dateOfBirth)} ({getAge(alumni.dateOfBirth)} yrs)</span>
          </div>
        </div>

        <div className="alumni-card alumni-info-card">
          <h4>Registration Details</h4>
          <div className="alumni-info-rows">
            <span><Hash size={16} /> Reference: {registration.referenceNumber}</span>
            <span><UserPlus size={16} /> Submitted {formatDate(registration.submittedAt)}</span>
            <span>
              <Clock size={16} /> Status: {registration.status}
              {registration.status === 'Pending' ? ' - for verification by the alumni office' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniSystemProfile;