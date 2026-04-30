import { Router } from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  login,
  logoutUser,
  register,
  updateUser,
} from "../controllers/user";
import { authorize, protect } from "../middlewares/auth";

const router = Router();

router.post("/register", protect, authorize(["admin", "teacher"]), register);
router.post("/login", login);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, authorize(["admin", "teacher"]), getUsers);
router.patch(
  "/update/:id",
  protect,
  authorize(["admin", "teacher"]),
  updateUser,
);
router.delete(
  "/delete/:id",
  protect,
  authorize(["admin", "teacher"]),
  deleteUser,
);

export default router;
