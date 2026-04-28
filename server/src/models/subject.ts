import { Schema, Document, Types, model } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  teacher?: Types.ObjectId[]; // Default teacher for this subject
  isActive: boolean; // Indicates if the subject is currently active
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    teacher: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Subject = model<ISubject>("Subject", subjectSchema);
