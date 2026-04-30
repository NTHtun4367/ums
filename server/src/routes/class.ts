import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "../controllers/class";

const router = Router();

router.use(protect, authorize(["admin"]));

router.post("/create", createClass);
router.get("/", getClasses);
router.patch("/update/:id", updateClass);
router.delete("/delete/:id", deleteClass);

export default router;
