import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Announcement, AnnouncementTarget, AnnouncementVisibility } from "../models/announcement";
import { AuthRequest } from "../middlewares/auth";
import { UserRole } from "../models/user";
import { logActivity } from "../utils/activitieslog";
import { uploadToCloudinary } from "../config/cloudinary";

/**
 * @desc Get all announcements (filtered by target for non-admins)
 * @route GET /api/announcements
 * @access Public/Private
 */
export const getAnnouncements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user; // User might be undefined for public access
  const query: any = { isActive: true };

  // If user is not logged in, only show PUBLIC announcements
  if (!user) {
    query.visibility = AnnouncementVisibility.PUBLIC;
    query.target = AnnouncementTarget.ALL;
    query.$or = [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }];
  } 
  // For logged-in non-admins, filter based on target
  else if (user.role !== UserRole.ADMIN) {
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
  const { title, content, target, visibility, departmentId, expiresAt, image } = req.body;

  let imageUrl = undefined;
  if (image) {
    imageUrl = await uploadToCloudinary(image, "announcements");
  }

  const announcement = await Announcement.create({
    title,
    content,
    target,
    visibility,
    departmentId,
    expiresAt,
    image: imageUrl,
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
  const { title, content, target, visibility, departmentId, expiresAt, isActive, image } = req.body;

  let updateData: any = { title, content, target, visibility, departmentId, expiresAt, isActive };

  if (image && !image.startsWith("http")) {
    updateData.image = await uploadToCloudinary(image, "announcements");
  }

  const announcement = await Announcement.findByIdAndUpdate(
    id,
    updateData,
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
