import type { EducationLevel } from './Alumni';

// Lifecycle of a registration submission. New submissions start as Pending
// and are moved to Approved/Rejected once the alumni office verifies them.
export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

// Data collected by the alumni registration form. Elementary registrants have
// no course/strand (course is saved empty) and educationLevel records which
// registration form was used.
export interface AlumniRegistrationData {
  fullName: string;
  // Optional name suffix (e.g. Jr., Sr., III). Registrations can still be
  // submitted without it.
  suffix?: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  // Optional - the registration form no longer collects a student ID.
  studentId?: string;
  course: string;
  department: string;
  educationLevel?: EducationLevel;
  expectedGraduationYear: number;
}

// A saved registration. The reference number is the registrant's key for
// checking their status later - no account or password is required.
export interface AlumniRegistration extends AlumniRegistrationData {
  referenceNumber: string;
  status: RegistrationStatus;
  submittedAt: string;
}