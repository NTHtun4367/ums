import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Class } from "../models/class";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new class
// @route POST /api/classes/create
export const createClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      name,
      academicYearId,
      departmentId,
      classTeacherId,
      semester,
      capacity,
    } = req.body;

    const existingClass = await Class.findOne({
      name,
      academicYearId,
      departmentId,
    });
    if (existingClass) {
      res.status(400);
      throw new Error(
        "A class with this name already exists for this department and year.",
      );
    }

    const newClass = await Class.create({
      name,
      academicYearId,
      departmentId,
      classTeacherId,
      semester,
      capacity,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Class",
      details: `Created class: ${newClass.name} (Sem: ${semester})`,
    });

    res.status(201).json(newClass);
  },
);

// @desc Get all classes
export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { search, departmentId, academicYearId } = req.query;

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (departmentId) query.departmentId = departmentId;
  if (academicYearId) query.academicYearId = academicYearId;

  const [total, classes] = await Promise.all([
    Class.countDocuments(query),
    Class.find(query)
      .populate("academicYearId", "name")
      .populate("departmentId", "name code")
      .populate("classTeacherId", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    classes,
    pagination: { page, pages: Math.ceil(total / limit), total, limit },
  });
});

// @desc Get single class
export const getClassById = asyncHandler(
  async (req: Request, res: Response) => {
    const classData = await Class.findById(req.params.id).populate(
      "academicYearId departmentId classTeacherId",
    );
    if (!classData) {
      res.status(404);
      throw new Error("Class not found!");
    }
    res.status(200).json(classData);
  },
);

// @desc Update class
export const updateClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedClass) {
      res.status(404);
      throw new Error("Class not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Class",
      details: `Updated class: ${updatedClass.name}`,
    });

    res.status(200).json(updatedClass);
  },
);

// @desc Delete class
export const deleteClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      res.status(404);
      throw new Error("Class not found!");
    }
    res.status(200).json({ message: "Class deleted successfully!" });
  },
);
