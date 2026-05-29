import { Router } from "express";

import { authorize, protect, authenticate } from "../middlewares/auth";

import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controllers/department";

import { UserRole } from "../models/user";

import { validateDepartment, validateMongoIdParam } from "../validators";

import { validateRequest } from "../middlewares/validate";

const router = Router();

// Shared Access (Public for landing, Private for dashboard)

router.get("/", protect, getDepartments);

router.get(
  "/:id",
  protect,
  validateMongoIdParam("id"),
  validateRequest,
  getDepartmentById,
);

// Admin Only

router.use(protect, authenticate, authorize([UserRole.ADMIN]));

router.post("/create", validateDepartment, validateRequest, createDepartment);

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateDepartment,
  validateRequest,
  updateDepartment,
);

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteDepartment,
);

export default router;
