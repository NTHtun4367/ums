import { body } from "express-validator";

export const validateAcademicYear = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Academic year name is required")
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Name must follow the format 'YYYY-YYYY' (e.g., 2025-2026)"),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date")
    .toDate(),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .toDate()
    .custom((value, { req }) => {
      if (
        req.body.startDate &&
        new Date(value) <= new Date(req.body.startDate)
      ) {
        throw new Error("End date must be after the start date");
      }
      return true;
    }),
  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean value")
    .toBoolean(),
];
