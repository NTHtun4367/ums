import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateDepartment = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Department code is required")
    .isLength({ min: 2, max: 10 })
    .withMessage("Department code must be between 2 and 10 characters")
    .toUpperCase(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  // NEW FIELD
  body("isAcademic")
    .optional()
    .isBoolean()
    .withMessage("isAcademic must be a boolean value")
    .toBoolean(),

  body("headId").optional({ checkFalsy: true }).custom(isValidObjectId),
];
