import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Announcement, AnnouncementTarget } from "../models/announcement";
import { AuthRequest } from "../middlewares/auth";
import { UserRole } from "../models/user";
import { logActivity } from "../utils/activitieslog";

/**
 * @desc Get all announcements (filtered by target for non-admins)
 * @route GET /api/announcements
 * @access Private
 */
export const getAnnouncements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const query: any = { isActive: true };

  // For non-admins, filter based on target
  if (user.role !== UserRole.ADMIN) {
    const orConditions: any[] = [
      { target: AnnouncementTarget.ALL },
      { target: user.role }, // Match specific role (teacher, student, hod)
    ];

    if (user.departmentId) {
      orConditions.push({
        target: AnnouncementTarget.DEPARTMENT,
        departmentId: user.departmentId,
      });
    }

    query.$and = [
      { $or: orConditions },
      { $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }] },
    ];
  }

  const announcements = await Announcement.find(query)
    .sort({ createdAt: -1 })
    .populate("authorId", "name role")
    .populate("departmentId", "name");

  res.status(200).json({
    success: true,
    data: announcements,
  });
});

/**
 * @desc Create a new announcement
 * @route POST /api/announcements
 * @access Private/Admin
 */
export const createAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, target, departmentId, expiresAt } = req.body;

  const announcement = await Announcement.create({
    title,
    content,
    target,
    departmentId,
    expiresAt,
    authorId: req.user!._id,
  });

  await logActivity({
    userId: req.user!._id.toString(),
    action: "Announcement Created",
    details: `Created announcement: ${title}`,
  });

  res.status(201).json({
    success: true,
    data: announcement,
  });
});

/**
 * @desc Update an announcement
 * @route PUT /api/announcements/:id
 * @access Private/Admin
 */
export const updateAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, target, departmentId, expiresAt, isActive } = req.body;

  const announcement = await Announcement.findByIdAndUpdate(
    id,
    { title, content, target, departmentId, expiresAt, isActive },
    { new: true, runValidators: true }
  );

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await logActivity({
    userId: req.user!._id.toString(),
    action: "Announcement Updated",
    details: `Updated announcement: ${title}`,
  });

  res.status(200).json({
    success: true,
    data: announcement,
  });
});

/**
 * @desc Delete an announcement
 * @route DELETE /api/announcements/:id
 * @access Private/Admin
 */
export const deleteAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const announcement = await Announcement.findByIdAndDelete(id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await logActivity({
    userId: req.user!._id.toString(),
    action: "Announcement Deleted",
    details: `Deleted announcement: ${announcement.title}`,
  });

  res.status(200).json({
    success: true,
    message: "Announcement removed",
  });
});
