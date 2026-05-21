import { body, param } from "express-validator";
import { isValidObjectId } from "./common";

export const validateActivitiesLog = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("Responsible user ID required for system logs tracing context")
    .custom(isValidObjectId),
  body("action")
    .trim()
    .notEmpty()
    .withMessage(
      "Descriptive system logging execution tracking label required",
    ),
  body("details").optional().trim(),
];

export const validateMongoIdParam = (paramName: string) => [
  param(paramName)
    .trim()
    .custom(isValidObjectId)
    .withMessage(
      `Target URL parameter: '${paramName}' must be a valid 24-character hexadecimal MongoDB ID`,
    ),
];
