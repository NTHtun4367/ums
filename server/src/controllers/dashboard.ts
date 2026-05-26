import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ActivitiesLog } from "../models/activitieslog";
import { User, UserRole } from "../models/user";
import { Class } from "../models/class";
import { Department } from "../models/department";
import { Subject } from "../models/subject";
import { Attendance } from "../models/attendance";
import { AuthRequest } from "../middlewares/auth";
import { Timetable } from "../models/timetable";

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    let stats: any = {};
    let chartData: any = {};
    let extra: any = {};

    // 1. Fetch Recent Activities
    const activityQuery =
      user.role === UserRole.ADMIN ? {} : { userId: user._id };

    const recentActivities = await ActivitiesLog.find(activityQuery)
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "name role");

    // 2. Attendance Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const attendanceTrend = await Attendance.aggregate([
      {
        $match: {
          attendanceDate: { $gte: sevenDaysAgo },
          ...(user.role === UserRole.STUDENT ? { studentId: user._id } : {}),
          ...(user.role === UserRole.TEACHER ? { teacherId: user._id } : {}),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$attendanceDate" } },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    chartData.attendanceTrend = attendanceTrend;

    // 3. Role-Based Statistics
    if (user.role === UserRole.ADMIN) {
      const [
        totalStudents,
        totalTeachers,
        totalHods,
        totalDepartments,
        totalClasses,
        totalSubjects,
        userDistribution,
      ] = await Promise.all([
        User.countDocuments({ role: UserRole.STUDENT }),
        User.countDocuments({ role: UserRole.TEACHER }),
        User.countDocuments({ role: UserRole.HOD }),
        Department.countDocuments(),
        Class.countDocuments(),
        Subject.countDocuments(),
        User.aggregate([
          { $group: { _id: "$role", count: { $sum: 1 } } }
        ]),
      ]);

      stats = {
        summary: [
          { label: "Students", value: totalStudents, icon: "students" },
          { label: "Teachers", value: totalTeachers, icon: "teachers" },
          { label: "HODs", value: totalHods, icon: "hods" },
          { label: "Departments", value: totalDepartments, icon: "departments" },
          { label: "Classes", value: totalClasses, icon: "classes" },
          { label: "Subjects", value: totalSubjects, icon: "subjects" },
        ],
      };
      chartData.userDistribution = userDistribution;

    } else if (user.role === UserRole.HOD) {
      const deptId = user.departmentId;
      const [deptStudents, deptTeachers, deptClasses, deptSubjects] =
        await Promise.all([
          User.countDocuments({ role: UserRole.STUDENT, departmentId: deptId }),
          User.countDocuments({ role: UserRole.TEACHER, departmentId: deptId }),
          Class.countDocuments({ departmentId: deptId }),
          Subject.countDocuments({ departmentId: deptId }),
        ]);

      stats = {
        summary: [
          { label: "Total Students", value: deptStudents, icon: "students" },
          { label: "Total Teachers", value: deptTeachers, icon: "teachers" },
          { label: "Total Classes", value: deptClasses, icon: "classes" },
          { label: "Total Subjects", value: deptSubjects, icon: "subjects" },
        ],
      };
    } else if (user.role === UserRole.TEACHER) {
      const [myClasses, mySubjects] = await Promise.all([
        Class.countDocuments({ classTeacherId: user._id }),
        Subject.countDocuments({ departmentId: user.departmentId }),
      ]);

      stats = {
        summary: [
          { label: "My Classes", value: myClasses, icon: "classes" },
          { label: "Department Subjects", value: mySubjects, icon: "subjects" },
        ],
      };

      // Today's Schedule for Teacher
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      const schedule = await Timetable.find({
        "periods.teacherId": user._id,
        day: today,
      }).populate("classId", "name").populate("periods.subjectId", "name");

      extra.todaySchedule = schedule.flatMap(t =>
        t.periods
          .filter(p => p.teacherId.toString() === user._id.toString())
          .map((p: any) => ({
            ...p.toObject(),
            className: (t.classId as any).name,
            subjectName: (p.subjectId as any).name
          }))
      ).sort((a, b) => a.startMinutes - b.startMinutes);

    } else if (user.role === UserRole.STUDENT) {
      const attendance = await Attendance.find({ studentId: user._id });
      const total = attendance.length;
      const present = attendance.filter((a) => a.status === "present").length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";

      stats = {
        summary: [
          { label: "Attendance", value: `${percentage}%`, icon: "attendance" },
          { label: "Sessions", value: total, icon: "sessions" },
        ],
      };

      // Today's Schedule for Student
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      if (user.classId) {
        const schedule = await Timetable.findOne({
          classId: user.classId,
          day: today,
        }).populate("periods.subjectId", "name").populate("periods.teacherId", "name");
        extra.todaySchedule = schedule?.periods || [];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        recentActivities,
        chartData,
        ...extra,
      },
    });
  },
);
