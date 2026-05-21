import { Schema, Document, Types, model } from "mongoose";

export interface IPeriod {
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  startTime: string; // "08:30"
  endTime: string; // "09:30"
  room: string; // Room/Lab Name
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

const timetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
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
    periods: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        room: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

// Ensures only one schedule configuration per class per day
timetableSchema.index({ classId: 1, day: 1 }, { unique: true });

export const Timetable = model<ITimetable>("Timetable", timetableSchema);
