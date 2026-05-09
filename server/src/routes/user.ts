import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  login,
  logoutUser,
  register,
  updateUser,
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";
import { UserRole } from "../models/user";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/logout", logoutUser);

// Protected routes
router.use(protect);

// Profile is accessible by the user themselves or staff
router.get("/profile/:id", getUserById);

// Staff-only management routes
router.use(authorize([UserRole.ADMIN, UserRole.TEACHER]));

router.post("/register", register);
router.get("/", getUsers);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
