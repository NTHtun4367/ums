import { Document, model, Schema } from "mongoose";

export interface IAcademicYear extends Document {
  name: string; // e.g., "2025-2026"
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AcademicYear = model<IAcademicYear>(
  "AcademicYear",
  academicYearSchema,
);
