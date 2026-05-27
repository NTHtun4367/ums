import { Router } from "express";
import { protect, authorize } from "../middlewares/auth";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement";
import { announcementValidator } from "../validators/announcement";
import { validateRequest } from "../middlewares/validate";
import { UserRole } from "../models/user";

const router = Router();

// All roles can view relevant announcements
router.get("/", protect, getAnnouncements);

// Admin only management routes
router.use(protect, authorize([UserRole.ADMIN]));

router.post("/", announcementValidator, validateRequest, createAnnouncement);
router.put("/:id", announcementValidator, validateRequest, updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
