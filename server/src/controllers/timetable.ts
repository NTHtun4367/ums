import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { inngest } from "../inngest";
import { logActivity } from "../utils/activitieslog";
import { Timetable } from "../models/timetable";

// @desc Generate a timetable using AI
// @route POST /api/timetables/generate
// @access Private (Admin only)
export const generateTimetable = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { classId, academicYearId, settings } = req.body;

    if (!classId || !academicYearId) {
      res.status(400);
      throw new Error("Class ID and Academic Year ID are required.");
    }

    // Trigger background AI Job via Inngest
    await inngest.send({
      name: "generate/timetable",
      data: { classId, academicYearId, settings },
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Triggered AI Timetable Generation",
      details: `Initiated generation for Class ID: ${classId}`,
    });

    res
      .status(202)
      .json({ message: "Timetable generation initiated in the background!" });
  },
);

// @desc Get all timetables (Pagination)
// @route GET /api/timetables
export const getAllTimetables = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, timetables] = await Promise.all([
      Timetable.countDocuments(),
      Timetable.find()
        .populate("classId", "name")
        .populate("academicYearId", "name")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      timetables,
      pagination: { page, pages: Math.ceil(total / limit), total, limit },
    });
  },
);

// @desc Get timetable by class
// @route GET /api/timetables/class/:classId
export const getTimetableByClass = asyncHandler(
  async (req: Request, res: Response) => {
    const timetable = await Timetable.findOne({ classId: req.params.classId })
      .populate("schedule.periods.subjectId", "name code")
      .populate("schedule.periods.teacherId", "name email")
      .populate("academicYearId", "name");

    if (!timetable) {
      res.status(404);
      throw new Error("Timetable not found for this class!");
    }

    res.status(200).json(timetable);
  },
);

// @desc Delete a timetable
// @route DELETE /api/timetables/delete/:id
export const deleteTimetable = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      res.status(404);
      throw new Error("Timetable not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Timetable",
      details: `Removed timetable for Class ID: ${timetable.classId}`,
    });

    res.status(200).json({ message: "Timetable deleted successfully!" });
  },
);
