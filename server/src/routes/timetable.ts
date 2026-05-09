import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  generateTimetable,
  getAllTimetables,
  getTimetableByClass,
  deleteTimetable,
} from "../controllers/timetable";
import { UserRole } from "../models/user";

const router = Router();

// Global Middleware: All timetable operations require a logged-in user
router.use(protect);

/**
 * @desc    Generate a timetable using AI
 * @access  Private (Admin only)
 */
router.post("/generate", authorize([UserRole.ADMIN]), generateTimetable);

/**
 * @desc    Get all timetables with pagination
 * @access  Private (Admin and Teacher)
 */
router.get(
  "/",
  authorize([UserRole.ADMIN, UserRole.TEACHER]),
  getAllTimetables,
);

/**
 * @desc    Get timetable by class ID
 * @access  Private (Admin, Teacher, and Student)
 */
router.get(
  "/class/:classId",
  authorize([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getTimetableByClass,
);

/**
 * @desc    Delete a specific timetable
 * @access  Private (Admin only)
 */
router.delete("/delete/:id", authorize([UserRole.ADMIN]), deleteTimetable);

export default router;
