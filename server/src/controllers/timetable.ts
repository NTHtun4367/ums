// controllers/timetable.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import { Timetable } from "../models/timetable";

// @desc Save or Update timetable for a specific day
// @route POST /api/timetables
export const saveTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId, day, periods } = req.body;

    const updatedTimetable = await Timetable.findOneAndUpdate(
      { classId: new Types.ObjectId(classId), day },
      {
        classId,
        day,
        periods: periods.map((p: any) => ({
          ...p,
          subjectId: new Types.ObjectId(p.subjectId),
          teacherId: new Types.ObjectId(p.teacherId),
        })),
      },
      { upsert: true, new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      data: updatedTimetable,
    });
  },
);

// @desc Get full weekly timetable for a class
// @route GET /api/timetables/class/:classId
export const getClassTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;

    const timetable = await Timetable.find({
      classId: new Types.ObjectId(classId as string),
    })
      .populate("periods.subjectId", "name code")
      .populate("periods.teacherId", "name email");

    res.status(200).json({
      success: true,
      data: timetable,
    });
  },
);

// @desc Delete a specific day's timetable
// @route DELETE /api/timetables/:id
export const deleteTimetableDay = asyncHandler(
  async (req: Request, res: Response) => {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Day schedule removed" });
  },
);
