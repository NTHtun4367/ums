import { body } from "express-validator";
import { isValidObjectId } from "./common";

export const validateUser = [
  body("name").optional().trim().notEmpty().withMessage("Name is required"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "hod", "teacher", "student"])
    .withMessage("Invalid role"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("departmentId")
    .optional({ nullable: true })
    .custom((value) => {
      if (value) {
        return isValidObjectId(value);
      }
      return true;
    }),

  body("teacherStatus")
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === "teacher" || req.body.role === "hod") {
        const statuses = [
          "professor",
          "assistant_professor",
          "lecturer",
          "tutor",
        ];

        if (!statuses.includes(value)) {
          throw new Error("Invalid teacher status");
        }
      }

      return true;
    }),

  body("classId")
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === "student") {
        if (!value) {
          throw new Error("classId is required for students");
        }

        return isValidObjectId(value);
      }

      return true;
    }),

  body("rollNo")
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === "student") {
        if (!value || value.trim() === "") {
          throw new Error("Roll number is required");
        }
      }

      return true;
    }),

  body("admissionDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid admission date")
    .toDate(),
];
