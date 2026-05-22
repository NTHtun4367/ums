import { Document, Schema, model, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  departmentId: Types.ObjectId;
  classId: Types.ObjectId;
  semester: number;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 20,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate subjects
 * Example:
 * CSE + CS101 cannot exist twice
 */

subjectSchema.index(
  {
    code: 1,
    departmentId: 1,
  },
  {
    unique: true,
  },
);

subjectSchema.index({ departmentId: 1 });
subjectSchema.index({ classId: 1 });
subjectSchema.index({ semester: 1 });

export const Subject = model<ISubject>("Subject", subjectSchema);
