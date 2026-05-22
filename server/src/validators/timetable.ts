import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateTimetable = [
  body("classId")
    .notEmpty()
    .withMessage("Class ID is required")
    .custom(isValidObjectId),

  body("day")
    .notEmpty()
    .withMessage("Day is required")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Invalid day"),

  body("periods")
    .isArray({ min: 1 })
    .withMessage("At least one period is required"),

  body("periods.*.subjectId")
    .notEmpty()
    .withMessage("Subject ID is required")
    .custom(isValidObjectId),

  body("periods.*.teacherId")
    .notEmpty()
    .withMessage("Teacher ID is required")
    .custom(isValidObjectId),

  body("periods.*.startMinutes")
    .isInt({ min: 0, max: 1440 })
    .withMessage("startMinutes must be between 0 and 1440"),

  body("periods.*.endMinutes")
    .isInt({ min: 0, max: 1440 })
    .withMessage("endMinutes must be between 0 and 1440")
    .custom((value, { req, path }) => {
      const index = Number(path.match(/\d+/)?.[0] || 0);

      const start = req.body.periods[index]?.startMinutes;

      if (value <= start) {
        throw new Error("endMinutes must be greater than startMinutes");
      }

      return true;
    }),

  body("periods.*.room").trim().notEmpty().withMessage("Room is required"),
];
