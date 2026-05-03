export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  studentClass?: Class;
  teacherSubjects?: Subject[];
}

export interface AcademicYear {
  _id: string;
  name: string;
  fromYear: Date;
  toYear: Date;
  isCurrent: boolean;
}

export interface Class {
  _id: string;
  name: string;
  academicYear: AcademicYear;
  classTeacher: User;
  subjects: Subject[];
  students: User[];
  capacity: number;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  teacher?: User[];
  isActive: boolean;
}

export interface Period {
  _id: string;
  subject: { _id: string; name: string; code: string };
  teacher: { _id: string; name: string };
  startTime: string;
  endTime: string;
}

export interface Schedule {
  day: string;
  periods: Period[];
}
