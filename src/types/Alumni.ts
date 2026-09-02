export type EmploymentStatus = 'Employed' | 'Unemployed' | 'Self-employed' | 'Further Studies';

// Alumni are tracked across all departments. Elementary and Senior High School
// records share the same structure as college records.
export type EducationLevel = 'College' | 'Senior High School' | 'Elementary';

export interface Alumni {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  educationLevel: EducationLevel;
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