import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ActivitiesLog } from "../models/activitieslog";

// @desc Get system activity logs => (including pagination)
// @route GET /api/activities
// @access Private (Admin only)
export const getAllActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      ActivitiesLog.countDocuments(),
      ActivitiesLog.find()
        .populate("userId", "name email role") // Populates from Unified User model
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      logs,
      pagination: { page, total, pages: Math.ceil(total / limit) },
    });
  },
);
