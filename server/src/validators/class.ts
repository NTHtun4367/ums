import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateClass = [
  body("name").trim().notEmpty().withMessage("Class name is required"),
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
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be an integer between 1 and 8")
    .toInt(),
  body("capacity")
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage("Capacity must be an integer between 1 and 200")
    .toInt(),
];
