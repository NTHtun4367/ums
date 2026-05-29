import { useState } from "react";
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  AnnouncementTarget
} from "@/store/slices/announcementApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Megaphone,
  Plus,
  Calendar,
  User,
  MoreVertical,
  Trash2,
  Edit2,
  Clock,
  Building,
  Eye,
  Globe,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import CustomModal from "@/components/common/custom-modal";
import CustomAlert from "@/components/common/custom-alert";
import { AnnouncementForm } from "./announcement-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";

export default function AnnouncementsPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isAdmin = userInfo?.role === "admin";

  const { data, isLoading } = useGetAnnouncementsQuery();
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  const announcements = data?.data || [];

  const handleCreate = async (formData: any) => {
    try {
      await createAnnouncement(formData).unwrap();
      toast.success("Announcement posted successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to post announcement");
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await updateAnnouncement({ id: selectedAnnouncement._id, data: formData }).unwrap();
      toast.success("Announcement updated successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update announcement");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(selectedAnnouncement._id).unwrap();
      toast.success("Announcement deleted successfully");
      setIsAlertOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete announcement");
    }
  };

  const openEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsEdit(true);
    setIsView(false);
    setIsModalOpen(true);
  };

  const openView = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsView(true);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openDelete = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsAlertOpen(true);
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case AnnouncementTarget.ALL: return <Badge variant="outline">Everyone</Badge>;
      case AnnouncementTarget.TEACHER: return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Teachers</Badge>;
      case AnnouncementTarget.STUDENT: return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Students</Badge>;
      case AnnouncementTarget.HOD: return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">HODs</Badge>;
      case AnnouncementTarget.DEPARTMENT: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Department</Badge>;
      default: return <Badge variant="outline">{target}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-lg mb-8" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Announcements"
        description="Stay updated with the latest university news and notices."
        icon={<Megaphone className="w-6 h-6" />}
      >
        {isAdmin && (
          <Button
            onClick={() => {
              setIsEdit(false);
              setIsView(false);
              setSelectedAnnouncement(null);
              setIsModalOpen(true);
            }}
            className="rounded-xl flex gap-2"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-6">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement._id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-4">
                  {announcement.image && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <img src={announcement.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTargetBadge(announcement.target)}
                      {announcement.visibility === "public" ? (
                        <Badge variant="outline" className="flex gap-1 items-center border-primary text-primary">
                          <Globe className="w-3 h-3" /> Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex gap-1 items-center border-amber-500 text-amber-500">
                          <Lock className="w-3 h-3" /> Private
                        </Badge>
                      )}
                      {announcement.departmentId && (
                        <Badge variant="secondary" className="flex gap-1 items-center">
                          <Building className="w-3 h-3" />
                          {announcement.departmentId.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {announcement.title}
                    </CardTitle>
                  </div>
                </div>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => openEdit(announcement)} className="flex gap-2">
                        <Edit2 className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDelete(announcement)} className="text-red-600 flex gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                  {announcement.content}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{announcement.authorId?.name}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="capitalize">{announcement.authorId?.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(announcement.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  {announcement.expiresAt && (
                    <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Expires: {format(new Date(announcement.expiresAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  <Button variant="link" onClick={() => openView(announcement)} className="ml-auto h-auto p-0 text-primary flex gap-1.5 items-center">
                    <Eye className="w-3.5 h-3.5" /> Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Announcements</h3>
            <p className="text-muted-foreground">Check back later for important updates.</p>
          </div>
        )}
      </div>

      <CustomModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={isView ? "Announcement Details" : isEdit ? "Edit Announcement" : "New Announcement"}
        description={isView ? "" : isEdit ? "Update existing announcement details" : "Post a new announcement to the university portal"}
      >
        {isView ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex gap-2 mb-4">
                {getTargetBadge(selectedAnnouncement?.target)}
                {selectedAnnouncement?.visibility === "public" ? (
                  <Badge variant="outline" className="flex gap-1 items-center border-primary text-primary">
                    <Globe className="w-3 h-3" /> Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex gap-1 items-center border-amber-500 text-amber-500">
                    <Lock className="w-3 h-3" /> Private
                  </Badge>
                )}
                {selectedAnnouncement?.departmentId && (
                  <Badge variant="secondary">{selectedAnnouncement.departmentId.name}</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold">{selectedAnnouncement?.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedAnnouncement?.authorId?.name}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedAnnouncement && format(new Date(selectedAnnouncement.createdAt), "PPP")}</span>
              </div>
            </div>
            {selectedAnnouncement?.image && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-[400px]">
                <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} className="w-full h-full object-contain bg-slate-50" />
              </div>
            )}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-400">
                {selectedAnnouncement?.content}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="rounded-xl">Close</Button>
            </div>
          </div>
        ) : (
          <AnnouncementForm
            initialData={selectedAnnouncement}
            onSubmit={isEdit ? handleUpdate : handleCreate}
            isLoading={isCreating || isUpdating}
          />
        )}
      </CustomModal>

      <CustomAlert
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        handleDelete={handleDelete}
        title="Delete Announcement"
        description="Are you sure you want to delete this announcement? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
