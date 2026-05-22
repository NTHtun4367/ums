import { body } from "express-validator";
import { isValidObjectId } from "./common";
import { AttendanceStatus } from "../models/attendance";

export const validateAttendance = [
  body("studentId")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required")
    .custom(isValidObjectId),

  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Class ID is required")
    .custom(isValidObjectId),

  body("subjectId")
    .trim()
    .notEmpty()
    .withMessage("Subject ID is required")
    .custom(isValidObjectId),

  body("teacherId")
    .trim()
    .notEmpty()
    .withMessage("Teacher ID is required")
    .custom(isValidObjectId),

  body("academicYearId")
    .trim()
    .notEmpty()
    .withMessage("Academic Year ID is required")
    .custom(isValidObjectId),

  body("attendanceDate")
    .notEmpty()
    .withMessage("Attendance date is required")
    .isISO8601()
    .withMessage("Attendance date must be valid")
    .toDate(),

  body("sessionNumber")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Session number must be greater than 0")
    .toInt(),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Attendance status is required")
    .isIn(Object.values(AttendanceStatus))
    .withMessage("Invalid attendance status"),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Remarks cannot exceed 300 characters"),
];
