import { Document, model, Schema, Types } from "mongoose";

export interface IActivitiesLog extends Document {
  user: Types.ObjectId; // Who did it?
  action: string; // "Registered Student", "Created Exam"
  details?: string;
  createdAt: Date;
}

const activitiesLogSchema = new Schema<IActivitiesLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true },
);

export const ActivitiesLog = model<IActivitiesLog>(
  "ActivitiesLog",
  activitiesLogSchema,
);
