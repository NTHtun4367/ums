import { Document, model, Schema, Types } from "mongoose";

export interface IAttendance extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  markedBy: Types.ObjectId; // Teacher ID
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Composite index: Student can't have two attendance records for the same subject on the same day
attendanceSchema.index(
  { studentId: 1, subjectId: 1, date: 1 },
  { unique: true },
);

export const Attendance = model<IAttendance>("Attendance", attendanceSchema);
