import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import { getAllActivities } from "../controllers/activitieslog";

const router = Router();

router.use(protect, authorize(["admin", "teacher"]));

router.get("/", getAllActivities);

export default router;
