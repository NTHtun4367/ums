import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User, UserRole } from "../models/user";
import asyncHandler from "../utils/asyncHandler";
import { ENV } from "../utils/env";

/**
 * Custom request interface to include the user object
 */
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware to protect routes: Verifies JWT token from cookies
 */
export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Unauthorized. No token provided.");
    }

    try {
      // 2. Verify token
      const decoded = jwt.verify(token, ENV.JWT_SECRET!) as JwtPayload;

      // 3. Find user and exclude password
      const user = await User.findById(decoded.userId)
        .select("-password")
        .lean();

      if (!user) {
        res.status(401);
        throw new Error("User not found.");
      }

      // 4. Attach user to request object
      // We cast to unknown then IUser to satisfy TypeScript while using .lean()
      req.user = user as unknown as IUser;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized. Invalid token.");
    }
  },
);

/**
 * Middleware to authorize specific roles
 * Usage: router.post("/create", protect, authorize([UserRole.ADMIN, UserRole.HOD]), controller)
 */
export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if user exists (set by protect) and if their role is in the allowed list
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route.`,
      });
    }
    next();
  };
};
