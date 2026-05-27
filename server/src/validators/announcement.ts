import { body } from "express-validator";
import { AnnouncementTarget } from "../models/announcement";
import { isValidObjectId } from "./common";

export const announcementValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be less than 200 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("target")
    .trim()
    .notEmpty()
    .withMessage("Target is required")
    .isIn(Object.values(AnnouncementTarget))
    .withMessage("Invalid target audience"),

  body("departmentId")
    .optional({ checkFalsy: true })
    .custom(isValidObjectId)
    .withMessage("Invalid department ID"),

  body("expiresAt")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid expiration date format"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
