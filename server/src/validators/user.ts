import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("User full profile identification name parameter is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email parameter tracking identifier required")
    .isEmail()
    .withMessage("Must provide a format-adherent electronic address structure")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Authentication credentials passkey is required")
    .isLength({ min: 6 })
    .withMessage(
      "Secret authentication passphrase must meet structural length requirements of at least 6 characters",
    ),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("System routing role validation attribute required")
    .isIn(["admin", "hod", "teacher", "student"])
    .withMessage("Unauthorized structural tier access assignment attempt"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage(
      "Status toggle configurations must map explicitly to true or false fields",
    )
    .toBoolean(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Active contact telephone registry link string is required"),
  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Biological gender mapping reference field is required")
    .isIn(["male", "female", "other"])
    .withMessage("Select an applicable mapping alternative frame"),
  body("departmentId")
    .optional({ checkFalsy: true })
    .trim()
    .custom(isValidObjectId),
  body("teacherStatus").custom((value, { req }) => {
    if (req.body.role === "teacher" || req.body.role === "hod") {
      const structuralTiers = [
        "professor",
        "assistant_professor",
        "lecturer",
        "tutor",
      ];
      if (!value || !structuralTiers.includes(value)) {
        throw new Error(
          "Academic staff ranking status descriptor must be declared accurately for teachers/HODs",
        );
      }
    }
    return true;
  }),
  body("classId").custom((value, { req }) => {
    if (req.body.role === "student") {
      if (!value)
        throw new Error(
          "Assigned operational group class assignment reference is required for students",
        );
      return isValidObjectId(value);
    }
    return true;
  }),
  body("rollNo").custom((value, { req }) => {
    if (req.body.role === "student" && (!value || value.trim() === "")) {
      throw new Error(
        "Student tracking matrix ledger sequence code (Roll No) is required",
      );
    }
    return true;
  }),
  body("admissionDate")
    .optional()
    .isISO8601()
    .withMessage(
      "Admission date tracking context must adhere to format specifications",
    )
    .toDate(),
];
