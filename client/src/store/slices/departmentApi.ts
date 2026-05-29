// @/store/slices/departmentApi.ts
import { apiSlice } from "./api";
import type { DepartmentFormValues } from "@/schemas/department";
import type { Department, Pagination } from "@/types/type";

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<
      { departments: Department[]; pagination: Pagination },
      { page: number; search?: string; limit?: number }
    >({
      query: ({ page, search, limit = 10 }) => ({
        url: "/departments",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Department"],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/departments/${id}`,
      transformResponse: (response: { success: boolean; data: Department }) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<
      { message: string },
      DepartmentFormValues
    >({
      query: (data) => ({
        url: "/departments/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation<
      { message: string },
      { id: string; data: DepartmentFormValues }
    >({
      query: ({ id, data }) => ({
        url: `/departments/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),
    deleteDepartment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/departments/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
