import { Document, model, Schema, Types } from "mongoose";

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused",
}

export interface IAttendance extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  academicYearId: Types.ObjectId;

  attendanceDate: Date;

  // Supports multiple sessions in one day
  // Example:
  // Session 1 = Morning
  // Session 2 = Afternoon
  sessionNumber: number;

  status: AttendanceStatus;

  remarks?: string;

  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
      index: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
      index: true,
    },

    sessionNumber: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
      default: AttendanceStatus.PRESENT,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate attendance
// Same student + same subject + same day + same session
attendanceSchema.index(
  {
    studentId: 1,
    subjectId: 1,
    attendanceDate: 1,
    sessionNumber: 1,
  },
  {
    unique: true,
  },
);

// Fast monthly attendance queries
attendanceSchema.index({
  classId: 1,
  subjectId: 1,
  attendanceDate: 1,
});

// Fast student attendance history
attendanceSchema.index({
  studentId: 1,
  attendanceDate: -1,
});

export const Attendance = model<IAttendance>("Attendance", attendanceSchema);
