import { body } from "express-validator";
import { isValidObjectId } from "./common";

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
  body("academicYearId")
    .trim()
    .notEmpty()
    .withMessage("Academic Year ID is required")
    .custom(isValidObjectId),
  body("date")
    .notEmpty()
    .withMessage("Attendance date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 timestamp")
    .toDate(),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Attendance status is required")
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("Status must be either: present, absent, late, or excused"),
  body("markedBy")
    .trim()
    .notEmpty()
    .withMessage("Marking Teacher ID reference is required")
    .custom(isValidObjectId),
];
