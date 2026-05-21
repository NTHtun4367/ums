import { Router } from "express";
import { protect, authorize } from "../middlewares/auth";
import { UserRole } from "../models/user";
import {
  saveTimetable,
  getClassTimetable,
  deleteTimetableDay,
} from "../controllers/timetable";
import { validateTimetable, validateMongoIdParam } from "../validators";
import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);

// Admin and Teachers can manage timetables
router
  .route("/")
  .post(
    authorize([UserRole.ADMIN, UserRole.TEACHER]),
    validateTimetable,
    validateRequest,
    saveTimetable,
  );

router
  .route("/:id")
  .delete(
    authorize([UserRole.ADMIN, UserRole.TEACHER]),
    validateMongoIdParam("id"),
    validateRequest,
    deleteTimetableDay,
  );

// Everyone (Admin, Teacher, Student) can view the timetable
router
  .route("/class/:classId")
  .get(
    authorize([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
    validateMongoIdParam("classId"),
    validateRequest,
    getClassTimetable,
  );

export default router;
