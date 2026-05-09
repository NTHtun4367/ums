import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subject";
import { UserRole } from "../models/user";

const router = Router();

router.use(protect);

// Management: Admin only
router.post("/create", authorize([UserRole.ADMIN]), createSubject);
router.patch("/update/:id", authorize([UserRole.ADMIN]), updateSubject);
router.delete("/delete/:id", authorize([UserRole.ADMIN]), deleteSubject);

// View: Admin and Teacher
router.get("/", authorize([UserRole.ADMIN, UserRole.TEACHER]), getSubjects);

export default router;
