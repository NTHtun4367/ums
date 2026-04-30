import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
} from "../controllers/subject";

const router = Router();

router.use(protect);

router.post("/create", authorize(["admin"]), createSubject);
router.get("/", authorize(["admin", "teacher"]), getAllSubjects);
router.patch("/update/:id", authorize(["admin"]), updateSubject);
router.delete("/delete/:id", authorize(["admin"]), deleteSubject);

export default router;
