import type { AcademicYearFormValues } from "@/schemas/academic-year";
import { apiSlice } from "./api";

export const academicYearApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query<any, { page: number; search?: string }>({
      query: ({ page, search }) => ({
        url: "/academic-years",
        method: "GET",
        params: { page, limit: 10, search },
      }),
      providesTags: ["AcademicYear"],
    }),

    createAcademicYear: builder.mutation<
      { message: string },
      AcademicYearFormValues
    >({
      query: (data) => ({
        url: "/academic-years/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    updateAcademicYear: builder.mutation<
      { message: string },
      { id: string; data: AcademicYearFormValues }
    >({
      query: ({ id, data }) => ({
        url: `/academic-years/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AcademicYear"],
    }),

    deleteAcademicYear: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/academic-years/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicYear"],
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
} = academicYearApi;
