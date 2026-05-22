import { Router } from "express";

import { authorize, protect } from "../middlewares/auth";

import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "../controllers/subject";

import { UserRole } from "../models/user";

import { validateSubject, validateMongoIdParam } from "../validators";

import { validateRequest } from "../middlewares/validate";

const router = Router();

router.use(protect);

router.use(authorize([UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER]));

// Create

router.post("/create", validateSubject, validateRequest, createSubject);

// Get All

router.get("/", getSubjects);

// Get One

router.get("/:id", validateMongoIdParam("id"), validateRequest, getSubjectById);

// Update

router.patch(
  "/update/:id",
  validateMongoIdParam("id"),
  validateSubject,
  validateRequest,
  updateSubject,
);

// Delete

router.delete(
  "/delete/:id",
  validateMongoIdParam("id"),
  validateRequest,
  deleteSubject,
);

export default router;
