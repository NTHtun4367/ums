import { Schema, Document, model, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;
  headId?: Types.ObjectId;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 10,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    headId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes

departmentSchema.index({ name: 1 });

departmentSchema.index({ code: 1 });

departmentSchema.index({ headId: 1 });

export const Department = model<IDepartment>("Department", departmentSchema);
