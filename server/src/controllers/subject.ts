import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Subject } from "../models/subject";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new subject
// @route POST /api/subjects/create
// @access Private (Admin only)
export const createSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, teacher, isActive } = req.body;

    const existingSubject = await Subject.findOne({ code });

    if (existingSubject) {
      res.status(400);
      throw new Error("Subject code already exists!");
    }

    const newSubject = await Subject.create({
      name,
      code,
      teacher: Array.isArray(teacher) ? teacher : [],
      isActive,
    });

    if (newSubject) {
      await logActivity({
        user: req.user?._id.toString()!,
        action: `Created subject: ${newSubject.name}`,
      });

      res.status(201).json(newSubject);
    }
  },
);

// @desc Get all subjects
// @route GET /api/subjects
// @access Private (Admin only)
export const getAllSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    // fetch subjects with pagination & filtering
    const [total, subjects] = await Promise.all([
      Subject.countDocuments(query),
      Subject.find(query)
        .populate("teacher", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      subjects,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  },
);

// @desc Update subject
// @route PATCH /api/subjects/update/:id
// @access Private (Admin only)
export const updateSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, teacher, isActive } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        teacher: Array.isArray(teacher) ? teacher : [],
        isActive,
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSubject) {
      res.status(404);
      throw new Error("Subject not found!");
    }

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Updated subject: ${updatedSubject.name}`,
    });

    res.status(201).json(updatedSubject);
  },
);

// @desc Delete subject
// @route DELETE /api/subjects/delete/:id
// @access Private (Admin only)
export const deleteSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    if (!deletedSubject) {
      res.status(404);
      throw new Error("Subject not found!");
    }

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Deleted subject: ${deletedSubject.name}`,
    });

    res.status(201).json({ message: "Subject deleted successfully!" });
  },
);
