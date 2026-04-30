import { ActivitiesLog } from "../models/activitieslog";

export const logActivity = async ({
  user,
  action,
  details,
}: {
  user: string;
  action: string;
  details?: string;
}) => {
  try {
    await ActivitiesLog.create({ user, action, details });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
