import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";

import asyncHandler from "../utils/asyncHandler";

import { Class } from "../models/class";

import { logActivity } from "../utils/activitieslog";

// @desc Create new class
// @route POST /api/classes/create
// @access Private
export const createClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      name,
      section,
      academicYearId,
      departmentId,
      classTeacherId,
      semester,
      capacity,
    } = req.body;

    const existingClass = await Class.findOne({
      name,
      section,
      academicYearId,
      departmentId,
    });

    if (existingClass) {
      res.status(400);
      throw new Error(
        "Class already exists for this section, department and academic year",
      );
    }

    const newClass = await Class.create({
      name,
      section,
      academicYearId,
      departmentId,
      classTeacherId: classTeacherId || undefined,
      semester,
      capacity,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Class",
      details: `Created class ${newClass.name}-${newClass.section}`,
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate("academicYearId", "name")
      .populate("departmentId", "name code")
      .populate("classTeacherId", "name email");

    res.status(201).json(populatedClass);
  },
);

// @desc Get all classes
// @route GET /api/classes
// @access Private
export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const { search, departmentId, academicYearId, semester, section } = req.query;

  const query: any = {};

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        section: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (departmentId) {
    query.departmentId = departmentId;
  }

  if (academicYearId) {
    query.academicYearId = academicYearId;
  }

  if (semester) {
    query.semester = Number(semester);
  }

  if (section) {
    query.section = section;
  }

  const [total, classes] = await Promise.all([
    Class.countDocuments(query),

    Class.find(query)
      .populate("academicYearId", "name")
      .populate("departmentId", "name code")
      .populate("classTeacherId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      }),
  ]);

  res.status(200).json({
    classes,

    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  });
});

// @desc Get class by id
// @route GET /api/classes/:id
// @access Private
export const getClassById = asyncHandler(
  async (req: Request, res: Response) => {
    const classData = await Class.findById(req.params.id)
      .populate("academicYearId", "name")
      .populate("departmentId", "name code")
      .populate("classTeacherId", "name email");

    if (!classData) {
      res.status(404);
      throw new Error("Class not found");
    }

    res.status(200).json(classData);
  },
);

// @desc Update class
// @route PATCH /api/classes/update/:id
// @access Private
export const updateClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("academicYearId", "name")
      .populate("departmentId", "name code")
      .populate("classTeacherId", "name email");

    if (!updatedClass) {
      res.status(404);
      throw new Error("Class not found");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Class",
      details: `Updated class ${updatedClass.name}-${updatedClass.section}`,
    });

    res.status(200).json(updatedClass);
  },
);

// @desc Delete class
// @route DELETE /api/classes/delete/:id
// @access Private
export const deleteClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      res.status(404);
      throw new Error("Class not found");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Class",
      details: `Deleted class ${deletedClass.name}-${deletedClass.section}`,
    });

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  },
);
