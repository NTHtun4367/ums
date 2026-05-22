import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AcademicYear } from "../models/academicYear";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";

// @desc Create Academic Year
// @route POST /api/academic-years/create
// @access Private/Admin

export const createAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, startDate, endDate, isCurrent } = req.body;

    // Check duplicate name

    const existingName = await AcademicYear.findOne({
      name,
    });

    if (existingName) {
      res.status(400);
      throw new Error("Academic year name already exists");
    }

    // Prevent overlapping years

    const overlappingYear = await AcademicYear.findOne({
      $or: [
        {
          startDate: {
            $lte: new Date(endDate),
          },
          endDate: {
            $gte: new Date(startDate),
          },
        },
      ],
    });

    if (overlappingYear) {
      res.status(400);
      throw new Error("Academic year overlaps with existing year");
    }

    // Only one current year

    if (isCurrent) {
      await AcademicYear.updateMany(
        {},
        {
          isCurrent: false,
        },
      );
    }

    const academicYear = await AcademicYear.create({
      name,
      startDate,
      endDate,
      isCurrent: isCurrent || false,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Academic Year",
      details: `Created academic year ${academicYear.name}`,
    });

    res.status(201).json({
      success: true,
      data: academicYear,
    });
  },
);

// @desc Get all academic years

export const getAllAcademicYears = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { search } = req.query;

    const query: any = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const [total, years] = await Promise.all([
      AcademicYear.countDocuments(query),

      AcademicYear.find(query)
        .sort({
          startDate: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.status(200).json({
      success: true,

      data: years,

      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  },
);

// @desc Get current academic year

export const getCurrentAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const currentYear = await AcademicYear.findOne({
      isCurrent: true,
    }).lean();

    if (!currentYear) {
      res.status(404);

      throw new Error("No current academic year found");
    }

    res.status(200).json({
      success: true,
      data: currentYear,
    });
  },
);

// @desc Update academic year

export const updateAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { isCurrent } = req.body;

    const existingYear = await AcademicYear.findById(req.params.id);

    if (!existingYear) {
      res.status(404);

      throw new Error("Academic year not found");
    }

    // Prevent overlap

    if (req.body.startDate || req.body.endDate) {
      const start = req.body.startDate || existingYear.startDate;

      const end = req.body.endDate || existingYear.endDate;

      const overlap = await AcademicYear.findOne({
        _id: {
          $ne: req.params.id,
        },

        startDate: {
          $lte: new Date(end),
        },

        endDate: {
          $gte: new Date(start),
        },
      });

      if (overlap) {
        res.status(400);

        throw new Error("Academic year overlaps with another year");
      }
    }

    // Ensure one current year

    if (isCurrent) {
      await AcademicYear.updateMany(
        {
          _id: {
            $ne: req.params.id,
          },
        },
        {
          isCurrent: false,
        },
      );
    }

    const updatedYear = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Academic Year",
      details: `Updated academic year ${updatedYear?.name}`,
    });

    res.status(200).json({
      success: true,
      data: updatedYear,
    });
  },
);

// @desc Delete academic year

export const deleteAcademicYear = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const year = await AcademicYear.findById(req.params.id);

    if (!year) {
      res.status(404);

      throw new Error("Academic year not found");
    }

    if (year.isCurrent) {
      res.status(400);

      throw new Error("Cannot delete current academic year");
    }

    await year.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Academic Year",
      details: `Deleted academic year ${year.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Academic year deleted successfully",
    });
  },
);
