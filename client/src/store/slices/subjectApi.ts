import type { Pagination, Subject } from "@/types/type";
import { apiSlice } from "./api";

export const subjectApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Get Subjects with Pagination & Search
    getSubjects: builder.query<
      { subjects: Subject[]; pagination: Pagination },
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/subjects",
        params: { page, limit, search: search || undefined },
      }),
      providesTags: ["Subject"],
    }),

    // Create Subject
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (data) => ({
        url: "/subjects/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subject"],
    }),

    // Update Subject
    updateSubject: builder.mutation<
      Subject,
      { id: string; data: Partial<Subject> }
    >({
      query: ({ id, data }) => ({
        url: `/subjects/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subject"],
    }),

    // Delete Subject
    deleteSubject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/subjects/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
