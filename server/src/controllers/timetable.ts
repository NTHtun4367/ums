import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/asyncHandler";
import { Timetable } from "../models/timetable";

// @desc Create or Update timetable
// @route POST /api/timetables
// @access Admin / Teacher

export const saveTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId, day, periods, room } = req.body;

    const formattedPeriods = periods
      .map((period: any) => ({
        subjectId: new Types.ObjectId(period.subjectId),
        teacherId: new Types.ObjectId(period.teacherId),
        startMinutes: Number(period.startMinutes),
        endMinutes: Number(period.endMinutes),
      }))
      .sort((a: any, b: any) => a.startMinutes - b.startMinutes);

    const timetable = await Timetable.findOneAndUpdate(
      {
        classId: new Types.ObjectId(classId),
        day,
      },
      {
        classId: new Types.ObjectId(classId),
        day,
        periods: formattedPeriods,
        room: room?.trim() || undefined,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Timetable saved successfully",
      data: timetable,
    });
  },
);

// @desc Get weekly timetable
// @route GET /api/timetables/class/:classId

export const getClassTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;

    const timetable = await Timetable.find({
      classId: new Types.ObjectId(classId as string),
    })
      .populate("periods.subjectId", "name code")
      .populate("periods.teacherId", "name email role")
      .sort({ day: 1 });

    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable,
    });
  },
);

// @desc Delete timetable day
// @route DELETE /api/timetables/:id

export const deleteTimetableDay = asyncHandler(
  async (req: Request, res: Response) => {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      res.status(404);

      throw new Error("Timetable not found");
    }

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  },
);
