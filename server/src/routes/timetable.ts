// routes/timetable.ts
import { Router } from "express";
import { protect, authorize } from "../middlewares/auth";
import { UserRole } from "../models/user";
import {
  saveTimetable,
  getClassTimetable,
  deleteTimetableDay,
} from "../controllers/timetable";

const router = Router();

router.use(protect);

// Admin and Teachers can manage timetables
router
  .route("/")
  .post(authorize([UserRole.ADMIN, UserRole.TEACHER]), saveTimetable);

router
  .route("/:id")
  .delete(authorize([UserRole.ADMIN, UserRole.TEACHER]), deleteTimetableDay);

// Everyone (Admin, Teacher, Student) can view the timetable
router
  .route("/class/:classId")
  .get(
    authorize([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
    getClassTimetable,
  );

export default router;
