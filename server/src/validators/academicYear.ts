import { body } from "express-validator";

export const validateAcademicYear = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Academic year name is required")
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Name must follow format YYYY-YYYY"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be valid ISO date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be valid ISO date")
    .toDate()
    .custom((value, { req }) => {
      const startDate = req.body.startDate;

      if (startDate && new Date(value) <= new Date(startDate)) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be boolean")
    .toBoolean(),
];
