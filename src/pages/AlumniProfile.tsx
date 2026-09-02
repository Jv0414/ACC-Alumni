import { useParams, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Building2,
  Award,
  Users,
  Pencil,
  ArrowLeft,
  BadgeCheck,
  Clock
} from 'lucide-react';
import { getAlumniById } from '../data/alumniData';
import { getInitials, getAge, formatDate } from '../utils/formatters';

const AlumniProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alumniId = Number(id);
  const alumni = getAlumniById(alumniId);

  if (!alumni) {
    return (
      <div className="page-content">
        <div className="profile-header">
          <button className="btn btn-secondary" onClick={() => navigate('/alumni')}>
            <ArrowLeft size={16} />
            Back to Alumni
          </button>
          <h1>Alumni Not Found</h1>
          <p>The requested alumni profile does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="profile-top-bar">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/alumni')}>
          <ArrowLeft size={16} />
          Back to Alumni
        </button>
        <button className="btn btn-primary btn-sm">
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Profile Header */}
      <div className="card profile-header-card">
        <div className="profile-header-top">
          <div className="profile-header-avatar" style={{ backgroundColor: alumni.avatarColor }}>
            {getInitials(alumni.fullName)}
          </div>
          <div className="profile-header-info">
            <h1>{alumni.fullName}</h1>
            <p className="profile-header-title">
              {alumni.position} at {alumni.company}
            </p>
            <div className="profile-header-meta">
              <span className="profile-meta-item">{alumni.employmentStatus}</span>
              <span className="profile-meta-item">
                <MapPin size={14} />
                {alumni.location}
              </span>
              <span className="profile-meta-item">
                <Calendar size={14} />
                Class of {alumni.graduationYear}
              </span>
              {alumni.honors !== 'None' && (
                <span className="profile-meta-item">
                  <Award size={14} />
                  {alumni.honors}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="profile-grid">
        {/* Personal Information */}
        <div className="card profile-section">
          <div className="card-header">
            <h3>
              <Users size={18} />
              Personal Information
            </h3>
          </div>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{alumni.fullName}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">
                <Mail size={14} />
                {alumni.email}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">
                <Phone size={14} />
                {alumni.phone}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Address</span>
              <span className="profile-info-value">
                <MapPin size={14} />
                {alumni.address}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Date of Birth</span>
              <span className="profile-info-value">
                <Calendar size={14} />
                {formatDate(alumni.dateOfBirth)} ({getAge(alumni.dateOfBirth)} years old)
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Gender</span>
              <span className="profile-info-value">{alumni.gender}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Registered</span>
              <span className="profile-info-value">
                <Calendar size={14} />
                {formatDate(alumni.registeredAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="card profile-section">
          <div className="card-header">
            <h3>
              <GraduationCap size={18} />
              Academic Information
            </h3>
          </div>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="profile-info-label">Student ID</span>
              <span className="profile-info-value">{alumni.studentId}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Course</span>
              <span className="profile-info-value">{alumni.course}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Department</span>
              <span className="profile-info-value">{alumni.department}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Graduation Year</span>
              <span className="profile-info-value">{alumni.graduationYear}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Honors/Awards</span>
              <span className="profile-info-value">
                {alumni.honors === 'None' ? 'No honors received' : (
                  <span className="honor-badge">
                    <BadgeCheck size={14} />
                    {alumni.honors}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="card profile-section">
          <div className="card-header">
            <h3>
              <Briefcase size={18} />
              Employment Information
            </h3>
          </div>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="profile-info-label">Employment Status</span>
              <span className="profile-info-value">
                {alumni.employmentStatus}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Company</span>
              <span className="profile-info-value">
                <Building2 size={14} />
                {alumni.company}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Position</span>
              <span className="profile-info-value">{alumni.position}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Industry</span>
              <span className="profile-info-value">{alumni.industry}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Location</span>
              <span className="profile-info-value">
                <MapPin size={14} />
                {alumni.location}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Years of Experience</span>
              <span className="profile-info-value">
                <Clock size={14} />
                {alumni.yearsOfExperience} years
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;