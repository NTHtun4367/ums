import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  login,
  logoutUser,
  updateUser,
  getMe,
  register,
} from "../controllers/user";

import { authorize, protect } from "../middlewares/auth";
import { UserRole } from "../models/user";

import { validateUser, validateMongoIdParam } from "../validators";

import { validateRequest } from "../middlewares/validate";

import { body } from "express-validator";

const router = Router();

// PUBLIC ROUTES

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login,
);

router.post("/logout", logoutUser);

// PROTECTED ROUTES

router.use(protect);

router.get("/me", getMe);

router.get(
  "/profile/:id",
  validateMongoIdParam("id"),
  validateRequest,
  getUserById,
);

// STAFF ROUTES

router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

router.post("/register", validateUser, validateRequest, register);

router.get("/", getUsers);

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateUser,
  validateRequest,
  updateUser,
);

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteUser,
);

export default router;
