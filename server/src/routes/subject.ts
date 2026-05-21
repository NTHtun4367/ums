import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subject";
import { UserRole } from "../models/user";
import { validateSubject, validateMongoIdParam } from "../validators";
import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);
router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

// Management: Admin / Staff
router.post("/create", validateSubject, validateRequest, createSubject);

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateSubject,
  validateRequest,
  updateSubject,
);

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteSubject,
);

router.get("/", getSubjects);

export default router;
