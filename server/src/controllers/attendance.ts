import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Attendance } from "../models/attendance";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";

/**
 * @desc Mark or Update attendance
 * @route POST /api/attendance
 * @access Private (Admin/Teacher)
 */
export const markAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      studentId,
      classId,
      subjectId,
      teacherId,
      academicYearId,
      attendanceDate,
      sessionNumber,
      status,
      remarks,
    } = req.body;

    const attendance = await Attendance.findOneAndUpdate(
      {
        studentId,
        subjectId,
        attendanceDate: new Date(attendanceDate),
        sessionNumber: sessionNumber || 1,
      },
      {
        studentId,
        classId,
        subjectId,
        teacherId,
        academicYearId,
        attendanceDate,
        sessionNumber: sessionNumber || 1,
        status,
        remarks,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Marked Attendance",
      details: `Attendance marked for student ${studentId}`,
    });

    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendance,
    });
  },
);

/**
 * @desc Get attendance by class
 * @route GET /api/attendance/class/:classId
 */
export const getAttendanceByClass = asyncHandler(
  async (req: Request, res: Response) => {
    const { classId } = req.params;

    const { attendanceDate, subjectId, sessionNumber } = req.query;

    const query: any = {
      classId,
    };

    if (attendanceDate) {
      query.attendanceDate = new Date(attendanceDate as string);
    }

    if (subjectId) {
      query.subjectId = subjectId;
    }

    if (sessionNumber) {
      query.sessionNumber = Number(sessionNumber);
    }

    const records = await Attendance.find(query)
      .populate("studentId", "name rollNo")
      .populate("teacherId", "name email")
      .populate("subjectId", "name code")
      .sort({
        attendanceDate: -1,
      });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  },
);

/**
 * @desc Get student attendance stats
 * @route GET /api/attendance/student/:studentId/stats
 */
export const getStudentStats = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;

    const academicYearId = req.query.academicYearId as string;

    if (!academicYearId) {
      res.status(400);
      throw new Error("Academic Year ID is required");
    }

    const records = await Attendance.find({
      studentId,
      academicYearId,
    });

    const stats = {
      totalSessions: records.length,

      present: records.filter((r) => r.status === "present").length,

      absent: records.filter((r) => r.status === "absent").length,

      late: records.filter((r) => r.status === "late").length,

      excused: records.filter((r) => r.status === "excused").length,
    };

    const attendancePercentage =
      stats.totalSessions > 0
        ? (
            ((stats.present + stats.late + stats.excused) /
              stats.totalSessions) *
            100
          ).toFixed(2)
        : "0";

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        attendancePercentage,
      },
    });
  },
);
