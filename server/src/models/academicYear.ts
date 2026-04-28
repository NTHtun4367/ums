import { Document, model, Schema } from "mongoose";

export interface IAcademicYear extends Document {
  name: string; // "2025-2026"
  fromYear: Date; // 2025-12-01
  toYear: Date; // 2026-03-26
  isCurrent: boolean;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: { type: String, required: true },
    fromYear: { type: Date, required: true },
    toYear: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AcademicYear = model<IAcademicYear>(
  "AcademicYear",
  academicYearSchema,
);
