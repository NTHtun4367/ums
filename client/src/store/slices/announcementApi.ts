import { apiSlice } from "./api";

export const AnnouncementTarget = {
  ALL: "all",
  TEACHER: "teacher",
  STUDENT: "student",
  HOD: "hod",
  DEPARTMENT: "department",
} as const;

export type AnnouncementTarget = (typeof AnnouncementTarget)[keyof typeof AnnouncementTarget];

export const AnnouncementVisibility = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type AnnouncementVisibility = (typeof AnnouncementVisibility)[keyof typeof AnnouncementVisibility];

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  image?: string;
  authorId: {
    _id: string;
    name: string;
    role: string;
  };
  target: AnnouncementTarget;
  visibility: AnnouncementVisibility;
  departmentId?: {
    _id: string;
    name: string;
  };
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementResponse {
  success: boolean;
  data: Announcement[];
}

export interface SingleAnnouncementResponse {
  success: boolean;
  data: Announcement;
}

export const announcementApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAnnouncements: builder.query<AnnouncementResponse, void>({
      query: () => ({
        url: "/announcements",
        method: "GET",
      }),
      providesTags: ["Announcement"],
    }),

    createAnnouncement: builder.mutation<SingleAnnouncementResponse, Partial<Announcement>>({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement", "Activities"],
    }),

    updateAnnouncement: builder.mutation<
      SingleAnnouncementResponse,
      { id: string; data: Partial<Announcement> }
    >({
      query: ({ id, data }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Announcement", "Activities"],
    }),

    deleteAnnouncement: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement", "Activities"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
