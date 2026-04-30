import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAllAcademicYears,
  getCurrentAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear";

const router = Router();

router.use(protect);

router.post("/create", authorize(["admin"]), createAcademicYear);
router.patch("/update/:id", authorize(["admin"]), updateAcademicYear);
router.delete("/delete/:id", authorize(["admin"]), deleteAcademicYear);
router.get("/current", getCurrentAcademicYear);
router.get("/current", authorize(["admin"]), getAllAcademicYears);

export default router;
