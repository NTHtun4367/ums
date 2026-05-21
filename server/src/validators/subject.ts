import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateSubject = [
  body("name").trim().notEmpty().withMessage("Subject name is required"),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Subject code is required (e.g., CS-101)"),
  body("departmentId")
    .trim()
    .notEmpty()
    .withMessage("Department ID is required")
    .custom(isValidObjectId),
  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Class ID mapping reference is required")
    .custom(isValidObjectId),
  body("semester")
    .notEmpty()
    .withMessage("Semester timeline is required")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester value must be a valid integer between 1 and 8")
    .toInt(),
];
