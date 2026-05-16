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
router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

// Management: Admin only
router.post("/create", createSubject);
router.patch("/update/:id", updateSubject);
router.delete("/delete/:id", deleteSubject);
router.get("/", getSubjects);

export default router;
