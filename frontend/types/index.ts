// ============================================================
// types/index.ts  —  All TypeScript types for ILIMA frontend
// ============================================================

// ── Auth ─────────────────────────────────────────────────────
export interface Admin {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin'
}

export interface AuthResponse {
  token: string
  admin: Admin
}

// ── Domain & Course ──────────────────────────────────────────
export interface Domain {
  id: number
  name: string
  description: string | null
  status: boolean
  coursesCount?: number
}

export interface Course {
  id: number
  title: string
  description: string | null
  duration: string
  sessionsCount: number | null
  price: number
  level: 'débutant' | 'intermédiaire' | 'avancé' | null
  status: boolean
  domain?: Domain
  activeGroupsCount?: number
}

// ── Teacher ───────────────────────────────────────────────────
export interface Teacher {
  id: number
  fullName: string
  phone: string
  email: string | null
  specialty: string | null
  status: boolean
  notes: string | null
  groupsCount?: number
}

// ── Student ───────────────────────────────────────────────────
export type StudentStatus = 'active' | 'completed' | 'archived'

export interface Student {
  id: number
  studentCode: string
  fullName: string
  firstName: string
  lastName: string
  gender: 'M' | 'F' | null
  birthDate: string | null
  phone: string
  email: string | null
  address: string | null
  educationLevel: string | null
  specialization: string | null
  registrationDate: string
  status: StudentStatus
  notes: string | null
  archivedAt: string | null
  paymentStatus?: PaymentStatus
  activeGroups?: Group[]
  enrollments?: Enrollment[]
  payments?: Payment[]
  riskAnalysis?: RiskAnalysis
}

// ── Group ─────────────────────────────────────────────────────
export type GroupStatus = 'active' | 'completed' | 'cancelled'

export interface Group {
  id: number
  name: string
  room: string | null
  days: string[]
  startTime: string
  endTime: string
  startDate: string
  endDate: string | null
  capacity: number
  enrolledCount: number
  availableSlots: number
  progressPercent: number
  status: GroupStatus
  course?: Course
  teacher?: Teacher
  enrollments?: Enrollment[]
  sessions?: Session[]
}

// ── Enrollment ────────────────────────────────────────────────
export interface Enrollment {
  id: number
  studentId: number
  groupId: number
  enrollmentDate: string
  status: 'active' | 'completed' | 'cancelled'
  student?: Student
  group?: Group
  payment?: Payment
}

// ── Session ───────────────────────────────────────────────────
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Session {
  id: number
  groupId: number
  teacherId: number
  title: string | null
  sessionDate: string
  startTime: string
  endTime: string
  room: string | null
  lessonOrder: number
  status: SessionStatus
  notes: string | null
  attendanceRate: number
  group?: Group
  teacher?: Teacher
  attendance?: Attendance[]
}

// ── Attendance ────────────────────────────────────────────────
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface Attendance {
  id: number
  sessionId: number
  studentId: number
  status: AttendanceStatus
  timeIn: string | null
  timeOut: string | null
  note: string | null
  student?: Student
  session?: Session
}

export interface AttendanceRecord {
  studentId: number
  status: AttendanceStatus
  timeIn?: string
  timeOut?: string
  note?: string
}

// ── Payment ───────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue'

export interface Payment {
  id: number
  studentId: number
  enrollmentId: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: PaymentStatus
  dueDate: string | null
  installments?: Installment[]
  student?: Student
  enrollment?: Enrollment & { group?: Group & { course?: Course } }
}

export interface Installment {
  id: number
  paymentId: number
  amount: number
  dueDate: string
  paidDate: string | null
  status: 'pending' | 'paid' | 'overdue'
  method: 'cash'
  note: string | null
}

// ── Risk Analysis ─────────────────────────────────────────────
export type RiskLevel = 'low' | 'medium' | 'high'

export interface RiskAnalysis {
  absenceScore: number
  paymentScore: number
  progressionScore: number
  totalRiskScore: number
  riskLevel: RiskLevel
  recommendation: string
  updatedAt: string
  student?: Student
}

// ── Student Note ─────────────────────────────────────────────
export interface StudentNote {
  id: number
  content: string
  createdAt: string
  admin: { id: number; name: string }
}

// ── AI Assistant ─────────────────────────────────────────────
export interface AiQuery {
  id: number
  question: string
  answer: string
  askedAt: string
}

// ── Dashboard ────────────────────────────────────────────────
export interface DashboardKpis {
  activeStudents: number
  activeCourses: number
  activeGroups: number
  overduePayments: number
  avgAttendanceRate: number
  atRiskStudents: number
}

// ── API Responses ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    currentPage: number
    lastPage: number
  }
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    currentPage: number
    lastPage: number
  }
}

// ── Form helpers ──────────────────────────────────────────────
export interface CreateStudentForm {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: 'M' | 'F' | ''
  birth_date?: string
  education_level?: string
  specialization?: string
  notes?: string
}

export interface CreateGroupForm {
  course_id: string | number
  teacher_id: string | number
  name: string
  room?: string
  start_date: string
  end_date?: string
  days: string[]
  start_time: string
  end_time: string
  capacity: number
}

export interface CreateCourseForm {
  domain_id: string | number
  title: string
  duration: string
  price: number
  level?: string
  sessions_count?: number
  description?: string
}

export interface AddInstallmentForm {
  amount: number
  due_date: string
  note?: string
}