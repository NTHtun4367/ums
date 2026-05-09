import { ActivitiesLog } from "../models/activitieslog";
import { Types } from "mongoose";

// Utility to log system activities
export const logActivity = async ({
  userId,
  action,
  details,
}: {
  userId: string;
  action: string;
  details?: string;
}) => {
  try {
    await ActivitiesLog.create({
      userId: new Types.ObjectId(userId),
      action,
      details,
    });
  } catch (error) {
    // Silently log error to console so it doesn't crash the main request flow
    console.error("CRITICAL: Failed to save activity log:", error);
  }
};
