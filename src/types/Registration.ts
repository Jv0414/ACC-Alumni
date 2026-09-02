// Lifecycle of a registration submission. New submissions start as Pending
// and are moved to Approved/Rejected once the alumni office verifies them.
export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

// Data collected by the alumni registration form.
export interface AlumniRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  studentId: string;
  course: string;
  department: string;
  expectedGraduationYear: number;
}

// A saved registration. The reference number is the registrant's key for
// checking their status later - no account or password is required.
export interface AlumniRegistration extends AlumniRegistrationData {
  referenceNumber: string;
  status: RegistrationStatus;
  submittedAt: string;
}