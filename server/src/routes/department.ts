import { Router } from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department";
import { UserRole } from "../models/user";
import { validateDepartment, validateMongoIdParam } from "../validators";
import { validateRequest } from "../middlewares/validate";

const router = Router();

/**
 * All department routes are protected.
 * Specific management actions (Create, Update, Delete) are restricted to ADMINs.
 */
router.use(protect);

// PUBLIC/SHARED ACCESS (Authenticated Users)
// GET /api/departments (List with pagination/search)
router.get("/", getDepartments);

// GET /api/departments/:id (Single department details)
router.get(
  "/:id",
  validateMongoIdParam("id"),
  validateRequest,
  getDepartmentById,
);

// RESTRICTED ACCESS (Admin Only)
router.use(authorize([UserRole.ADMIN]));

// POST /api/departments/create
router.post("/create", validateDepartment, validateRequest, createDepartment);

// PATCH /api/departments/update/:id
router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateDepartment,
  validateRequest,
  updateDepartment,
);

// DELETE /api/departments/delete/:id
router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteDepartment,
);

export default router;
