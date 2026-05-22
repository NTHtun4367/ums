import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User, UserRole } from "../models/user";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";
import { generateToken } from "../utils/generateToken";
import { Department } from "../models/department";

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, departmentId, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Cleanup unwanted fields
    if (role !== UserRole.STUDENT) {
      delete req.body.classId;
      delete req.body.rollNo;
    }

    if (role === UserRole.ADMIN) {
      delete req.body.departmentId;
      delete req.body.teacherStatus;
    }

    // Default HOD status
    if (role === UserRole.HOD) {
      req.body.teacherStatus = "professor";
    }

    const newUser = await User.create(req.body);

    // Update Department Head
    if (role === UserRole.HOD && departmentId) {
      await Department.findByIdAndUpdate(departmentId, {
        headId: newUser._id,
      });
    }

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Register User",
      details: `Created ${newUser.role}: ${newUser.email}`,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      teacherStatus: newUser.teacherStatus,
      isActive: newUser.isActive,
      message: "User registered successfully",
    });
  },
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  generateToken(res, user._id.toString());

  const userResponse = await User.findById(user._id)
    .select("-password")
    .populate("departmentId classId");

  res.status(200).json(userResponse);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const { role, search, departmentId, teacherStatus, classId } = req.query;

  const filters: any = {};

  if (role && role !== "all") {
    filters.role = role;
  }

  if (departmentId) {
    filters.departmentId = departmentId;
  }

  if (teacherStatus) {
    filters.teacherStatus = teacherStatus;
  }

  if (classId) {
    filters.classId = classId;
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
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filters),

    User.find(filters)
      .select("-password")
      .populate("departmentId classId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    users,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id)
    .select("-password")
    .populate("departmentId classId");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("departmentId classId");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Prevent password direct update here
    delete req.body.password;

    Object.assign(user, req.body);

    await user.save();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Update User",
      details: `Updated ${user.email}`,
    });

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  },
);

export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const email = user.email;

    await user.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Delete User",
      details: `Deleted ${email}`,
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  },
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});
