import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateClass = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Class name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Class name must be between 2 and 100 characters"),

  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required")
    .isLength({ min: 1, max: 10 })
    .withMessage("Section must be between 1 and 10 characters"),

  body("academicYearId")
    .trim()
    .notEmpty()
    .withMessage("Academic Year reference ID is required")
    .custom(isValidObjectId),

  body("departmentId")
    .trim()
    .notEmpty()
    .withMessage("Department reference ID is required")
    .custom(isValidObjectId),

  body("classTeacherId")
    .optional({ checkFalsy: true })
    .trim()
    .custom(isValidObjectId),

  body("semester")
    .notEmpty()
    .withMessage("Semester is required")
    .isInt({ min: 1, max: 20 })
    .withMessage("Semester must be between 1 and 20")
    .toInt(),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("Capacity must be between 1 and 500")
    .toInt(),
];
