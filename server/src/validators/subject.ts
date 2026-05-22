import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateSubject = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Subject name must be between 2 and 100 characters"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Subject code is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Subject code length invalid")
    .toUpperCase(),

  body("departmentId")
    .trim()
    .notEmpty()
    .withMessage("Department ID is required")
    .custom(isValidObjectId),

  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Class ID is required")
    .custom(isValidObjectId),

  body("semester")
    .notEmpty()
    .withMessage("Semester is required")
    .isInt({ min: 1, max: 20 })
    .withMessage("Semester must be between 1 and 20")
    .toInt(),
];
