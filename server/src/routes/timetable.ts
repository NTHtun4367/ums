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

// CREATE / UPDATE TIMETABLE

router.post(
  "/",
  authorize([UserRole.ADMIN, UserRole.TEACHER]),
  validateTimetable,
  validateRequest,
  saveTimetable,
);

// DELETE TIMETABLE DAY

router.delete(
  "/:id",
  authorize([UserRole.ADMIN, UserRole.TEACHER]),
  validateMongoIdParam("id"),
  validateRequest,
  deleteTimetableDay,
);

// GET CLASS TIMETABLE

router.get(
  "/class/:classId",
  authorize([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  validateMongoIdParam("classId"),
  validateRequest,
  getClassTimetable,
);

export default router;
