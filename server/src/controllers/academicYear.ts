import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { AcademicYear } from "../models/academicYear";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new academic year
// @route POST /api/academic-years/create
// @access Private (Admin only)
export const createAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, fromYear, toYear, isCurrent } = req.body;

    const existingYear = await AcademicYear.findOne({ fromYear, toYear });

    if (existingYear) {
      res.status(400);
      throw new Error("Academic Year already exists!");
    }

    // if isCurrent is true, set all others academic years to false
    if (isCurrent) {
      await AcademicYear.updateMany(
        { _id: { $ne: null } },
        { isCurrent: false },
      );
    }

    const academicYear = await AcademicYear.create({
      name,
      fromYear,
      toYear,
      isCurrent: isCurrent || false,
    });

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Created academic year ${name}`,
    });

    res.status(201).json(academicYear);
  },
);

// @desc Get all academic years (Pagination & Search)
// @route GET /api/academic-years
// @access Public
export const getAllAcademicYears = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search;

    // query -> search by name
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [total, years] = await Promise.all([
      AcademicYear.countDocuments(),
      AcademicYear.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      years,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  },
);

// @desc Get the current active academic year
// @route POST /api/academic-years/current
// @access Public
export const getCurrentAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const currentYear = await AcademicYear.findOne({ isCurrent: true });

    if (!currentYear) {
      res.status(404);
      throw new Error("No current academic year found!");
    }

    res.status(200).json(currentYear);
  },
);

// @desc Update academic year
// @route PATCH /api/academic-years/update/:id
// @access Private (Admin only)
export const updateAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { isCurrent } = req.body;

    if (isCurrent) {
      await AcademicYear.updateMany(
        { _id: { $ne: req.params.id } },
        { isCurrent: false },
      );
    }

    const updatedYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedYear) {
      res.status(404);
      throw new Error("Academic Year not found!");
    }

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Updated academic year ${updatedYear.name}`,
    });

    res.status(200).json(updatedYear);
  },
);

// @desc Delete academic year
// @route DELETE /api/academic-years/delete/:id
// @access Private (Admin only)
export const deleteAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const year = await AcademicYear.findById(req.params.id);

    if (!year) {
      res.status(404);
      throw new Error("Academic Year not found!");
    }

    if (year.isCurrent) {
      res.status(400);
      throw new Error("Can't delete the current Academic Year!");
    }

    await year.deleteOne();

    await logActivity({
      user: req.user?._id.toString()!,
      action: `Deleted academic year ${year.name}`,
    });

    res.status(200).json({ message: "Academic Year deleted successfully!" });
  },
);
