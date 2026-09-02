export type EmploymentStatus = 'Employed' | 'Unemployed' | 'Self-employed' | 'Further Studies';

export interface Alumni {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  course: string;
  department: string;
  graduationYear: number;
  honors: string;
  employmentStatus: EmploymentStatus;
  company: string;
  position: string;
  industry: string;
  location: string;
  yearsOfExperience: number;
  active: boolean;
  registeredAt: string;
  avatarColor: string;
}