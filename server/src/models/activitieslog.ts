import { Document, model, Schema, Types } from "mongoose";

export interface IActivitiesLog extends Document {
  userId: Types.ObjectId; // Reference to the user who performed the action
  action: string; // Descriptive name of the action (e.g., "Created Class")
  details?: string; // Optional additional information about the change
  createdAt: Date;
}

const activitiesLogSchema = new Schema<IActivitiesLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need the creation time for logs
  },
);

export const ActivitiesLog = model<IActivitiesLog>(
  "ActivitiesLog",
  activitiesLogSchema,
);
