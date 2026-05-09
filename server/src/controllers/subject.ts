import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Subject } from "../models/subject";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new subject
export const createSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, departmentId, semester } = req.body;

    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      res.status(400);
      throw new Error("Subject with this code already exists.");
    }

    const subject = await Subject.create({
      name,
      code,
      departmentId,
      semester,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Subject",
      details: `Created subject: ${name} (${code})`,
    });

    res.status(201).json(subject);
  },
);

// @desc Get all subjects
export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { search, departmentId, semester } = req.query;

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }
  if (departmentId) query.departmentId = departmentId;
  if (semester) query.semester = semester;

  const [total, subjects] = await Promise.all([
    Subject.countDocuments(query),
    Subject.find(query)
      .populate("departmentId", "name code")
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    subjects,
    pagination: { page, pages: Math.ceil(total / limit), total, limit },
  });
});

// @desc Get single subject
export const getSubjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const subject = await Subject.findById(req.params.id).populate(
      "departmentId",
    );
    if (!subject) {
      res.status(404);
      throw new Error("Subject not found!");
    }
    res.status(200).json(subject);
  },
);

// @desc Update subject
export const updateSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedSubject) {
      res.status(404);
      throw new Error("Subject not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Subject",
      details: `Updated info for subject: ${updatedSubject.name}`,
    });

    res.status(200).json(updatedSubject);
  },
);

// @desc Delete subject
export const deleteSubject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Subject",
      details: `Deleted subject: ${subject.name}`,
    });

    res.status(200).json({ message: "Subject deleted successfully!" });
  },
);
