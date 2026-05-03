import type { Class, Pagination } from "@/types/type";
import { apiSlice } from "./api";

export const classApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Get Classes with Pagination
    getClasses: builder.query<
      { classes: Class[]; pagination: Pagination },
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => {
        let url = `/classes?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        return url;
      },
      providesTags: ["Class"],
    }),

    // Get Single Class
    getClassById: builder.query<Class, string>({
      query: (id) => `/classes/${id}`,
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),

    // Create Class
    createClass: builder.mutation<Class, Partial<Class>>({
      query: (data) => ({
        url: "/classes/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    // Update Class
    updateClass: builder.mutation<Class, { id: string; data: Partial<Class> }>({
      query: ({ id, data }) => ({
        url: `/classes/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    // Delete Class
    deleteClass: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/classes/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
