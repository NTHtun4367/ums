import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  login,
  logoutUser,
  updateUser,
  getMe,
  register, // Ensure this is imported for the session check
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";
import { UserRole } from "../models/user";

const router = Router();

// --- Public Routes ---
router.post("/login", login);
router.post("/logout", logoutUser);

// --- Protected Routes (Login Required) ---
router.use(protect);

// 1. Session Verification Route
// Used by useGetMeQuery to verify the user is still active in the DB
router.get("/me", getMe);

// 2. Profile Access
// Accessible by the user themselves or staff
router.get("/profile/:id", getUserById);

// --- Staff-Only Management Routes ---
// Requires ADMIN or TEACHER role
router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

router.post("/register", register);
router.get("/", getUsers);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
