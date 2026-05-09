import { Schema, Document, Types, model } from "mongoose";

export interface IClass extends Document {
  name: string;
  academicYearId: Types.ObjectId;
  departmentId: Types.ObjectId;
  classTeacherId: Types.ObjectId;
  semester: number;
  capacity: number;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    classTeacherId: { type: Schema.Types.ObjectId, ref: "User" },
    semester: { type: Number, required: true },
    capacity: { type: Number, default: 50 },
  },
  { timestamps: true },
);

// Prevents duplicate classes in the same major for the same year
classSchema.index(
  { name: 1, academicYearId: 1, departmentId: 1 },
  { unique: true },
);

export const Class = model<IClass>("Class", classSchema);
