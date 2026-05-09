import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import asyncHandler from "../utils/asyncHandler";
import { Department } from "../models/department";
import { logActivity } from "../utils/activitieslog";

// @desc Create a new department
// @route POST /api/departments/create
// @access Private (Admin only)
export const createDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, code, description, headId } = req.body;

    const existingDept = await Department.findOne({
      $or: [{ name }, { code }],
    });
    if (existingDept) {
      res.status(400);
      throw new Error("Department with this name or code already exists.");
    }

    const department = await Department.create({
      name,
      code,
      description,
      headId,
    });

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Created Department",
      details: `Created department: ${department.name} (${department.code})`,
    });

    res.status(201).json(department);
  },
);

// @desc Get all departments (With Pagination & Search)
// @route GET /api/departments
// @access Private
export const getDepartments = asyncHandler(
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

    const [total, departments] = await Promise.all([
      Department.countDocuments(query),
      Department.find(query)
        .populate("headId", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }),
    ]);

    res.status(200).json({
      departments,
      pagination: { page, pages: Math.ceil(total / limit), total, limit },
    });
  },
);

// @desc Get single department
// @route GET /api/departments/:id
export const getDepartmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await Department.findById(req.params.id).populate(
      "headId",
      "name email",
    );
    if (!department) {
      res.status(404);
      throw new Error("Department not found!");
    }
    res.status(200).json(department);
  },
);

// @desc Update department
// @route PATCH /api/departments/update/:id
export const updateDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updatedDept = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDept) {
      res.status(404);
      throw new Error("Department not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Updated Department",
      details: `Updated info for department: ${updatedDept.name}`,
    });

    res.status(200).json(updatedDept);
  },
);

// @desc Delete department
// @route DELETE /api/departments/delete/:id
export const deleteDepartment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.status(404);
      throw new Error("Department not found!");
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted Department",
      details: `Deleted department: ${department.name}`,
    });

    res.status(200).json({ message: "Department deleted successfully!" });
  },
);
