import { Schema, Document, Types, model } from "mongoose";

export interface IClass extends Document {
  name: string;
  section: string;
  academicYearId: Types.ObjectId;
  departmentId: Types.ObjectId;
  classTeacherId?: Types.ObjectId;
  semester: number;
  capacity: number;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },

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

    classTeacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    capacity: {
      type: Number,
      default: 50,
      min: 1,
      max: 500,
    },
  },
  {
    timestamps: true,
  },
);

classSchema.index(
  {
    name: 1,
    section: 1,
    academicYearId: 1,
    departmentId: 1,
  },
  {
    unique: true,
  },
);

classSchema.index({ departmentId: 1 });
classSchema.index({ academicYearId: 1 });
classSchema.index({ semester: 1 });

export const Class = model<IClass>("Class", classSchema);
