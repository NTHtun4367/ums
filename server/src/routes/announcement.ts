import { Router } from "express";
import { protect, authorize, authenticate } from "../middlewares/auth";
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

// Public can view public announcements, logged-in view relevant ones
router.get("/", protect, getAnnouncements);

// Admin only management routes
router.use(protect, authenticate, authorize([UserRole.ADMIN]));

router.post("/", announcementValidator, validateRequest, createAnnouncement);
router.put("/:id", announcementValidator, validateRequest, updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
