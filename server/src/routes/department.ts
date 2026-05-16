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
router.get("/:id", getDepartmentById);

// RESTRICTED ACCESS (Admin Only)
router.use(authorize([UserRole.ADMIN]));

// POST /api/departments/create
router.post("/create", createDepartment);

// PATCH /api/departments/update/:id
router.patch("/update/:id", updateDepartment);

// DELETE /api/departments/delete/:id
router.delete("/delete/:id", deleteDepartment);

export default router;
