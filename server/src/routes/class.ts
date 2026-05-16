import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../controllers/class";
import { UserRole } from "../models/user";

const router = Router();

router.use(protect);
router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

router.post("/create", createClass);
router.get("/", getClasses);
router.patch("/update/:id", updateClass);
router.delete("/delete/:id", deleteClass);

export default router;
