import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ActivitiesLog } from "../models/activitieslog";
import { User, UserRole } from "../models/user";
import { Class } from "../models/class";
import { AuthRequest } from "../middlewares/auth";

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!; // Populated by protect middleware
    let stats: any = {};

    // RBAC: Admin sees all logs; others see only their own
    const activityQuery =
      user.role === UserRole.ADMIN ? {} : { userId: user._id };

    const recentActivities = await ActivitiesLog.find(activityQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "full_name"); // Using full_name based on your user controller

    const formattedActivity = recentActivities.map((log) => {
      const userName = (log.userId as any)?.full_name || "System";
      const time = new Date(log.createdAt as any).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${userName}: ${log.action} (${time})`;
    });

    // Role-Specific Statistics Logic
    if (user.role === UserRole.ADMIN) {
      const totalStudents = await User.countDocuments({
        role: UserRole.STUDENT,
      });
      const totalTeachers = await User.countDocuments({
        role: UserRole.TEACHER,
      });

      stats = {
        totalStudents,
        totalTeachers,
        avgAttendance: "94.5%", // Placeholder for aggregation logic
        recentActivity: formattedActivity,
      };
    } else if (user.role === UserRole.TEACHER) {
      const myClassesCount = await Class.countDocuments({
        classTeacher: user._id,
      });

      stats = {
        myClassesCount,
        nextClass: "Class Session - Room 102",
        nextClassTime: "09:00 AM",
        recentActivity: formattedActivity,
      };
    } else if (user.role === UserRole.STUDENT) {
      stats = {
        myAttendance: "98%",
        recentActivity: formattedActivity,
      };
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);
