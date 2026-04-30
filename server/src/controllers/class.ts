import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Class } from "../models/class";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new class
// @route POST /api/classes/create
// @access Private (Admin only)
export const createClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, academicYear, classTeacher, capacity } = req.body;

    const existingClass = await Class.findOne({ name, academicYear });

    if (existingClass) {
      res.status(400);
      throw new Error(
        "Class with this name already exists for the specific academic year.",
      );
    }

    const newClass = await Class.create({
      name,
      academicYear,
      classTeacher,
      capacity,
    });

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Created new class: ${newClass.name}`,
    });

    res.status(200).json(newClass);
  },
);

// @desc Update class
// @route PATCH /api/classes/update/:id
// @access Private (Admin only)
export const updateClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const classId = req.params.id;
    const { name, academicYear, classTeacher, capacity } = req.body;

    const existingClass = await Class.findOne({
      _id: { $ne: classId },
    });

    if (existingClass) {
      const updatedClass = await Class.findByIdAndUpdate(classId, req.body, {
        returnDocument: "after",
        runValidators: true,
      });

      if (!updatedClass) {
        res.status(404);
        throw new Error("Class not found!");
      }

      await logActivity({
        user: req.user?._id.toString()!,
        action: `Updated class: ${updatedClass.name}`,
      });

      res.status(200).json(updateClass);
    }
  },
);

// @desc Get all classes
// @route GET /api/classes
// @access Private (Admin only)
export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search;

  // query -> search by name
  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const [total, classes] = await Promise.all([
    Class.countDocuments(),
    Class.find(query)
      .populate("academicYear", "name")
      .populate("classTeacher", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
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

// @desc Delete class
// @route DELETE /api/classes/delete/:id
// @access Private (Admin only)
export const deleteClass = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      res.status(404);
      throw new Error("Class not found!");
    }

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Deleted class: ${deletedClass.name}`,
    });

    res.status(200).json({ message: "Class deleted successfully!" });
  },
);
