export type UserRole = "admin" | "hod" | "teacher" | "student";

export type TeacherStatus =
  | "professor"
  | "assistant_professor"
  | "lecturer"
  | "tutor";

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isAcademic: boolean;
  headId?: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  _id: string;
  name: string;
  academicYearId: string;
  departmentId: string | Department;
  classTeacherId?: string | User;
  semester: number;
  capacity: number;
  students?: string[] | User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  departmentId: string | Department;
  classId: string | Class;
  semester: number;
}

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
  teacherSubjects?: Subject[];
  classId?: string | Class;
  rollNo?: string;
  admissionDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetablePeriod {
  subjectId:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      };
  teacherId:
    | string
    | {
        _id: string;
        name: string;
        email?: string;
        role?: string;
      };

  startMinutes: number;
  endMinutes: number;

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
  periods: TimetablePeriod[];

  createdAt?: string;
  updatedAt?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface Attendance {
  _id?: string;
  studentId: string | User;
  classId: string | Class;
  subjectId: string | Subject;
  teacherId: string | User;
  academicYearId: string;
  attendanceDate: string | Date;
  sessionNumber: number;
  status: AttendanceStatus;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceStats {
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePercentage: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
}
