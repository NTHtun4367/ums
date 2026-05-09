import { Document, Schema, model, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string; // e.g., CS-101
  departmentId: Types.ObjectId;
  semester: number; // 1 to 8
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: { type: Number, required: true, min: 1, max: 8 },
  },
  { timestamps: true },
);

export const Subject = model<ISubject>("Subject", subjectSchema);
