// Official ACC college program offerings and their departments.
//
// Single source of truth shared by the alumni registration forms and the
// admin alumni records page so the dropdowns never drift apart.

export const COLLEGE_COURSE_OPTIONS = [
  'Master of Arts in Education',
  'Master in Business Administration',
  'Teacher Education Certificate Program',
  'Bachelor of Secondary Education (Major in English)',
  'Bachelor of Secondary Education (Major in Filipino)',
  'Bachelor of Secondary Education (Major in Mathematics)',
  'Bachelor of Secondary Education (Major in Science)',
  'Bachelor of Elementary Education',
  'Bachelor of Arts in English Language',
  'Bachelor of Arts in Political Science',
  'BS Criminology',
  'BS Nursing',
  'BS Business Administration (Major in Marketing Management)',
  'BS Business Administration (Major in Human Resource Management)',
  'BS Business Administration (Major in Operations Management)',
  'BS Business Administration (Major in Financial Management)',
  'BS Hospitality Management',
  'BS Hospitality Management (Culinary Arts)',
  'BS Tourism Management',
  'BS Accountancy',
  'BS Accounting Information System',
  'BS Real Estate Management',
  'BS Computer Science',
  'BS Information Technology'
];

export const COLLEGE_DEPARTMENT_OPTIONS = [
  'College of Arts and Sciences',
  'College of Business',
  'College of Computer Studies',
  'College of Criminal Justice',
  'College of Health Sciences',
  'College of Hospitality and Tourism Management',
  'College of Teacher Education',
  'Graduate School'
];

// Senior High School strands offered by the SHS department. TVL is listed per
// specialization (Cookery, ICT, Tourism).
export const SENIOR_HIGH_STRAND_OPTIONS = [
  'STEM',
  'ABM',
  'HUMSS',
  'GAS',
  'TVL - Cookery',
  'TVL - ICT',
  'TVL - Tourism'
];

// The department that offers each college program. The registration form uses
// this to derive the department automatically instead of asking for it.
export const COLLEGE_COURSE_DEPARTMENTS: Record<string, string> = {
  'Master of Arts in Education': 'Graduate School',
  'Master in Business Administration': 'Graduate School',
  'Teacher Education Certificate Program': 'College of Teacher Education',
  'Bachelor of Secondary Education (Major in English)': 'College of Teacher Education',
  'Bachelor of Secondary Education (Major in Filipino)': 'College of Teacher Education',
  'Bachelor of Secondary Education (Major in Mathematics)': 'College of Teacher Education',
  'Bachelor of Secondary Education (Major in Science)': 'College of Teacher Education',
  'Bachelor of Elementary Education': 'College of Teacher Education',
  'Bachelor of Arts in English Language': 'College of Arts and Sciences',
  'Bachelor of Arts in Political Science': 'College of Arts and Sciences',
  'BS Criminology': 'College of Criminal Justice',
  'BS Nursing': 'College of Health Sciences',
  'BS Business Administration (Major in Marketing Management)': 'College of Business',
  'BS Business Administration (Major in Human Resource Management)': 'College of Business',
  'BS Business Administration (Major in Operations Management)': 'College of Business',
  'BS Business Administration (Major in Financial Management)': 'College of Business',
  'BS Hospitality Management': 'College of Hospitality and Tourism Management',
  'BS Hospitality Management (Culinary Arts)': 'College of Hospitality and Tourism Management',
  'BS Tourism Management': 'College of Hospitality and Tourism Management',
  'BS Accountancy': 'College of Business',
  'BS Accounting Information System': 'College of Business',
  'BS Real Estate Management': 'College of Business',
  'BS Computer Science': 'College of Computer Studies',
  'BS Information Technology': 'College of Computer Studies'
};