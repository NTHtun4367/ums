import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";
import { generateToken } from "../utils/generateToken";

// @desc Register new user
// @route POST /api/users/register
// @access Private (Admin & Teacher only)
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = await User.create(req.body);
    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Register",
      details: `Created ${newUser.role}: ${newUser.email}`,
    });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      message: "User registered successfully!",
    });
  },
);

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());
    // Return user without password
    const userResponse = await User.findById(user._id).select("-password");
    res.status(200).json(userResponse);
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc Get all users (With Pagination & Filtering)
// @route GET /api/users
// @access Private (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { role, search, departmentId } = req.query;

  const filters: any = {};

  if (role && role !== "all") filters.role = role;
  if (departmentId) filters.departmentId = departmentId;
  if (search)
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  const [total, users] = await Promise.all([
    User.countDocuments(filters),
    User.find(filters)
      .select("-password")
      .populate("departmentId classId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);

  res.json({
    users,
    pagination: { page, pages: Math.ceil(total / limit), total },
  });
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

// @desc Update user (Admin)
// @route PATCH /api/users/update/:id
// @access Private (Admin only)
export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Update User",
      details: `Updated ${user.email}`,
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User updated successfully!",
    });
  },
);

// @desc Delete user (Admin)
// @route DELETE /api/users/delete/:id
// @access Private (Admin only)
export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    const email = user.email; // Store for log
    await user.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted User",
      details: `Deleted user: ${email}`,
    });

    res.status(200).json({ message: "User deleted successfully!" });
  },
);

// @desc Logout user (clear cookies)
// @route POST /api/users/logout
// @access Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully!" });
});
