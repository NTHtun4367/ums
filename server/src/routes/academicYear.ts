import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAllAcademicYears,
  getCurrentAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear";
import { UserRole } from "../models/user";

const router = Router();

router.use(protect);

router.get("/current", getCurrentAcademicYear);
router.get("/", getAllAcademicYears);

// Management: Admin only
router.use(authorize([UserRole.ADMIN]));
router.post("/create", createAcademicYear);
router.patch("/update/:id", updateAcademicYear);
router.delete("/delete/:id", deleteAcademicYear);

export default router;
