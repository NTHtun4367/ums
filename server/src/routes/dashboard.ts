import { Router } from "express";
import { protect } from "../middlewares/auth";
import { getDashboardStats } from "../controllers/dashboard";

const router = Router();

// Internal controller logic (if/else) handles specific data visibility
router.get("/stats", protect, getDashboardStats);

export default router;
