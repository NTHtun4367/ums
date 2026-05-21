import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  getAttendanceByClass,
  getStudentStats,
  markAttendance,
} from "../controllers/attendance";
import { UserRole } from "../models/user";
import { validateAttendance, validateMongoIdParam } from "../validators";
import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);

// Only Admin and Teacher can mark or view class-wide attendance
router
  .route("/")
  .post(
    authorize([UserRole.ADMIN, UserRole.TEACHER]),
    validateAttendance,
    validateRequest,
    markAttendance,
  );

router
  .route("/class/:classId")
  .get(
    authorize([UserRole.ADMIN, UserRole.TEACHER]),
    validateMongoIdParam("classId"),
    validateRequest,
    getAttendanceByClass,
  );

// Students can view their own stats, Admin/Teacher can view anyone's
router
  .route("/student/:studentId/stats")
  .get(
    authorize([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
    validateMongoIdParam("studentId"),
    validateRequest,
    getStudentStats,
  );

export default router;
