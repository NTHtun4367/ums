import { Schema, Document, Types, model } from "mongoose";

export interface IClass extends Document {
  name: string;
  academicYear: Types.ObjectId;
  classTeacher: Types.ObjectId; // The main teacher in charge
  subjects: Types.ObjectId[]; // List of subjects taught in this class
  students: Types.ObjectId[]; // List of students enrolled
  capacity: number; // Max students allowed (optional)
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    capacity: {
      type: Number,
      default: 40,
    },
  },
  {
    timestamps: true,
  },
);

// Compound Index: Prevents creating duplicate classes
classSchema.index({ name: 1, academicYear: 1 }, { unique: true });

export const Class = model<IClass>("Class", classSchema);
