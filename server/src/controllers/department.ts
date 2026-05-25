import { Request, Response } from "express";
import { Types } from "mongoose";

import asyncHandler from "../utils/asyncHandler";

import { Department } from "../models/department";
import { User, UserRole } from "../models/user";

import { AuthRequest } from "../middlewares/auth";

import { logActivity } from "../utils/activitieslog";

// @desc Create Department
// @route POST /api/departments/create
// @access Private/Admin

export const createDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, description, headId, isAcademic } = req.body;

    const normalizedName = name.trim();
    const normalizedCode = code.toUpperCase();

    const existingDepartment = await Department.findOne({
      $or: [{ name: normalizedName }, { code: normalizedCode }],
    });

    if (existingDepartment) {
      res.status(400);
      throw new Error("Department with same name or code already exists");
    }

    // Validate HOD

    if (headId) {
      const hod = await User.findById(headId);

      if (!hod) {
        res.status(404);
        throw new Error("Assigned HOD user not found");
      }

      if (hod.role !== UserRole.HOD && hod.role !== UserRole.TEACHER) {
        res.status(400);
        throw new Error("Department head must be HOD or Teacher");
      }
    }

    const department = await Department.create({
      name: normalizedName,
      code: normalizedCode,
      description,

      // NEW FIELD
      isAcademic: typeof isAcademic === "boolean" ? isAcademic : true,

      headId: headId ? new Types.ObjectId(headId) : null,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Department",
      details: `Created department ${department.name}`,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  },
);

// @desc Get Departments
// @route GET /api/departments
// @access Private

export const getDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { search, isAcademic } = req.query;

    const filters: any = {};

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

    // NEW FILTER
    if (typeof isAcademic !== "undefined") {
      filters.isAcademic = isAcademic === "true";
    }

    const [departments, total] = await Promise.all([
      Department.find(filters)
        .populate("headId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Department.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      departments,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  },
);

// @desc Get Department By ID
// @route GET /api/departments/:id
// @access Private

export const getDepartmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await Department.findById(req.params.id).populate(
      "headId",
      "name email role",
    );

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  },
);

// @desc Update Department
// @route PATCH /api/departments/update/:id
// @access Private/Admin

export const updateDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    // Normalize fields

    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }

    // Duplicate validation

    const duplicateDepartment = await Department.findOne({
      _id: { $ne: req.params.id },

      $or: [
        {
          name: req.body.name || department.name,
        },
        {
          code: req.body.code || department.code,
        },
      ],
    });

    if (duplicateDepartment) {
      res.status(400);
      throw new Error("Another department already uses this name or code");
    }

    // Validate head

    if (req.body.headId) {
      const hod = await User.findById(req.body.headId);

      if (!hod) {
        res.status(404);
        throw new Error("Assigned HOD not found");
      }

      if (hod.role !== UserRole.HOD && hod.role !== UserRole.TEACHER) {
        res.status(400);
        throw new Error("Department head must be HOD or Teacher");
      }
    }

    // NEW FIELD SUPPORT
    if (typeof req.body.isAcademic !== "undefined") {
      department.isAcademic = req.body.isAcademic;
    }

    if (typeof req.body.name !== "undefined") {
      department.name = req.body.name;
    }

    if (typeof req.body.code !== "undefined") {
      department.code = req.body.code;
    }

    if (typeof req.body.description !== "undefined") {
      department.description = req.body.description;
    }

    if (typeof req.body.headId !== "undefined") {
      department.headId = req.body.headId
        ? new Types.ObjectId(req.body.headId)
        : null;
    }

    await department.save();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Department",
      details: `Updated department ${department.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  },
);

// @desc Delete Department
// @route DELETE /api/departments/delete/:id
// @access Private/Admin

export const deleteDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    await department.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Department",
      details: `Deleted department ${department.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  },
);
