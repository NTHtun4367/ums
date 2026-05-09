import { Schema, Document, model, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string; // e.g., "CSE", "ECE", "ME"
  description?: string;
  headId?: Types.ObjectId; // Links to User (Role: HOD)
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    headId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Department = model<IDepartment>("Department", departmentSchema);
