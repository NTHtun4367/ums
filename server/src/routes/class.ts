import { Router } from "express";

import { authorize, protect } from "../middlewares/auth";

import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  updateClass,
} from "../controllers/class";

import { UserRole } from "../models/user";

import { validateClass, validateMongoIdParam } from "../validators";

import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);

router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

router.post("/create", validateClass, validateRequest, createClass);

router.get("/", getClasses);

router.get("/:id", validateMongoIdParam("id"), validateRequest, getClassById);

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateClass,
  validateRequest,
  updateClass,
);

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteClass,
);

export default router;
