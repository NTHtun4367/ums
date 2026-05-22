import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Subject } from "../models/subject";
import { logActivity } from "../utils/activitieslog";

// @desc Create Subject
// @route POST /api/subjects/create
// @access Private

export const createSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, departmentId, classId, semester } = req.body;

    const existingSubject = await Subject.findOne({
      code: code.toUpperCase(),
      departmentId,
    });

    if (existingSubject) {
      res.status(400);
      throw new Error("Subject already exists in this department");
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      departmentId,
      classId,
      semester,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Subject",
      details: `Created subject ${subject.name} (${subject.code})`,
    });

    res.status(201).json(subject);
  },
);

// @desc Get Subjects
// @route GET /api/subjects
// @access Private

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const { search, departmentId, classId, semester } = req.query;

  const filters: any = {};

  if (departmentId) {
    filters.departmentId = departmentId;
  }

  if (classId) {
    filters.classId = classId;
  }

  if (semester) {
    filters.semester = Number(semester);
  }

  if (search) {
    filters.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [subjects, total] = await Promise.all([
    Subject.find(filters)
      .populate("departmentId", "name code")
      .populate("classId", "name semester")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Subject.countDocuments(filters),
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
});

// @desc Get Subject By ID
// @route GET /api/subjects/:id
// @access Private

export const getSubjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const subject = await Subject.findById(req.params.id)
      .populate("departmentId", "name code")
      .populate("classId", "name semester");

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    res.status(200).json(subject);
  },
);

// @desc Update Subject
// @route PATCH /api/subjects/update/:id
// @access Private

export const updateSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    const duplicateSubject = await Subject.findOne({
      _id: { $ne: req.params.id },
      code: req.body.code || subject.code,
      departmentId: req.body.departmentId || subject.departmentId,
    });

    if (duplicateSubject) {
      res.status(400);
      throw new Error("Another subject already uses this code");
    }

    Object.assign(subject, req.body);

    await subject.save();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Subject",
      details: `Updated subject ${subject.name}`,
    });

    res.status(200).json(subject);
  },
);

// @desc Delete Subject
// @route DELETE /api/subjects/delete/:id
// @access Private

export const deleteSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    await subject.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Subject",
      details: `Deleted subject ${subject.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  },
);
