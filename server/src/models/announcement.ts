import { Document, model, Schema, Types } from "mongoose";

export enum AnnouncementTarget {
  ALL = "all",
  TEACHER = "teacher",
  STUDENT = "student",
  HOD = "hod",
  DEPARTMENT = "department",
}

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  target: AnnouncementTarget;
  departmentId?: Types.ObjectId;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    target: {
      type: String,
      enum: Object.values(AnnouncementTarget),
      default: AnnouncementTarget.ALL,
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: function (this: IAnnouncement) {
        return this.target === AnnouncementTarget.DEPARTMENT;
      },
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for fetching announcements efficiently
announcementSchema.index({ target: 1, departmentId: 1, isActive: 1, createdAt: -1 });

export const Announcement = model<IAnnouncement>("Announcement", announcementSchema);
