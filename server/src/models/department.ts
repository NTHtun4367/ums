import { Schema, Document, model, Types } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;
  isAcademic: boolean;
  headId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true, // AUTO INDEX
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      unique: true, // AUTO INDEX
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

    isAcademic: {
      type: Boolean,
      required: true,
      default: true,
      index: true, // AUTO INDEX
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

departmentSchema.index({ headId: 1 });

export const Department = model<IDepartment>("Department", departmentSchema);
