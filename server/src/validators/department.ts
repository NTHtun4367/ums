import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateDepartment = [
  body("name").trim().notEmpty().withMessage("Department name is required"),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Department code is required (e.g., CSE)")
    .isLength({ min: 2, max: 10 })
    .withMessage("Code must be between 2 and 10 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("headId").optional({ checkFalsy: true }).trim().custom(isValidObjectId),
];
