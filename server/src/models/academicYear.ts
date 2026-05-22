import { Document, model, Schema } from "mongoose";

export interface IAcademicYear extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{4}-\d{4}$/,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Only ONE active current year allowed

academicYearSchema.index(
  { isCurrent: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isCurrent: true,
    },
  },
);

// Fast sorting/search

academicYearSchema.index({
  startDate: -1,
});

academicYearSchema.pre("validate", function (next) {
  if (this.endDate <= this.startDate) {
    throw new Error("End date must be after start date");
  }
});

export const AcademicYear = model<IAcademicYear>(
  "AcademicYear",
  academicYearSchema,
);
