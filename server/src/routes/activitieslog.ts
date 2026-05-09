import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import { getAllActivities } from "../controllers/activitieslog";
import { UserRole } from "../models/user";

const router = Router();

router.use(protect);
router.use(authorize([UserRole.ADMIN, UserRole.TEACHER]));

router.get("/", getAllActivities);

export default router;
