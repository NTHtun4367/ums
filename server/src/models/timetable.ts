import { Schema, Document, Types, model } from "mongoose";

export interface IPeriod {
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  startMinutes: number;
  endMinutes: number;
  room: string;
}

export interface ITimetable extends Document {
  classId: Types.ObjectId;

  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  periods: IPeriod[];
}

const periodSchema = new Schema<IPeriod>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },

    endMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },

    room: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

const timetableSchema = new Schema<ITimetable>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    periods: {
      type: [periodSchema],
      validate: {
        validator: function (periods: IPeriod[]) {
          return periods.length > 0;
        },
        message: "At least one period is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate timetable per class/day

timetableSchema.index(
  {
    classId: 1,
    day: 1,
  },
  {
    unique: true,
  },
);

// Validate overlapping periods

timetableSchema.pre("save", function (next) {
  const periods = [...this.periods].sort(
    (a, b) => a.startMinutes - b.startMinutes,
  );

  for (let i = 0; i < periods.length; i++) {
    const current = periods[i];

    // Prevent invalid duration
    if (current.startMinutes >= current.endMinutes) {
      throw new Error(`Invalid time range in period ${i + 1}`);
    }

    // Check overlap
    if (i > 0) {
      const previous = periods[i - 1];

      if (current.startMinutes < previous.endMinutes) {
        throw new Error(`Time overlap between periods ${i} and ${i + 1}`);
      }
    }
  }
});

export const Timetable = model<ITimetable>("Timetable", timetableSchema);
