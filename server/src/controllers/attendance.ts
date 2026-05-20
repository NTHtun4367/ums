import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Attendance } from "../models/attendance";

/**
 * @desc    Mark or Update attendance (Bulk or Single)
 * @route   POST /api/attendance
 */
export const markAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      studentId,
      classId,
      subjectId,
      academicYearId,
      date,
      status,
      markedBy,
    } = req.body;

    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        subjectId,
        date: new Date(date),
      },
      {
        classId,
        academicYearId,
        status,
        markedBy,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    });
  },
);

/**
 * @desc    Get attendance for a specific class with filters
 * @route   GET /api/attendance/class/:classId
 */
export const getAttendanceByClass = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { date, subjectId } = req.query;

    // Build the query object with explicit types to avoid TS errors
    const query: any = { classId };

    if (date) {
      query.date = new Date(date as string);
    }

    if (subjectId) {
      query.subjectId = subjectId as string;
    }

    const records = await Attendance.find(query)
      .populate("studentId", "full_name roll_number")
      .populate("markedBy", "full_name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  },
);

/**
 * @desc    Get attendance statistics for a student
 * @route   GET /api/attendance/student/:studentId/stats
 */
export const getStudentStats = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId as string;
    const academicYearId = req.query.academicYearId as string;

    if (!academicYearId) {
      res.status(400);
      throw new Error("Academic Year ID is required for statistics");
    }

    // Explicitly casting the search object helps Mongoose match the correct overload
    const records = await Attendance.find({
      studentId: studentId,
      academicYearId: academicYearId,
    });

    const stats = {
      totalSessions: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      excused: records.filter((r) => r.status === "excused").length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);
