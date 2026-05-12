/**
 * Global User Roles synchronized with the backend UserRole enum
 */
export type UserRole = "admin" | "hod" | "teacher" | "student";

export type TeacherStatus =
  | "professor"
  | "assistant_professor"
  | "lecturer"
  | "tutor";

/**
 * API Pagination Metadata
 */
export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

/**
 * User Interface
 * Matches backend 'User' Schema exactly
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  phone: string;
  gender: "male" | "female" | "other";
  departmentId?: string | Department;
  teacherStatus?: TeacherStatus;

  // Student Specific
  classId?: any; // In schema: ref: "Class"
  rollNo?: string;
  admissionDate?: string | Date;

  // Teacher Specific (Missing in your previous snippet but required for UI)
  teacherSubjects?: Subject[] | string[];

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Academic Year Interface
 * Fixed: 'isCurrent' instead of 'isActive' to match backend schema
 */
export interface AcademicYear {
  _id: string;
  name: string; // e.g., "2025-2026"
  startDate: string | Date;
  endDate: string | Date;
  isCurrent: boolean;
}

/**
 * Subject Interface
 * Added: 'departmentId' and 'semester' to match backend schema
 */
export interface Subject {
  _id: string;
  name: string;
  code: string;
  departmentId: string | Department; // Matches ref: "Department"
  semester: number; // Required: 1 to 8
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Attendance Interface
 * Matches backend 'Attendance' Schema
 */
export interface Attendance {
  _id: string;
  studentId: string | User;
  classId: string | Class;
  subjectId: string | Subject;
  academicYearId: string | AcademicYear;
  date: string | Date;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string | User; // Teacher ID
}

/**
 * Updated Department Interface
 * Matches the backend schema with name, code, description, and headId.
 */
export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string | User; // Can be ID or populated User object
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Updated Class Interface
 * Matches the backend schema including departmentId and semester.
 */
export interface Class {
  _id: string;
  name: string;
  academicYearId: string | AcademicYear; // Matches ref: "AcademicYear"
  departmentId: string | Department; // Matches ref: "Department"
  classTeacherId?: string | User; // Matches ref: "User"
  semester: number; // Required in schema
  capacity: number; // Defaulted to 50 in schema
  students?: string[] | User[]; // Associated students
  subjectsIds?: string[] | Subject[]; // Associated subjects
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Timetable/Schedule Interfaces
 * Added: 'room' to Period and fixed nesting to match backend IPeriod
 */
export interface Period {
  subjectId: { _id: string; name: string; code: string };
  teacherId: { _id: string; name: string };
  startTime: string;
  endTime: string;
  room: string;
}

export interface Timetable {
  _id: string;
  classId: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  periods: Period[];
}

/**
 * Activities Log Interface
 * Matches backend 'ActivitiesLog' Schema
 */
export interface ActivitiesLog {
  _id: string;
  userId: string | User;
  action: string;
  details?: string;
  createdAt: string;
}

/**
 * Standard API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
}
