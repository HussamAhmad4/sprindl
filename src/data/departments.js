// CSI department directory powering the Community Chat.
// Contact info verified against csi.cuny.edu (Aug 2026) — re-verify each semester.
// Every chat is an AI assistant grounded in this data, clearly labeled as NOT CSI staff.

export const DEPARTMENTS = [
  {
    id: 'financial-aid',
    icon: '💰',
    name: 'Financial Aid',
    tagline: 'FAFSA, TAP, Pell, loans & aid appeals',
    location: 'Building 2A, Room 106',
    phone: '718.982.2030',
    email: 'financialaid@csi.cuny.edu',
    hours: 'Mon–Fri, 9:00am–4:45pm (NYS aid virtual hours: Wed 2–4pm)',
    url: 'https://www.csi.cuny.edu/admissions/paying-college/financial-aid',
    knowledge: [
      "CSI's FAFSA federal school code is 002698.",
      'Handles: FAFSA filing help, Pell Grant, NY TAP, Excelsior Scholarship, federal work-study, loans, verification, SAP appeals, aid disbursement questions.',
      'TAP and Excelsior are applied for at hesc.ny.gov after filing the FAFSA.',
      'Students can check aid status in CUNYfirst.',
    ].join(' '),
  },
  {
    id: 'career',
    icon: '💼',
    name: 'Career & Professional Development',
    tagline: 'Internships, jobs, resumes & Handshake',
    location: 'Building 1A, Room 105',
    phone: '718.982.2300',
    email: 'careers@csi.cuny.edu',
    hours: 'Mon–Fri, 9:00am–5:00pm',
    url: 'https://www.csi.cuny.edu/campus-life/student-services/center-career-and-professional-development',
    knowledge: [
      'Handles: resume and cover letter reviews, mock interviews, career counseling, internship and job search, on-campus recruiting, career fairs.',
      'Appointments can be booked by phone, in person, or through the student Handshake account.',
      'CUNY-wide options also apply: SYEP, Ladders for Leaders, CUNY internship programs.',
    ].join(' '),
  },
  {
    id: 'tutoring',
    icon: '📚',
    name: 'Tutoring & Academic Support',
    tagline: 'Free tutoring, writing help & study support',
    location: 'See website for center locations',
    phone: null,
    email: null,
    hours: 'Varies by center — check the tutoring page',
    url: 'https://www.csi.cuny.edu/students/academic-assistance/tutoring',
    knowledge: [
      'CSI offers free tutoring for enrolled students through the Office of Academic Support, including subject tutoring, the writing center, and math help.',
      'Availability and locations vary by subject and semester — the tutoring page lists current centers and how to book.',
    ].join(' '),
  },
  {
    id: 'counseling',
    icon: '💚',
    name: 'Counseling Center',
    tagline: 'Free, confidential mental health support',
    location: 'Building 1A, Room 109',
    phone: '(718) 982-2391',
    email: 'counseling@csi.cuny.edu',
    hours: 'Mon–Fri, 9:00am–5:00pm · counselors available 24/7 by phone',
    url: 'https://www.csi.cuny.edu/students/counseling-center',
    knowledge: [
      'Free, confidential counseling for enrolled CSI students — in-person and virtual, with walk-in appointments during business hours.',
      'Counselors are available 24/7 by telephone at the main number for urgent needs.',
      'For crisis support anytime: call or text 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).',
    ].join(' '),
  },
  {
    id: 'registrar',
    icon: '🗂️',
    name: 'Registrar',
    tagline: 'Registration, transcripts & records',
    location: '2800 Victory Blvd, Staten Island, NY 10314',
    phone: '718.982.2000',
    email: 'registraroffice@csi.cuny.edu',
    hours: 'See website for current hours',
    url: 'https://www.csi.cuny.edu/students/registrar',
    knowledge: [
      'Handles: course registration, add/drop, enrollment verification, transcripts, degree audits, graduation applications, name/address changes.',
      'Specialized emails: degreeaudit@csi.cuny.edu for graduation/degree questions, transcriptrequest@csi.cuny.edu for transcripts.',
      'Most registration actions happen in CUNYfirst.',
    ].join(' '),
  },
  {
    id: 'basic-needs',
    icon: '🧺',
    name: 'Single Stop & Basic Needs',
    tagline: 'Food pantry, benefits screening & emergency help',
    location: 'Ask Student Services for the current campus office', // TODO: verify CSI office room
    phone: null,
    email: null,
    hours: 'Varies — check the CUNY Single Stop page',
    url: 'https://www.cuny.edu/current-students/student-affairs/student-services/single-stop/',
    knowledge: [
      'Single Stop is a free CUNY service that screens students for public benefits (SNAP, Medicaid, Fair Fares) and helps file the paperwork, plus free legal aid and tax prep.',
      'CSI students can also ask about the campus food pantry and one-time emergency grants through student services or the Dean of Students.',
    ].join(' '),
  },
]

export const DEPARTMENT_MODE_PREFIX = 'dept:'

export function isDepartmentMode(mode) {
  return typeof mode === 'string'
    && mode.startsWith(DEPARTMENT_MODE_PREFIX)
    && DEPARTMENTS.some((d) => DEPARTMENT_MODE_PREFIX + d.id === mode)
}

export function departmentForMode(mode) {
  if (typeof mode !== 'string' || !mode.startsWith(DEPARTMENT_MODE_PREFIX)) return null
  return DEPARTMENTS.find((d) => DEPARTMENT_MODE_PREFIX + d.id === mode) || null
}
