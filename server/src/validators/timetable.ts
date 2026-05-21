import { body } from "express-validator";
import { isValidObjectId, isValidTime } from "./common";

export const validateTimetable = [
  body("classId")
    .trim()
    .notEmpty()
    .withMessage("Class mapping configuration identity required")
    .custom(isValidObjectId),
  body("day")
    .trim()
    .notEmpty()
    .withMessage("Target operational schedule configuration day is required")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Must provide a standard day name entry context"),
  body("periods")
    .isArray({ min: 1 })
    .withMessage(
      "Periods matrix tracking configuration must contain at least 1 active hour segment",
    ),
  body("periods.*.subjectId")
    .trim()
    .notEmpty()
    .withMessage("Target Subject configuration context identity required")
    .custom(isValidObjectId),
  body("periods.*.teacherId")
    .trim()
    .notEmpty()
    .withMessage(
      "Target Instructor tracking context node reference configuration required",
    )
    .custom(isValidObjectId),
  body("periods.*.startTime")
    .trim()
    .notEmpty()
    .withMessage("Start timestamp runtime marker required")
    .custom(isValidTime),
  body("periods.*.endTime")
    .trim()
    .notEmpty()
    .withMessage("Ending block tracking coordinate required")
    .custom(isValidTime)
    .custom((value, { req, path }) => {
      const index = parseInt(path.match(/\d+/)?.[0] || "0", 10);
      const start = req.body.periods?.[index]?.startTime;
      if (start && value <= start) {
        throw new Error(
          "End hour block cannot occur at or prior to the declared start tracking segment",
        );
      }
      return true;
    }),
  body("periods.*.room")
    .trim()
    .notEmpty()
    .withMessage("Assigned room resource designation coordinate is required"),
];
