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
import { validateAcademicYear, validateMongoIdParam } from "../validators";
import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);

router.get("/current", getCurrentAcademicYear);
router.get("/", getAllAcademicYears);

// Management: Admin only
router.use(authorize([UserRole.ADMIN]));

router.post(
  "/create",
  validateAcademicYear,
  validateRequest,
  createAcademicYear,
);

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateAcademicYear,
  validateRequest,
  updateAcademicYear,
);

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteAcademicYear,
);

export default router;
